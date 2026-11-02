/**
 * Deterministic generational layout for the focused family canvas.
 *
 * Parents sit on the row above the people they belong to, partners sit beside
 * each other, and children sit on the row below. The layout is intentionally
 * dependency-free so the server can render a stable, readable tree for small
 * focused neighbourhoods without a general graph-layout engine.
 */

export type CanvasRelation = "parent" | "child" | "sibling" | "spouse";

/** `relation` describes `to` from the point of view of `from`. */
export type CanvasConnection = {
  from: string;
  to: string;
  relation: CanvasRelation;
};

export type CanvasLink = {
  kind: "parent-child" | "partner" | "sibling";
  source: string;
  target: string;
  sourceHandle: string;
  targetHandle: string;
};

export type CanvasLayout = {
  positions: Map<string, { x: number; y: number }>;
  generations: Map<string, number>;
  links: CanvasLink[];
};

export const CANVAS_NODE_WIDTH = 240;
export const CANVAS_NODE_HEIGHT = 124;
const COLUMN_GAP = 56;
const PARTNER_GAP = 36;
const ROW_GAP = 128;

function pairKey(left: string, right: string) {
  return left < right ? `${left}|${right}` : `${right}|${left}`;
}

export function layoutFamilyCanvas({
  focusId,
  nodeIds,
  connections,
  compareNodes,
}: {
  focusId: string;
  nodeIds: string[];
  connections: CanvasConnection[];
  /** Stable tie-breaker, usually by display name. */
  compareNodes?: (left: string, right: string) => number;
}): CanvasLayout {
  const known = new Set(nodeIds);
  const compare = compareNodes ?? ((left: string, right: string) => left.localeCompare(right));

  const parentChild = new Map<string, { parent: string; child: string }>();
  const partners = new Map<string, [string, string]>();
  const siblings = new Map<string, [string, string]>();
  const adjacency = new Map<string, CanvasConnection[]>();

  for (const connection of connections) {
    if (!known.has(connection.from) || !known.has(connection.to) || connection.from === connection.to) {
      continue;
    }

    const key = pairKey(connection.from, connection.to);
    if (connection.relation === "parent") {
      parentChild.set(key, { parent: connection.to, child: connection.from });
    } else if (connection.relation === "child") {
      parentChild.set(key, { parent: connection.from, child: connection.to });
    } else if (connection.relation === "spouse") {
      partners.set(key, [connection.from, connection.to]);
    } else {
      siblings.set(key, [connection.from, connection.to]);
    }

    const forward = adjacency.get(connection.from) ?? [];
    forward.push(connection);
    adjacency.set(connection.from, forward);
  }

  // Assign generations outward from the focus person.
  const generations = new Map<string, number>([[focusId, 0]]);
  const queue = [focusId];
  while (queue.length) {
    const current = queue.shift()!;
    const generation = generations.get(current)!;
    const neighbours = [
      ...(adjacency.get(current) ?? []),
      // Connections recorded from the other side still place this node.
      ...connections
        .filter((connection) => connection.to === current && known.has(connection.from))
        .map((connection) => ({
          from: current,
          to: connection.from,
          relation: invert(connection.relation),
        })),
    ];

    for (const neighbour of neighbours) {
      if (generations.has(neighbour.to)) continue;
      const offset = neighbour.relation === "parent" ? -1 : neighbour.relation === "child" ? 1 : 0;
      generations.set(neighbour.to, generation + offset);
      queue.push(neighbour.to);
    }
  }

  for (const id of nodeIds) {
    if (!generations.has(id)) generations.set(id, 0);
  }

  const rows = new Map<number, string[]>();
  for (const id of nodeIds) {
    const generation = generations.get(id)!;
    rows.set(generation, [...(rows.get(generation) ?? []), id]);
  }

  // Seed the focus row: siblings to the left, focus, then partners.
  const focusRow = rows.get(0) ?? [focusId];
  const isPartnerOfFocus = (id: string) => partners.has(pairKey(id, focusId));
  rows.set(0, [
    ...focusRow.filter((id) => id !== focusId && !isPartnerOfFocus(id)).sort(compare),
    focusId,
    ...focusRow.filter((id) => isPartnerOfFocus(id)).sort(compare),
  ]);

  const orderedGenerations = [...rows.keys()].sort((left, right) => left - right);
  for (const generation of orderedGenerations) {
    if (generation !== 0) rows.set(generation, [...rows.get(generation)!].sort(compare));
  }

  const parentChildLinks = [...parentChild.values()];
  const indexOf = (generation: number, id: string) => rows.get(generation)?.indexOf(id) ?? -1;

  // Barycentre sweeps outward from the focus row keep relatives near the
  // people they are attached to and minimise crossing lines.
  const sweep = (generation: number, towardFocus: number) => {
    const row = rows.get(generation);
    if (!row) return;
    const weights = new Map<string, number>();
    row.forEach((id, index) => {
      const anchors = parentChildLinks
        .filter((link) => link.parent === id || link.child === id)
        .map((link) => (link.parent === id ? link.child : link.parent))
        .filter((other) => generations.get(other) === towardFocus)
        .map((other) => indexOf(towardFocus, other))
        .filter((value) => value >= 0);
      weights.set(
        id,
        anchors.length ? anchors.reduce((sum, value) => sum + value, 0) / anchors.length : index,
      );
    });
    rows.set(
      generation,
      [...row].sort((left, right) => weights.get(left)! - weights.get(right)! || compare(left, right)),
    );
  };

  for (const generation of orderedGenerations.filter((value) => value < 0).reverse()) {
    sweep(generation, generation + 1);
  }
  for (const generation of orderedGenerations.filter((value) => value > 0)) {
    sweep(generation, generation - 1);
  }

  // Keep partners side by side outside the focus row (already seeded there).
  for (const generation of orderedGenerations) {
    if (generation === 0) continue;
    const row = [...rows.get(generation)!];
    for (const [left, right] of partners.values()) {
      if (generations.get(left) !== generation || generations.get(right) !== generation) continue;
      const leftIndex = row.indexOf(left);
      const rightIndex = row.indexOf(right);
      if (Math.abs(leftIndex - rightIndex) === 1) continue;
      const [anchor, mover] = leftIndex < rightIndex ? [left, right] : [right, left];
      row.splice(row.indexOf(mover), 1);
      row.splice(row.indexOf(anchor) + 1, 0, mover);
    }
    rows.set(generation, row);
  }

  // Horizontal placement: pack each row, then shift it so its people sit
  // centred over (or under) the relatives they connect to.
  const positions = new Map<string, { x: number; y: number }>();
  const placeRow = (generation: number) => {
    const row = rows.get(generation)!;
    let cursor = 0;
    const local = row.map((id, index) => {
      if (index > 0) {
        const previous = row[index - 1]!;
        cursor += CANVAS_NODE_WIDTH + (partners.has(pairKey(previous, id)) ? PARTNER_GAP : COLUMN_GAP);
      }
      return { id, x: cursor };
    });
    const width = cursor + CANVAS_NODE_WIDTH;
    let offset = -width / 2;

    if (generation !== 0) {
      const towardFocus = generation < 0 ? generation + 1 : generation - 1;
      const pairs = local.flatMap(({ id, x }) =>
        parentChildLinks
          .filter((link) => link.parent === id || link.child === id)
          .map((link) => (link.parent === id ? link.child : link.parent))
          .filter((other) => generations.get(other) === towardFocus && positions.has(other))
          .map((other) => ({ x, target: positions.get(other)!.x })),
      );
      if (pairs.length) {
        offset = pairs.reduce((sum, pair) => sum + (pair.target - pair.x), 0) / pairs.length;
      }
    }

    local.forEach(({ id, x }) => {
      positions.set(id, {
        x: Math.round(x + offset),
        y: generation * (CANVAS_NODE_HEIGHT + ROW_GAP),
      });
    });
  };

  placeRow(0);
  for (const generation of orderedGenerations.filter((value) => value < 0).reverse()) placeRow(generation);
  for (const generation of orderedGenerations.filter((value) => value > 0)) placeRow(generation);

  const links: CanvasLink[] = [];
  const left = (a: string, b: string) => (positions.get(a)!.x <= positions.get(b)!.x ? [a, b] : [b, a]);

  for (const { parent, child } of parentChildLinks) {
    const parentGeneration = generations.get(parent)!;
    const childGeneration = generations.get(child)!;
    if (parentGeneration < childGeneration) {
      links.push({ kind: "parent-child", source: parent, target: child, sourceHandle: "bottom", targetHandle: "top" });
    } else {
      // Rare when breadth-first placement put both on one row; draw side to side.
      const [a, b] = left(parent, child);
      links.push({ kind: "parent-child", source: a, target: b, sourceHandle: "right", targetHandle: "left" });
    }
  }

  for (const [a, b] of partners.values()) {
    const [first, second] = left(a, b);
    links.push({ kind: "partner", source: first, target: second, sourceHandle: "right", targetHandle: "left" });
  }

  const visibleParentsOf = (id: string) =>
    new Set(parentChildLinks.filter((link) => link.child === id).map((link) => link.parent));
  for (const [a, b] of siblings.values()) {
    const shared = [...visibleParentsOf(a)].some((parent) => visibleParentsOf(b).has(parent));
    if (shared) continue; // The shared parent already shows the relationship.
    const [first, second] = left(a, b);
    links.push({ kind: "sibling", source: first, target: second, sourceHandle: "top-source", targetHandle: "top" });
  }

  return { positions, generations, links };
}

function invert(relation: CanvasRelation): CanvasRelation {
  if (relation === "parent") return "child";
  if (relation === "child") return "parent";
  return relation;
}
