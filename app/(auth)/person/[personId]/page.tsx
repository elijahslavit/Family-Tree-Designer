import Link from "next/link";

import { BiographyRenderer } from "@/components/domain/biography-renderer";
import { FactTable } from "@/components/domain/fact-table";
import { RelativeGroup } from "@/components/domain/relative-group";
import { Timeline } from "@/components/domain/timeline";
import { Card } from "@/components/foundation/card";
import { CreatorTreeShell } from "@/components/layouts/tree-shell";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { requireAccountSession } from "@/lib/auth/session";
import { getActiveTreeForCreator, getPersonById } from "@/lib/queries";

type PersonPageProps = {
  params: Promise<{ personId: string }>;
};

export default async function CreatorPersonPage({ params }: PersonPageProps) {
  const accountId = await requireAccountSession();
  const tree = await getActiveTreeForCreator(accountId);
  const { personId } = await params;
  const person = await getPersonById({
    treeSlug: tree.slug,
    personId,
    viewer: { mode: "creator", accountId },
  });

  return (
    <ThemeProvider layout={tree.themeLayout} skin={tree.themeSkin}>
      <CreatorTreeShell
        tree={tree}
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
              <Link href={`/person/${person.id}/edit`} className="text-sm font-semibold text-[var(--accent-text)]">
                Edit profile
              </Link>
            </Card>
            <BiographyRenderer markdown={person.biographyMd} />
            <Timeline items={person.timeline} />
          </div>
        }
        detail={
          <div className="space-y-4">
            <FactTable person={person} />
            <RelativeGroup person={person} buildHref={(id) => `/person/${id}`} />
          </div>
        }
      />
    </ThemeProvider>
  );
}
