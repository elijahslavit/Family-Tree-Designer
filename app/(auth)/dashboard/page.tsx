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
              <div className="space-y-2">
                <p className="text-xs uppercase tracking-[0.16em] text-[var(--creator-text-muted)]">
                  Dashboard / Home
                </p>
                <h2 className="text-3xl font-semibold text-[var(--creator-text)]">
                  Welcome
                </h2>
                <p className="max-w-3xl text-sm leading-6 text-[var(--creator-text-muted)]">
                  Keep the workbench simple: choose a presentation, bring family data in,
                  and review the canvas before you present it.
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
                        <span className="text-[var(--creator-text-muted)]">→</span>
                      ) : null}
                    </div>
                    <p className="mt-2 text-sm leading-6 text-[var(--creator-text-muted)]">
                      {step.detail}
                    </p>
                  </Link>
                ))}
              </div>
            </Card>

            <Card className="space-y-5">
              <div className="space-y-2">
                <p className="text-xs uppercase tracking-[0.16em] text-[var(--creator-text-muted)]">
                  Overview / Statistics
                </p>
                <h2 className="text-2xl font-semibold text-[var(--creator-text)]">
                  Archive summary
                </h2>
              </div>

              <div className="grid gap-3 md:grid-cols-4">
                <StatCell label="People" value={stats.people} />
                <StatCell label="Families" value={stats.families} />
                <StatCell label="Events" value={stats.events} />
                <StatCell label="Open issues" value={stats.issues} />
              </div>

              <div className="grid gap-4 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)]">
                <div className="space-y-3 rounded-[var(--radius-sm)] border border-[var(--creator-border)] bg-[var(--creator-surface-muted)] p-4">
                  <p className="text-sm font-semibold text-[var(--creator-text)]">
                    Current notes
                  </p>
                  <p className="text-sm leading-6 text-[var(--creator-text-muted)]">
                    {tree.description ||
                      "This archive is in active editing. Use the four main pages to keep the presentation and underlying records aligned."}
                  </p>
                  <div className="grid gap-3 md:grid-cols-3">
                    <ListBlock
                      title="People"
                      items={[
                        `${stats.living} living`,
                        `${recentPeople.length} recently edited`,
                        `${stats.orphan} standalone records`,
                      ]}
                    />
                    <ListBlock
                      title="Families"
                      items={
                        topSurnames.length
                          ? topSurnames.slice(0, 3).map(
                              (surname) => `${surname.surname} (${surname.count})`,
                            )
                          : ["No surname groups yet", "Add or import more records"]
                      }
                    />
                    <ListBlock
                      title="Events"
                      items={[
                        `${stats.events} total events`,
                        latestImportJob
                          ? `Latest import: ${latestImportJob.status}`
                          : "No recent import",
                        openIssues.length
                          ? `${openIssues.length} items need review`
                          : "No review backlog",
                      ]}
                    />
                  </div>
                </div>

                <div className="space-y-3 rounded-[var(--radius-sm)] border border-[var(--creator-border)] bg-[var(--creator-surface)] p-4">
                  <p className="text-sm font-semibold text-[var(--creator-text)]">
                    Quick access
                  </p>
                  <ActionLink href="/theme" label="Open theme builder" />
                  <ActionLink href="/import" label="Open family upload" />
                  <ActionLink href="/canvas" label="Open presentation canvas" />
                  <ActionLink href="/directory" label="Go to directory" />
                </div>
              </div>
            </Card>
          </>
        }
      />
    </ThemeProvider>
  );
}

function StatCell({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-[var(--radius-sm)] border border-[var(--creator-border)] bg-[var(--creator-surface)] p-4">
      <p className="text-xs uppercase tracking-[0.16em] text-[var(--creator-text-muted)]">
        {label}
      </p>
      <p className="mt-2 text-3xl font-semibold text-[var(--creator-text)]">{value}</p>
    </div>
  );
}

function ListBlock({ title, items }: { title: string; items: string[] }) {
  return (
    <div className="rounded-[var(--radius-sm)] border border-[var(--creator-border)] bg-[var(--creator-surface)] p-3">
      <p className="text-xs uppercase tracking-[0.16em] text-[var(--creator-text-muted)]">
        {title}
      </p>
      <div className="mt-2 space-y-2 text-sm text-[var(--creator-text)]">
        {items.map((item) => (
          <p key={item}>{item}</p>
        ))}
      </div>
    </div>
  );
}

function ActionLink({ href, label }: { href: string; label: string }) {
  return (
    <Link
      href={href}
      className="block rounded-[var(--radius-sm)] border border-[var(--creator-border)] px-3 py-3 text-sm text-[var(--creator-text)] transition-colors hover:bg-[var(--creator-surface-muted)]"
    >
      {label}
    </Link>
  );
}
