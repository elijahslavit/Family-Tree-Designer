import { productConfig } from "@/lib/config/product";
import { CanvasExperience } from "@/components/canvas/canvas-experience";
import { creatorNavItems } from "@/components/layouts/tree-shell";
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
      <CanvasExperience
        nodes={canvas.nodes}
        edges={canvas.edges}
        basePath="/canvas"
        profilePathBase="/person"
        depth={canvas.depth}
        maxDepth={canvas.maxDepth}
        selectedLineageId={lineageId}
        selectedLineageName={selectedLineage?.name ?? null}
        lineages={canvas.availableLineages}
        focusPerson={canvas.focusPerson}
        profileHref={`/person/${personId}`}
        relatedCount={canvas.relatedCount}
        topBar={{
          eyebrow: productConfig.name,
          title: tree.name,
          navItems: creatorNavItems,
          activeLabel: "Canvas",
        }}
      />
    </ThemeProvider>
  );
}
