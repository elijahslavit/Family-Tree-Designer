import Link from "next/link";
import { ArrowUpRight, Clock3 } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

import { Badge } from "@/components/foundation/badge";
import { Card } from "@/components/foundation/card";
import type { Lineage, Person } from "@/lib/types";

type RecentDashboardPerson = Person & {
  lineages: Lineage[];
};

export function DashboardActivityFeed({
  recentPeople,
}: {
  recentPeople: RecentDashboardPerson[];
}) {
  return (
    <Card className="relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,color-mix(in_oklab,var(--bg-elevated)_70%,transparent),transparent)]" />
      <div className="relative space-y-5">
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-2">
            <p className="text-xs uppercase tracking-[0.18em] text-[var(--text-muted)]">
              Recent activity
            </p>
            <h2 className="text-3xl font-semibold text-[var(--text-primary)]">
              Recently shaped profiles
            </h2>
            <p className="max-w-2xl text-sm leading-6 text-[var(--text-secondary)]">
              The latest edits and additions stay grouped here so you can jump back into the
              archive without hunting through the directory.
            </p>
          </div>
          <Link
            href="/directory"
            className="hidden items-center gap-2 rounded-[var(--radius-md)] border border-[var(--border-default)] px-3 py-2 text-sm font-semibold text-[var(--text-primary)] transition-colors hover:bg-[var(--accent-muted)] md:inline-flex"
          >
            Open directory
            <ArrowUpRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="grid gap-3">
          {recentPeople.map((person, index) => (
            <div
              key={`${person.id}-${person.updatedAt}`}
              className="group rounded-[var(--radius-lg)] border border-[var(--border-default)] bg-[color-mix(in_oklab,var(--bg-surface)_88%,transparent)] p-4 transition-colors hover:border-[var(--border-strong)] hover:bg-[var(--accent-muted)]/35"
            >
              <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                <div className="min-w-0 space-y-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge tone="default">#{index + 1}</Badge>
                    <span className="inline-flex items-center gap-1 text-xs uppercase tracking-[0.16em] text-[var(--text-muted)]">
                      <Clock3 className="h-3.5 w-3.5" />
                      {formatDistanceToNow(new Date(person.updatedAt), { addSuffix: true })}
                    </span>
                    {person.isLiving ? <Badge tone="warning">Living</Badge> : null}
                  </div>
                  <div className="space-y-1">
                    <p className="text-xl font-semibold text-[var(--text-primary)]">{person.fullName}</p>
                    <p className="max-w-2xl text-sm leading-6 text-[var(--text-secondary)]">
                      {person.summary || "Summary still needed. Open this profile to fill in the archival narrative and timeline."}
                    </p>
                  </div>
                  {person.lineages.length ? (
                    <div className="flex flex-wrap gap-2">
                      {person.lineages.slice(0, 3).map((lineage) => (
                        <Badge key={lineage.id} tone="accent">
                          {lineage.name}
                        </Badge>
                      ))}
                    </div>
                  ) : null}
                </div>
                <div className="flex flex-wrap gap-3 text-sm">
                  <Link
                    href={`/person/${person.id}/edit`}
                    className="inline-flex items-center gap-1 text-[var(--text-secondary)] group-hover:text-[var(--text-primary)]"
                  >
                    Edit person
                    <ArrowUpRight className="h-3.5 w-3.5" />
                  </Link>
                  <Link
                    href={`/person/${person.id}`}
                    className="inline-flex items-center gap-1 text-[var(--accent-text)]"
                  >
                    View profile
                    <ArrowUpRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
}
