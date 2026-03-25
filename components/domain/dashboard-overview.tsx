import Link from "next/link";
import { CalendarClock, FolderHeart, Globe, Lock, Palette, Users } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import type { ReactNode } from "react";

import { Badge } from "@/components/foundation/badge";
import { Card } from "@/components/foundation/card";
import type { Tree } from "@/lib/types";

type DashboardOverviewProps = {
  tree: Tree;
  stats: {
    people: number;
    families: number;
    events: number;
    issues: number;
    living: number;
    orphan: number;
  };
  topSurnames: Array<{
    surname: string;
    count: number;
  }>;
  publicHref: string;
};

export function DashboardOverview({
  tree,
  stats,
  topSurnames,
  publicHref,
}: DashboardOverviewProps) {
  return (
    <Card className="relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,color-mix(in_oklab,var(--accent-primary)_18%,transparent),transparent_38%),radial-gradient(circle_at_bottom_right,color-mix(in_oklab,var(--accent-primary)_10%,transparent),transparent_28%)]" />
      <div className="relative space-y-6">
        <div className="grid gap-6 xl:grid-cols-[minmax(0,1.1fr)_22rem]">
          <div className="space-y-5">
            <div className="flex flex-wrap items-center gap-2">
              <Badge tone={tree.isPublic ? "accent" : "default"}>
                {tree.isPublic ? <Globe className="mr-1 h-3.5 w-3.5" /> : <Lock className="mr-1 h-3.5 w-3.5" />}
                {tree.isPublic ? "Public archive live" : "Private creator archive"}
              </Badge>
              <Badge tone="default">
                <Palette className="mr-1 h-3.5 w-3.5" />
                {labelize(tree.themeLayout)} + {labelize(tree.themeSkin)}
              </Badge>
              <Badge tone="default">
                <CalendarClock className="mr-1 h-3.5 w-3.5" />
                Updated {formatDistanceToNow(new Date(tree.updatedAt), { addSuffix: true })}
              </Badge>
            </div>

            <div className="space-y-3">
              <p className="text-xs uppercase tracking-[0.2em] text-[var(--text-muted)]">
                Creator dashboard
              </p>
              <h2 className="display-name text-4xl font-semibold leading-tight text-[var(--text-primary)] md:text-5xl">
                Steer the archive, not just the records.
              </h2>
              <p className="max-w-3xl text-base leading-7 text-[var(--text-secondary)] md:text-lg">
                {tree.description ||
                  "Use the dashboard to keep the archive healthy, move quickly between editing flows, and keep the public-facing tree polished."}
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <ActionLink href="/person/new" tone="primary">
                Add person
              </ActionLink>
              <ActionLink href="/import" tone="secondary">
                Import GEDCOM
              </ActionLink>
              <ActionLink href="/canvas" tone="secondary">
                Explore canvas
              </ActionLink>
              <ActionLink href={tree.isPublic ? publicHref : "/settings"} tone="ghost">
                {tree.isPublic ? "Open public archive" : "Manage sharing"}
              </ActionLink>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-3 xl:grid-cols-1">
            <MetaCard
              icon={<Users className="h-4 w-4" />}
              label="Living people"
              value={stats.living}
              detail="Visible in structure, private in shared mode."
            />
            <MetaCard
              icon={<FolderHeart className="h-4 w-4" />}
              label="Standalone records"
              value={stats.orphan}
              detail="People not yet attached to a parent, spouse, or child link."
            />
            <div className="rounded-[var(--radius-md)] border border-[var(--border-default)] bg-[color-mix(in_oklab,var(--bg-surface)_86%,transparent)] p-4 backdrop-blur">
              <p className="text-xs uppercase tracking-[0.16em] text-[var(--text-muted)]">
                Leading surnames
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                {topSurnames.length ? (
                  topSurnames.map((surname) => (
                    <Badge key={surname.surname} tone="default">
                      {surname.surname} · {surname.count}
                    </Badge>
                  ))
                ) : (
                  <p className="text-sm text-[var(--text-secondary)]">No surname clusters yet.</p>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="grid gap-3 md:grid-cols-4">
          <OverviewStat label="People" value={stats.people} detail="Directory-ready records" />
          <OverviewStat label="Families" value={stats.families} detail="Structured relationship units" />
          <OverviewStat label="Events" value={stats.events} detail="Timeline entries and life markers" />
          <OverviewStat label="Issues" value={stats.issues} detail="Import review backlog and quality flags" />
        </div>
      </div>
    </Card>
  );
}

function labelize(value: string) {
  return value
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function ActionLink({
  href,
  tone,
  children,
}: {
  href: string;
  tone: "primary" | "secondary" | "ghost";
  children: ReactNode;
}) {
  const className =
    tone === "primary"
      ? "bg-[var(--accent-primary)] text-[var(--text-inverse)] hover:bg-[var(--accent-hover)]"
      : tone === "secondary"
        ? "border border-[var(--border-strong)] bg-[color-mix(in_oklab,var(--bg-surface)_86%,transparent)] text-[var(--text-primary)] hover:bg-[var(--accent-muted)]"
        : "border border-[var(--border-default)] bg-transparent text-[var(--text-secondary)] hover:bg-[var(--accent-muted)] hover:text-[var(--text-primary)]";

  return (
    <Link
      href={href}
      className={`inline-flex items-center justify-center rounded-[var(--radius-md)] px-4 py-2 text-sm font-semibold transition-colors ${className}`}
    >
      {children}
    </Link>
  );
}

function MetaCard({
  icon,
  label,
  value,
  detail,
}: {
  icon: ReactNode;
  label: string;
  value: number;
  detail: string;
}) {
  return (
    <div className="rounded-[var(--radius-md)] border border-[var(--border-default)] bg-[color-mix(in_oklab,var(--bg-surface)_86%,transparent)] p-4 backdrop-blur">
      <div className="flex items-center gap-2 text-[var(--text-muted)]">{icon}</div>
      <p className="mt-3 text-xs uppercase tracking-[0.16em] text-[var(--text-muted)]">{label}</p>
      <p className="mt-2 text-3xl font-semibold text-[var(--text-primary)]">{value}</p>
      <p className="mt-2 text-sm leading-6 text-[var(--text-secondary)]">{detail}</p>
    </div>
  );
}

function OverviewStat({
  label,
  value,
  detail,
}: {
  label: string;
  value: number;
  detail: string;
}) {
  return (
    <div className="rounded-[var(--radius-md)] border border-[var(--border-default)] bg-[color-mix(in_oklab,var(--bg-surface)_88%,transparent)] p-4 backdrop-blur">
      <p className="text-xs uppercase tracking-[0.16em] text-[var(--text-muted)]">{label}</p>
      <p className="mt-3 text-4xl font-semibold text-[var(--text-primary)]">{value}</p>
      <p className="mt-2 text-sm leading-6 text-[var(--text-secondary)]">{detail}</p>
    </div>
  );
}
