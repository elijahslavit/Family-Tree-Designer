import type { EventRecord, Family, FamilyChild, Person } from "@/lib/types";

/**
 * A person with no recorded death is presumed deceased once they would be older
 * than this. Mainstream genealogy tools use a similar 100–110 year rule.
 */
export const PRESUMED_DECEASED_AGE = 110;

/** Approximate spacing between generations, used to date undated people. */
const GENERATION_YEARS = 30;

/** Passes of graph propagation. Three reaches great-grandparents from a dated child. */
const PROPAGATION_PASSES = 3;

export type LivingInferenceResult = {
  people: Person[];
  /**
   * People the graph could not date at all. They stay flagged living, so the
   * presentation hides them until the genealogist decides otherwise.
   */
  undatedPersonIds: string[];
  presumedDeceasedCount: number;
};

/**
 * GEDCOM dates are free text: "12 MAR 1885", "ABT 1900", "BET 1880 AND 1890".
 * The first four-digit run is a good enough year for a living/deceased decision.
 */
export function extractYear(value: string | null | undefined): number | null {
  if (!value) {
    return null;
  }

  const match = value.match(/\b(\d{4})\b/);

  if (!match) {
    return null;
  }

  const year = Number(match[1]);

  return year >= 1000 && year <= new Date().getFullYear() + 1 ? year : null;
}

/**
 * Decide who is actually living, using the whole family graph rather than the
 * presence of a DEAT tag. Real-world GEDCOM files routinely omit death dates for
 * people who died a century ago; treating those as living empties the archive.
 */
export function inferLivingStatus({
  people,
  families,
  familyChildren,
  events,
  now = new Date(),
}: {
  people: Person[];
  families: Family[];
  familyChildren: FamilyChild[];
  events: EventRecord[];
  now?: Date;
}): LivingInferenceResult {
  const currentYear = now.getFullYear();

  // Strongest available birth-year evidence per person.
  const birthYear = new Map<string, number>();
  // Any dated evidence at all, used as a weaker "this person existed then" signal.
  const anyYear = new Map<string, number>();

  function noteAny(personId: string, year: number | null) {
    if (year === null) {
      return;
    }
    const existing = anyYear.get(personId);
    if (existing === undefined || year < existing) {
      anyYear.set(personId, year);
    }
  }

  for (const person of people) {
    const born = extractYear(person.birthDateText);
    if (born !== null) {
      birthYear.set(person.id, born);
    }
    noteAny(person.id, born);
    noteAny(person.id, extractYear(person.deathDateText));
  }

  for (const event of events) {
    const year = extractYear(event.dateText);
    if (year === null) {
      continue;
    }
    if (event.type === "birth" && !birthYear.has(event.personId)) {
      birthYear.set(event.personId, year);
    }
    noteAny(event.personId, year);
  }

  const childrenByFamily = new Map<string, string[]>();
  for (const link of familyChildren) {
    const existing = childrenByFamily.get(link.familyId);
    if (existing) {
      existing.push(link.childId);
    } else {
      childrenByFamily.set(link.familyId, [link.childId]);
    }
  }

  // A marriage year implies both spouses were adults, so treat it as roughly a
  // generation after their birth.
  for (const family of families) {
    const married = extractYear(family.marriageDateText);
    if (married === null) {
      continue;
    }
    for (const spouseId of [family.spouse1Id, family.spouse2Id]) {
      if (spouseId) {
        noteAny(spouseId, married - GENERATION_YEARS);
      }
    }
  }

  // Propagate estimates across the graph: parents predate their children by
  // roughly a generation, children postdate their parents by the same.
  for (let pass = 0; pass < PROPAGATION_PASSES; pass += 1) {
    let changed = false;

    const estimate = (personId: string, year: number) => {
      if (birthYear.has(personId)) {
        return;
      }
      birthYear.set(personId, year);
      noteAny(personId, year);
      changed = true;
    };

    for (const family of families) {
      const spouseIds = [family.spouse1Id, family.spouse2Id].filter(
        (id): id is string => Boolean(id),
      );
      const childIds = childrenByFamily.get(family.id) ?? [];

      const knownChildYears = childIds
        .map((id) => birthYear.get(id))
        .filter((year): year is number => year !== undefined);
      const knownSpouseYears = spouseIds
        .map((id) => birthYear.get(id))
        .filter((year): year is number => year !== undefined);

      // Parents from children.
      if (knownChildYears.length) {
        const earliestChild = Math.min(...knownChildYears);
        for (const spouseId of spouseIds) {
          estimate(spouseId, earliestChild - GENERATION_YEARS);
        }
      }

      // Children from parents.
      if (knownSpouseYears.length) {
        const latestSpouse = Math.max(...knownSpouseYears);
        for (const childId of childIds) {
          estimate(childId, latestSpouse + GENERATION_YEARS);
        }
      }

      // Spouses from each other.
      if (knownSpouseYears.length === 1 && spouseIds.length === 2) {
        const known = knownSpouseYears[0]!;
        for (const spouseId of spouseIds) {
          estimate(spouseId, known);
        }
      }
    }

    if (!changed) {
      break;
    }
  }

  const undatedPersonIds: string[] = [];
  let presumedDeceasedCount = 0;

  const resolved = people.map((person) => {
    // An explicit death date is always authoritative.
    if (person.deathDateText) {
      return person.isLiving ? { ...person, isLiving: false } : person;
    }

    const reference = birthYear.get(person.id) ?? anyYear.get(person.id) ?? null;

    if (reference === null) {
      undatedPersonIds.push(person.id);
      return person.isLiving ? person : { ...person, isLiving: true };
    }

    const isLiving = currentYear - reference <= PRESUMED_DECEASED_AGE;

    if (!isLiving) {
      presumedDeceasedCount += 1;
    }

    return person.isLiving === isLiving ? person : { ...person, isLiving };
  });

  return { people: resolved, undatedPersonIds, presumedDeceasedCount };
}
