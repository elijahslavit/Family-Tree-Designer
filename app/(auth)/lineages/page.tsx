import Link from "next/link";

import { LineageCollection } from "@/components/domain/lineage-collection";
import { LineageOverview } from "@/components/domain/lineage-overview";
import { Card } from "@/components/foundation/card";
import { CreatorTreeShell } from "@/components/layouts/tree-shell";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { requireAccountSession } from "@/lib/auth/session";
import { getActiveTreeForCreator, getLineagesByTree } from "@/lib/queries";
import type { LineageViewModel } from "@/lib/types";

export default async function CreatorLineagesPage() {
  const accountId = await requireAccountSession();
  const tree = await getActiveTreeForCreator(accountId);
  const lineages = await getLineagesByTree({
    treeSlug: tree.slug,
    viewer: { mode: "creator", accountId },
  });
  const longestLineage = [...lineages].sort(
    (left, right) => right.members.length - left.members.length,
  )[0];
  const uniqueMembers = new Set(
    lineages.flatMap((lineage) => lineage.members.map((member) => member.id)),
  ).size;

  return (
    <ThemeProvider layout={tree.themeLayout} skin={tree.themeSkin}>
      <CreatorTreeShell
        tree={tree}
        main={
          <div className="space-y-6">
            <LineageOverview
              eyebrow="Lineages"
              title="Named descent lines"
              description="Review the ordered descent paths that give the archive its narrative shape, then jump to the right profile or highlighted canvas view to keep refining them."
              primaryAction={
                longestLineage
                  ? {
                      href: buildCreatorLineageCanvasHref(longestLineage),
                      label: "Open highlighted canvas",
                    }
                  : undefined
              }
              secondaryAction={{
                href: "/directory",
                label: "Browse directory",
              }}
              stats={[
                {
                  label: "Lineages",
                  value: lineages.length,
                  detail: "Named descent lines currently featured in the archive.",
                },
                {
                  label: "People featured",
                  value: uniqueMembers,
                  detail: "Unique people represented across all named paths.",
                },
                {
                  label: "Longest path",
                  value: longestLineage?.members.length ?? 0,
                  detail: "Members in the most detailed lineage sequence.",
                },
              ]}
            />
            <LineageCollection
              lineages={lineages}
              buildPersonHref={(personId) => `/person/${personId}`}
              buildCanvasHref={buildCreatorLineageCanvasHref}
              emptyTitle="No lineages yet"
              emptyDescription="Create a lineage from a person profile to build named descent paths."
              emptyActionLabel="Browse directory"
              emptyActionHref="/directory"
              mode="creator"
            />
          </div>
        }
        detail={
          <div className="space-y-4 lg:sticky lg:top-24">
            <Card className="space-y-3">
              <h2 className="text-xl font-semibold text-[var(--text-primary)]">How to edit</h2>
              <p className="text-sm leading-6 text-[var(--text-secondary)]">
                Lineage membership is managed from the person edit workbench so connections, ordering, and narrative context stay close together.
              </p>
              <Link href="/directory" className="text-sm font-semibold text-[var(--accent-text)]">
                Open a person profile
              </Link>
            </Card>
            <Card className="space-y-3">
              <p className="text-xs uppercase tracking-[0.16em] text-[var(--text-muted)]">
                At a glance
              </p>
              <div className="space-y-2 text-sm leading-6 text-[var(--text-secondary)]">
                <p>
                  {lineages.length} lineage{lineages.length === 1 ? "" : "s"} currently define the archive’s most important descent paths.
                </p>
                {longestLineage ? (
                  <p>
                    <span className="font-semibold text-[var(--text-primary)]">{longestLineage.name}</span> is currently the longest path at {longestLineage.members.length} members.
                  </p>
                ) : null}
              </div>
            </Card>
          </div>
        }
      />
    </ThemeProvider>
  );
}

function buildCreatorLineageCanvasHref(lineage: LineageViewModel) {
  const focusMember = getLineageFocusMember(lineage);
  const params = new URLSearchParams({
    lineage: lineage.id,
    depth: "3",
  });

  if (focusMember) {
    params.set("person", focusMember.id);
  }

  return `/canvas?${params.toString()}`;
}

function getLineageFocusMember(lineage: LineageViewModel) {
  return lineage.members[Math.floor((lineage.members.length - 1) / 2)] ?? lineage.members[0] ?? null;
}
