import { DirectoryActiveFilters } from "@/components/domain/directory-active-filters";
import { DirectoryControls } from "@/components/domain/directory-controls";
import { buildDirectoryHref } from "@/components/domain/directory-controls";
import { DirectoryOverview } from "@/components/domain/directory-overview";
import { DirectoryResults } from "@/components/domain/directory-results";
import { EmptyState } from "@/components/foundation/empty-state";
import { Card } from "@/components/foundation/card";
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
            <DirectoryOverview
              eyebrow="Directory"
              title="Browse everyone in the tree"
              description="Search by name, narrow by surname or lineage, and move from overview to profile editing without losing your place in the archive."
              primaryAction={{
                href: "/person/new",
                label: "Add person",
              }}
              secondaryAction={{
                href: "/canvas",
                label: "Open canvas",
              }}
              stats={[
                {
                  label: "Visible people",
                  value: directory.total,
                  detail: "Results in the current filtered view.",
                },
                {
                  label: "Named lineages",
                  value: lineages.length,
                  detail: "Branches available for quick filtering.",
                },
                {
                  label: "Page",
                  value: `${directory.page}/${directory.totalPages}`,
                  detail: "Paginated in sets of 50 people.",
                },
              ]}
              featuredLineages={lineages}
            />
            <DirectoryActiveFilters
              filters={filters}
              lineages={directory.lineages}
              clearHref={buildDirectoryHref({
                actionPath: "/directory",
                filters: {},
              })}
            />
            {directory.items.length ? (
              <DirectoryResults
                people={directory.items}
                layout={tree.themeLayout}
                buildHref={(personId) => `/person/${personId}`}
                lineagesByPerson={lineagesByPerson}
              />
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
          <div className="space-y-4 lg:sticky lg:top-24">
            <DirectoryControls
              actionPath="/directory"
              filters={filters}
              surnames={directory.surnames}
              lineages={directory.lineages}
              total={directory.total}
              totalPages={directory.totalPages}
            />
            <Card className="space-y-3">
              <p className="text-xs uppercase tracking-[0.16em] text-[var(--text-muted)]">
                Layout note
              </p>
              <h2 className="text-xl font-semibold text-[var(--text-primary)]">
                {tree.themeLayout === "classic"
                  ? "Dense list view enabled"
                  : tree.themeLayout === "explorer"
                    ? "Card view tuned for discovery"
                    : "Editorial card view enabled"}
              </h2>
              <p className="text-sm leading-6 text-[var(--text-secondary)]">
                The directory presentation adapts to the active layout so the archive feels denser in Classic and more presentational in Editorial or Explorer.
              </p>
            </Card>
          </div>
        }
      />
    </ThemeProvider>
  );
}
