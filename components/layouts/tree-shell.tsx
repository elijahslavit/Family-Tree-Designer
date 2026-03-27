import Link from "next/link";
import type { ReactNode } from "react";

import { ClassicShell } from "@/components/layouts/classic-shell";
import { EditorialShell } from "@/components/layouts/editorial-shell";
import { ExplorerShell } from "@/components/layouts/explorer-shell";
import type { Tree } from "@/lib/types";
import { cn } from "@/lib/utils/cn";

type ShellProps = {
  tree: Tree;
  main: ReactNode;
  detail?: ReactNode;
  sidebar?: ReactNode;
  variant?: "default" | "profile";
  activePath?: string;
};

const creatorNavItems = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/theme", label: "Theme" },
  { href: "/import", label: "Family Upload" },
  { href: "/canvas", label: "Canvas" },
];

export function CreatorTreeShell({
  tree,
  main,
  detail,
  activePath,
}: ShellProps) {
  return (
    <div className="min-h-screen bg-[var(--creator-bg)]">
      <header className="border-b border-[var(--creator-border)] bg-[var(--creator-surface)]">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
          <div className="space-y-0.5">
            <p className="text-[10px] uppercase tracking-[0.18em] text-[var(--creator-text-muted)]">
              Family Tree Designer
            </p>
            <h1 className="text-lg font-semibold text-[var(--creator-text)]">{tree.name}</h1>
          </div>
          <nav className="flex items-center gap-5">
            {creatorNavItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                aria-current={activePath === item.href ? "page" : undefined}
                className={cn(
                  "text-sm transition-colors",
                  activePath === item.href
                    ? "font-medium text-[var(--creator-text)]"
                    : "text-[var(--creator-text-muted)] hover:text-[var(--creator-text)]",
                )}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      </header>

      <div
        className={cn(
          "mx-auto grid max-w-6xl gap-6 px-4 py-6",
          detail ? "lg:grid-cols-[minmax(0,1fr)_320px]" : "grid-cols-1",
        )}
      >
        <main className="space-y-6">{main}</main>
        {detail ? <aside className="space-y-6">{detail}</aside> : null}
      </div>
    </div>
  );
}

export function PublicTreeShell({
  tree,
  main,
  detail,
  sidebar,
  variant = "default",
}: ShellProps) {
  const share = `share=${tree.shareToken}`;
  const navItems = [
    { href: `/t/${tree.slug}?${share}`, label: "Directory" },
    { href: `/t/${tree.slug}/lineages?${share}`, label: "Lineages" },
    { href: `/t/${tree.slug}/canvas?${share}`, label: "Canvas" },
  ];

  if (tree.themeLayout === "classic") {
    return (
      <ClassicShell
        tree={tree}
        sidebar={sidebar}
        detail={detail}
        navItems={navItems}
        eyebrow="Shared archive"
      >
        {main}
      </ClassicShell>
    );
  }

  if (tree.themeLayout === "explorer" && variant === "profile") {
    return (
      <EditorialShell tree={tree} aside={detail} navItems={navItems} eyebrow="Shared archive">
        {main}
      </EditorialShell>
    );
  }

  if (tree.themeLayout === "explorer") {
    return (
      <ExplorerShell
        tree={tree}
        drawer={detail}
        navItems={navItems}
        eyebrow="Shared archive"
      >
        {main}
      </ExplorerShell>
    );
  }

  return (
    <EditorialShell tree={tree} aside={detail} navItems={navItems} eyebrow="Shared archive">
      {main}
    </EditorialShell>
  );
}
