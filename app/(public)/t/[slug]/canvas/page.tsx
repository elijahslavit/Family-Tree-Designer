import { CanvasExperience } from "@/components/canvas/canvas-experience";
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
  const share = `share=${tree.shareToken}`;

  return (
    <ThemeProvider layout={tree.themeLayout} skin={tree.themeSkin}>
      <CanvasExperience
        nodes={canvas.nodes}
        edges={canvas.edges}
        basePath={`/t/${tree.slug}/canvas`}
        profilePathBase={`/t/${tree.slug}/person`}
        shareToken={tree.shareToken}
        depth={canvas.depth}
        maxDepth={canvas.maxDepth}
        selectedLineageId={lineageId}
        selectedLineageName={selectedLineage?.name ?? null}
        lineages={canvas.availableLineages}
        focusPerson={canvas.focusPerson}
        profileHref={publicPersonHref(tree.slug, personId, tree.shareToken)}
        relatedCount={canvas.relatedCount}
        topBar={{
          eyebrow: "Shared archive",
          title: tree.name,
          navItems: [
            { href: `/t/${tree.slug}?${share}`, label: "Directory" },
            { href: `/t/${tree.slug}/lineages?${share}`, label: "Lineages" },
            { href: `/t/${tree.slug}/canvas?${share}`, label: "Canvas" },
          ],
          activeLabel: "Canvas",
        }}
      />
    </ThemeProvider>
  );
}
