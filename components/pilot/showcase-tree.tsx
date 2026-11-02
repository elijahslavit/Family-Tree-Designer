import { CanvasRouteViewer } from "@/components/canvas/canvas-route-viewer";
import { CanvasSidebar } from "@/components/canvas/canvas-sidebar";
import type { PilotProject } from "@/lib/pilot/types";
import { getShowcaseCanvas } from "@/lib/showcase/pilot-showcase";

type TreeQuery = Record<string, string | string[] | undefined>;

/**
 * The family-tree page shared by the professional preview and the invited
 * client presentation, so both always render the same privacy-filtered view.
 */
export async function ShowcaseTreeView({
  project,
  basePath,
  query,
}: {
  project: PilotProject;
  basePath: string;
  query: TreeQuery;
}) {
  const personId =
    typeof query.person === "string" ? query.person : project.focalPersonId ?? "p03";
  const requestedDepth = typeof query.depth === "string" ? Number.parseInt(query.depth, 10) : 1;
  const depth = Number.isFinite(requestedDepth) ? Math.min(2, Math.max(1, requestedDepth)) : 1;
  const lineageId = typeof query.lineage === "string" ? query.lineage : null;
  const canvas = await getShowcaseCanvas(project, personId, depth, lineageId);
  const treePath = `${basePath}/tree`;
  const visibleCount = canvas.nodes.filter((node) => node.type === "person").length;

  return (
    <div className="mx-auto grid max-w-[1500px] gap-5 px-4 py-6 sm:px-6 lg:grid-cols-[minmax(0,1fr)_320px] lg:px-8">
      <h1 className="sr-only">Family tree centred on {canvas.focusPerson.fullName}</h1>
      <CanvasRouteViewer
        nodes={canvas.nodes}
        edges={canvas.edges}
        basePath={treePath}
        depth={canvas.depth}
        selectedLineageId={canvas.selectedLineage?.id ?? null}
        selectedLineageName={canvas.selectedLineage?.name ?? null}
        profilePathBase={`${basePath}/people`}
        focusLabel={canvas.focusPerson.fullName}
        searchPeople={canvas.searchablePeople}
        enableListView
      />
      <CanvasSidebar
        person={canvas.focusPerson}
        profileHref={`${basePath}/people/${canvas.focusPerson.id}`}
        basePath={treePath}
        depth={canvas.depth}
        maxDepth={canvas.maxDepth}
        visibleCount={visibleCount}
        relatedCount={canvas.relatedCount}
        lineages={canvas.availableLineages}
        selectedLineageId={canvas.selectedLineage?.id ?? null}
      />
    </div>
  );
}
