import Link from "next/link";
import { ArrowUpRight, Globe, ShieldAlert, ShieldCheck, Sparkles } from "lucide-react";

import { Badge } from "@/components/foundation/badge";
import { Card } from "@/components/foundation/card";
import type { ReviewIssue, Tree } from "@/lib/types";

type DashboardAsideProps = {
  tree: Tree;
  lineages: Array<{
    id: string;
    name: string;
    description?: string | null;
    memberCount: number;
    firstPersonId: string | null;
    firstPersonName: string | null;
    latestPersonName: string | null;
  }>;
  openIssues: ReviewIssue[];
  publicHref: string;
};

export function DashboardAside({
  tree,
  lineages,
  openIssues,
  publicHref,
}: DashboardAsideProps) {
  return (
    <div className="space-y-4">
      <Card className="space-y-4">
        <div className="space-y-2">
          <p className="text-xs uppercase tracking-[0.18em] text-[var(--text-muted)]">
            Archive status
          </p>
          <h2 className="text-2xl font-semibold text-[var(--text-primary)]">Sharing and quality</h2>
        </div>

        <div className="grid gap-3">
          <div className="rounded-[var(--radius-md)] border border-[var(--border-default)] bg-[color-mix(in_oklab,var(--bg-elevated)_74%,transparent)] p-4">
            <div className="flex items-center justify-between gap-3">
              <p className="text-sm font-semibold text-[var(--text-primary)]">Public archive</p>
              <Badge tone={tree.isPublic ? "accent" : "default"}>
                {tree.isPublic ? "Live" : "Private"}
              </Badge>
            </div>
            <p className="mt-2 text-sm leading-6 text-[var(--text-secondary)]">
              {tree.isPublic
                ? "The shared tree is available through the active slug and token."
                : "The creator workspace is private until you turn sharing on in Settings."}
            </p>
            <Link
              href={tree.isPublic ? publicHref : "/settings"}
              className="mt-3 inline-flex items-center gap-2 text-sm font-semibold text-[var(--accent-text)]"
            >
              {tree.isPublic ? "Open shared archive" : "Manage sharing"}
              <ArrowUpRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          <div className="rounded-[var(--radius-md)] border border-[var(--border-default)] bg-[color-mix(in_oklab,var(--bg-elevated)_74%,transparent)] p-4">
            <div className="flex items-center justify-between gap-3">
              <p className="text-sm font-semibold text-[var(--text-primary)]">Review quality</p>
              {openIssues.length ? (
                <ShieldAlert className="h-4 w-4 text-[var(--color-warning)]" />
              ) : (
                <ShieldCheck className="h-4 w-4 text-[var(--color-success)]" />
              )}
            </div>
            <p className="mt-2 text-sm leading-6 text-[var(--text-secondary)]">
              {openIssues.length
                ? `${openIssues.length} open review issue${openIssues.length === 1 ? "" : "s"} still need attention.`
                : "No open review issues are blocking the archive right now."}
            </p>
            <Link
              href={openIssues.length ? "/import" : "/settings"}
              className="mt-3 inline-flex items-center gap-2 text-sm font-semibold text-[var(--accent-text)]"
            >
              {openIssues.length ? "Open import review" : "Open archive settings"}
              <ArrowUpRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      </Card>

      <Card className="space-y-4">
        <div className="flex items-start justify-between gap-3">
          <div className="space-y-2">
            <p className="text-xs uppercase tracking-[0.18em] text-[var(--text-muted)]">
              Lineages
            </p>
            <h2 className="text-2xl font-semibold text-[var(--text-primary)]">Featured descent paths</h2>
          </div>
          <Badge tone="default">{lineages.length} total</Badge>
        </div>

        <div className="grid gap-3">
          {lineages.slice(0, 4).map((lineage) => (
            <div
              key={lineage.id}
              className="rounded-[var(--radius-md)] border border-[var(--border-default)] bg-[color-mix(in_oklab,var(--bg-surface)_88%,transparent)] p-4"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-lg font-semibold text-[var(--text-primary)]">{lineage.name}</p>
                  <p className="mt-1 text-sm leading-6 text-[var(--text-secondary)]">
                    {lineage.description || "Named descent path ready for browsing and canvas highlighting."}
                  </p>
                </div>
                <Badge tone="accent">{lineage.memberCount} members</Badge>
              </div>
              <div className="mt-3 flex flex-wrap gap-2">
                {lineage.firstPersonName ? <Badge tone="default">{lineage.firstPersonName}</Badge> : null}
                {lineage.latestPersonName ? <Badge tone="default">{lineage.latestPersonName}</Badge> : null}
              </div>
              <div className="mt-3 flex flex-wrap gap-3 text-sm">
                <Link href="/lineages" className="inline-flex items-center gap-2 text-[var(--accent-text)]">
                  Browse lineages
                  <ArrowUpRight className="h-3.5 w-3.5" />
                </Link>
                {lineage.firstPersonId ? (
                  <Link href={`/canvas?person=${lineage.firstPersonId}&lineage=${lineage.id}&depth=3`} className="inline-flex items-center gap-2 text-[var(--accent-text)]">
                    Highlight in canvas
                    <Sparkles className="h-3.5 w-3.5" />
                  </Link>
                ) : null}
              </div>
            </div>
          ))}
        </div>
      </Card>

      <Card className="space-y-3">
        <div className="flex items-center gap-2 text-[var(--accent-text)]">
          <Globe className="h-4 w-4" />
          <p className="text-xs uppercase tracking-[0.18em]">Viewer perspective</p>
        </div>
        <p className="text-sm leading-6 text-[var(--text-secondary)]">
          Open the public archive after major edits so you can verify privacy masking, lineages,
          directory order, and presentation in the shared experience.
        </p>
        <Link
          href={tree.isPublic ? publicHref : "/settings"}
          className="inline-flex items-center gap-2 text-sm font-semibold text-[var(--accent-text)]"
        >
          {tree.isPublic ? "Review public experience" : "Enable sharing first"}
          <ArrowUpRight className="h-3.5 w-3.5" />
        </Link>
      </Card>
    </div>
  );
}
