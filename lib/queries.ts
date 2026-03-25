import type { Edge, Node } from "@xyflow/react";
import { notFound } from "next/navigation";

import { getDemoStore } from "@/lib/data/demo-store";
import { pageSize } from "@/lib/utils/constants";
import { compareNormalizedDates } from "@/lib/utils/dates";
import { maskPersonForViewer, isViewerSuppressed } from "@/lib/utils/privacy";
import type {
  Account,
  CanvasNodeData,
  DirectoryFilters,
  EventRecord,
  Family,
  FamilyChild,
  Lineage,
  LineageViewModel,
  Person,
  PersonViewModel,
  RelativeGroup,
  ReviewIssue,
  ReviewIssueStatus,
  TimelineItem,
  Tree,
  ViewerContext,
} from "@/lib/types";

type RelativeRelation = "parent" | "sibling" | "spouse" | "child";
type CanvasRelationGroup = NonNullable<CanvasNodeData["relationGroup"]>;

function getBundle() {
  return getDemoStore();
}

function getTree() {
  return getBundle().tree;
}

function getAccount() {
  return getBundle().account;
}

function getPeople() {
  return getBundle().people;
}

function getFamilies() {
  return getBundle().families;
}

function getFamilyChildren() {
  return getBundle().familyChildren;
}

function getEvents() {
  return getBundle().events;
}

function getLineages() {
  return getBundle().lineages;
}

function getLineageMembers() {
  return getBundle().lineageMembers;
}

function assertTreeAccess(tree: Tree, viewer: ViewerContext) {
  if (viewer.mode === "creator") {
    if (viewer.accountId !== tree.accountId) {
      notFound();
    }

    return;
  }

  if (!tree.isPublic || viewer.shareToken !== tree.shareToken) {
    notFound();
  }
}

function getSafePerson(person: Person, viewer: ViewerContext) {
  if (isViewerSuppressed(person, viewer)) {
    return maskPersonForViewer(person);
  }

  return person;
}

function getLineagesForPerson(personId: string) {
  const lineageIds = getLineageMembers()
    .filter((member) => member.personId === personId)
    .map((member) => member.lineageId);

  return getLineages().filter((lineage) => lineageIds.includes(lineage.id));
}

function getCanvasDateLabel(person: Person) {
  const birth = person.birthDateText?.trim();
  const death = person.deathDateText?.trim();

  if (person.isLiving) {
    return birth ? `Born ${birth}` : "Living";
  }

  if (birth && death) {
    return `${birth} - ${death}`;
  }

  if (birth) {
    return `Born ${birth}`;
  }

  if (death) {
    return `Died ${death}`;
  }

  return "Dates unknown";
}

function getCanvasRelationGroup({
  currentGroup,
  relation,
}: {
  currentGroup: CanvasRelationGroup;
  relation: RelativeRelation;
}) {
  if (currentGroup === "focus") {
    switch (relation) {
      case "parent":
        return "ancestor";
      case "child":
        return "descendant";
      case "sibling":
        return "sibling";
      case "spouse":
        return "spouse";
      default:
        return "relative";
    }
  }

  if (relation === "spouse") {
    return "spouse";
  }

  if (currentGroup === "ancestor" || currentGroup === "sibling") {
    return "ancestor";
  }

  if (currentGroup === "descendant") {
    return "descendant";
  }

  return currentGroup === "relative" ? "relative" : currentGroup;
}

function getCanvasEdgeStyle(relation: RelativeRelation, isHighlighted: boolean) {
  if (isHighlighted) {
    return {
      stroke: "var(--accent-primary)",
      strokeWidth: 2.7,
    };
  }

  switch (relation) {
    case "parent":
      return {
        stroke: "var(--rel-parent-border)",
        strokeWidth: 2.1,
      };
    case "sibling":
      return {
        stroke: "var(--rel-sibling-border)",
        strokeWidth: 2,
      };
    case "spouse":
      return {
        stroke: "var(--rel-spouse-border)",
        strokeWidth: 1.9,
        strokeDasharray: "7 5",
      };
    case "child":
      return {
        stroke: "var(--rel-child-border)",
        strokeWidth: 2.1,
      };
    default:
      return {
        stroke: "var(--canvas-edge)",
        strokeWidth: 1.9,
      };
  }
}

