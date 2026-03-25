import Link from "next/link";
import { ArrowRight, ArrowUpRight, Users } from "lucide-react";
import type { ReactNode } from "react";

import { LineageBadge } from "@/components/domain/lineage-badge";
import { Avatar } from "@/components/foundation/avatar";
import { Badge } from "@/components/foundation/badge";
import { Card } from "@/components/foundation/card";
import { EmptyState } from "@/components/foundation/empty-state";
import type { LineageViewModel, Person } from "@/lib/types";
import { formatLifespan } from "@/lib/utils/dates";

type LineageCollectionProps = {
  lineages: LineageViewModel[];
  buildPersonHref: (personId: string) => string;
  buildCanvasHref?: (lineage: LineageViewModel) => string;
  emptyTitle: string;
  emptyDescription: string;
  emptyActionLabel?: string;
  emptyActionHref?: string;
  mode: "creator" | "viewer";
};

export function LineageCollection({
  lineages,
  buildPersonHref,
  buildCanvasHref,
  emptyTitle,
  emptyDescription,
  emptyActionLabel,
  emptyActionHref,
  mode,
}: LineageCollectionProps) {
  if (!lineages.length) {
    return (
      <EmptyState
        title={emptyTitle}
        description={emptyDescription}
        actionLabel={emptyActionLabel}
        actionHref={emptyActionHref}
      />
    );
  }

  return (
    <div className="grid gap-6">
      {lineages.map((lineage) => (
        <LineagePathCard
          key={lineage.id}
          lineage={lineage}
          buildPersonHref={buildPersonHref}
          buildCanvasHref={buildCanvasHref}
          mode={mode}
        />
      ))}
    </div>
  );
}

