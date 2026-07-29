import { productConfig } from "@/lib/config/product";
import { ArrowLeft, BookOpen, GitBranch, Home, Menu, ShieldCheck, UsersRound } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";

import {
  getShowcaseTheme,
  showcaseThemeStyle,
  type ShowcaseThemeId,
} from "@/lib/themes/showcase-themes";

export type ShowcaseBrand = {
  familyName: string;
  genealogistName: string;
  genealogistLogoPath: string;
  accent: string;
};

export function ShowcaseShell({
  brand,
  basePath,
  viewerLabel,
  themeId,
  hasStories = false,
  chrome = "standard",
  children,
}: {
  brand: ShowcaseBrand;
  basePath: string;
  viewerLabel: string;
  themeId?: ShowcaseThemeId;
  /**
   * Whether any story is published. A freshly imported archive has none, and
   * offering the family a Stories link that leads to an empty page is worse
   * than not offering it at all.
   */
  hasStories?: boolean;
  /** Immersive hides archive header/footer for full-viewport tree viewing. */
  chrome?: "standard" | "immersive";
  children: ReactNode;
}) {
  const theme = getShowcaseTheme(themeId);
  const immersive = chrome === "immersive";

  const nav = [
    { href: basePath, label: "Welcome", icon: Home },
    { href: `${basePath}/tree`, label: "Family tree", icon: GitBranch },
    { href: `${basePath}/people`, label: "People", icon: UsersRound },
    ...(hasStories
      ? [{ href: `${basePath}/stories`, label: "Stories", icon: BookOpen }]
      : []),
  ];

  return (
    <div
      data-skin={theme.skin}
      data-showcase-theme={theme.id}
      data-showcase-chrome={chrome}
      style={showcaseThemeStyle(theme)}
      className={
        immersive
          ? "relative min-h-dvh bg-[var(--sc-bg)] text-[var(--sc-ink)]"
          : "min-h-screen bg-[var(--sc-bg)] text-[var(--sc-ink)]"
      }
    >
      <a
        href="#showcase-content"
        className="sr-only z-50 rounded bg-[var(--sc-elevated)] px-4 py-2 focus:not-sr-only focus:fixed focus:left-4 focus:top-4"
      >
        Skip to family story
      </a>

      {immersive ? (
        <Link
          href={basePath}
          className="absolute left-3 top-3 z-40 inline-flex items-center gap-2 rounded-full border border-[var(--sc-border)] bg-[var(--sc-elevated)]/90 px-3 py-2 text-xs font-medium text-[var(--sc-ink-secondary)] shadow-[var(--sc-shadow)] backdrop-blur transition-colors hover:bg-[var(--sc-accent-wash)] hover:text-[var(--sc-ink)]"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Back to archive
        </Link>
      ) : (
        <header className="sticky top-0 z-30 border-b border-[var(--sc-border)] bg-[var(--sc-header)] backdrop-blur">
          <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
            <Link href={basePath} className="flex min-w-0 items-center gap-3">
              <span className="relative h-10 w-10 shrink-0 overflow-hidden rounded-full border border-[var(--sc-border-strong)] bg-[var(--sc-elevated)]">
                <Image
                  src={brand.genealogistLogoPath}
                  alt=""
                  fill
                  sizes="40px"
                  className="object-cover"
                />
              </span>
              <span className="min-w-0">
                <span className="block truncate font-[family-name:var(--sc-display-font)] text-lg font-semibold leading-tight">
                  {brand.familyName}
                </span>
                <span className="block truncate text-[10px] font-semibold uppercase tracking-[0.16em] text-[var(--sc-ink-muted)]">
                  Curated by {brand.genealogistName}
                </span>
              </span>
            </Link>

            <nav aria-label="Family archive" className="hidden items-center gap-1 md:flex">
              {nav.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="flex items-center gap-2 rounded-full px-3 py-2 text-sm font-medium text-[var(--sc-ink-secondary)] transition-colors hover:bg-[var(--sc-accent-wash)] hover:text-[var(--sc-ink)]"
                  >
                    <Icon className="h-4 w-4" />
                    {item.label}
                  </Link>
                );
              })}
            </nav>

            <div className="flex items-center gap-2">
              <span className="hidden items-center gap-2 rounded-full border border-[var(--sc-border)] bg-[var(--sc-elevated)] px-3 py-2 text-xs text-[var(--sc-ink-secondary)] lg:flex">
                <ShieldCheck className="h-3.5 w-3.5 text-[var(--sc-accent)]" />
                {viewerLabel}
              </span>
              <details className="relative md:hidden">
                <summary
                  className="grid h-10 w-10 cursor-pointer list-none place-items-center rounded-full border border-[var(--sc-border)] bg-[var(--sc-elevated)]"
                  aria-label="Open navigation"
                >
                  <Menu className="h-4 w-4" />
                </summary>
                <nav className="absolute right-0 top-12 grid w-52 gap-1 rounded-xl border border-[var(--sc-border)] bg-[var(--sc-elevated)] p-2 shadow-[var(--sc-shadow)]">
                  {nav.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className="rounded-lg px-3 py-2 text-sm hover:bg-[var(--sc-accent-wash)]"
                    >
                      {item.label}
                    </Link>
                  ))}
                </nav>
              </details>
            </div>
          </div>
        </header>
      )}

      <main id="showcase-content">{children}</main>

      {immersive ? null : (
        <footer className="border-t border-[var(--sc-border)] bg-[var(--sc-footer)]">
          <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-8 text-xs leading-5 text-[var(--sc-ink-muted)] sm:px-6 md:flex-row md:items-center md:justify-between lg:px-8">
            <p>This private family archive is shared only with invited recipients.</p>
            <p>Presented by {brand.genealogistName} · Powered by {productConfig.name}</p>
          </div>
        </footer>
      )}
    </div>
  );
}
