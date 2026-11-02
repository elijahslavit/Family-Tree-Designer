import { describe, expect, it } from "vitest";

import {
  CANVAS_NODE_HEIGHT,
  CANVAS_NODE_WIDTH,
  layoutFamilyCanvas,
  type CanvasConnection,
} from "@/lib/data/canvas-layout";
import { getDemoStore } from "@/lib/data/demo-store";
import { getCanvasNeighborhoodFromBundle } from "@/lib/data/tree-selectors";

const family: CanvasConnection[] = [
  { from: "focus", to: "mother", relation: "parent" },
  { from: "focus", to: "father", relation: "parent" },
  { from: "mother", to: "father", relation: "spouse" },
  { from: "focus", to: "brother", relation: "sibling" },
  { from: "brother", to: "mother", relation: "parent" },
  { from: "brother", to: "father", relation: "parent" },
  { from: "focus", to: "partner", relation: "spouse" },
  { from: "focus", to: "daughter", relation: "child" },
  { from: "partner", to: "daughter", relation: "child" },
];
const ids = ["focus", "mother", "father", "brother", "partner", "daughter"];

function overlaps(a: { x: number; y: number }, b: { x: number; y: number }) {
  return (
    Math.abs(a.x - b.x) < CANVAS_NODE_WIDTH &&
    Math.abs(a.y - b.y) < CANVAS_NODE_HEIGHT
  );
}

describe("layoutFamilyCanvas", () => {
  const layout = layoutFamilyCanvas({ focusId: "focus", nodeIds: ids, connections: family });
  const at = (id: string) => layout.positions.get(id)!;

  it("places generations on separate rows: parents above, children below", () => {
    expect(layout.generations.get("mother")).toBe(-1);
    expect(layout.generations.get("father")).toBe(-1);
    expect(layout.generations.get("focus")).toBe(0);
    expect(layout.generations.get("brother")).toBe(0);
    expect(layout.generations.get("partner")).toBe(0);
    expect(layout.generations.get("daughter")).toBe(1);

    expect(at("mother").y).toBeLessThan(at("focus").y);
    expect(at("daughter").y).toBeGreaterThan(at("focus").y);
    expect(at("brother").y).toBe(at("focus").y);
  });

  it("never overlaps two people", () => {
    for (const [index, left] of ids.entries()) {
      for (const right of ids.slice(index + 1)) {
        expect(overlaps(at(left), at(right)), `${left} overlaps ${right}`).toBe(false);
      }
    }
  });

  it("keeps partners side by side and siblings on the other side of the focus", () => {
    const row = ["brother", "focus", "partner"].map((id) => at(id).x);
    expect(row).toEqual([...row].sort((left, right) => left - right));
    expect(at("partner").x - at("focus").x).toBeLessThan(CANVAS_NODE_WIDTH * 1.5);
  });

  it("centres a child beneath both of its parents", () => {
    const parentsCentre = (at("focus").x + at("partner").x) / 2;
    expect(Math.abs(at("daughter").x - parentsCentre)).toBeLessThan(1);
  });

  it("draws parent-to-child lines downward and omits redundant sibling lines", () => {
    const parentLinks = layout.links.filter((link) => link.kind === "parent-child");
    expect(parentLinks).toHaveLength(6);
    for (const link of parentLinks) {
      expect(layout.generations.get(link.source)!).toBeLessThan(layout.generations.get(link.target)!);
      expect(link.sourceHandle).toBe("bottom");
      expect(link.targetHandle).toBe("top");
    }
    // Shared visible parents already express the sibling relationship.
    expect(layout.links.some((link) => link.kind === "sibling")).toBe(false);
    expect(layout.links.filter((link) => link.kind === "partner")).toHaveLength(2);
  });

  it("keeps an explicit sibling line when no shared parent is in view", () => {
    const sparse = layoutFamilyCanvas({
      focusId: "focus",
      nodeIds: ["focus", "brother"],
      connections: [{ from: "focus", to: "brother", relation: "sibling" }],
    });
    expect(sparse.links).toEqual([
      expect.objectContaining({ kind: "sibling", sourceHandle: "top-source", targetHandle: "top" }),
    ]);
  });
});

describe("getCanvasNeighborhoodFromBundle", () => {
  it("excludes filtered people before layout so no gaps remain", async () => {
    const bundle = getDemoStore();
    const viewer = { mode: "creator" as const, accountId: bundle.account.id };
    const full = await getCanvasNeighborhoodFromBundle({ bundle, personId: "p03", viewer });
    const hiddenChild = full!.nodes.find((node) => node.data.relationGroup === "descendant")!;

    const filtered = await getCanvasNeighborhoodFromBundle({
      bundle,
      personId: "p03",
      viewer,
      includePerson: (person) => person.id !== hiddenChild.id,
    });

    expect(filtered!.nodes.some((node) => node.id === hiddenChild.id)).toBe(false);
    expect(
      filtered!.edges.some((edge) => edge.source === hiddenChild.id || edge.target === hiddenChild.id),
    ).toBe(false);

    const remainingChildren = filtered!.nodes.filter((node) => node.data.relationGroup === "descendant");
    const focus = filtered!.nodes.find((node) => node.id === "p03")!;
    for (const child of remainingChildren) {
      expect(child.position.y).toBeGreaterThan(focus.position.y);
    }
  });

  it("gives every connector an accessible description", async () => {
    const bundle = getDemoStore();
    const result = await getCanvasNeighborhoodFromBundle({
      bundle,
      personId: "p03",
      viewer: { mode: "creator", accountId: bundle.account.id },
    });

    expect(result!.edges.length).toBeGreaterThan(0);
    for (const edge of result!.edges) {
      expect(edge.ariaLabel).toMatch(/parent of|partners|siblings/);
    }
  });
});
