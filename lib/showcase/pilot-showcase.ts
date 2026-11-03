import type { Edge, Node } from "@xyflow/react";

import type { ShowcasePersonCard, ShowcaseStoryCard } from "@/components/pilot/showcase-home";

export type ShowcaseRelativeCard = ShowcasePersonCard & { relation: string };
import { getDemoStore } from "@/lib/data/demo-store";
import { getCanvasNeighborhoodFromBundle, getPersonViewFromBundle } from "@/lib/data/tree-selectors";
import type { PilotMediaAsset, PilotProject, PilotStory } from "@/lib/pilot/types";
import type { Person, PersonViewModel } from "@/lib/types";

const genericMediaPlaceholder = "/demo/pilot/record-placeholder.svg";
const fallbackPortrait = "/demo/pilot/portrait-placeholder.svg";

export type PilotShowcaseData = {
  project: PilotProject;
  basePath: string;
  brand: {
    familyName: string;
    genealogistName: string;
    genealogistLogoPath: string;
    accent: string;
    highlight?: string;
  };
  heroPath: string;
  focalPerson: ShowcasePersonCard;
  people: ShowcasePersonCard[];
  stories: ShowcaseStoryCard[];
  sourcePreviewPath: string;
};

export function buildPilotShowcase(project: PilotProject, basePath: string): PilotShowcaseData {
  const bundle = getDemoStore();
  const visiblePeople = bundle.people.filter((person) => canShowPerson(project, person));
  const people = visiblePeople.map((person) => personCard(project, person));
  const focalPerson =
    people.find((person) => person.id === project.focalPersonId) ?? people[0];

  if (!focalPerson) {
    throw new Error("The pilot presentation has no privacy-cleared focal person.");
  }

  const hero = project.media.find((asset) => asset.id === project.welcome.heroMediaId);

  return {
    project,
    basePath,
    brand: {
      familyName: project.welcome.familyName,
      genealogistName: project.branding.practiceName,
      genealogistLogoPath:
        project.branding.logoPath ?? "/demo/pilot/meridian-family-histories-logo.svg",
      accent: project.branding.primaryColor,
      highlight: project.branding.accentColor,
    },
    heroPath: safeDisplayPath(project, hero) ?? genericMediaPlaceholder,
    focalPerson,
    people,
    stories: project.stories
      .filter((story) => story.featured && canShowStory(project, story))
      .sort((left, right) => left.order - right.order)
      .map((story) => storyCard(project, story)),
    sourcePreviewPath:
      safeDisplayPath(
        project,
        project.media.find((asset) => asset.id === "media-reunion-circular"),
      ) ?? genericMediaPlaceholder,
  };
}

/**
 * Close relatives in a stable reading order (parents, siblings, partners,
 * children), each labelled with its relationship to the person being viewed.
 * Only people already cleared for the showcase are returned.
 */
export function getShowcaseRelatives(
  view: PersonViewModel,
  showcasePeople: ShowcasePersonCard[],
  limit = 8,
): ShowcaseRelativeCard[] {
  const groups: Array<[string, Person[]]> = [
    ["Parent", view.relatives.parents],
    ["Sibling", view.relatives.siblings],
    ["Partner", view.relatives.spouses],
    ["Child", view.relatives.children],
  ];
  const seen = new Set<string>();
  const result: ShowcaseRelativeCard[] = [];

  for (const [relation, relatives] of groups) {
    for (const relative of relatives) {
      if (seen.has(relative.id)) continue;
      seen.add(relative.id);
      const card = showcasePeople.find((candidate) => candidate.id === relative.id);
      if (card) result.push({ ...card, relation });
    }
  }

  return result.slice(0, limit);
}

export function getShowcasePerson(project: PilotProject, personId: string) {
  const bundle = getDemoStore();
  const raw = bundle.people.find((person) => person.id === personId);

  if (!raw || !canShowPerson(project, raw)) {
    return null;
  }

  const view = getPersonViewFromBundle(bundle, personId, {
    mode: "creator",
    accountId: bundle.account.id,
  });

  if (!view) {
    return null;
  }

  return {
    raw: minimizeLivingPerson(project, raw),
    view: filterPersonView(project, view),
    card: personCard(project, raw),
  };
}

