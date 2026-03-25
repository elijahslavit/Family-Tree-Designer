import { demoBundle } from "@/lib/data/demo-tree";
import type { TreeBundle } from "@/lib/types";

declare global {
  var __familyTreeDemoStore: TreeBundle | undefined;
}

function createStore() {
  return structuredClone(demoBundle);
}

export function getDemoStore() {
  if (!globalThis.__familyTreeDemoStore) {
    globalThis.__familyTreeDemoStore = createStore();
  }

  return globalThis.__familyTreeDemoStore;
}

export function resetDemoStore() {
  globalThis.__familyTreeDemoStore = createStore();
  return globalThis.__familyTreeDemoStore;
}
