import { CanvasSidebar } from "@/components/canvas/canvas-sidebar";
import { CanvasRouteViewer } from "@/components/canvas/canvas-route-viewer";
import { PublicTreeShell } from "@/components/layouts/tree-shell";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { getPublicViewerContext } from "@/lib/auth/session";
import {
  getCanvasNeighborhood,
  getDefaultPersonIdForTree,
  getTreeBySlug,
} from "@/lib/queries";
import { publicPersonHref } from "@/lib/utils/links";

type PublicCanvasPageProps = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function PublicCanvasPage({
  params,
  searchParams,
}: PublicCanvasPageProps) {
  const { slug } = await params;
  const query = await searchParams;
  const shareToken = typeof query.share === "string" ? query.share : null;
  const viewer = getPublicViewerContext(shareToken);
  const fallbackPersonId = await getDefaultPersonIdForTree({
    treeSlug: slug,
    viewer,
  });
  const personId =
    (typeof query.person === "string" ? query.person : null) ?? fallbackPersonId!;
  const rawDepth =
    typeof query.depth === "string" ? Number.parseInt(query.depth, 10) : 1;
  const depth = Number.isFinite(rawDepth) ? rawDepth : 1;
  const lineageId = typeof query.lineage === "string" ? query.lineage : null;
  const tree = await getTreeBySlug(slug, viewer);
  const canvas = await getCanvasNeighborhood({
    treeSlug: slug,
    personId,
    viewer,
    depth,
    lineageId,
  });
  const selectedLineage =
    canvas.availableLineages.find((lineage) => lineage.id === lineageId) ?? null;

  return (
    <ThemeProvider layout={tree.themeLayout} skin={tree.themeSkin}>
      <PublicTreeShell
        tree={tree}
        main={
          <CanvasRouteViewer
            basePath={`/t/${tree.slug}/canvas`}
            nodes={canvas.nodes}
            edges={canvas.edges}
            shareToken={tree.shareToken}
            depth={canvas.depth}
            selectedLineageId={lineageId}
            selectedLineageName={selectedLineage?.name ?? null}
            profilePathBase={`/t/${tree.slug}/person`}
            focusLabel={canvas.focusPerson.fullName}
          />
        }
        detail={
          <CanvasSidebar
            person={canvas.focusPerson}
            profileHref={publicPersonHref(tree.slug, personId, tree.shareToken)}
            basePath={`/t/${tree.slug}/canvas`}
            depth={canvas.depth}
            maxDepth={canvas.maxDepth}
            visibleCount={canvas.nodes.length}
            relatedCount={canvas.relatedCount}
            lineages={canvas.availableLineages}
            selectedLineageId={lineageId}
            shareToken={tree.shareToken}
          />
        }
      />
    </ThemeProvider>
  );
}