function LineagePathCard({
  lineage,
  buildPersonHref,
  buildCanvasHref,
  mode,
}: {
  lineage: LineageViewModel;
  buildPersonHref: (personId: string) => string;
  buildCanvasHref?: (lineage: LineageViewModel) => string;
  mode: "creator" | "viewer";
}) {
  const firstMember = lineage.members[0] ?? null;
  const lastMember = lineage.members.at(-1) ?? null;

  return (
    <Card className="relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,color-mix(in_oklab,var(--accent-primary)_10%,transparent),transparent_38%),linear-gradient(180deg,color-mix(in_oklab,var(--bg-elevated)_72%,transparent),transparent)]" />
      <div className="relative space-y-6">
        <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_300px]">
          <div className="space-y-4">
            <LineageBadge lineage={lineage} />
            <div className="space-y-3">
              <h3 className="display-name text-3xl font-semibold text-[var(--text-primary)]">
                {lineage.name}
              </h3>
              <p className="max-w-3xl text-sm leading-7 text-[var(--text-secondary)] md:text-base">
                {lineage.description || "No description recorded for this lineage yet."}
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <StatPill label="Members" value={String(lineage.members.length)} icon={<Users className="h-4 w-4" />} />
              {firstMember ? <StatPill label="Origin" value={firstMember.fullName} /> : null}
              {lastMember ? <StatPill label="Current end" value={lastMember.fullName} /> : null}
            </div>
          </div>
          <div className="space-y-4 rounded-[var(--radius-lg)] border border-[var(--border-default)] bg-[color-mix(in_oklab,var(--bg-surface)_84%,transparent)] p-5">
            <p className="text-xs uppercase tracking-[0.16em] text-[var(--text-muted)]">
              Path summary
            </p>
            <div className="space-y-3 text-sm leading-7 text-[var(--text-secondary)]">
              <p>
                {mode === "creator"
                  ? "Use this page to review the ordered descent line, then jump into a profile to edit membership or narrative details."
                  : "This path surfaces one featured descent line chosen by the archive creator."}
              </p>
              {firstMember && lastMember ? (
                <p>
                  The visible path runs from <span className="font-semibold text-[var(--text-primary)]">{firstMember.fullName}</span> to{" "}
                  <span className="font-semibold text-[var(--text-primary)]">{lastMember.fullName}</span>.
                </p>
              ) : null}
            </div>
            <div className="flex flex-wrap gap-3">
              {buildCanvasHref ? (
                <Link
                  href={buildCanvasHref(lineage)}
                  className="inline-flex items-center justify-center rounded-[var(--radius-md)] bg-[var(--accent-primary)] px-4 py-2 text-sm font-semibold text-[var(--text-inverse)]"
                >
                  Open highlighted canvas
                </Link>
              ) : null}
              {lastMember ? (
                <Link
                  href={buildPersonHref(lastMember.id)}
                  className="inline-flex items-center justify-center rounded-[var(--radius-md)] border border-[var(--border-strong)] px-4 py-2 text-sm font-semibold text-[var(--text-primary)]"
                >
                  Open end profile
                </Link>
              ) : null}
            </div>
          </div>
        </div>
        <ol className="relative space-y-4 pl-0 md:pl-2">
          <div className="absolute bottom-4 left-[1.15rem] top-5 hidden w-px bg-[color-mix(in_oklab,var(--accent-primary)_34%,var(--border-default))] md:block" />
          {lineage.members.map((member, index) => (
            <li key={`${lineage.id}:${member.id}`} className="relative md:pl-12">
              <span className="absolute left-0 top-6 hidden h-9 w-9 items-center justify-center rounded-full border border-[var(--border-default)] bg-[var(--bg-surface)] text-sm font-semibold text-[var(--accent-text)] shadow-[var(--shadow-sm)] md:inline-flex">
                {index + 1}
              </span>
              <Link
                href={buildPersonHref(member.id)}
                className="group block rounded-[var(--radius-lg)] border border-[var(--border-default)] bg-[color-mix(in_oklab,var(--bg-surface)_90%,transparent)] px-4 py-4 transition-all duration-[var(--transition-normal)] hover:-translate-y-0.5 hover:border-[var(--border-strong)] hover:shadow-[var(--shadow-lg)]"
              >
                <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                  <div className="flex items-start gap-4">
                    <Avatar
                      name={member.fullName}
                      className="h-12 w-12 bg-[color-mix(in_oklab,var(--accent-muted)_74%,white)]"
                    />
                    <div className="space-y-2">
                      <div className="flex flex-wrap items-center gap-2 md:hidden">
                        <Badge tone="accent">Generation {index + 1}</Badge>
                        {memberPositionBadge(index, lineage.members.length)}
                      </div>
                      <div className="space-y-1">
                        <p className="text-xl font-semibold text-[var(--text-primary)] transition-colors group-hover:text-[var(--accent-text)]">
                          {member.fullName}
                        </p>
                        <p className="text-sm text-[var(--text-muted)]">{getLifespanText(member)}</p>
                      </div>
                      <p className="max-w-3xl text-sm leading-7 text-[var(--text-secondary)]">
                        {getSummaryText(member, mode)}
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {memberPositionBadge(index, lineage.members.length)}
                        {member.isLiving ? <Badge tone="warning">Living</Badge> : null}
                      </div>
                    </div>
                  </div>
                  <span className="hidden rounded-full border border-[var(--border-default)] p-2 text-[var(--text-muted)] transition-colors group-hover:border-[var(--border-strong)] group-hover:text-[var(--accent-text)] lg:inline-flex">
                    <ArrowUpRight className="h-4 w-4" />
                  </span>
                </div>
              </Link>
              {index < lineage.members.length - 1 ? (
                <div className="mt-2 hidden items-center gap-3 pl-2 text-[var(--text-muted)] md:flex">
                  <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-[color-mix(in_oklab,var(--accent-primary)_14%,transparent)] text-[var(--accent-text)]">
                    <ArrowRight className="h-3.5 w-3.5" />
                  </span>
                  <span className="text-xs uppercase tracking-[0.14em]">Next generation</span>
                </div>
              ) : null}
            </li>
          ))}
        </ol>
      </div>
    </Card>
  );
}

function StatPill({
  label,
  value,
  icon,
}: {
  label: string;
  value: string;
  icon?: ReactNode;
}) {
  return (
    <div className="inline-flex items-center gap-3 rounded-full border border-[var(--border-default)] bg-[color-mix(in_oklab,var(--bg-surface)_88%,transparent)] px-4 py-2">
      {icon ? <span className="text-[var(--accent-text)]">{icon}</span> : null}
      <div>
        <p className="text-[10px] uppercase tracking-[0.16em] text-[var(--text-muted)]">{label}</p>
        <p className="text-sm font-semibold text-[var(--text-primary)]">{value}</p>
      </div>
    </div>
  );
}

function memberPositionBadge(index: number, total: number) {
  if (index === 0) {
    return <Badge tone="success">Origin</Badge>;
  }

  if (index === total - 1) {
    return <Badge tone="accent">Current end</Badge>;
  }

  return <Badge>Generation {index + 1}</Badge>;
}

function getSummaryText(member: Person, mode: "creator" | "viewer") {
  if (member.summary === "Details private" && mode === "viewer") {
    return "Details are hidden for living people in the shared archive.";
  }

  return member.summary || "No summary recorded for this member yet.";
}

function getLifespanText(member: Person) {
  if (!member.birthDateText && !member.deathDateText && member.isLiving) {
    return "Living";
  }

  if (!member.birthDateText && !member.deathDateText && !member.isLiving) {
    return "Dates unavailable";
  }

  return formatLifespan(member.birthDateText, member.deathDateText, member.isLiving);
}
