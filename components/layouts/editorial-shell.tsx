import Link from "next/link";
import type { PropsWithChildren, ReactNode } from "react";

import type { Tree } from "@/lib/types";

type EditorialShellProps = PropsWithChildren<{
  tree: Tree;
  aside?: ReactNode;
  navItems: Array<{ href: string; label: string }>;
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
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4">
          <div>
            <p className="text-xs uppercase tracking-[0.16em] text-[var(--text-muted)]">{eyebrow}</p>
            <h1 className="text-2xl font-semibold text-[var(--text-primary)]">{tree.name}</h1>
          </div>
          <nav className="flex gap-4 text-sm text-[var(--text-secondary)]">
            {navItems.map((item) => (
              <Link key={item.href} href={item.href}>
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      </header>
      <div className="mx-auto grid max-w-7xl gap-6 px-4 py-8 lg:grid-cols-[minmax(0,1fr)_320px]">
        <main className="space-y-6">{children}</main>
        <aside className="space-y-6">{aside}</aside>
      </div>
    </div>
  );
}
