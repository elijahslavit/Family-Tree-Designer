import { BookOpen, GitBranch, Home, Menu, ShieldCheck, UsersRound } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";

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
  children,
}: {
  brand: ShowcaseBrand;
  basePath: string;
  viewerLabel: string;
  children: ReactNode;
}) {
  const nav = [
    { href: basePath, label: "Welcome", icon: Home },
    { href: `${basePath}/tree`, label: "Family tree", icon: GitBranch },
    { href: `${basePath}/people`, label: "People", icon: UsersRound },
    { href: `${basePath}/stories`, label: "Stories", icon: BookOpen },
  ];

  return (
    <div
      className="min-h-screen bg-[#f8f4ea] text-[#2f2a22]"
      style={{ "--showcase-accent": brand.accent } as React.CSSProperties}
    >
      <a
        href="#showcase-content"
        className="sr-only z-50 rounded bg-white px-4 py-2 focus:not-sr-only focus:fixed focus:left-4 focus:top-4"
      >
        Skip to family story
      </a>
      <header className="sticky top-0 z-30 border-b border-[#3c3325]/10 bg-[#fbf8f0]/95 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
          <Link href={basePath} className="flex min-w-0 items-center gap-3">
            <span className="relative h-10 w-10 shrink-0 overflow-hidden rounded-full border border-[#3c3325]/15 bg-white">
              <Image
                src={brand.genealogistLogoPath}
                alt=""
                fill
                sizes="40px"
                className="object-cover"
              />
            </span>
            <span className="min-w-0">
              <span className="block truncate font-serif text-lg font-semibold leading-tight">
                {brand.familyName}
              </span>
              <span className="block truncate text-[10px] font-semibold uppercase tracking-[0.16em] text-[#766c5c]">
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
                  className="flex items-center gap-2 rounded-full px-3 py-2 text-sm font-medium text-[#665d50] transition-colors hover:bg-[#eee6d7] hover:text-[#2f2a22]"
                >
                  <Icon className="h-4 w-4" />
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-2">
            <span className="hidden items-center gap-2 rounded-full border border-[#3c3325]/10 bg-white px-3 py-2 text-xs text-[#665d50] lg:flex">
              <ShieldCheck className="h-3.5 w-3.5 text-[#526b57]" />
              {viewerLabel}
            </span>
            <details className="relative md:hidden">
              <summary className="grid h-10 w-10 cursor-pointer list-none place-items-center rounded-full border border-[#3c3325]/10 bg-white" aria-label="Open navigation">
                <Menu className="h-4 w-4" />
              </summary>
              <nav className="absolute right-0 top-12 grid w-52 gap-1 rounded-xl border border-[#3c3325]/10 bg-white p-2 shadow-xl">
                {nav.map((item) => (
                  <Link key={item.href} href={item.href} className="rounded-lg px-3 py-2 text-sm hover:bg-[#f3ede2]">
                    {item.label}
                  </Link>
                ))}
              </nav>
            </details>
          </div>
        </div>
      </header>

      <main id="showcase-content">{children}</main>

      <footer className="border-t border-[#3c3325]/10 bg-[#f1eadc]">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-8 text-xs leading-5 text-[#706657] sm:px-6 md:flex-row md:items-center md:justify-between lg:px-8">
          <p>This private family archive is shared only with invited recipients.</p>
          <p>Presented by {brand.genealogistName} · Powered by Family Tree Designer</p>
        </div>
      </footer>
    </div>
  );
}