function getRelativeConnections(personId: string, viewer: ViewerContext) {
  const relatives = getRelatives(personId, viewer);

  return [
    ...relatives.parents.map((person) => ({ person, relation: "parent" as const })),
    ...relatives.siblings.map((person) => ({ person, relation: "sibling" as const })),
    ...relatives.spouses.map((person) => ({ person, relation: "spouse" as const })),
    ...relatives.children.map((person) => ({ person, relation: "child" as const })),
  ];
}

function getRelatives(personId: string, viewer: ViewerContext): RelativeGroup {
  const people = getPeople();
  const families = getFamilies();
  const familyChildren = getFamilyChildren();

  const asChildFamilyIds = familyChildren
    .filter((item) => item.childId === personId)
    .map((item) => item.familyId);
  const parentFamilies = families.filter((family) => asChildFamilyIds.includes(family.id));
  const parentIds = parentFamilies.flatMap((family) => [family.spouse1Id, family.spouse2Id]).filter(Boolean) as string[];

  const ownFamilies = families.filter(
    (family) => family.spouse1Id === personId || family.spouse2Id === personId,
  );
  const spouseIds = ownFamilies
    .flatMap((family) => [family.spouse1Id, family.spouse2Id])
    .filter((id) => id && id !== personId) as string[];

  const childIds = familyChildren
    .filter((item) => ownFamilies.some((family) => family.id === item.familyId))
    .map((item) => item.childId);

  const siblingIds = parentFamilies.flatMap((family) =>
    familyChildren
      .filter((item) => item.familyId === family.id && item.childId !== personId)
      .map((item) => item.childId),
  );

  const resolve = (ids: string[]) =>
    [...new Set(ids)]
      .map((id) => people.find((person) => person.id === id))
      .filter((person): person is Person => Boolean(person))
      .map((person) => getSafePerson(person, viewer));

  return {
    parents: resolve(parentIds),
    siblings: resolve(siblingIds),
    spouses: resolve(spouseIds),
    children: resolve(childIds),
  };
}

function getTimeline(person: Person, viewer: ViewerContext): TimelineItem[] {
  if (isViewerSuppressed(person, viewer)) {
    return [];
  }

  const items: TimelineItem[] = [];

  if (person.birthDateText || person.birthDateNormalized) {
    items.push({
      id: `${person.id}-birth`,
      label: "Birth",
      dateText: person.birthDateText,
      dateNormalized: person.birthDateNormalized,
      place: person.birthPlace,
    });
  }

  items.push(
    ...getEvents()
      .filter((event) => event.personId === person.id)
      .map((event) => ({
        id: event.id,
        label: event.type,
        dateText: event.dateText,
        dateNormalized: event.dateNormalized,
        place: event.place,
        description: event.description,
      })),
  );

  if (person.deathDateText || person.deathDateNormalized) {
    items.push({
      id: `${person.id}-death`,
      label: "Death",
      dateText: person.deathDateText,
      dateNormalized: person.deathDateNormalized,
      place: person.deathPlace,
    });
  }

  return items.sort((left, right) =>
    compareNormalizedDates(left.dateNormalized, right.dateNormalized),
  );
}

function buildPersonViewModel(person: Person, viewer: ViewerContext): PersonViewModel {
  const safePerson = getSafePerson(person, viewer);

  return {
    ...safePerson,
    relatives: getRelatives(person.id, viewer),
    lineages: getLineagesForPerson(person.id),
    timeline: getTimeline(person, viewer),
  };
}

