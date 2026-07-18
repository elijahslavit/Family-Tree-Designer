import { describe, expect, it } from "vitest";

import { inferLivingStatus } from "@/lib/import/living-inference";
import type { EventRecord, Family, FamilyChild, Person } from "@/lib/types";

function person(id: string, overrides: Partial<Person> = {}): Person {
  return {
    id,
    treeId: "t1",
    givenName: id,
    surname: "Test",
    fullName: `${id} Test`,
    gender: "unknown",
    isLiving: true,
    createdAt: "2020-01-01T00:00:00.000Z",
    updatedAt: "2020-01-01T00:00:00.000Z",
    ...overrides,
  };
}

function run({
  people,
  families = [],
  familyChildren = [],
  events = [],
}: {
  people: Person[];
  families?: Family[];
  familyChildren?: FamilyChild[];
  events?: EventRecord[];
}) {
  return inferLivingStatus({
    people,
    families,
    familyChildren,
    events,
    now: new Date("2026-01-01T00:00:00.000Z"),
  });
}

describe("inferLivingStatus", () => {
  it("treats a recorded death as authoritative", () => {
    const result = run({
      people: [person("a", { deathDateText: "2 NOV 1901", isLiving: true })],
    });

    expect(result.people[0]!.isLiving).toBe(false);
  });

  it("presumes death for an old birth year with no death record", () => {
    // The case that matters most: an ancestor whose death was never recorded
    // must not be hidden from their own family's archive.
    const result = run({
      people: [person("a", { birthDateText: "ABT 1841" })],
    });

    expect(result.people[0]!.isLiving).toBe(false);
    expect(result.presumedDeceasedCount).toBe(1);
  });

  it("keeps a recent birth year living", () => {
    const result = run({ people: [person("a", { birthDateText: "1994" })] });

    expect(result.people[0]!.isLiving).toBe(true);
  });

  it("dates an undated person through their parents", () => {
    const result = run({
      people: [
        person("parent", { birthDateText: "1836" }),
        person("child"),
      ],
      families: [{ id: "f1", treeId: "t1", spouse1Id: "parent", spouse2Id: null }],
      familyChildren: [
        { familyId: "f1", childId: "child", order: 1, relationshipType: "biological" },
      ],
    });

    expect(result.people.find((p) => p.id === "child")!.isLiving).toBe(false);
    expect(result.undatedPersonIds).toEqual([]);
  });

  it("leaves a person the graph cannot date flagged living", () => {
    const result = run({ people: [person("orphan")] });

    expect(result.people[0]!.isLiving).toBe(true);
    expect(result.undatedPersonIds).toEqual(["orphan"]);
  });

  it("uses a birth event when the person record carries no date", () => {
    const result = run({
      people: [person("a")],
      events: [
        {
          id: "e1",
          treeId: "t1",
          personId: "a",
          type: "birth",
          dateText: "14 MAR 1836",
          dateNormalized: null,
          place: null,
          description: null,
        },
      ],
    });

    expect(result.people[0]!.isLiving).toBe(false);
  });
});
