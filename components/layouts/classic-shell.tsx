import Link from "next/link";
import type { PropsWithChildren, ReactNode } from "react";

import { SearchBar } from "@/components/foundation/search-bar";
import type { Tree } from "@/lib/types";

type ClassicShellProps = PropsWithChildren<{
  tree: Tree;
  sidebar?: ReactNode;
  detail?: ReactNode;
  navItems: Array<{ href: string; label: string }>;
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
    <div className="grid min-h-screen gap-4 p-4 lg:grid-cols-[260px_1fr_420px]">
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
          <nav className="grid gap-2 text-sm text-[var(--text-secondary)]">
            {navItems.map((item) => (
              <Link key={item.href} href={item.href}>
                {item.label}
              </Link>
            ))}
          </nav>
          {showSearch ? <SearchBar /> : null}
          {sidebar}
        </div>
      </aside>
      <main className="space-y-4">{children}</main>
      <section className="space-y-4">{detail}</section>
    </div>
  );
}
