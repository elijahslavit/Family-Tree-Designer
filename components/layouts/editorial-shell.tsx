import type { PropsWithChildren, ReactNode } from "react";

import { MobileNavDrawer, ShellNavLinks, type ShellNavItem } from "@/components/layouts/shell-nav";
import type { Tree } from "@/lib/types";
import { cn } from "@/lib/utils/cn";

type EditorialShellProps = PropsWithChildren<{
  tree: Tree;
  aside?: ReactNode;
  navItems: ShellNavItem[];
  eyebrow?: string;
}>;

export function EditorialShell({
  tree,
  aside,
  children,
  navItems,
  eyebrow = "Archive",
}: EditorialShellProps) {
  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-20 border-b border-[var(--border-default)] bg-[color-mix(in_oklab,var(--bg-primary)_90%,transparent)] backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4">
          <div>
            <p className="text-xs uppercase tracking-[0.16em] text-[var(--text-muted)]">{eyebrow}</p>
            <h1 className="text-2xl font-semibold text-[var(--text-primary)]">{tree.name}</h1>
          </div>
          <div className="hidden md:block">
            <ShellNavLinks items={navItems} className="justify-end" />
          </div>
          <div className="md:hidden">
            <MobileNavDrawer title={`${tree.name} navigation`} items={navItems} />
          </div>
        </div>
      </header>
      <div
        className={cn(
          "mx-auto grid max-w-7xl gap-6 px-4 py-8",
          aside ? "lg:grid-cols-[minmax(0,1fr)_320px]" : "grid-cols-1",
        )}
      >
        <main className="min-w-0 space-y-6">{children}</main>
        {aside ? <aside className="space-y-6">{aside}</aside> : null}
      </div>
    </div>
  );
}
