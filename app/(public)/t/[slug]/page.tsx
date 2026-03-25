import Link from "next/link";

import { DirectoryActiveFilters } from "@/components/domain/directory-active-filters";
import { DirectoryControls, buildDirectoryHref } from "@/components/domain/directory-controls";
import { DirectoryOverview } from "@/components/domain/directory-overview";
import { DirectoryResults } from "@/components/domain/directory-results";
import { Card } from "@/components/foundation/card";
import { EmptyState } from "@/components/foundation/empty-state";
import { PublicTreeShell } from "@/components/layouts/tree-shell";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { getPublicViewerContext } from "@/lib/auth/session";
import { getFamiliesByTree, getLineagesByTree, getPeopleByTree, getTreeBySlug } from "@/lib/queries";
import { publicCanvasHref, publicLineagesHref, publicPersonHref } from "@/lib/utils/links";

type PublicTreePageProps = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function PublicTreePage({
  params,
  searchParams,
}: PublicTreePageProps) {
  const { slug } = await params;
  const query = await searchParams;
  const shareToken = typeof query.share === "string" ? query.share : null;
  const viewer = getPublicViewerContext(shareToken);
  const tree = await getTreeBySlug(slug, viewer);
  const pageValue =
    typeof query.page === "string" ? Number.parseInt(query.page, 10) : 1;
  const filters = {
    search: typeof query.search === "string" ? query.search : undefined,
    surname: typeof query.surname === "string" ? query.surname : undefined,
    lineageId: typeof query.lineage === "string" ? query.lineage : undefined,
    sort: typeof query.sort === "string" ? (query.sort as "name" | "birth" | "death") : "name",
    page: Number.isFinite(pageValue) ? pageValue : 1,
  };
  const directory = await getPeopleByTree({ treeSlug: slug, viewer, filters });
  const [lineages, families] = await Promise.all([
    getLineagesByTree({ treeSlug: slug, viewer }),
    getFamiliesByTree({ treeSlug: slug, viewer }),
  ]);
  const lineagesByPerson = new Map<string, (typeof lineages)[number][]>();

  lineages.forEach((lineage) => {
    lineage.members.forEach((member) => {
      const current = lineagesByPerson.get(member.id) ?? [];
      current.push(lineage);
      lineagesByPerson.set(member.id, current);
    });
  });

  return (
    <ThemeProvider layout={tree.themeLayout} skin={tree.themeSkin}>
      <PublicTreeShell
        tree={tree}
        main={
          <div className="space-y-6">
            <DirectoryOverview
              eyebrow="Shared archive"
              title={tree.name}
              description={
                tree.description ??
                "A presentation-first family archive designed for browsing, storytelling, and shared discovery."
              }
              primaryAction={{
                href: publicCanvasHref(tree.slug, tree.shareToken),
                label: "Open canvas",
              }}
              secondaryAction={{
                href: publicLineagesHref(tree.slug, tree.shareToken),
                label: "Browse lineages",
              }}
              stats={[
                {
                  label: "People",
                  value: directory.total,
                  detail: "Profiles available in this shared archive.",
                },
                {
                  label: "Families",
                  value: families.length,
                  detail: "Structured unions and parent-child links.",
                },
                {
                  label: "Lineages",
                  value: lineages.length,
                  detail: "Named descent paths chosen by the creator.",
                },
              ]}
              featuredLineages={lineages}
            />
            <DirectoryActiveFilters
              filters={filters}
              lineages={directory.lineages}
              clearHref={buildDirectoryHref({
                actionPath: `/t/${tree.slug}`,
                filters: {},
                shareToken: tree.shareToken,
              })}
            />
            {directory.items.length ? (
              <DirectoryResults
                people={directory.items}
                layout={tree.themeLayout}
                buildHref={(personId) => publicPersonHref(tree.slug, personId, tree.shareToken)}
                lineagesByPerson={lineagesByPerson}
              />
            ) : (
              <EmptyState
                title="No people match this view"
                description="Try a broader search or clear the current surname and lineage filters."
              />
            )}
          </div>
        }
        detail={
          <div className="space-y-4 lg:sticky lg:top-24">
            <DirectoryControls
              actionPath={`/t/${tree.slug}`}
              filters={filters}
              surnames={directory.surnames}
              lineages={directory.lineages}
              total={directory.total}
              totalPages={directory.totalPages}
              shareToken={tree.shareToken}
            />
            <Card className="space-y-3">
              <p className="text-xs uppercase tracking-[0.16em] text-[var(--text-muted)]">CTA</p>
              <h2 className="text-2xl font-semibold text-[var(--text-primary)]">Create your own tree</h2>
              <p className="text-sm leading-6 text-[var(--text-secondary)]">
                Shared archives are read-only. Creator mode includes import, editing, themes, and sharing.
              </p>
              <Link href="/" className="text-sm font-semibold text-[var(--accent-text)]">
                Learn more
              </Link>
            </Card>
          </div>
        }
      />
    </ThemeProvider>
  );
}
