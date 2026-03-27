import Link from "next/link";

import { Card } from "@/components/foundation/card";
import { CreatorTreeShell } from "@/components/layouts/tree-shell";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { requireAccountSession } from "@/lib/auth/session";
import { getDashboardData } from "@/lib/queries";

export default async function DashboardPage() {
  const accountId = await requireAccountSession();
  const {
    tree,
    stats,
    topSurnames,
    recentPeople,
    openIssues,
    latestImportJob,
  } = await getDashboardData(accountId);

  const workflowSteps = [
    {
      title: "Select Theme",
      href: "/theme",
      detail: "Choose a presentation preset and preview it.",
    },
    {
      title: "Enter Family",
      href: "/import",
      detail: "Upload records or continue manual entry.",
    },
    {
      title: "Present Canvas",
      href: "/canvas",
      detail: "Preview the tree and move through the branch layout.",
    },
  ];

  return (
    <ThemeProvider layout={tree.themeLayout} skin={tree.themeSkin}>
      <CreatorTreeShell
        tree={tree}
        activePath="/dashboard"
        main={
          <>
            <Card className="space-y-4">
              <div className="space-y-1">
                <p className="text-xs uppercase tracking-[0.16em] text-[var(--creator-text-muted)]">
                  Dashboard
                </p>
                <h2 className="text-2xl font-semibold text-[var(--creator-text)]">
                  Welcome
                </h2>
                <p className="max-w-2xl text-sm leading-6 text-[var(--creator-text-muted)]">
                  Choose a presentation, bring family data in, and review the
                  canvas.
                </p>
              </div>

              <div className="grid gap-3 md:grid-cols-3">
                {workflowSteps.map((step, index) => (
                  <Link
                    key={step.title}
                    href={step.href}
                    className="rounded-[var(--radius-sm)] border border-[var(--creator-border)] bg-[var(--creator-surface)] p-4 transition-colors hover:bg-[var(--creator-surface-muted)]"
                  >
                    <p className="text-xs uppercase tracking-[0.16em] text-[var(--creator-text-muted)]">
                      Step {index + 1}
                    </p>
                    <div className="mt-3 flex items-center gap-3">
                      <p className="text-lg font-semibold text-[var(--creator-text)]">
                        {step.title}
                      </p>
                      {index < workflowSteps.length - 1 ? (
                        <span className="text-[var(--creator-text-muted)]">
                          &rarr;
                        </span>
                      ) : null}
                    </div>
                    <p className="mt-2 text-sm leading-6 text-[var(--creator-text-muted)]">
                      {step.detail}
                    </p>
                  </Link>
                ))}
              </div>
            </Card>

            <Card className="space-y-4">
              <div className="space-y-1">
                <p className="text-xs uppercase tracking-[0.16em] text-[var(--creator-text-muted)]">
                  Overview / Statistics
                </p>
                <h2 className="text-2xl font-semibold text-[var(--creator-text)]">
                  Archive summary
                </h2>
              </div>

              <div className="grid gap-3 md:grid-cols-3">
                <SummaryColumn
                  label="People"
                  value={stats.people}
                  items={[
                    `${stats.living} living`,
                    `${recentPeople.length} recently edited`,
                    `${stats.orphan} standalone`,
                  ]}
                />
                <SummaryColumn
                  label="Families"
                  value={stats.families}
                  items={
                    topSurnames.length
                      ? topSurnames
                          .slice(0, 3)
                          .map((s) => `${s.surname} (${s.count})`)
                      : ["No surname groups yet"]
                  }
                />
                <SummaryColumn
                  label="Events"
                  value={stats.events}
                  items={[
                    `${stats.events} total`,
                    latestImportJob
                      ? `Import: ${latestImportJob.status}`
                      : "No recent import",
                    openIssues.length
                      ? `${openIssues.length} need review`
                      : "No review backlog",
                  ]}
                />
              </div>
            </Card>
          </>
        }
      />
    </ThemeProvider>
  );
}

function SummaryColumn({
  label,
  value,
  items,
}: {
  label: string;
  value: number;
  items: string[];
}) {
  return (
    <div className="rounded-[var(--radius-sm)] border border-[var(--creator-border)] bg-[var(--creator-surface)] p-4">
      <p className="text-xs uppercase tracking-[0.16em] text-[var(--creator-text-muted)]">
        {label}
      </p>
      <p className="mt-2 text-3xl font-semibold text-[var(--creator-text)]">
        {value}
      </p>
      <ul className="mt-3 space-y-1 text-sm text-[var(--creator-text-muted)]">
        {items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </div>
  );
}
