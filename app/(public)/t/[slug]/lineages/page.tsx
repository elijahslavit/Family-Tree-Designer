import Link from "next/link";

import { LineageCollection } from "@/components/domain/lineage-collection";
import { LineageOverview } from "@/components/domain/lineage-overview";
import { Card } from "@/components/foundation/card";
import { PublicTreeShell } from "@/components/layouts/tree-shell";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { getPublicViewerContext } from "@/lib/auth/session";
import { getLineagesByTree, getTreeBySlug } from "@/lib/queries";
import type { LineageViewModel } from "@/lib/types";
import {
  publicLineageCanvasHref,
  publicPersonHref,
  publicTreeHref,
} from "@/lib/utils/links";

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
  const longestLineage = [...lineages].sort(
    (left, right) => right.members.length - left.members.length,
  )[0];
  const uniqueMembers = new Set(
    lineages.flatMap((lineage) => lineage.members.map((member) => member.id)),
  ).size;

  return (
    <ThemeProvider layout={tree.themeLayout} skin={tree.themeSkin}>
      <PublicTreeShell
        tree={tree}
        main={
          <div className="space-y-6">
            <LineageOverview
              eyebrow="Lineages"
              title="Follow named descent paths"
              description="These ordered lines surface the branches the creator chose to feature most prominently, making it easier to move through the archive as a family story instead of a flat list."
              primaryAction={
                longestLineage
                  ? {
                      href: buildPublicLineageCanvasHref(tree.slug, tree.shareToken, longestLineage),
                      label: "Open highlighted canvas",
                    }
                  : undefined
              }
              secondaryAction={{
                href: publicTreeHref(tree.slug, tree.shareToken),
                label: "Browse directory",
              }}
              stats={[
                {
                  label: "Lineages",
                  value: lineages.length,
                  detail: "Featured descent paths shared in this archive.",
                },
                {
                  label: "People featured",
                  value: uniqueMembers,
                  detail: "Unique relatives represented across those paths.",
                },
                {
                  label: "Longest path",
                  value: longestLineage?.members.length ?? 0,
                  detail: "Members in the most detailed visible sequence.",
                },
              ]}
            />
            <LineageCollection
              lineages={lineages}
              buildPersonHref={(personId) => publicPersonHref(tree.slug, personId, tree.shareToken)}
              buildCanvasHref={(lineage) =>
                buildPublicLineageCanvasHref(tree.slug, tree.shareToken, lineage)
              }
              emptyTitle="No lineages available"
              emptyDescription="This archive does not expose any named descent lines yet."
              mode="viewer"
            />
          </div>
        }
        detail={
          <div className="space-y-4 lg:sticky lg:top-24">
            <Card className="space-y-3">
              <p className="text-xs uppercase tracking-[0.16em] text-[var(--text-muted)]">Guide</p>
              <h2 className="text-2xl font-semibold text-[var(--text-primary)]">Read the path</h2>
              <p className="text-sm leading-6 text-[var(--text-secondary)]">
                Each card marks a generation in order, from the origin of the featured line to the current end of the visible path.
              </p>
            </Card>
            <Card className="space-y-3">
              <p className="text-xs uppercase tracking-[0.16em] text-[var(--text-muted)]">CTA</p>
              <h2 className="text-2xl font-semibold text-[var(--text-primary)]">Browse the full archive</h2>
              <p className="text-sm leading-6 text-[var(--text-secondary)]">
                Continue exploring profiles, directory filters, and the visual graph without leaving the shared link.
              </p>
              <Link
                href={publicTreeHref(tree.slug, tree.shareToken)}
                className="text-sm font-semibold text-[var(--accent-text)]"
              >
                Open the directory
              </Link>
            </Card>
          </div>
        }
      />
    </ThemeProvider>
  );
}

function buildPublicLineageCanvasHref(
  slug: string,
  shareToken: string,
  lineage: LineageViewModel,
) {
  const focusMember = getLineageFocusMember(lineage);

  return publicLineageCanvasHref({
    slug,
    shareToken,
    lineageId: lineage.id,
    personId: focusMember?.id ?? null,
    depth: 3,
  });
}

function getLineageFocusMember(lineage: LineageViewModel) {
  return lineage.members[Math.floor((lineage.members.length - 1) / 2)] ?? lineage.members[0] ?? null;
}