export function getShowcaseStory(project: PilotProject, storyId: string) {
  const story = project.stories.find((candidate) => candidate.id === storyId);

  if (!story || !canShowStory(project, story)) {
    return null;
  }

  const bundle = getDemoStore();
  const people = story.personIds
    .map((personId) => bundle.people.find((person) => person.id === personId))
    .filter(
      (person): person is Person =>
        Boolean(person && canShowStorySubject(project, person)),
    )
    .map((person) => personCard(project, person));

  const sources = story.sourceIds
    .map((sourceId) => bundle.sources.find((source) => source.id === sourceId))
    .filter((source): source is NonNullable<typeof source> => Boolean(source))
    .map((source) => ({
      id: source.id,
      title: source.title,
      detail: [source.author, source.notes].filter(Boolean).join(" · "),
    }));

  const featured = project.stories
    .filter((candidate) => candidate.featured && canShowStory(project, candidate))
    .sort((left, right) => left.order - right.order);
  const position = featured.findIndex((candidate) => candidate.id === story.id);
  const next = featured.length > 1 && position >= 0 ? featured[(position + 1) % featured.length] : null;

  return {
    story,
    card: storyCard(project, story),
    people,
    sources,
    nextStory: next && next.id !== story.id ? storyCard(project, next) : null,
  };
}

export function getShowcaseSource(project: PilotProject, sourceId: string) {
  const bundle = getDemoStore();
  const source = bundle.sources.find((candidate) => candidate.id === sourceId);

  if (!source) {
    return null;
  }

  const visibleStories = project.stories.filter(
    (story) => story.sourceIds.includes(sourceId) && canShowStory(project, story),
  );
  const visibleAssets = project.media.filter(
    (asset) =>
      asset.sourceIds.includes(sourceId) && Boolean(safeDisplayPath(project, asset)),
  );

  // Source records do not have their own visibility field, so they are reachable
  // only through privacy-cleared project content that cites them.
  if (visibleStories.length === 0 && visibleAssets.length === 0) {
    return null;
  }

  const linkedPersonIds = new Set(
    [
      ...visibleAssets.flatMap((asset) => asset.linkedPersonIds),
      ...visibleStories.flatMap((story) => story.personIds),
    ],
  );
  const connectedPeople = bundle.people
    .filter(
      (person) =>
        linkedPersonIds.has(person.id) && canShowStorySubject(project, person),
    )
    .map((person) => personCard(project, person));

  const previewAsset = visibleAssets.find(
    (asset) => asset.kind === "pdf",
  );

  return {
    source,
    connectedPeople,
    previewPath:
      safeDisplayPath(project, previewAsset) ?? genericMediaPlaceholder,
  };
}

export type ShowcaseSearchPerson = { id: string; name: string; years: string };

