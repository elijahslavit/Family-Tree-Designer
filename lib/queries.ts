import type { Edge, Node } from "@xyflow/react";
import { notFound } from "next/navigation";

import { getDemoStore } from "@/lib/data/demo-store";
import { pageSize } from "@/lib/utils/constants";
import { compareNormalizedDates } from "@/lib/utils/dates";
import { maskPersonForViewer, isViewerSuppressed } from "@/lib/utils/privacy";
import type {
  DirectoryFilters,
  Family,
  Lineage,
  Person,
  PersonViewModel,
  RelativeGroup,
  TimelineItem,
  Tree,
  ViewerContext,
} from "@/lib/types";

function getBundle() {
  return getDemoStore();
}

function getTree() {
  return getBundle().tree;
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

function getTimeline(person: Person): TimelineItem[] {
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
    timeline: getTimeline(safePerson),
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

export async function getDashboardData(accountId: string) {
  const tree = await getActiveTreeForCreator(accountId);
  const people = getPeople();
  const issues = getBundle().reviewIssues;

  return {
    tree,
    stats: {
      people: people.length,
      families: getFamilies().length,
      events: getEvents().length,
      issues: issues.length,
    },
    recentPeople: [...people]
      .sort((left, right) => right.updatedAt.localeCompare(left.updatedAt))
      .slice(0, 5),
    lineages: getLineages(),
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
}) {
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

export async function getCanvasNeighborhood({
  treeSlug,
  personId,
  viewer,
}: {
  treeSlug: string;
  personId: string;
  viewer: ViewerContext;
}) {
  const person = await getPersonById({ treeSlug, personId, viewer });

  const relatives = [
    ...person.relatives.parents,
    ...person.relatives.siblings,
    ...person.relatives.spouses,
    ...person.relatives.children,
  ];

  const nodes: Node[] = [
    {
      id: person.id,
      type: "person",
      position: { x: 0, y: 0 },
      ariaLabel: person.fullName,
      data: {
        label: person.fullName,
        subtitle: person.summary,
        isLiving: person.isLiving,
      },
    },
  ];

  const edges: Edge[] = [];

  const groups = [
    { label: "parents", people: person.relatives.parents, y: -180 },
    { label: "siblings", people: person.relatives.siblings, y: -40 },
    { label: "spouses", people: person.relatives.spouses, y: 40 },
    { label: "children", people: person.relatives.children, y: 180 },
  ];

  groups.forEach((group) => {
    group.people.forEach((relative, index) => {
      const x = (index - (group.people.length - 1) / 2) * 240;
      nodes.push({
        id: relative.id,
        type: "person",
        position: { x, y: group.y },
        ariaLabel: relative.fullName,
        data: {
          label: relative.fullName,
          subtitle: relative.summary,
          isLiving: relative.isLiving,
        },
      });
      edges.push({
        id: `${person.id}-${relative.id}-${group.label}`,
        source: person.id,
        target: relative.id,
        label: group.label,
      });
    });
  });

  return {
    focusPerson: person,
    nodes,
    edges,
    relatedCount: relatives.length,
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
