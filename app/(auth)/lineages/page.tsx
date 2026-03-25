import { LineageCollection } from "@/components/domain/lineage-collection";
import { Card } from "@/components/foundation/card";
import { CreatorTreeShell } from "@/components/layouts/tree-shell";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { requireAccountSession } from "@/lib/auth/session";
import { getActiveTreeForCreator, getLineagesByTree } from "@/lib/queries";

export default async function CreatorLineagesPage() {
  const accountId = await requireAccountSession();
  const tree = await getActiveTreeForCreator(accountId);
  const lineages = await getLineagesByTree({
    treeSlug: tree.slug,
    viewer: { mode: "creator", accountId },
  });

  return (
    <ThemeProvider layout={tree.themeLayout} skin={tree.themeSkin}>
      <CreatorTreeShell
        tree={tree}
        main={
          <div className="space-y-6">
            <div className="space-y-2">
              <p className="text-xs uppercase tracking-[0.16em] text-[var(--text-muted)]">
                Lineages
              </p>
              <h2 className="text-3xl font-semibold text-[var(--text-primary)]">
                Named descent lines
              </h2>
              <p className="text-sm leading-6 text-[var(--text-secondary)]">
                Review ordered lineage membership, then open a profile to adjust membership or descriptions.
              </p>
            </div>
            <LineageCollection
              lineages={lineages}
              buildPersonHref={(personId) => `/person/${personId}`}
              emptyTitle="No lineages yet"
              emptyDescription="Create a lineage from a person profile to build named descent paths."
              emptyActionLabel="Browse directory"
              emptyActionHref="/directory"
            />
          </div>
        }
        detail={
          <Card className="space-y-3">
            <h2 className="text-xl font-semibold text-[var(--text-primary)]">How to edit</h2>
            <p className="text-sm text-[var(--text-secondary)]">
              Lineage membership is managed from the person edit workbench so connections, ordering, and narrative context stay close together.
            </p>
          </Card>
        }
      />
    </ThemeProvider>
  );
}