export async function getTreeBySlug(slug: string, viewer: ViewerContext) {
  const tree = getTree();

  if (tree.slug !== slug) {
    notFound();
  }

  assertTreeAccess(tree, viewer);
  return tree;
}

export async function getActiveTreeForCreator(accountId: string) {
  const tree = getTree();

  if (tree.accountId !== accountId) {
    notFound();
  }

  return tree;
}

export async function getAccountForCreator(accountId: string) {
  const account = getAccount();

  if (account.id !== accountId) {
    notFound();
  }

  return account as Account;
}

export async function getDashboardData(accountId: string) {
  const tree = await getActiveTreeForCreator(accountId);
  const people = getPeople();
  const families = getFamilies();
  const events = getEvents();
  const issues = getBundle().reviewIssues;
  const importJobs = getBundle().importJobs;
  const familyChildren = getFamilyChildren();
  const lineageMembers = getLineageMembers();
  const lineages = getLineages();
  const relatedPersonIds = new Set(
    [
      ...families.flatMap((family) => [family.spouse1Id, family.spouse2Id]),
      ...familyChildren.map((item) => item.childId),
    ].filter(Boolean),
  );
  const orphanCount = people.filter((person) => !relatedPersonIds.has(person.id)).length;
  const livingCount = people.filter((person) => person.isLiving).length;
  const topSurnames = [...people]
    .reduce<Map<string, number>>((map, person) => {
      const surname = person.surname.trim();

      if (!surname) {
        return map;
      }

      map.set(surname, (map.get(surname) ?? 0) + 1);
      return map;
    }, new Map<string, number>());
  const topSurnamesList = Array.from(topSurnames.entries())
    .sort((left, right) => {
      if (right[1] !== left[1]) {
        return right[1] - left[1];
      }

      return left[0].localeCompare(right[0]);
    })
    .slice(0, 4)
    .map(([surname, count]) => ({ surname, count }));
  const recentPeople = [...people]
    .sort((left, right) => right.updatedAt.localeCompare(left.updatedAt))
    .slice(0, 6)
    .map((person) => ({
      ...person,
      lineages: getLineagesForPerson(person.id),
    }));
  const openIssues = [...issues]
    .filter((issue) => issue.status === "open")
    .sort((left, right) => right.createdAt.localeCompare(left.createdAt))
    .slice(0, 4);
  const lineageSummaries = lineages
    .map((lineage) => {
      const members = lineageMembers
        .filter((member) => member.lineageId === lineage.id)
        .sort((left, right) => left.order - right.order);
      const peopleInLineage = members
        .map((member) => people.find((person) => person.id === member.personId))
        .filter((person): person is Person => Boolean(person));

      return {
        ...lineage,
        memberCount: members.length,
        firstPersonId: peopleInLineage[0]?.id ?? null,
        firstPersonName: peopleInLineage[0]?.fullName ?? null,
        latestPersonName: peopleInLineage.at(-1)?.fullName ?? null,
      };
    })
    .sort((left, right) => {
      if (right.memberCount !== left.memberCount) {
        return right.memberCount - left.memberCount;
      }

      return left.name.localeCompare(right.name);
    });
  const latestImportJob =
    [...importJobs].sort((left, right) => right.createdAt.localeCompare(left.createdAt))[0] ??
    null;

  return {
    tree,
    stats: {
      people: people.length,
      families: families.length,
      events: events.length,
      issues: issues.length,
      living: livingCount,
      orphan: orphanCount,
    },
    topSurnames: topSurnamesList,
    recentPeople,
    openIssues,
    latestImportJob,
    lineages: lineageSummaries,
  };
}

