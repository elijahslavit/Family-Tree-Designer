import Link from "next/link";

import { Card } from "@/components/foundation/card";
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
  const directory = await getPeopleByTree({
    treeSlug: tree.slug,
    viewer: {
      mode: "creator",
      accountId,
    },
    filters: {
      search: typeof params.search === "string" ? params.search : undefined,
      surname: typeof params.surname === "string" ? params.surname : undefined,
      sort: typeof params.sort === "string" ? (params.sort as "name" | "birth" | "death") : "name",
    },
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
                href={`/person/${directory.items[0]?.id ?? ""}/edit`}
                className="rounded-[var(--radius-md)] bg-[var(--accent-primary)] px-4 py-2 text-sm font-semibold text-[var(--text-inverse)]"
              >
                Edit first person
              </Link>
            </div>
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {directory.items.map((person) => (
                <PersonCard
                  key={person.id}
                  person={person}
                  href={`/person/${person.id}`}
                />
              ))}
            </div>
          </div>
        }
        detail={
          <Card className="space-y-4">
            <h2 className="text-xl font-semibold text-[var(--text-primary)]">Filters</h2>
            <p className="text-sm text-[var(--text-secondary)]">
              Surnames: {directory.surnames.join(", ")}
            </p>
            <p className="text-sm text-[var(--text-secondary)]">
              Results: {directory.total} across {directory.totalPages} pages
            </p>
          </Card>
        }
      />
    </ThemeProvider>
  );
}
