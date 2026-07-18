import { inferLivingStatus } from "@/lib/import/living-inference";
import { createReviewIssue } from "@/lib/import/review";
import type {
  EventRecord,
  ExternalId,
  Family,
  FamilyChild,
  Person,
  ReviewIssue,
} from "@/lib/types";

export type ParsedGedcomPayload = {
  people: Person[];
  families: Family[];
  familyChildren: FamilyChild[];
  events: EventRecord[];
  externalIds: ExternalId[];
  issues: ReviewIssue[];
  /** People no date evidence could reach; hidden as possibly living. */
  undatedPersonIds: string[];
  /** People with no death record who are old enough to be presumed deceased. */
  presumedDeceasedCount: number;
};

type GedcomPersonRecord = {
  xref: string;
  name?: string;
  sex?: string;
  birthDate?: string;
  birthPlace?: string;
  deathDate?: string;
  deathPlace?: string;
  note?: string;
};

type GedcomFamilyRecord = {
  xref: string;
  husband?: string;
  wife?: string;
  children: string[];
  marriageDate?: string;
  marriagePlace?: string;
};

function sanitize(value: string | undefined) {
  return value?.replace(/\0/g, "").trim() ?? "";
}

/**
 * GEDCOM delimits the surname with slashes: "John Michael /Van Dyke/ Jr".
 * Honour that when present; fall back to a first-word split when it is missing.
 */
function parseName(rawName: string) {
  const raw = sanitize(rawName);
  const delimited = raw.match(/^([^/]*)\/([^/]*)\/(.*)$/);

  if (delimited) {
    const givenName = sanitize(delimited[1]);
    const surname = sanitize(delimited[2]);
    const suffix = sanitize(delimited[3]);
    const fullName = [givenName, surname, suffix].filter(Boolean).join(" ");

    return {
      givenName: givenName || "Unknown",
      surname: surname || "Unknown",
      suffix: suffix || null,
      fullName: fullName || "Unknown Person",
    };
  }

  const clean = raw.replaceAll("/", "").trim();
  const parts = clean.split(/\s+/).filter(Boolean);

  return {
    givenName: parts[0] ?? "Unknown",
    surname: parts.slice(1).join(" ") || "Unknown",
    suffix: null,
    fullName: clean || "Unknown Person",
  };
}

