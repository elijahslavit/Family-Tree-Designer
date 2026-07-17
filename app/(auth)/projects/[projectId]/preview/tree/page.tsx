import { CanvasExperience } from "@/components/canvas/canvas-experience";
import { getShowcaseCanvas } from "@/lib/showcase/pilot-showcase";
import { getSyntheticPilotProject } from "@/lib/showcase/project";

export default async function PilotPreviewTreePage({ params, searchParams }: { params: Promise<{ projectId: string }>; searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const { projectId } = await params;
  const query = await searchParams;
  const project = await getSyntheticPilotProject(projectId);
  const personId = typeof query.person === "string" ? query.person : project.focalPersonId ?? "p03";
  const requestedDepth = typeof query.depth === "string" ? Number.parseInt(query.depth, 10) : 1;
  const depth = Number.isFinite(requestedDepth) ? Math.min(2, Math.max(1, requestedDepth)) : 1;
  const canvas = await getShowcaseCanvas(project, personId, depth);
  const basePath = `/projects/${project.id}/preview`;
  return (
    <CanvasExperience
      nodes={canvas.nodes}
      edges={canvas.edges}
      basePath={`${basePath}/tree`}
      profilePathBase={`${basePath}/people`}
      depth={canvas.depth}
      maxDepth={canvas.maxDepth}
      lineages={canvas.availableLineages}
      focusPerson={canvas.focusPerson}
      profileHref={`${basePath}/people/${canvas.focusPerson.id}`}
      relatedCount={canvas.relatedCount}
      className="h-[calc(100dvh-7.5rem)] min-h-[560px]"
    />
  );
}
