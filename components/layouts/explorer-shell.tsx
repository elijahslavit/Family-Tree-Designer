import Link from "next/link";
import type { PropsWithChildren, ReactNode } from "react";

import type { Tree } from "@/lib/types";

type ExplorerShellProps = PropsWithChildren<{
  tree: Tree;
  drawer?: ReactNode;
  navItems: Array<{ href: string; label: string }>;
  eyebrow?: string;
}>;

export function ExplorerShell({
  tree,
  drawer,
  children,
  navItems,
  eyebrow = "Explorer",
}: ExplorerShellProps) {
  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-10 flex items-center justify-between border-b border-[var(--border-default)] bg-[var(--bg-primary)] px-4 py-3">
        <div>
          <p className="text-xs uppercase tracking-[0.16em] text-[var(--text-muted)]">{eyebrow}</p>
          <h1 className="text-xl font-semibold text-[var(--text-primary)]">{tree.name}</h1>
        </div>
        <nav className="flex gap-4 text-sm text-[var(--text-secondary)]">
          {navItems.map((item) => (
            <Link key={item.href} href={item.href}>
              {item.label}
            </Link>
          ))}
        </nav>
      </header>
      <div className="grid gap-4 p-4 lg:grid-cols-[minmax(0,1fr)_360px]">
        <main>{children}</main>
        <aside>{drawer}</aside>
      </div>
    </div>
  );
}
