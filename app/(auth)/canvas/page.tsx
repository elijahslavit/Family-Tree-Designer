import { CanvasSidebar } from "@/components/canvas/canvas-sidebar";
import { CanvasRouteViewer } from "@/components/canvas/canvas-route-viewer";
import { CreatorTreeShell } from "@/components/layouts/tree-shell";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { requireAccountSession } from "@/lib/auth/session";
import { getActiveTreeForCreator, getCanvasNeighborhood, getDefaultPersonId } from "@/lib/queries";

type CanvasPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function CreatorCanvasPage({ searchParams }: CanvasPageProps) {
  const accountId = await requireAccountSession();
  const tree = await getActiveTreeForCreator(accountId);
  const params = await searchParams;
  const personId =
    (typeof params.person === "string" ? params.person : null) ?? getDefaultPersonId()!;
  const canvas = await getCanvasNeighborhood({
    treeSlug: tree.slug,
    personId,
    viewer: { mode: "creator", accountId },
  });

  return (
    <ThemeProvider layout={tree.themeLayout} skin={tree.themeSkin}>
      <CreatorTreeShell
        tree={tree}
        main={<CanvasRouteViewer basePath="/canvas" nodes={canvas.nodes} edges={canvas.edges} />}
        detail={<CanvasSidebar person={canvas.focusPerson} profileHref={`/person/${personId}`} />}
      />
    </ThemeProvider>
  );
}
