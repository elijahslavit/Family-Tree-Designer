import { beforeEach, describe, expect, it } from "vitest";

import {
  getDemoStore,
  getTreeBundle,
  resetDemoStore,
  seedTreeBundleFromDemo,
} from "@/lib/data/demo-store";
import { getPilotProject } from "@/lib/pilot/store";
import { buildPilotShowcase } from "@/lib/showcase/pilot-showcase";

describe("per-tree archives", () => {
  beforeEach(() => {
    resetDemoStore();
  });

  it("returns the seeded archive for the demo tree", () => {
    const seed = getDemoStore();

    expect(getTreeBundle(seed.tree.id)).toBe(seed);
    expect(getTreeBundle(seed.tree.id).people.length).toBeGreaterThan(0);
  });

  it("gives an unknown tree its own empty archive", () => {
    const bundle = getTreeBundle("tree-new-client");

    expect(bundle.people).toEqual([]);
    expect(bundle.families).toEqual([]);
    expect(bundle.tree.id).toBe("tree-new-client");
  });

  it("returns a stable instance per tree", () => {
    expect(getTreeBundle("tree-a")).toBe(getTreeBundle("tree-a"));
  });

  it("keeps one client's records out of another's archive", () => {
    const first = getTreeBundle("tree-a");
    const second = getTreeBundle("tree-b");
    const seed = getDemoStore();

    first.people = [
      {
        id: "x1",
        treeId: "tree-a",
        givenName: "Ada",
        surname: "Client",
        fullName: "Ada Client",
        gender: "female",
        isLiving: false,
        createdAt: "2020-01-01T00:00:00.000Z",
        updatedAt: "2020-01-01T00:00:00.000Z",
      },
    ];

    expect(second.people).toEqual([]);
    expect(seed.people.some((person) => person.id === "x1")).toBe(false);
  });

  it("seeds a demo archive without linking it to the original", () => {
    const seeded = seedTreeBundleFromDemo("tree-demo-copy");
    const seed = getDemoStore();

    expect(seeded).not.toBe(seed);
    expect(seeded.people.length).toBe(seed.people.length);
    expect(seeded.people.every((person) => person.treeId === "tree-demo-copy")).toBe(true);

    seeded.people = [];
    expect(seed.people.length).toBeGreaterThan(0);
  });

  it("does not re-seed a tree that already holds records", () => {
    const first = seedTreeBundleFromDemo("tree-imported");
    first.people = [];

    // Seeding runs on every workspace read; a second call must not restore data.
    expect(seedTreeBundleFromDemo("tree-imported").people).toEqual([]);
  });

  it("presents an empty archive rather than throwing", () => {
    const project = getPilotProject("pilot-hart-001");
    const empty = { ...project, treeId: "tree-never-imported" };

    const showcase = buildPilotShowcase(empty, "/preview");

    expect(showcase.focalPerson).toBeNull();
    expect(showcase.people).toEqual([]);
  });

  it("discards per-tree archives on reset", () => {
    getTreeBundle("tree-a").people = [];
    const before = getTreeBundle("tree-a");
    resetDemoStore();

    expect(getTreeBundle("tree-a")).not.toBe(before);
  });
});
