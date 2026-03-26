import { CanvasSidebar } from "@/components/canvas/canvas-sidebar";
import { CanvasRouteViewer } from "@/components/canvas/canvas-route-viewer";
import { CreatorTreeShell } from "@/components/layouts/tree-shell";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { requireAccountSession } from "@/lib/auth/session";
import {
  getActiveTreeForCreator,
  getCanvasNeighborhood,
  getDefaultPersonIdForTree,
} from "@/lib/queries";

type CanvasPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function CreatorCanvasPage({ searchParams }: CanvasPageProps) {
  const accountId = await requireAccountSession();
  const tree = await getActiveTreeForCreator(accountId);
  const params = await searchParams;
  const fallbackPersonId = await getDefaultPersonIdForTree({
    treeSlug: tree.slug,
    viewer: { mode: "creator", accountId },
  });
  const personId =
    (typeof params.person === "string" ? params.person : null) ?? fallbackPersonId!;
  const rawDepth =
    typeof params.depth === "string" ? Number.parseInt(params.depth, 10) : 1;
  const depth = Number.isFinite(rawDepth) ? rawDepth : 1;
  const lineageId = typeof params.lineage === "string" ? params.lineage : null;
  const canvas = await getCanvasNeighborhood({
    treeSlug: tree.slug,
    personId,
    viewer: { mode: "creator", accountId },
    depth,
    lineageId,
  });
  const selectedLineage =
    canvas.availableLineages.find((lineage) => lineage.id === lineageId) ?? null;

  return (
    <ThemeProvider layout={tree.themeLayout} skin={tree.themeSkin}>
      <CreatorTreeShell
        tree={tree}
        main={
          <CanvasRouteViewer
            basePath="/canvas"
            nodes={canvas.nodes}
            edges={canvas.edges}
            depth={canvas.depth}
            selectedLineageId={lineageId}
            selectedLineageName={selectedLineage?.name ?? null}
            profilePathBase="/person"
            focusLabel={canvas.focusPerson.fullName}
          />
        }
        detail={
          <CanvasSidebar
            person={canvas.focusPerson}
            profileHref={`/person/${personId}`}
            basePath="/canvas"
            depth={canvas.depth}
            maxDepth={canvas.maxDepth}
            visibleCount={canvas.nodes.length}
            relatedCount={canvas.relatedCount}
            lineages={canvas.availableLineages}
            selectedLineageId={lineageId}
          />
        }
      />
    </ThemeProvider>
  );
}