export async function getShowcaseCanvas(
  project: PilotProject,
  personId: string,
  depth: number,
  lineageId: string | null = null,
): Promise<{
  searchablePeople: ShowcaseSearchPerson[];
  selectedLineage: ReturnType<typeof getAllowedLineages>[number] | null;
  nodes: Node[];
  edges: Edge[];
  focusPerson: PersonViewModel;
  relatedCount: number;
  depth: number;
  maxDepth: number;
  availableLineages: ReturnType<typeof getAllowedLineages>;
}> {
  const bundle = getDemoStore();
  const allowedPersonIds = new Set(
    bundle.people
      .filter((person) => canShowRelationship(project, person))
      .map((person) => person.id),
  );
  const safeFocusId = allowedPersonIds.has(personId)
    ? personId
    : project.focalPersonId && allowedPersonIds.has(project.focalPersonId)
      ? project.focalPersonId
      : [...allowedPersonIds][0];

  if (!safeFocusId) {
    throw new Error("No privacy-cleared person is available for the family tree.");
  }

  const availableLineages = getAllowedLineages(project);
  const selectedLineage = lineageId
    ? availableLineages.find((lineage) => lineage.id === lineageId) ?? null
    : null;

  const result = await getCanvasNeighborhoodFromBundle({
    bundle,
    personId: safeFocusId,
    viewer: { mode: "creator", accountId: bundle.account.id },
    depth: Math.min(2, Math.max(1, depth)),
    lineageId: selectedLineage?.id ?? null,
    includePerson: (candidate) => allowedPersonIds.has(candidate.id),
  });

  if (!result) {
    throw new Error("Unable to build the focused family tree.");
  }

  const allowedNodeIds = new Set<string>();
  result.nodes.forEach((node) => {
    const data = node.data as { kind?: string };
    if (data.kind !== "person" || allowedPersonIds.has(node.id)) {
      allowedNodeIds.add(node.id);
    }
  });

  const edges = result.edges.filter(
    (edge) => allowedNodeIds.has(edge.source) && allowedNodeIds.has(edge.target),
  );
  const connectedIds = new Set(edges.flatMap((edge) => [edge.source, edge.target]));
  connectedIds.add(safeFocusId);
  const nodes = result.nodes
    .filter((node) => connectedIds.has(node.id))
    .map((node) => minimizeLivingCanvasNode(project, node));

  return {
    nodes,
    edges,
    focusPerson: filterPersonView(project, result.focusPerson),
    relatedCount: nodes.filter((node) => (node.data as { kind?: string }).kind === "person").length - 1,
    depth: result.depth,
    maxDepth: Math.min(2, result.maxDepth),
    availableLineages,
    selectedLineage,
    searchablePeople: bundle.people
      .filter((person) => allowedPersonIds.has(person.id))
      .map((person) => {
        const card = personCard(project, person);
        return { id: card.id, name: card.name, years: card.years };
      })
      .sort((left, right) => left.name.localeCompare(right.name)),
  };
}

function canShowPerson(project: PilotProject, person: Person) {
  if (!person.isLiving) {
    return true;
  }

  return hasLivingFieldConsent(project, person, "display_name");
}

function canShowRelationship(project: PilotProject, person: Person) {
  return (
    !person.isLiving ||
    (canShowPerson(project, person) &&
      hasLivingFieldConsent(project, person, "relationship"))
  );
}

function canShowStorySubject(project: PilotProject, person: Person) {
  return (
    !person.isLiving ||
    (canShowPerson(project, person) &&
      hasLivingFieldConsent(project, person, "story"))
  );
}

function hasLivingFieldConsent(
  project: PilotProject,
  person: Person,
  field: "display_name" | "relationship" | "portrait" | "story",
) {
  const consent = project.consents.find(
    (record) => record.personId === person.id,
  );
  return Boolean(
    consent &&
      consent.subjectKind === "living_adult" &&
      consent.status === "granted" &&
      !consent.hiddenByDefault &&
      consent.allowedFields.includes(field),
  );
}

function canShowStory(project: PilotProject, story: PilotStory) {
  if (
    story.visibility === "private" ||
    (story.status !== "ready" && story.status !== "published")
  ) {
    return false;
  }

  const bundle = getDemoStore();
  return story.personIds.every((personId) => {
    const person = bundle.people.find((candidate) => candidate.id === personId);
    return Boolean(person && canShowStorySubject(project, person));
  });
}

function minimizeLivingPerson(project: PilotProject, person: Person): Person {
  if (!person.isLiving) {
    return person;
  }

  const storyAllowed = hasLivingFieldConsent(project, person, "story");
  return {
    ...person,
    gender: "unknown",
    birthDateText: null,
    birthDateNormalized: null,
    birthPlace: null,
    deathDateText: null,
    deathDateNormalized: null,
    deathPlace: null,
    summary: storyAllowed ? person.summary : null,
    biographyMd: storyAllowed ? person.biographyMd : null,
  };
}