export async function getPeopleByTree({
  treeSlug,
  viewer,
  filters = {},
}: {
  treeSlug: string;
  viewer: ViewerContext;
  filters?: DirectoryFilters;
}) {
  await getTreeBySlug(treeSlug, viewer);

  const search = filters.search?.trim().toLowerCase() ?? "";
  const surname = filters.surname?.trim().toLowerCase();
  const lineageId = filters.lineageId;
  const sort = filters.sort ?? "name";
  const page = Math.max(filters.page ?? 1, 1);
  const size = filters.pageSize ?? pageSize;

  let result = [...getPeople()];

  if (search) {
    result = result.filter((person) => person.fullName.toLowerCase().includes(search));
  }

  if (surname) {
    result = result.filter((person) => person.surname.toLowerCase() === surname);
  }

  if (lineageId) {
    const personIds = getLineageMembers()
      .filter((member) => member.lineageId === lineageId)
      .map((member) => member.personId);
    result = result.filter((person) => personIds.includes(person.id));
  }

  result.sort((left, right) => {
    if (sort === "birth") {
      return compareNormalizedDates(left.birthDateNormalized, right.birthDateNormalized);
    }

    if (sort === "death") {
      return compareNormalizedDates(left.deathDateNormalized, right.deathDateNormalized);
    }

    return left.fullName.localeCompare(right.fullName);
  });

  const total = result.length;
  const totalPages = Math.max(Math.ceil(total / size), 1);
  const paged = result.slice((page - 1) * size, page * size).map((person) => getSafePerson(person, viewer));

  return {
    items: paged,
    total,
    totalPages,
    page,
    surnames: [...new Set(getPeople().map((person) => person.surname))].sort(),
    lineages: getLineages(),
  };
}

export async function getPersonById({
  treeSlug,
  personId,
  viewer,
}: {
  treeSlug: string;
  personId: string;
  viewer: ViewerContext;
}) {
  await getTreeBySlug(treeSlug, viewer);
  const person = getPeople().find((candidate) => candidate.id === personId);

  if (!person) {
    notFound();
  }

  return buildPersonViewModel(person, viewer);
}

export async function getFamiliesByTree({
  treeSlug,
  viewer,
}: {
  treeSlug: string;
  viewer: ViewerContext;
}) {
  await getTreeBySlug(treeSlug, viewer);
  return getFamilies();
}

export async function getLineagesByTree({
  treeSlug,
  viewer,
}: {
  treeSlug: string;
  viewer: ViewerContext;
}): Promise<LineageViewModel[]> {
  await getTreeBySlug(treeSlug, viewer);
  return getLineages().map((lineage) => ({
    ...lineage,
    members: getLineageMembers()
      .filter((member) => member.lineageId === lineage.id)
      .sort((left, right) => left.order - right.order)
      .map((member) => getPeople().find((person) => person.id === member.personId))
      .filter((person): person is Person => Boolean(person))
      .map((person) => getSafePerson(person, viewer)),
  }));
}

export async function getEventsByPerson({
  treeSlug,
  personId,
  viewer,
}: {
  treeSlug: string;
  personId: string;
  viewer: ViewerContext;
}) {
  await getTreeBySlug(treeSlug, viewer);
  const person = getPeople().find((candidate) => candidate.id === personId);

  if (!person) {
    notFound();
  }

  if (isViewerSuppressed(person, viewer)) {
    return [] as EventRecord[];
  }

  return getEvents()
    .filter((event) => event.personId === personId)
    .sort((left, right) =>
      compareNormalizedDates(left.dateNormalized, right.dateNormalized),
    );
}

export async function getImportJobsByTree({
  treeSlug,
  viewer,
}: {
  treeSlug: string;
  viewer: ViewerContext;
}) {
  await getTreeBySlug(treeSlug, viewer);
  return getBundle().importJobs;
}

export async function getImportJob({
  treeSlug,
  jobId,
  viewer,
}: {
  treeSlug: string;
  jobId: string;
  viewer: ViewerContext;
}) {
  await getTreeBySlug(treeSlug, viewer);
  return getBundle().importJobs.find((job) => job.id === jobId) ?? null;
}

