import Link from "next/link";
import type { ReactNode } from "react";

import { getContact } from "@/lib/config/contact";
import { productConfig } from "@/lib/config/product";

const nav = [
  { href: "/styles", label: "Presentation styles" },
  { href: "/how-it-works", label: "How it works" },
];

/** The engraved monogram used in place of a logo file. */
function Monogram() {
  return (
    <span
      aria-hidden
      className="grid h-11 w-11 shrink-0 place-items-center rounded-sm border border-[#a67c52]/50 bg-[#f5f1e8] font-serif text-[15px] leading-none text-[#6b3e36] shadow-[inset_0_0_0_1px_rgba(166,124,82,0.25)]"
    >
      H&amp;H
    </span>
  );
}

export function MarketingShell({ children }: { children: ReactNode }) {
  const contact = getContact();

  return (
    <div className="min-h-screen bg-[#f5f1e8] text-[#26231e]">
      <a
        href="#main"
        className="sr-only z-50 rounded bg-white px-4 py-2 focus:not-sr-only focus:fixed focus:left-4 focus:top-4"
      >
        Skip to content
      </a>

      <header className="border-b border-[#a67c52]/30 bg-[#efe7d6]">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
          <Link href="/" className="flex items-center gap-3">
            <Monogram />
            <span className="min-w-0">
              <span className="block font-serif text-lg font-semibold tracking-[0.06em] text-[#3a3026]">
                {productConfig.name}
              </span>
              <span className="block text-[9px] font-semibold uppercase tracking-[0.22em] text-[#8a7a62]">
                {productConfig.tagline}
              </span>
            </span>
          </Link>

          <nav aria-label="Main" className="flex items-center gap-5">
            {nav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="hidden text-sm font-medium text-[#5c5142] underline-offset-4 hover:underline sm:block"
              >
                {item.label}
              </Link>
            ))}
            <Link
              href="/sign-in"
              className="text-sm font-semibold text-[#54493a] underline decoration-[#a67c52]/60 underline-offset-4 hover:decoration-[#6b3e36]"
            >
              Sign in
            </Link>
          </nav>
        </div>
      </header>

      <main id="main">{children}</main>

      <footer className="border-t border-[#a67c52]/30 bg-[#efe7d6]">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 py-12 sm:px-6 lg:grid-cols-[1.4fr_1fr_1fr] lg:px-8">
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <Monogram />
              <span className="font-serif text-lg font-semibold tracking-[0.06em] text-[#3a3026]">
                {productConfig.name}
              </span>
            </div>
            <p className="max-w-sm text-sm leading-6 text-[#6e6353]">
              We turn a genealogist&apos;s finished research into a private family
              archive worth handing over.
            </p>
          </div>

          <div className="space-y-3 text-sm">
            <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#8a7a62]">
              For genealogists
            </p>
            {nav.map((item) => (
              <Link key={item.href} href={item.href} className="block text-[#5c5142] hover:underline">
                {item.label}
              </Link>
            ))}
            <Link href="/sign-in" className="block text-[#5c5142] hover:underline">
              Sign in
            </Link>
          </div>

          <div className="space-y-3 text-sm">
            <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#8a7a62]">
              For families
            </p>
            <Link href="/for-families" className="block text-[#5c5142] hover:underline">
              Have your own history made
            </Link>
            <p className="text-xs leading-5 text-[#8a7a62]">
              Most of our work arrives through a genealogist, but families can
              commission an archive directly.
            </p>
          </div>
        </div>

        <div className="border-t border-[#a67c52]/25">
          <div className="mx-auto flex max-w-7xl flex-col gap-2 px-4 py-5 text-xs text-[#8a7a62] sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
            <p>
              © {new Date().getFullYear()} {productConfig.name}. Every archive is
              private and excluded from search engines.
            </p>
            {contact.email ? <p>{contact.email}</p> : null}
          </div>
        </div>
      </footer>
    </div>
  );
}