export function parseGedcomText({
  treeId,
  content,
}: {
  treeId: string;
  content: string;
}): ParsedGedcomPayload {
  const peopleByGedcomId = new Map<string, GedcomPersonRecord>();
  const familiesByGedcomId = new Map<string, GedcomFamilyRecord>();
  const issues: ReviewIssue[] = [];

  let currentPerson: GedcomPersonRecord | null = null;
  let currentFamily: GedcomFamilyRecord | null = null;
  let currentEvent: "BIRT" | "DEAT" | "MARR" | null = null;

  const lines = content.split(/\r?\n/);

  for (const rawLine of lines) {
    const line = sanitize(rawLine);

    if (!line) {
      continue;
    }

    const match = line.match(/^(\d+)\s+(?:(@[^@]+@)\s+)?([A-Z0-9_]+)(?:\s+(.*))?$/);

    if (!match) {
      continue;
    }

    const [, levelText, xref, tag, valueRaw] = match;
    const level = Number(levelText);
    const value = sanitize(valueRaw);

    if (level === 0) {
      currentEvent = null;
      currentPerson = null;
      currentFamily = null;

      if (tag === "INDI" && xref) {
        currentPerson = { xref };
        peopleByGedcomId.set(xref, currentPerson);
      }

      if (tag === "FAM" && xref) {
        currentFamily = { xref, children: [] };
        familiesByGedcomId.set(xref, currentFamily);
      }

      continue;
    }

    if (currentPerson) {
      if (level === 1) {
        currentEvent = tag === "BIRT" || tag === "DEAT" ? tag : null;

        if (tag === "NAME") {
          currentPerson.name = value;
        }

        if (tag === "SEX") {
          currentPerson.sex = value;
        }

        if (tag === "NOTE") {
          currentPerson.note = value;
        }
      }

      if (level === 2 && currentEvent) {
        if (tag === "DATE" && currentEvent === "BIRT") {
          currentPerson.birthDate = value;
        }

        if (tag === "PLAC" && currentEvent === "BIRT") {
          currentPerson.birthPlace = value;
        }

        if (tag === "DATE" && currentEvent === "DEAT") {
          currentPerson.deathDate = value;
        }

        if (tag === "PLAC" && currentEvent === "DEAT") {
          currentPerson.deathPlace = value;
        }
      }
    }

    if (currentFamily) {
      if (level === 1) {
        currentEvent = tag === "MARR" ? "MARR" : null;

        if (tag === "HUSB") {
          currentFamily.husband = value;
        }

        if (tag === "WIFE") {
          currentFamily.wife = value;
        }

        if (tag === "CHIL") {
          currentFamily.children.push(value);
        }
      }

      if (level === 2 && currentEvent === "MARR") {
        if (tag === "DATE") {
          currentFamily.marriageDate = value;
        }

        if (tag === "PLAC") {
          currentFamily.marriagePlace = value;
        }
      }
    }
  }

  const people: Person[] = [];
  const families: Family[] = [];
  const familyChildren: FamilyChild[] = [];
  const events: EventRecord[] = [];
  const externalIds: ExternalId[] = [];
  const personIdByGedcomId = new Map<string, string>();

  for (const record of peopleByGedcomId.values()) {
    const personId = crypto.randomUUID();
    const name = parseName(record.name ?? "");

    if (!record.name) {
      issues.push(
        createReviewIssue(
          treeId,
          "person",
          personId,
          `Missing NAME for GEDCOM person ${record.xref}.`,
          "missing_data",
        ),
      );
    }

    personIdByGedcomId.set(record.xref, personId);
    people.push({
      id: personId,
      treeId,
      givenName: name.givenName,
      surname: name.surname,
      fullName: name.fullName,
      suffix: name.suffix,
      gender:
        record.sex === "M"
          ? "male"
          : record.sex === "F"
            ? "female"
            : "unknown",
      birthDateText: record.birthDate ?? null,
      birthDateNormalized: null,
      birthPlace: record.birthPlace ?? null,
      deathDateText: record.deathDate ?? null,
      deathDateNormalized: null,
      deathPlace: record.deathPlace ?? null,
      summary: record.note ?? null,
      biographyMd: record.note ?? null,
      isLiving: !record.deathDate,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
    externalIds.push({
      id: crypto.randomUUID(),
      treeId,
      subjectType: "person",
      subjectId: personId,
      system: "gedcom",
      externalId: record.xref,
    });
  }

  for (const record of familiesByGedcomId.values()) {
    const familyId = crypto.randomUUID();
    const spouse1Id = record.husband
      ? personIdByGedcomId.get(record.husband)
      : record.wife
        ? personIdByGedcomId.get(record.wife)
        : undefined;
    const spouse2Id = record.husband && record.wife
      ? personIdByGedcomId.get(record.wife)
      : undefined;

    if (!spouse1Id) {
      issues.push(
        createReviewIssue(
          treeId,
          "family",
          familyId,
          `Family ${record.xref} has no resolvable spouse reference.`,
          "missing_data",
        ),
      );
      continue;
    }

    families.push({
      id: familyId,
      treeId,
      spouse1Id,
      spouse2Id: spouse2Id ?? null,
      marriageDateText: record.marriageDate ?? null,
      marriageDateNormalized: null,
      marriagePlace: record.marriagePlace ?? null,
    });

    externalIds.push({
      id: crypto.randomUUID(),
      treeId,
      subjectType: "family",
      subjectId: familyId,
      system: "gedcom",
      externalId: record.xref,
    });

    record.children.forEach((childXref, index) => {
      const childId = personIdByGedcomId.get(childXref);

      if (!childId) {
        issues.push(
          createReviewIssue(
            treeId,
            "family",
            familyId,
            `Family ${record.xref} references unresolved child ${childXref}.`,
          ),
        );
        return;
      }

      familyChildren.push({
        familyId,
        childId,
        order: index + 1,
        relationshipType: "biological",
      });
    });
  }

  for (const person of people) {
    if (person.birthDateText || person.birthPlace) {
      events.push({
        id: crypto.randomUUID(),
        treeId,
        personId: person.id,
        type: "birth",
        dateText: person.birthDateText,
        dateNormalized: null,
        place: person.birthPlace,
        description: null,
      });
    }

    if (person.deathDateText || person.deathPlace) {
      events.push({
        id: crypto.randomUUID(),
        treeId,
        personId: person.id,
        type: "death",
        dateText: person.deathDateText,
        dateNormalized: null,
        place: person.deathPlace,
        description: null,
      });
    }
  }

  const duplicateNames = new Map<string, number>();
  people.forEach((person) => {
    duplicateNames.set(person.fullName, (duplicateNames.get(person.fullName) ?? 0) + 1);
  });

  people.forEach((person) => {
    if ((duplicateNames.get(person.fullName) ?? 0) > 1) {
      issues.push(
        createReviewIssue(
          treeId,
          "person",
          person.id,
          `Potential duplicate name detected for ${person.fullName}.`,
          "duplicate",
        ),
      );
    }
  });

  // A DEAT tag is not the only evidence of death. Resolve living status against
  // the whole graph, otherwise undated ancestors stay hidden from the family.
  const living = inferLivingStatus({ people, families, familyChildren, events });

  if (living.undatedPersonIds.length) {
    issues.push(
      createReviewIssue(
        treeId,
        "person",
        living.undatedPersonIds[0]!,
        `${living.undatedPersonIds.length} people carry no date evidence and stay hidden as possibly living until reviewed.`,
        "missing_data",
      ),
    );
  }

  return {
    people: living.people,
    families,
    familyChildren,
    events,
    externalIds,
    issues,
    undatedPersonIds: living.undatedPersonIds,
    presumedDeceasedCount: living.presumedDeceasedCount,
  };
}