export async function getReviewIssuesByTree({
  treeSlug,
  viewer,
  status,
}: {
  treeSlug: string;
  viewer: ViewerContext;
  status?: ReviewIssueStatus;
}) {
  await getTreeBySlug(treeSlug, viewer);

  return getBundle().reviewIssues.filter((issue) =>
    status ? issue.status === status : true,
  ) as ReviewIssue[];
}

export async function getCanvasNeighborhood({
  treeSlug,
  personId,
  viewer,
  depth = 1,
  lineageId = null,
}: {
  treeSlug: string;
  personId: string;
  viewer: ViewerContext;
  depth?: number;
  lineageId?: string | null;
}) {
  const person = await getPersonById({ treeSlug, personId, viewer });
  const maxDepth = 3;
  const safeDepth = Math.max(1, Math.min(depth, maxDepth));
  const visiblePeople = new Map<string, Person>();
  const nodeDepths = new Map<string, number>();
  const edgeMap = new Map<string, Edge>();
  const relationGroups = new Map<string, CanvasRelationGroup>([[person.id, "focus"]]);
  const queue = [{ personId: person.id, level: 0, group: "focus" as CanvasRelationGroup }];
  const visited = new Set<string>([person.id]);

  visiblePeople.set(person.id, person);
  nodeDepths.set(person.id, 0);

  while (queue.length) {
    const current = queue.shift();

    if (!current || current.level >= safeDepth) {
      continue;
    }

    getRelativeConnections(current.personId, viewer).forEach(({ person: relative, relation }) => {
      const relationGroup = getCanvasRelationGroup({
        currentGroup: current.group,
        relation,
      });

      if (!visiblePeople.has(relative.id)) {
        visiblePeople.set(relative.id, relative);
      }

      if (!nodeDepths.has(relative.id)) {
        nodeDepths.set(relative.id, current.level + 1);
      }

      if (!relationGroups.has(relative.id)) {
        relationGroups.set(relative.id, relationGroup);
      }

      const edgeKey = [current.personId, relative.id].sort().join(":");

      if (!edgeMap.has(edgeKey)) {
        edgeMap.set(edgeKey, {
          id: `${edgeKey}:${relation}`,
          source: current.personId,
          target: relative.id,
          label: relation,
          type: "smoothstep",
        });
      }

      if (!visited.has(relative.id)) {
        visited.add(relative.id);
        queue.push({
          personId: relative.id,
          level: current.level + 1,
          group: relationGroup,
        });
      }
    });
  }

  const visibleIds = new Set(visiblePeople.keys());
  const availableLineages = getLineages().filter((lineage) =>
    getLineageMembers().some(
      (member) => member.lineageId === lineage.id && visibleIds.has(member.personId),
    ),
  );
  const highlightedIds = new Set(
    lineageId
      ? getLineageMembers()
          .filter((member) => member.lineageId === lineageId)
          .map((member) => member.personId)
      : [],
  );

  const nodes: Node[] = [...visiblePeople.values()].map((visiblePerson) => {
    const personLineages = getLineagesForPerson(visiblePerson.id);
    const data: CanvasNodeData = {
      id: visiblePerson.id,
      label: visiblePerson.fullName,
      subtitle: getCanvasDateLabel(visiblePerson),
      summary: visiblePerson.summary,
      isLiving: visiblePerson.isLiving,
      kind: "person",
      isFocus: visiblePerson.id === person.id,
      isHighlighted: highlightedIds.has(visiblePerson.id),
      relationGroup: relationGroups.get(visiblePerson.id) ?? "relative",
      lineageNames: personLineages.map((lineage) => lineage.name),
    };

    return {
      id: visiblePerson.id,
      type: "person",
      position: {
        x: (nodeDepths.get(visiblePerson.id) ?? 0) * 240,
        y: 0,
      },
      ariaLabel: highlightedIds.has(visiblePerson.id)
        ? `${visiblePerson.fullName}, highlighted lineage member`
        : visiblePerson.fullName,
      data,
    };
  });

  const edges = [...edgeMap.values()].map((edge) => {
    const isHighlighted =
      highlightedIds.has(edge.source) && highlightedIds.has(edge.target);
    const relation = (edge.label as RelativeRelation | undefined) ?? "child";

    return {
      ...edge,
      animated: isHighlighted,
      style: getCanvasEdgeStyle(relation, isHighlighted),
    };
  });

  const layeredNodes = new Map<number, Node[]>();

  nodes.forEach((node) => {
    const level = nodeDepths.get(node.id) ?? 0;
    const current = layeredNodes.get(level) ?? [];
    current.push(node);
    layeredNodes.set(level, current);
  });

  [...layeredNodes.entries()].forEach(([level, layerNodes]) => {
    const sortedNodes = [...layerNodes].sort((left, right) => {
      const leftFocus = left.id === person.id ? -1 : 0;
      const rightFocus = right.id === person.id ? -1 : 0;

      if (leftFocus !== rightFocus) {
        return leftFocus - rightFocus;
      }

      return String(left.data.label).localeCompare(String(right.data.label));
    });
    const layerHeight = Math.max((sortedNodes.length - 1) * 190, 0);

    sortedNodes.forEach((node, index) => {
      node.position = {
        x: level * 320,
        y: index * 190 - layerHeight / 2,
      };
    });
  });

  try {
    const ELKModule = await import("elkjs/lib/elk.bundled.js");
    const ELKConstructor = ELKModule.default;
    const elk = new ELKConstructor();
    const layout = await elk.layout({
      id: "family-tree",
      layoutOptions: {
        "elk.algorithm": "layered",
        "elk.direction": "RIGHT",
        "elk.edgeRouting": "ORTHOGONAL",
        "elk.layered.nodePlacement.strategy": "NETWORK_SIMPLEX",
        "elk.layered.spacing.nodeNodeBetweenLayers": "170",
        "elk.spacing.nodeNode": "120",
      },
      children: nodes.map((node) => ({
        id: node.id,
        width: 252,
        height: 150,
      })),
      edges: edges.map((edge) => ({
        id: edge.id,
        sources: [edge.source],
        targets: [edge.target],
      })),
    });

    const layoutByNodeId = new Map(
      layout.children?.map((node) => [node.id, node]) ?? [],
    );

    nodes.forEach((node) => {
      const positionedNode = layoutByNodeId.get(node.id);

      if (!positionedNode) {
        return;
      }

      node.position = {
        x: positionedNode.x ?? node.position.x,
        y: positionedNode.y ?? node.position.y,
      };
    });
  } catch {
    // Fall back to the coarse manual grouping when ELK layout is unavailable.
  }

  return {
    focusPerson: person,
    nodes,
    edges,
    relatedCount: nodes.length - 1,
    depth: safeDepth,
    maxDepth,
    availableLineages,
  };
}

export async function getPublicEntry(treeSlug: string, shareToken: string | null) {
  const viewer: ViewerContext = {
    mode: "viewer",
    shareToken,
  };

  const tree = await getTreeBySlug(treeSlug, viewer);
  const directory = await getPeopleByTree({ treeSlug, viewer });

  return {
    tree,
    directory,
  };
}

export async function getThemeSnapshot(treeSlug: string, viewer: ViewerContext) {
  const tree = await getTreeBySlug(treeSlug, viewer);

  return {
    layout: tree.themeLayout,
    skin: tree.themeSkin,
  };
}

export function getDefaultPersonId() {
  return getPeople()[0]?.id ?? null;
}

export function getFamilyById(familyId: string): Family | null {
  return getFamilies().find((family) => family.id === familyId) ?? null;
}

export function getLineageById(lineageId: string): Lineage | null {
  return getLineages().find((lineage) => lineage.id === lineageId) ?? null;
}

export async function getFamilyChildrenByTree({
  treeSlug,
  viewer,
}: {
  treeSlug: string;
  viewer: ViewerContext;
}) {
  await getTreeBySlug(treeSlug, viewer);
  return getFamilyChildren() as FamilyChild[];
}
