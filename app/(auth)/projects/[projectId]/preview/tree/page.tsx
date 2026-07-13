import { CanvasSidebar } from "@/components/canvas/canvas-sidebar";
import { CanvasRouteViewer } from "@/components/canvas/canvas-route-viewer";
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
    <div className="mx-auto grid max-w-[1500px] gap-5 px-4 py-6 sm:px-6 lg:grid-cols-[minmax(0,1fr)_320px] lg:px-8">
      <CanvasRouteViewer nodes={canvas.nodes} edges={canvas.edges} basePath={`${basePath}/tree`} depth={canvas.depth} profilePathBase={`${basePath}/people`} focusLabel={canvas.focusPerson.fullName} />
      <CanvasSidebar person={canvas.focusPerson} profileHref={`${basePath}/people/${canvas.focusPerson.id}`} basePath={`${basePath}/tree`} depth={canvas.depth} maxDepth={canvas.maxDepth} visibleCount={canvas.nodes.length} relatedCount={canvas.relatedCount} lineages={canvas.availableLineages} selectedLineageId={null} />
    </div>
  );
}
