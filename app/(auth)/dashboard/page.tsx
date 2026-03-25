import Link from "next/link";

import { Card } from "@/components/foundation/card";
import { StatCard } from "@/components/domain/stat-card";
import { CreatorTreeShell } from "@/components/layouts/tree-shell";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { requireAccountSession } from "@/lib/auth/session";
import { getDashboardData } from "@/lib/queries";

export default async function DashboardPage() {
  const accountId = await requireAccountSession();
  const { tree, stats, recentPeople, lineages } = await getDashboardData(accountId);

  return (
    <ThemeProvider layout={tree.themeLayout} skin={tree.themeSkin}>
      <CreatorTreeShell
        tree={tree}
        main={
          <div className="space-y-6">
            <div className="grid gap-4 md:grid-cols-4">
              <StatCard label="People" value={stats.people} detail="Directory-ready records" />
              <StatCard label="Families" value={stats.families} detail="Structured relationship units" />
              <StatCard label="Events" value={stats.events} detail="Timeline entries" />
              <StatCard label="Issues" value={stats.issues} detail="Import review backlog" />
            </div>
            <Card className="space-y-4">
              <h2 className="text-2xl font-semibold text-[var(--text-primary)]">Recent activity</h2>
              <div className="grid gap-3">
                {recentPeople.map((person) => (
                  <Link
                    key={person.id}
                    href={`/person/${person.id}`}
                    className="rounded-[var(--radius-md)] border border-[var(--border-default)] px-4 py-3"
                  >
                    <p className="font-semibold text-[var(--text-primary)]">{person.fullName}</p>
                    <p className="text-sm text-[var(--text-secondary)]">{person.summary}</p>
                  </Link>
                ))}
              </div>
            </Card>
          </div>
        }
        detail={
          <Card className="space-y-4">
            <h2 className="text-xl font-semibold text-[var(--text-primary)]">Lineages</h2>
            <div className="space-y-3">
              {lineages.map((lineage) => (
                <div key={lineage.id}>
                  <p className="font-semibold text-[var(--text-primary)]">{lineage.name}</p>
                  <p className="text-sm text-[var(--text-secondary)]">{lineage.description}</p>
                </div>
              ))}
            </div>
          </Card>
        }
      />
    </ThemeProvider>
  );
}
