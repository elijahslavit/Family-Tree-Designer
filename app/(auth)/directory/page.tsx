import Link from "next/link";

import { DirectoryControls } from "@/components/domain/directory-controls";
import { EmptyState } from "@/components/foundation/empty-state";
import { LineageBadge } from "@/components/domain/lineage-badge";
import { PersonCard } from "@/components/domain/person-card";
import { CreatorTreeShell } from "@/components/layouts/tree-shell";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { requireAccountSession } from "@/lib/auth/session";
import {
  getActiveTreeForCreator,
  getLineagesByTree,
  getPeopleByTree,
} from "@/lib/queries";

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
  const lineages = await getLineagesByTree({
    treeSlug: tree.slug,
    viewer: {
      mode: "creator",
      accountId,
    },
  });
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
                    lineages={lineagesByPerson.get(person.id) ?? []}
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
          <div className="space-y-4">
            <DirectoryControls
              actionPath="/directory"
              filters={filters}
              surnames={directory.surnames}
              lineages={directory.lineages}
              total={directory.total}
              totalPages={directory.totalPages}
            />
            <div className="rounded-[var(--radius-lg)] border border-[var(--border-default)] bg-[var(--bg-surface)] p-4">
              <p className="text-xs uppercase tracking-[0.16em] text-[var(--text-muted)]">
                Active lineages
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                {lineages.length ? (
                  lineages.map((lineage) => <LineageBadge key={lineage.id} lineage={lineage} />)
                ) : (
                  <p className="text-sm text-[var(--text-muted)]">No lineages defined yet.</p>
                )}
              </div>
            </div>
          </div>
        }
      />
    </ThemeProvider>
  );
}
