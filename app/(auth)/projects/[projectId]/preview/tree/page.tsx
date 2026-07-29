import { CanvasExperience } from "@/components/canvas/canvas-experience";
import { ShowcaseEmpty } from "@/components/pilot/showcase-empty";
import { getShowcaseCanvas } from "@/lib/showcase/pilot-showcase";
import { getSyntheticPilotProject } from "@/lib/showcase/project";

function parseOrientation(value: unknown): "horizontal" | "vertical" {
  return value === "horizontal" ? "horizontal" : "vertical";
}

export default async function PilotPreviewTreePage({
  params,
  searchParams,
}: {
  params: Promise<{ projectId: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const { projectId } = await params;
  const query = await searchParams;
  const project = await getSyntheticPilotProject(projectId);
  const personId = typeof query.person === "string" ? query.person : project.focalPersonId ?? "p03";
  const requestedDepth = typeof query.depth === "string" ? Number.parseInt(query.depth, 10) : 1;
  const depth = Number.isFinite(requestedDepth) ? Math.min(3, Math.max(1, requestedDepth)) : 1;
  const orientation = parseOrientation(query.orient);
  const lineageId = typeof query.lineage === "string" ? query.lineage : null;

  const canvas = await getShowcaseCanvas(project, personId, depth, {
    orientation,
    lineageId,
  });
  const basePath = `/projects/${project.id}/preview`;

  if (!canvas) {
    return (
      <ShowcaseEmpty
        title="The family tree is not ready yet"
        description="Once family records are imported, the tree appears here with the branches this presentation focuses on."
      />
    );
  }

  const selectedLineageName =
    canvas.availableLineages.find((lineage) => lineage.id === lineageId)?.name ?? null;

  return (
    <CanvasExperience
      nodes={canvas.nodes}
      edges={canvas.edges}
      basePath={`${basePath}/tree`}
      profilePathBase={`${basePath}/people`}
      depth={canvas.depth}
      maxDepth={canvas.maxDepth}
      lineages={canvas.availableLineages}
      selectedLineageId={lineageId}
      selectedLineageName={selectedLineageName}
      focusPerson={canvas.focusPerson}
      profileHref={`${basePath}/people/${canvas.focusPerson.id}`}
      relatedCount={canvas.relatedCount}
      presentation="showcase"
      orientation={canvas.orientation}
      className="h-dvh min-h-[560px]"
    />
  );
}
