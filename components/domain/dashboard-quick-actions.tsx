import Link from "next/link";
import {
  ArrowUpRight,
  FolderInput,
  Network,
  Palette,
  Share2,
  UserRoundPlus,
} from "lucide-react";

import { Badge } from "@/components/foundation/badge";
import { Card } from "@/components/foundation/card";
import type { ImportJob, ReviewIssue, Tree } from "@/lib/types";

type DashboardQuickActionsProps = {
  tree: Tree;
  latestImportJob: ImportJob | null;
  openIssues: ReviewIssue[];
  publicHref: string;
};

export function DashboardQuickActions({
  tree,
  latestImportJob,
  openIssues,
  publicHref,
}: DashboardQuickActionsProps) {
  const actions = [
    {
      href: "/person/new",
      icon: <UserRoundPlus className="h-5 w-5" />,
      title: "Add the next person",
      body: "Open the full creator flow for biography, dates, places, and relationships.",
    },
    {
      href: "/import",
      icon: <FolderInput className="h-5 w-5" />,
      title: "Import or review GEDCOM",
      body: "Upload another branch, inspect staged issues, and confirm imports atomically.",
    },
    {
      href: "/canvas",
      icon: <Network className="h-5 w-5" />,
      title: "Explore the graph",
      body: "Jump into the live canvas to inspect connections and branch coverage visually.",
    },
    {
      href: tree.isPublic ? publicHref : "/settings",
      icon: <Share2 className="h-5 w-5" />,
      title: tree.isPublic ? "Open the public archive" : "Turn on sharing",
      body: tree.isPublic
        ? "Check the viewer-facing experience with the active slug and share token."
        : "Manage slug, sharing, and token controls before you send the archive out.",
    },
    {
      href: "/theme",
      icon: <Palette className="h-5 w-5" />,
      title: "Adjust the presentation",
      body: "Tune layout and skin choices so the archive feels right before sharing it.",
    },
  ];

  return (
    <div className="space-y-4">
      <Card className="space-y-4">
        <div className="space-y-2">
          <p className="text-xs uppercase tracking-[0.18em] text-[var(--text-muted)]">
            Quick actions
          </p>
          <h2 className="text-3xl font-semibold text-[var(--text-primary)]">Move the archive forward</h2>
          <p className="text-sm leading-6 text-[var(--text-secondary)]">
            The fastest creator flows stay one click away here: adding people, importing data,
            checking sharing, and tuning presentation.
          </p>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          {actions.map((action) => (
            <Link
              key={action.title}
              href={action.href}
              className="group rounded-[var(--radius-lg)] border border-[var(--border-default)] bg-[color-mix(in_oklab,var(--bg-surface)_88%,transparent)] p-4 transition-colors hover:border-[var(--border-strong)] hover:bg-[var(--accent-muted)]/30"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="rounded-full bg-[color-mix(in_oklab,var(--accent-primary)_14%,transparent)] p-2 text-[var(--accent-text)]">
                  {action.icon}
                </div>
                <ArrowUpRight className="h-4 w-4 text-[var(--text-muted)] transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </div>
              <p className="mt-4 text-lg font-semibold text-[var(--text-primary)]">{action.title}</p>
              <p className="mt-2 text-sm leading-6 text-[var(--text-secondary)]">{action.body}</p>
            </Link>
          ))}
        </div>
      </Card>

      <Card className="space-y-4">
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-2">
            <p className="text-xs uppercase tracking-[0.18em] text-[var(--text-muted)]">
              Archive pulse
            </p>
            <h3 className="text-2xl font-semibold text-[var(--text-primary)]">What needs attention next</h3>
          </div>
          <Badge tone={openIssues.length ? "warning" : "success"}>
            {openIssues.length ? `${openIssues.length} open issue${openIssues.length === 1 ? "" : "s"}` : "All clear"}
          </Badge>
        </div>

        <div className="grid gap-3 md:grid-cols-2">
          <div className="rounded-[var(--radius-md)] border border-[var(--border-default)] bg-[color-mix(in_oklab,var(--bg-elevated)_74%,transparent)] p-4">
            <p className="text-xs uppercase tracking-[0.16em] text-[var(--text-muted)]">Latest import</p>
            <p className="mt-2 text-lg font-semibold text-[var(--text-primary)]">
              {latestImportJob ? latestImportJob.fileName : "No import staged recently"}
            </p>
            <p className="mt-2 text-sm leading-6 text-[var(--text-secondary)]">
              {latestImportJob
                ? `Most recent job is ${latestImportJob.status}. Open import review to inspect counts, issues, or confirmation state.`
                : "The import workspace is ready whenever you want to stage another GEDCOM branch."}
            </p>
          </div>
          <div className="rounded-[var(--radius-md)] border border-[var(--border-default)] bg-[color-mix(in_oklab,var(--bg-elevated)_74%,transparent)] p-4">
            <p className="text-xs uppercase tracking-[0.16em] text-[var(--text-muted)]">Review backlog</p>
            <p className="mt-2 text-lg font-semibold text-[var(--text-primary)]">
              {openIssues[0]?.description ?? "No unresolved review issues"}
            </p>
            <p className="mt-2 text-sm leading-6 text-[var(--text-secondary)]">
              {openIssues.length
                ? "Jump into import review and resolve the remaining conflicts before your next share pass."
                : "The demo archive currently has no unresolved review work. Keep adding structure and content."}
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}