function filterPersonView(project: PilotProject, person: PersonViewModel): PersonViewModel {
  const focusAllowsRelationships = canShowRelationship(project, person);
  const filterRelatives = (relatives: Person[]) =>
    focusAllowsRelationships
      ? relatives
          .filter(
            (relative) =>
              canShowPerson(project, relative) &&
              canShowRelationship(project, relative),
          )
          .map((relative) => minimizeLivingPerson(project, relative))
      : [];

  return {
    ...person,
    ...minimizeLivingPerson(project, person),
    relatives: {
      parents: filterRelatives(person.relatives.parents),
      siblings: filterRelatives(person.relatives.siblings),
      spouses: filterRelatives(person.relatives.spouses),
      children: filterRelatives(person.relatives.children),
    },
    lineages: focusAllowsRelationships ? person.lineages : [],
    timeline: person.isLiving ? [] : person.timeline,
  };
}

function personCard(project: PilotProject, person: Person): ShowcasePersonCard {
  const asset = project.media.find(
    (candidate) =>
      candidate.linkedPersonIds.includes(person.id) &&
      candidate.kind === "image" &&
      candidate.id !== project.welcome.heroMediaId,
  );

  return {
    id: person.id,
    name: person.fullName,
    years: person.isLiving
      ? "Living"
      : `${person.birthDateNormalized?.slice(0, 4) ?? "Unknown"}–${
          person.deathDateNormalized?.slice(0, 4) ?? "Unknown"
        }`,
    summary:
      person.isLiving && !hasLivingFieldConsent(project, person, "story")
        ? "Living details are intentionally minimized."
        : person.summary ?? "A member of this family branch.",
    imagePath:
      !person.isLiving || hasLivingFieldConsent(project, person, "portrait")
        ? safeDisplayPath(project, asset) ?? fallbackPortrait
        : fallbackPortrait,
  };
}

function storyCard(project: PilotProject, story: PilotStory): ShowcaseStoryCard {
  const cover = project.media.find((asset) => asset.id === story.coverMediaId);
  return {
    id: story.id,
    title: story.title,
    dek: story.dek,
    period: story.period ?? "",
    imagePath: safeDisplayPath(project, cover) ?? fallbackPortrait,
    // About 200 words a minute, never less than one minute.
    readMinutes: Math.max(1, Math.round(story.bodyMd.trim().split(/\s+/).length / 200)),
  };
}

export function safeDisplayPath(
  project: PilotProject,
  asset?: PilotMediaAsset | null,
) {
  if (
    !asset ||
    asset.projectId !== project.id ||
    asset.visibility === "private" ||
    asset.consentStatus === "pending" ||
    asset.quarantineStatus !== "passed" ||
    asset.signatureStatus !== "passed" ||
    asset.malwareScanStatus !== "passed"
  ) {
    return null;
  }

  const bundle = getDemoStore();
  const linkedPeopleAreCleared = asset.linkedPersonIds.every((personId) => {
    const person = bundle.people.find((candidate) => candidate.id === personId);
    if (!person) {
      return false;
    }
    if (!person.isLiving) {
      return true;
    }

    const requiredField = asset.kind === "image" ? "portrait" : "story";
    return (
      asset.consentStatus === "granted" &&
      canShowPerson(project, person) &&
      hasLivingFieldConsent(project, person, requiredField)
    );
  });

  if (!linkedPeopleAreCleared) {
    return null;
  }

  return asset.inertPreviewPath ?? asset.derivativePath ?? null;
}

function minimizeLivingCanvasNode(project: PilotProject, node: Node): Node {
  const person = getDemoStore().people.find((candidate) => candidate.id === node.id);
  if (!person?.isLiving) {
    return node;
  }

  return {
    ...node,
    data: {
      ...node.data,
      label: person.fullName,
      subtitle: "Living",
      summary: hasLivingFieldConsent(project, person, "story")
        ? person.summary
        : null,
      lineageNames: canShowRelationship(project, person)
        ? (node.data as { lineageNames?: string[] }).lineageNames
        : [],
    },
  };
}

function getAllowedLineages(project: PilotProject) {
  const bundle = getDemoStore();
  const visibleIds = new Set(
    bundle.people
      .filter((person) => canShowRelationship(project, person))
      .map((person) => person.id),
  );
  return bundle.lineages
    .filter((lineage) =>
      bundle.lineageMembers.some(
        (member) => member.lineageId === lineage.id && visibleIds.has(member.personId),
      ),
    )
    .map((lineage) => ({ ...lineage, members: [] as Person[] }));
}
