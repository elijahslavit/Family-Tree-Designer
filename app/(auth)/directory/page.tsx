import Link from "next/link";

import { DirectoryControls } from "@/components/domain/directory-controls";
import { EmptyState } from "@/components/foundation/empty-state";
import { PersonCard } from "@/components/domain/person-card";
import { CreatorTreeShell } from "@/components/layouts/tree-shell";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { requireAccountSession } from "@/lib/auth/session";
import { getActiveTreeForCreator, getPeopleByTree } from "@/lib/queries";

type DirectoryPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function DirectoryPage({ searchParams }: DirectoryPageProps) {
  const accountId = await requireAccountSession();
  const tree = await getActiveTreeForCreator(accountId);
  const params = await searchParams;
  const pageValue =
    typeof params.page === "string" ? Number.parseInt(params.page, 10) : 1;
  const filters = {
    search: typeof params.search === "string" ? params.search : undefined,
    surname: typeof params.surname === "string" ? params.surname : undefined,
    lineageId: typeof params.lineage === "string" ? params.lineage : undefined,
    sort: typeof params.sort === "string" ? (params.sort as "name" | "birth" | "death") : "name",
    page: Number.isFinite(pageValue) ? pageValue : 1,
  };
  const directory = await getPeopleByTree({
    treeSlug: tree.slug,
    viewer: {
      mode: "creator",
      accountId,
    },
    filters,
  });

  return (
    <ThemeProvider layout={tree.themeLayout} skin={tree.themeSkin}>
      <CreatorTreeShell
        tree={tree}
        main={
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.16em] text-[var(--text-muted)]">
                  Directory
                </p>
                <h2 className="text-3xl font-semibold text-[var(--text-primary)]">
                  Browse everyone in the tree
                </h2>
              </div>
              <Link
                href="/person/new"
                className="rounded-[var(--radius-md)] bg-[var(--accent-primary)] px-4 py-2 text-sm font-semibold text-[var(--text-inverse)]"
              >
                Add person
              </Link>
            </div>
            {directory.items.length ? (
              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                {directory.items.map((person) => (
                  <PersonCard
                    key={person.id}
                    person={person}
                    href={`/person/${person.id}`}
                  />
                ))}
              </div>
            ) : (
              <EmptyState
                title="No people match these filters"
                description="Change the search, clear the lineage filter, or add a new person record."
                actionLabel="Add person"
                actionHref="/person/new"
              />
            )}
          </div>
        }
        detail={
          <DirectoryControls
            actionPath="/directory"
            filters={filters}
            surnames={directory.surnames}
            lineages={directory.lineages}
            total={directory.total}
            totalPages={directory.totalPages}
          />
        }
      />
    </ThemeProvider>
  );
}
