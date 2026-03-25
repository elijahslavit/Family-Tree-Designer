import { CanvasSidebar } from "@/components/canvas/canvas-sidebar";
import { FamilyCanvas } from "@/components/canvas/family-canvas";
import { PublicTreeShell } from "@/components/layouts/tree-shell";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { getPublicViewerContext } from "@/lib/auth/session";
import { getCanvasNeighborhood, getDefaultPersonId, getTreeBySlug } from "@/lib/queries";
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
  const personId =
    (typeof query.person === "string" ? query.person : null) ?? getDefaultPersonId()!;
  const viewer = getPublicViewerContext(shareToken);
  const tree = await getTreeBySlug(slug, viewer);
  const canvas = await getCanvasNeighborhood({
    treeSlug: slug,
    personId,
    viewer,
  });

  return (
    <ThemeProvider layout={tree.themeLayout} skin={tree.themeSkin}>
      <PublicTreeShell
        tree={tree}
        main={<FamilyCanvas nodes={canvas.nodes} edges={canvas.edges} />}
        detail={
          <CanvasSidebar
            person={canvas.focusPerson}
            profileHref={publicPersonHref(tree.slug, personId, tree.shareToken)}
          />
        }
      />
    </ThemeProvider>
  );
}
