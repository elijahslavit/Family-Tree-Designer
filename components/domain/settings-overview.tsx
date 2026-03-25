import Link from "next/link";
import { CalendarClock, Globe, Lock, Palette, ShieldAlert, UserCircle2 } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import type { ReactNode } from "react";

import { Badge } from "@/components/foundation/badge";
import { Card } from "@/components/foundation/card";
import type { Account, Tree } from "@/lib/types";

export function SettingsOverview({
  tree,
  account,
  openIssues,
  publicHref,
  demoMode,
  authConfigured,
}: {
  tree: Tree;
  account: Account;
  openIssues: number;
  publicHref: string;
  demoMode: boolean;
  authConfigured: boolean;
}) {
  return (
    <Card className="relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,color-mix(in_oklab,var(--accent-primary)_16%,transparent),transparent_38%),linear-gradient(180deg,color-mix(in_oklab,var(--bg-elevated)_74%,transparent),transparent)]" />
      <div className="relative space-y-6">
        <div className="flex flex-wrap items-center gap-2">
          <Badge tone={tree.isPublic ? "accent" : "default"}>
            {tree.isPublic ? <Globe className="mr-1 h-3.5 w-3.5" /> : <Lock className="mr-1 h-3.5 w-3.5" />}
            {tree.isPublic ? "Public archive live" : "Private creator archive"}
          </Badge>
          <Badge tone="default">
            <Palette className="mr-1 h-3.5 w-3.5" />
            {labelize(tree.themeLayout)} + {labelize(tree.themeSkin)}
          </Badge>
          <Badge tone={openIssues ? "warning" : "success"}>
            <ShieldAlert className="mr-1 h-3.5 w-3.5" />
            {openIssues ? `${openIssues} open issue${openIssues === 1 ? "" : "s"}` : "No open issues"}
          </Badge>
          <Badge tone="default">
            <CalendarClock className="mr-1 h-3.5 w-3.5" />
            Updated {formatDistanceToNow(new Date(tree.updatedAt), { addSuffix: true })}
          </Badge>
        </div>

        <div className="grid gap-6 xl:grid-cols-[minmax(0,1.08fr)_22rem]">
          <div className="space-y-5">
            <div className="space-y-3">
              <p className="text-xs uppercase tracking-[0.2em] text-[var(--text-muted)]">
                Settings
              </p>
              <h2 className="display-name text-4xl font-semibold leading-tight text-[var(--text-primary)] md:text-5xl">
                Configure how the archive is named, shared, and protected.
              </h2>
              <p className="max-w-3xl text-base leading-7 text-[var(--text-secondary)] md:text-lg">
                Tree details, public sharing, account identity, and destructive controls all stay
                here so the archive can be managed with clear intent instead of scattered utilities.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <Link
                href="#tree-settings"
                className="inline-flex items-center justify-center rounded-[var(--radius-md)] bg-[var(--accent-primary)] px-4 py-2 text-sm font-semibold text-[var(--text-inverse)]"
              >
                Tree settings
              </Link>
              <Link
                href="/theme"
                className="inline-flex items-center justify-center rounded-[var(--radius-md)] border border-[var(--border-strong)] bg-[color-mix(in_oklab,var(--bg-surface)_88%,transparent)] px-4 py-2 text-sm font-semibold text-[var(--text-primary)]"
              >
                Open theme studio
              </Link>
              <Link
                href={tree.isPublic ? publicHref : "#tree-settings"}
                className="inline-flex items-center justify-center rounded-[var(--radius-md)] border border-[var(--border-default)] px-4 py-2 text-sm font-semibold text-[var(--text-secondary)] transition-colors hover:bg-[var(--accent-muted)] hover:text-[var(--text-primary)]"
              >
                {tree.isPublic ? "Preview public archive" : "Manage sharing"}
              </Link>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-3 xl:grid-cols-1">
            <OverviewMeta
              label="Archive owner"
              value={account.displayName}
              detail={account.email}
              icon={<UserCircle2 className="h-4 w-4" />}
            />
            <OverviewMeta
              label="Runtime"
              value={demoMode ? "Demo" : authConfigured ? "Live auth" : "Setup needed"}
              detail={
                demoMode
                  ? "Edits stay in the seeded demo archive."
                  : authConfigured
                    ? "Supabase auth and backend are configured."
                    : "Backend auth is not configured yet."
              }
              icon={<ShieldAlert className="h-4 w-4" />}
            />
          </div>
        </div>
      </div>
    </Card>
  );
}

function OverviewMeta({
  label,
  value,
  detail,
  icon,
}: {
  label: string;
  value: string;
  detail: string;
  icon: ReactNode;
}) {
  return (
    <div className="rounded-[var(--radius-md)] border border-[var(--border-default)] bg-[color-mix(in_oklab,var(--bg-surface)_88%,transparent)] p-4 backdrop-blur">
      <div className="flex items-center gap-2 text-[var(--text-muted)]">{icon}</div>
      <p className="mt-3 text-xs uppercase tracking-[0.16em] text-[var(--text-muted)]">{label}</p>
      <p className="mt-2 text-lg font-semibold text-[var(--text-primary)]">{value}</p>
      <p className="mt-2 text-sm leading-6 text-[var(--text-secondary)]">{detail}</p>
    </div>
  );
}

function labelize(value: string) {
  return value
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}
