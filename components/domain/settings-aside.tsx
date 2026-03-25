import Link from "next/link";
import { ArrowUpRight, Globe, ShieldCheck, TriangleAlert, Wand2 } from "lucide-react";

import { Badge } from "@/components/foundation/badge";
import { Card } from "@/components/foundation/card";
import type { Tree } from "@/lib/types";

export function SettingsAside({
  tree,
  openIssues,
  publicHref,
  demoMode,
  authConfigured,
}: {
  tree: Tree;
  openIssues: number;
  publicHref: string;
  demoMode: boolean;
  authConfigured: boolean;
}) {
  return (
    <div className="space-y-4">
      <Card className="space-y-4">
        <div className="space-y-2">
          <p className="text-xs uppercase tracking-[0.18em] text-[var(--text-muted)]">
            Settings map
          </p>
          <h2 className="text-2xl font-semibold text-[var(--text-primary)]">Jump to the right control</h2>
        </div>
        <div className="grid gap-2">
          <SettingsJump href="#tree-settings" label="Tree settings" detail="Name, description, sharing, slug, token" />
          <SettingsJump href="#account-settings" label="Account settings" detail="Display name, email, sign-in context" />
          <SettingsJump href="#danger-zone" label="Danger zone" detail="Delete gating and demo reset controls" />
        </div>
      </Card>

      <Card className="space-y-4">
        <div className="flex items-start justify-between gap-3">
          <div className="space-y-2">
            <p className="text-xs uppercase tracking-[0.18em] text-[var(--text-muted)]">
              Archive state
            </p>
            <h2 className="text-2xl font-semibold text-[var(--text-primary)]">Current status</h2>
          </div>
          <Badge tone={tree.isPublic ? "accent" : "default"}>
            {tree.isPublic ? "Live" : "Private"}
          </Badge>
        </div>

        <div className="grid gap-3">
          <div className="rounded-[var(--radius-md)] border border-[var(--border-default)] bg-[color-mix(in_oklab,var(--bg-elevated)_74%,transparent)] p-4">
            <div className="flex items-center justify-between gap-3">
              <p className="text-sm font-semibold text-[var(--text-primary)]">Public archive</p>
              <Globe className="h-4 w-4 text-[var(--accent-text)]" />
            </div>
            <p className="mt-2 text-sm leading-6 text-[var(--text-secondary)]">
              {tree.isPublic
                ? "The public tree is available with the active slug and token."
                : "The archive is private until sharing is enabled."}
            </p>
            <Link
              href={tree.isPublic ? publicHref : "#tree-settings"}
              className="mt-3 inline-flex items-center gap-2 text-sm font-semibold text-[var(--accent-text)]"
            >
              {tree.isPublic ? "Open shared archive" : "Configure sharing"}
              <ArrowUpRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          <div className="rounded-[var(--radius-md)] border border-[var(--border-default)] bg-[color-mix(in_oklab,var(--bg-elevated)_74%,transparent)] p-4">
            <div className="flex items-center justify-between gap-3">
              <p className="text-sm font-semibold text-[var(--text-primary)]">Runtime and auth</p>
              {demoMode || !authConfigured ? (
                <TriangleAlert className="h-4 w-4 text-[var(--color-warning)]" />
              ) : (
                <ShieldCheck className="h-4 w-4 text-[var(--color-success)]" />
              )}
            </div>
            <p className="mt-2 text-sm leading-6 text-[var(--text-secondary)]">
              {demoMode
                ? "The app is in demo mode, so resets are available and deletion remains gated."
                : authConfigured
                  ? "The live auth path is configured for persisted account and tree settings."
                  : "Finish backend auth setup to unlock the full production settings path."}
            </p>
          </div>

          <div className="rounded-[var(--radius-md)] border border-[var(--border-default)] bg-[color-mix(in_oklab,var(--bg-elevated)_74%,transparent)] p-4">
            <div className="flex items-center justify-between gap-3">
              <p className="text-sm font-semibold text-[var(--text-primary)]">Import review</p>
              <Badge tone={openIssues ? "warning" : "success"}>
                {openIssues ? `${openIssues} open` : "Clear"}
              </Badge>
            </div>
            <p className="mt-2 text-sm leading-6 text-[var(--text-secondary)]">
              {openIssues
                ? "There are unresolved import issues waiting in the review workspace."
                : "No open import issues are currently blocking the archive."}
            </p>
            <Link
              href="/import"
              className="mt-3 inline-flex items-center gap-2 text-sm font-semibold text-[var(--accent-text)]"
            >
              Review imports
              <ArrowUpRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      </Card>

      <Card className="space-y-3">
        <div className="flex items-center gap-2 text-[var(--accent-text)]">
          <Wand2 className="h-4 w-4" />
          <p className="text-xs uppercase tracking-[0.18em]">Presentation shortcut</p>
        </div>
        <p className="text-sm leading-6 text-[var(--text-secondary)]">
          Theme choice sits beside settings in the spec. Jump there whenever the archive needs a
          different visual tone before you share it.
        </p>
        <Link
          href="/theme"
          className="inline-flex items-center gap-2 text-sm font-semibold text-[var(--accent-text)]"
        >
          Open theme studio
          <ArrowUpRight className="h-3.5 w-3.5" />
        </Link>
      </Card>
    </div>
  );
}

function SettingsJump({
  href,
  label,
  detail,
}: {
  href: string;
  label: string;
  detail: string;
}) {
  return (
    <Link
      href={href}
      className="rounded-[var(--radius-md)] border border-[var(--border-default)] bg-[color-mix(in_oklab,var(--bg-surface)_88%,transparent)] px-4 py-3 transition-colors hover:border-[var(--border-strong)] hover:bg-[var(--accent-muted)]/25"
    >
      <p className="text-sm font-semibold text-[var(--text-primary)]">{label}</p>
      <p className="mt-1 text-sm leading-6 text-[var(--text-secondary)]">{detail}</p>
    </Link>
  );
}
