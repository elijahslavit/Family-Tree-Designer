import type { ParsedGedcomPayload } from "@/lib/import/gedcom-parser";
import { extractYear } from "@/lib/import/living-inference";
import type { Lineage, LineageMember, Person, TreeBundle } from "@/lib/types";

/** Surnames below this share of the tree are not worth their own lineage. */
const MIN_LINEAGE_MEMBERS = 3;
/** Lineage filters stop being a filter past this many entries. */
const MAX_LINEAGES = 6;

export type CommitImportResult = {
  focalPersonId: string | null;
  peopleCount: number;
  familyCount: number;
  eventCount: number;
  lineageCount: number;
  /** People visible to the family: deceased, or living with consent recorded later. */
  presentablePeopleCount: number;
  hiddenLivingCount: number;
  undatedPersonIds: string[];
  /** Most frequent surname, used to name the archive. */
  dominantSurname: string | null;
  /** Earliest and latest years found, used for the welcome copy. */
  earliestYear: number | null;
  latestYear: number | null;
};

function summariseNames(people: Person[]) {
  const counts = new Map<string, number>();

  for (const person of people) {
    const surname = person.surname?.trim();
    if (surname && surname !== "Unknown") {
      counts.set(surname, (counts.get(surname) ?? 0) + 1);
    }
  }

  const ranked = [...counts.entries()].sort((left, right) => right[1] - left[1]);

  return ranked[0]?.[0] ?? null;
}

function summariseYears(people: Person[]) {
  const years: number[] = [];

  for (const person of people) {
    const birth = extractYear(person.birthDateText);
    const death = extractYear(person.deathDateText);
    if (birth !== null) years.push(birth);
    if (death !== null) years.push(death);
  }

  if (!years.length) {
    return { earliestYear: null, latestYear: null };
  }

  return { earliestYear: Math.min(...years), latestYear: Math.max(...years) };
}

/**
 * Pick the person the family should land on. Preference goes to someone with
 * many relatives and real dates, because the opening screen has to feel like a
 * portrait rather than a database row.
 */
export function deriveFocalPerson(
  people: Person[],
  parsed: Pick<ParsedGedcomPayload, "families" | "familyChildren">,
): string | null {
  if (!people.length) {
    return null;
  }

  const connections = new Map<string, number>();

  const bump = (personId: string | null | undefined, weight = 1) => {
    if (!personId) {
      return;
    }
    connections.set(personId, (connections.get(personId) ?? 0) + weight);
  };

  for (const family of parsed.families) {
    bump(family.spouse1Id);
    bump(family.spouse2Id);
  }

  for (const link of parsed.familyChildren) {
    bump(link.childId);
    const family = parsed.families.find((entry) => entry.id === link.familyId);
    bump(family?.spouse1Id);
    bump(family?.spouse2Id);
  }

  const scored = people
    // Living people are hidden from the presentation, so one can never be the anchor.
    .filter((person) => !person.isLiving)
    .map((person) => {
      const relatives = connections.get(person.id) ?? 0;
      const hasBirth = extractYear(person.birthDateText) !== null;
      const hasDeath = extractYear(person.deathDateText) !== null;
      const hasStory = Boolean(person.biographyMd?.trim());

      return {
        id: person.id,
        score:
          relatives * 3 +
          (hasBirth ? 4 : 0) +
          (hasDeath ? 3 : 0) +
          (hasStory ? 5 : 0) +
          (person.birthPlace ? 2 : 0),
      };
    })
    .sort((left, right) => right.score - left.score);

  return scored[0]?.id ?? null;
}

/**
 * Group people into surname lineages so the family tree offers a meaningful
 * filter instead of one undifferentiated graph.
 */
function deriveLineages(people: Person[], treeId: string) {
  const bySurname = new Map<string, Person[]>();

  for (const person of people) {
    const surname = person.surname?.trim();

    if (!surname || surname === "Unknown") {
      continue;
    }

    const existing = bySurname.get(surname);
    if (existing) {
      existing.push(person);
    } else {
      bySurname.set(surname, [person]);
    }
  }

  const ranked = [...bySurname.entries()]
    .filter(([, members]) => members.length >= MIN_LINEAGE_MEMBERS)
    .sort((left, right) => right[1].length - left[1].length)
    .slice(0, MAX_LINEAGES);

  const lineages: Lineage[] = [];
  const lineageMembers: LineageMember[] = [];

  for (const [surname, members] of ranked) {
    const lineageId = crypto.randomUUID();

    lineages.push({
      id: lineageId,
      treeId,
      name: `${surname} line`,
      description: `${members.length} people carrying the ${surname} name.`,
    });

    members.forEach((person, index) => {
      lineageMembers.push({ lineageId, personId: person.id, order: index + 1 });
    });
  }

  return { lineages, lineageMembers };
}

/**
 * Replace the working tree with a freshly parsed GEDCOM. This is a replace, not
 * a merge: an import defines the archive for the project it belongs to, and
 * merging two families into one graph would be worse than starting over.
 */
export function commitParsedGedcomToBundle({
  bundle,
  parsed,
  treeId,
}: {
  bundle: TreeBundle;
  parsed: ParsedGedcomPayload;
  treeId: string;
}): CommitImportResult {
  const people = parsed.people.map((person) => ({ ...person, treeId }));
  const { lineages, lineageMembers } = deriveLineages(people, treeId);

  bundle.people = people;
  bundle.families = parsed.families.map((family) => ({ ...family, treeId }));
  bundle.familyChildren = parsed.familyChildren;
  bundle.events = parsed.events.map((event) => ({ ...event, treeId }));
  bundle.externalIds = parsed.externalIds.map((entry) => ({ ...entry, treeId }));
  bundle.reviewIssues = parsed.issues.map((issue) => ({ ...issue, treeId }));
  bundle.lineages = lineages;
  bundle.lineageMembers = lineageMembers;

  // Claims, citations, and sources describe the previous archive and would point
  // at people who no longer exist.
  bundle.sources = [];
  bundle.claims = [];
  bundle.citations = [];

  const hiddenLivingCount = people.filter((person) => person.isLiving).length;
  const { earliestYear, latestYear } = summariseYears(people);

  return {
    focalPersonId: deriveFocalPerson(people, parsed),
    peopleCount: people.length,
    familyCount: bundle.families.length,
    eventCount: bundle.events.length,
    lineageCount: lineages.length,
    presentablePeopleCount: people.length - hiddenLivingCount,
    hiddenLivingCount,
    undatedPersonIds: parsed.undatedPersonIds,
    dominantSurname: summariseNames(people),
    earliestYear,
    latestYear,
  };
}
