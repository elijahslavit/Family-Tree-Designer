import Link from "next/link";

import { BiographyRenderer } from "@/components/domain/biography-renderer";
import { FactTable } from "@/components/domain/fact-table";
import { LineageBadge } from "@/components/domain/lineage-badge";
import { PrivacyMask } from "@/components/domain/privacy-mask";
import { RelativeGroup } from "@/components/domain/relative-group";
import { Timeline } from "@/components/domain/timeline";
import { Card } from "@/components/foundation/card";
import { PublicTreeShell } from "@/components/layouts/tree-shell";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { getPublicViewerContext } from "@/lib/auth/session";
import { getPersonById, getTreeBySlug } from "@/lib/queries";
import { publicCanvasHref, publicPersonHref } from "@/lib/utils/links";

type PublicPersonPageProps = {
  params: Promise<{ slug: string; personId: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function PublicPersonPage({
  params,
  searchParams,
}: PublicPersonPageProps) {
  const { slug, personId } = await params;
  const query = await searchParams;
  const shareToken = typeof query.share === "string" ? query.share : null;
  const viewer = getPublicViewerContext(shareToken);
  const tree = await getTreeBySlug(slug, viewer);
  const person = await getPersonById({ treeSlug: slug, personId, viewer });
  const isMasked = person.summary === "Details private";

  return (
    <ThemeProvider layout={tree.themeLayout} skin={tree.themeSkin}>
      <PublicTreeShell
        tree={tree}
        variant="profile"
        main={
          <div className="space-y-6">
            <Card className="space-y-3">
              <p className="text-xs uppercase tracking-[0.16em] text-[var(--text-muted)]">
                Profile
              </p>
              <h2 className="display-name text-5xl font-semibold text-[var(--text-primary)]">
                {person.fullName}
              </h2>
              <p className="text-lg text-[var(--text-secondary)]">{person.summary}</p>
              <div className="flex flex-wrap gap-2">
                {person.lineages.length ? (
                  person.lineages.map((lineage) => (
                    <LineageBadge key={lineage.id} lineage={lineage} />
                  ))
                ) : (
                  <span className="text-sm text-[var(--text-muted)]">No lineage assigned</span>
                )}
              </div>
              <div className="flex flex-wrap gap-4">
                <Link
                  href={publicCanvasHref(tree.slug, tree.shareToken, person.id)}
                  className="text-sm font-semibold text-[var(--accent-text)]"
                >
                  Explore in canvas
                </Link>
              </div>
            </Card>
            {isMasked ? <PrivacyMask /> : <BiographyRenderer markdown={person.biographyMd} />}
            {!isMasked ? <Timeline items={person.timeline} /> : null}
          </div>
        }
        detail={
          <div className="space-y-4">
            {!isMasked ? <FactTable person={person} /> : null}
            <RelativeGroup
              person={person}
              buildHref={(id) => publicPersonHref(tree.slug, id, tree.shareToken)}
            />
          </div>
        }
      />
    </ThemeProvider>
  );
}
