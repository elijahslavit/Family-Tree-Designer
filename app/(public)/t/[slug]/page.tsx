import Link from "next/link";

import { DirectoryControls } from "@/components/domain/directory-controls";
import { Card } from "@/components/foundation/card";
import { EmptyState } from "@/components/foundation/empty-state";
import { PersonCard } from "@/components/domain/person-card";
import { PublicTreeShell } from "@/components/layouts/tree-shell";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { getPublicViewerContext } from "@/lib/auth/session";
import { getPeopleByTree, getTreeBySlug } from "@/lib/queries";
import { publicPersonHref } from "@/lib/utils/links";

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

  return (
    <ThemeProvider layout={tree.themeLayout} skin={tree.themeSkin}>
      <PublicTreeShell
        tree={tree}
        main={
          <div className="space-y-6">
            <Card className="space-y-3">
              <p className="text-xs uppercase tracking-[0.16em] text-[var(--text-muted)]">
                Shared archive
              </p>
              <h2 className="display-name text-5xl font-semibold text-[var(--text-primary)]">
                {tree.name}
              </h2>
              <p className="text-lg text-[var(--text-secondary)]">{tree.description}</p>
            </Card>
            {directory.items.length ? (
              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                {directory.items.map((person) => (
                  <PersonCard
                    key={person.id}
                    person={person}
                    href={publicPersonHref(tree.slug, person.id, tree.shareToken)}
                  />
                ))}
              </div>
            ) : (
              <EmptyState
                title="No people match this view"
                description="Try a broader search or clear the current surname and lineage filters."
              />
            )}
          </div>
        }
        detail={
          <div className="space-y-4">
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
              <p className="text-sm text-[var(--text-secondary)]">
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
