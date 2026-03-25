import type { PropsWithChildren, ReactNode } from "react";

import { SearchBar } from "@/components/foundation/search-bar";
import {
  MobileBottomNav,
  ShellNavLinks,
  type ShellNavItem,
} from "@/components/layouts/shell-nav";
import type { Tree } from "@/lib/types";

type ClassicShellProps = PropsWithChildren<{
  tree: Tree;
  sidebar?: ReactNode;
  detail?: ReactNode;
  navItems: ShellNavItem[];
  eyebrow?: string;
  showSearch?: boolean;
}>;

export function ClassicShell({
  tree,
  sidebar,
  detail,
  children,
  navItems,
  eyebrow = "Archive",
  showSearch = true,
}: ClassicShellProps) {
  return (
    <div className="min-h-screen pb-24 lg:pb-0">
      <div className="px-4 pt-4 lg:hidden">
        <div className="rounded-[var(--radius-lg)] border border-[var(--border-default)] bg-[var(--bg-surface)] p-4">
          <p className="text-xs uppercase tracking-[0.16em] text-[var(--text-muted)]">
            {eyebrow}
          </p>
          <h1 className="mt-2 text-2xl font-semibold text-[var(--text-primary)]">
            {tree.name}
          </h1>
        </div>
      </div>
      <div className="hidden min-h-screen gap-4 p-4 lg:grid lg:grid-cols-[260px_1fr_420px]">
        <aside className="rounded-[var(--radius-lg)] border border-[var(--border-default)] bg-[var(--bg-surface)] p-4">
          <div className="space-y-4">
            <div>
              <p className="text-xs uppercase tracking-[0.16em] text-[var(--text-muted)]">
                {eyebrow}
              </p>
              <h1 className="mt-2 text-2xl font-semibold text-[var(--text-primary)]">
                {tree.name}
              </h1>
            </div>
            <ShellNavLinks items={navItems} stacked className="text-sm" />
            {showSearch ? <SearchBar /> : null}
            {sidebar}
          </div>
        </aside>
        <main className="space-y-4">{children}</main>
        <section className="space-y-4">{detail}</section>
      </div>
      <div className="grid gap-4 px-4 py-4 lg:hidden">
        <main className="space-y-4">{children}</main>
        {detail ? <section className="space-y-4">{detail}</section> : null}
      </div>
      <MobileBottomNav title={`${tree.name} navigation`} items={navItems}>
        <div className="space-y-4">
          {showSearch ? <SearchBar /> : null}
          {sidebar}
        </div>
      </MobileBottomNav>
    </div>
  );
}
