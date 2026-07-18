import { demoBundle } from "@/lib/data/demo-tree";
import type { TreeBundle } from "@/lib/types";

declare global {
  var __familyTreeDemoStore: TreeBundle | undefined;
  var __familyTreeBundles: Map<string, TreeBundle> | undefined;
}

function createStore() {
  return structuredClone(demoBundle);
}

/** The seeded archive. Creator and public routes operate on this single tree. */
export function getDemoStore() {
  if (!globalThis.__familyTreeDemoStore) {
    globalThis.__familyTreeDemoStore = createStore();
  }

  return globalThis.__familyTreeDemoStore;
}

function bundleMap() {
  if (!globalThis.__familyTreeBundles) {
    globalThis.__familyTreeBundles = new Map();
  }

  return globalThis.__familyTreeBundles;
}

/**
 * An empty but valid archive. A project that has imported nothing must render an
 * empty state rather than borrowing another family's records.
 */
function createEmptyBundle(treeId: string): TreeBundle {
  const seed = getDemoStore();

  return {
    account: seed.account,
    tree: {
      ...seed.tree,
      id: treeId,
      name: "Untitled archive",
      slug: treeId,
      description: null,
    },
    people: [],
    families: [],
    familyChildren: [],
    events: [],
    lineages: [],
    lineageMembers: [],
    sources: [],
    claims: [],
    citations: [],
    reviewIssues: [],
    externalIds: [],
    importJobs: [],
  };
}

/**
 * Give a tree its own populated copy of the seeded archive. Used only to stand
 * up the synthetic demonstration projects, which represent client work already
 * in progress and would be meaningless empty. Records are cloned, so editing or
 * importing into one project cannot affect another.
 */
export function seedTreeBundleFromDemo(treeId: string): TreeBundle {
  const seed = getDemoStore();

  if (treeId === seed.tree.id) {
    return seed;
  }

  // Idempotent: this runs on every workspace read, and re-seeding would discard
  // a real GEDCOM import.
  const existing = bundleMap().get(treeId);

  if (existing) {
    return existing;
  }

  const clone = structuredClone(seed);
  clone.tree = { ...clone.tree, id: treeId, slug: treeId };
  clone.people = clone.people.map((person) => ({ ...person, treeId }));
  clone.families = clone.families.map((family) => ({ ...family, treeId }));
  clone.events = clone.events.map((event) => ({ ...event, treeId }));
  clone.lineages = clone.lineages.map((lineage) => ({ ...lineage, treeId }));
  clone.sources = clone.sources.map((source) => ({ ...source, treeId }));
  clone.reviewIssues = clone.reviewIssues.map((issue) => ({ ...issue, treeId }));
  clone.externalIds = clone.externalIds.map((entry) => ({ ...entry, treeId }));
  clone.importJobs = clone.importJobs.map((job) => ({ ...job, treeId }));

  bundleMap().set(treeId, clone);

  return clone;
}

/**
 * The archive belonging to one tree. Projects each own a tree, so importing for
 * one client cannot overwrite another client's records.
 */
export function getTreeBundle(treeId: string): TreeBundle {
  const seed = getDemoStore();

  if (treeId === seed.tree.id) {
    return seed;
  }

  const map = bundleMap();
  let bundle = map.get(treeId);

  if (!bundle) {
    bundle = createEmptyBundle(treeId);
    map.set(treeId, bundle);
  }

  return bundle;
}

export function resetDemoStore() {
  globalThis.__familyTreeDemoStore = createStore();
  globalThis.__familyTreeBundles = new Map();
  return globalThis.__familyTreeDemoStore;
}
