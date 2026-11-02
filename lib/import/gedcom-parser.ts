import { createReviewIssue } from "@/lib/import/review";
import type {
  EventRecord,
  ExternalId,
  Family,
  FamilyChild,
  Person,
  ReviewIssue,
} from "@/lib/types";

type ParsedGedcomPayload = {
  people: Person[];
  families: Family[];
  familyChildren: FamilyChild[];
  events: EventRecord[];
  externalIds: ExternalId[];
  issues: ReviewIssue[];
};

type GedcomPersonRecord = {
  xref: string;
  name?: string;
  givenPart?: string;
  surnamePart?: string;
  alternateNames: string[];
  sex?: string;
  birthDate?: string;
  birthPlace?: string;
  deathDate?: string;
  deathPlace?: string;
  /** DEAT, BURI, or CREM present, even without a date. */
  hasDeathEvidence: boolean;
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

/** Tags imported (or deliberately structural) for each record kind. */
const SUPPORTED_PERSON_TAGS = new Set(["NAME", "SEX", "NOTE", "BIRT", "DEAT", "BURI", "CREM", "FAMC", "FAMS", "CHAN", "_UID", "RIN"]);
const SUPPORTED_FAMILY_TAGS = new Set(["HUSB", "WIFE", "CHIL", "MARR", "CHAN", "_UID", "RIN"]);
const STRUCTURAL_RECORDS = new Set(["HEAD", "TRLR", "SUBM", "SUBN"]);

const TAG_NAMES: Record<string, string> = {
  OCCU: "occupation",
  RESI: "residence",
  EDUC: "education",
  RELI: "religion",
  BAPM: "baptism",
  CHR: "christening",
  CENS: "census",
  EMIG: "emigration",
  IMMI: "immigration",
  NATU: "naturalization",
  GRAD: "graduation",
  RETI: "retirement",
  PROB: "probate",
  WILL: "will",
  EVEN: "custom event",
  FACT: "custom fact",
  TITL: "title",
  NATI: "nationality",
  DIV: "divorce",
  ENGA: "engagement",
  MARB: "marriage banns",
  SOUR: "source citation",
  OBJE: "media link",
  REPO: "repository",
  NOTE: "note",
  ASSO: "association",
  ALIA: "alias",
  ADOP: "adoption",
};

function describeTag(tag: string) {
  const name = TAG_NAMES[tag];
  return name ? `${name} (${tag})` : tag;
}

function sanitize(value: string | undefined) {
  return value?.replace(/\0/g, "").trim() ?? "";
}

/**
 * Splits a GEDCOM personal name. Surnames are delimited by slashes
 * ("John Paul /Smith/ Jr."); without slashes, the last word is the surname.
 */
export function parseGedcomName(rawName: string) {
  const clean = sanitize(rawName);
  const match = clean.match(/^([^/]*)\/([^/]*)\/?(.*)$/);
  let given: string;
  let surname: string;
  let suffix: string;

  if (match) {
    given = match[1]!.trim();
    surname = match[2]!.trim();
    suffix = match[3]!.trim();
  } else {
    const parts = clean.split(/\s+/).filter(Boolean);
    surname = parts.length > 1 ? parts.at(-1)! : "";
    given = parts.length > 1 ? parts.slice(0, -1).join(" ") : (parts[0] ?? "");
    suffix = "";
  }

  const fullName = [given, surname, suffix].filter(Boolean).join(" ").replace(/\s+/g, " ").trim();

  return {
    givenName: given || "Unknown",
    surname: surname || "Unknown",
    suffix: suffix || null,
    fullName: fullName || "Unknown Person",
  };
}

export type GedcomDecodeResult =
  | { ok: true; text: string; encoding: string }
  | { ok: false; error: string };

/**
 * Decodes an uploaded GEDCOM file. UTF-8 (with or without a byte-order mark)
 * and UTF-16 are supported; ANSEL and other legacy encodings are refused with
 * a clear instruction rather than silently garbling names and places.
 */
export function decodeGedcomFile(bytes: Uint8Array): GedcomDecodeResult {
  if (bytes[0] === 0xff && bytes[1] === 0xfe) {
    return { ok: true, text: new TextDecoder("utf-16le").decode(bytes.subarray(2)), encoding: "UTF-16LE" };
  }
  if (bytes[0] === 0xfe && bytes[1] === 0xff) {
    return { ok: true, text: new TextDecoder("utf-16be").decode(bytes.subarray(2)), encoding: "UTF-16BE" };
  }

  const hasUtf8Bom = bytes[0] === 0xef && bytes[1] === 0xbb && bytes[2] === 0xbf;
  const body = hasUtf8Bom ? bytes.subarray(3) : bytes;
  const header = new TextDecoder("latin1").decode(body.subarray(0, 4096));
  const declared = header.match(/^\s*1\s+CHAR\s+(\S+)/m)?.[1]?.toUpperCase() ?? null;

  if (declared && !["UTF-8", "UTF8", "UNICODE", "ASCII"].includes(declared)) {
    return {
      ok: false,
      error: `This file uses the ${declared} character set, which can't be imported without risking garbled names. Export it again from your genealogy software as UTF-8 and upload that copy.`,
    };
  }

  try {
    const text = new TextDecoder("utf-8", { fatal: true }).decode(body);
    return { ok: true, text, encoding: "UTF-8" };
  } catch {
    return {
      ok: false,
      error: "This file isn't valid UTF-8. Export it again from your genealogy software as UTF-8 and upload that copy.",
    };
  }
}

export function parseGedcomText({
  treeId,
  content,
  maxPeople,
}: {
  treeId: string;
  content: string;
  /** Adds a review issue when the file holds more people than the project allows. */
  maxPeople?: number;
}): ParsedGedcomPayload {
  const peopleByGedcomId = new Map<string, GedcomPersonRecord>();
  const familiesByGedcomId = new Map<string, GedcomFamilyRecord>();
  const issues: ReviewIssue[] = [];
  /** Unimported content, counted per record kind and tag, reported once each. */
  const unsupported = new Map<string, { kind: "person" | "family" | "record"; tag: string; count: number; firstXref?: string }>();

  const noteUnsupported = (kind: "person" | "family" | "record", tag: string, xref?: string) => {
    const key = `${kind}:${tag}`;
    const entry = unsupported.get(key) ?? { kind, tag, count: 0, firstXref: xref };
    entry.count += 1;
    unsupported.set(key, entry);
  };

  let currentPerson: GedcomPersonRecord | null = null;
  let currentFamily: GedcomFamilyRecord | null = null;
  let currentEvent: "BIRT" | "DEAT" | "MARR" | null = null;
  /** Level-1 context inside the current record (e.g. the first NAME, or NOTE). */
  let currentLevel1: { tag: string; primaryName: boolean } | null = null;

  const lines = content.replace(/^﻿/, "").split(/\r\n|\r|\n/);

  for (const rawLine of lines) {
    // Keep trailing spaces: CONC continuations may split text at a space.
    const line = rawLine.replace(/\0/g, "").replace(/^\s+/, "");

    if (!line.trim()) {
      continue;
    }

    const match = line.match(/^(\d+)\s+(?:(@[^@]+@)\s+)?([A-Za-z0-9_]+)(?:\s(.*))?$/);

    if (!match) {
      continue;
    }

    const [, levelText, xref, rawTag, valueRaw] = match;
    const level = Number(levelText);
    const tag = rawTag!.toUpperCase();
    // Values keep inner spacing; only the line ends were trimmed.
    const value = valueRaw === undefined ? "" : valueRaw.replace(/\0/g, "");

    if (level === 0) {
      currentEvent = null;
      currentPerson = null;
      currentFamily = null;
      currentLevel1 = null;

      if (tag === "INDI" && xref) {
        currentPerson = { xref, alternateNames: [], hasDeathEvidence: false };
        peopleByGedcomId.set(xref, currentPerson);
      } else if (tag === "FAM" && xref) {
        currentFamily = { xref, children: [] };
        familiesByGedcomId.set(xref, currentFamily);
      } else if (!STRUCTURAL_RECORDS.has(tag)) {
        noteUnsupported("record", tag);
      }

      continue;
    }

    if (currentPerson) {
      if (level === 1) {
        currentEvent = tag === "BIRT" || tag === "DEAT" ? tag : null;
        currentLevel1 = { tag, primaryName: false };

        if (tag === "NAME") {
          if (currentPerson.name === undefined) {
            currentPerson.name = value.trim();
            currentLevel1.primaryName = true;
          } else if (value.trim()) {
            currentPerson.alternateNames.push(value.trim());
          }
        } else if (tag === "SEX") {
          currentPerson.sex = value.trim();
        } else if (tag === "NOTE") {
          if (value.trim().startsWith("@")) {
            noteUnsupported("person", "NOTE", currentPerson.xref);
          } else {
            currentPerson.note = currentPerson.note ? `${currentPerson.note}\n\n${value.trim()}` : value.trim();
          }
        } else if (tag === "DEAT" || tag === "BURI" || tag === "CREM") {
          currentPerson.hasDeathEvidence = true;
        } else if (!SUPPORTED_PERSON_TAGS.has(tag)) {
          noteUnsupported("person", tag, currentPerson.xref);
        }
        continue;
      }

      if (level === 2 && currentLevel1) {
        if (currentLevel1.tag === "NOTE" && (tag === "CONT" || tag === "CONC")) {
          const base = currentPerson.note ?? "";
          currentPerson.note = tag === "CONT" ? `${base}\n${value}` : `${base}${value}`;
          continue;
        }

        if (currentLevel1.tag === "NAME" && currentLevel1.primaryName) {
          if (tag === "GIVN") currentPerson.givenPart = value.trim();
          if (tag === "SURN") currentPerson.surnamePart = value.trim();
          continue;
        }

        if (currentEvent === "BIRT" && tag === "DATE") currentPerson.birthDate = value.trim();
        if (currentEvent === "BIRT" && tag === "PLAC") currentPerson.birthPlace = value.trim();
        if (currentEvent === "DEAT" && tag === "DATE") currentPerson.deathDate = value.trim();
        if (currentEvent === "DEAT" && tag === "PLAC") currentPerson.deathPlace = value.trim();
      }
      continue;
    }

    if (currentFamily) {
      if (level === 1) {
        currentEvent = tag === "MARR" ? "MARR" : null;

        if (tag === "HUSB") {
          currentFamily.husband = value.trim();
        } else if (tag === "WIFE") {
          currentFamily.wife = value.trim();
        } else if (tag === "CHIL") {
          currentFamily.children.push(value.trim());
        } else if (!SUPPORTED_FAMILY_TAGS.has(tag)) {
          noteUnsupported("family", tag, currentFamily.xref);
        }
        continue;
      }

      if (level === 2 && currentEvent === "MARR") {
        if (tag === "DATE") currentFamily.marriageDate = value.trim();
        if (tag === "PLAC") currentFamily.marriagePlace = value.trim();
      }
    }
  }

  const people: Person[] = [];
  const families: Family[] = [];
  const familyChildren: FamilyChild[] = [];
  const events: EventRecord[] = [];
  const externalIds: ExternalId[] = [];
  const personIdByGedcomId = new Map<string, string>();
  const familyIdByGedcomId = new Map<string, string>();
  const now = new Date().toISOString();

  for (const record of peopleByGedcomId.values()) {
    const personId = crypto.randomUUID();
    const parsedName = parseGedcomName(record.name ?? "");
    const givenName =
      parsedName.givenName === "Unknown" && record.givenPart ? record.givenPart : parsedName.givenName;
    const surname =
      parsedName.surname === "Unknown" && record.surnamePart ? record.surnamePart : parsedName.surname;
    const fullName =
      parsedName.fullName === "Unknown Person" && (record.givenPart || record.surnamePart)
        ? [record.givenPart, record.surnamePart].filter(Boolean).join(" ")
        : parsedName.fullName;

    if (!record.name && !record.givenPart && !record.surnamePart) {
      issues.push(
        createReviewIssue(treeId, "person", personId, `Missing NAME for GEDCOM person ${record.xref}.`, "missing_data"),
      );
    }

    if (record.alternateNames.length) {
      issues.push(
        createReviewIssue(
          treeId,
          "person",
          personId,
          `${fullName} has ${record.alternateNames.length} alternate name${record.alternateNames.length === 1 ? "" : "s"} (${record.alternateNames.join("; ")}) that were not imported; the first NAME was used.`,
          "unsupported",
        ),
      );
    }

    const note = record.note?.trim() || null;
    personIdByGedcomId.set(record.xref, personId);
    people.push({
      id: personId,
      treeId,
      givenName,
      surname,
      fullName,
      suffix: parsedName.suffix,
      gender: record.sex === "M" ? "male" : record.sex === "F" ? "female" : "unknown",
      birthDateText: record.birthDate ?? null,
      birthDateNormalized: null,
      birthPlace: record.birthPlace ?? null,
      deathDateText: record.deathDate ?? null,
      deathDateNormalized: null,
      deathPlace: record.deathPlace ?? null,
      summary: note,
      biographyMd: note,
      // Without any death evidence a person is treated as living, which keeps
      // the privacy default conservative.
      isLiving: !record.hasDeathEvidence && !record.deathDate,
      createdAt: now,
      updatedAt: now,
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
    familyIdByGedcomId.set(record.xref, familyId);
    const resolveSpouse = (reference: string | undefined, role: "HUSB" | "WIFE") => {
      if (!reference) return undefined;
      const resolved = personIdByGedcomId.get(reference);
      if (!resolved) {
        issues.push(
          createReviewIssue(
            treeId,
            "family",
            familyId,
            `Family ${record.xref} references unresolved ${role === "HUSB" ? "husband" : "wife"} ${reference}.`,
          ),
        );
      }
      return resolved;
    };
    const husbandId = resolveSpouse(record.husband, "HUSB");
    const wifeId = resolveSpouse(record.wife, "WIFE");
    const spouse1Id = husbandId ?? wifeId;
    const spouse2Id = husbandId && wifeId ? wifeId : undefined;

    if (!spouse1Id) {
      issues.push(
        createReviewIssue(
          treeId,
          "family",
          familyId,
          `Family ${record.xref} has no resolvable spouse reference${record.children.length ? `; its ${record.children.length} child link${record.children.length === 1 ? " was" : "s were"} not imported` : ""}.`,
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
          createReviewIssue(treeId, "family", familyId, `Family ${record.xref} references unresolved child ${childXref}.`),
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
        createReviewIssue(treeId, "person", person.id, `Potential duplicate name detected for ${person.fullName}.`, "duplicate"),
      );
    }
  });

  for (const entry of unsupported.values()) {
    const subjectType = entry.kind === "family" ? "family" : "person";
    const subjectId =
      (entry.firstXref &&
        (entry.kind === "family" ? familyIdByGedcomId.get(entry.firstXref) : personIdByGedcomId.get(entry.firstXref))) ||
      crypto.randomUUID();
    const one = entry.count === 1;
    const where =
      entry.kind === "record"
        ? one ? "top-level record" : "top-level records"
        : `${entry.kind} ${one ? "entry" : "entries"}`;
    issues.push(
      createReviewIssue(
        treeId,
        subjectType,
        subjectId,
        `${entry.count} ${describeTag(entry.tag)} ${where} ${one ? "was" : "were"} not imported.`,
        "unsupported",
      ),
    );
  }

  if (maxPeople !== undefined && people.length > maxPeople) {
    issues.push(
      createReviewIssue(
        treeId,
        "person",
        people[0]!.id,
        `This file contains ${people.length} people, more than the ${maxPeople} included in this project.`,
        "conflict",
      ),
    );
  }

  return {
    people,
    families,
    familyChildren,
    events,
    externalIds,
    issues,
  };
}
