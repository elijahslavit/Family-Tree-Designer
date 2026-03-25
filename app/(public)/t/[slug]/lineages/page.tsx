import Link from "next/link";

import { LineageCollection } from "@/components/domain/lineage-collection";
import { Card } from "@/components/foundation/card";
import { PublicTreeShell } from "@/components/layouts/tree-shell";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { getPublicViewerContext } from "@/lib/auth/session";
import { getLineagesByTree, getTreeBySlug } from "@/lib/queries";
import { publicPersonHref } from "@/lib/utils/links";

type PublicLineagesPageProps = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function PublicLineagesPage({
  params,
  searchParams,
}: PublicLineagesPageProps) {
  const { slug } = await params;
  const query = await searchParams;
  const shareToken = typeof query.share === "string" ? query.share : null;
  const viewer = getPublicViewerContext(shareToken);
  const tree = await getTreeBySlug(slug, viewer);
  const lineages = await getLineagesByTree({
    treeSlug: slug,
    viewer,
  });

  return (
    <ThemeProvider layout={tree.themeLayout} skin={tree.themeSkin}>
      <PublicTreeShell
        tree={tree}
        main={
          <div className="space-y-6">
            <div className="space-y-2">
              <p className="text-xs uppercase tracking-[0.16em] text-[var(--text-muted)]">
                Lineages
              </p>
              <h2 className="text-3xl font-semibold text-[var(--text-primary)]">
                Follow named descent paths
              </h2>
              <p className="text-sm leading-6 text-[var(--text-secondary)]">
                These ordered lines highlight the branches the creator chose to feature most prominently.
              </p>
            </div>
            <LineageCollection
              lineages={lineages}
              buildPersonHref={(personId) => publicPersonHref(tree.slug, personId, tree.shareToken)}
              emptyTitle="No lineages available"
              emptyDescription="This archive does not expose any named descent lines yet."
            />
          </div>
        }
        detail={
          <Card className="space-y-3">
            <p className="text-xs uppercase tracking-[0.16em] text-[var(--text-muted)]">CTA</p>
            <h2 className="text-2xl font-semibold text-[var(--text-primary)]">Browse the full archive</h2>
            <p className="text-sm text-[var(--text-secondary)]">
              Continue exploring profiles, directory filters, and the visual graph without leaving the shared link.
            </p>
            <Link href={`/t/${tree.slug}?share=${tree.shareToken}`} className="text-sm font-semibold text-[var(--accent-text)]">
              Open the directory
            </Link>
          </Card>
        }
      />
    </ThemeProvider>
  );
}
