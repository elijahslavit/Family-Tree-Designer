import Link from "next/link";
import type { ReactNode } from "react";

import { cn } from "@/lib/utils/cn";

/** Engraved divider used between a heading and its supporting line. */
export function Ornament({ className }: { className?: string }) {
  return (
    <span
      aria-hidden
      className={cn("inline-flex items-center gap-2 text-[#a67c52]", className)}
    >
      <span className="h-px w-8 bg-current opacity-50" />
      <span className="text-[10px] leading-none">✦</span>
      <span className="h-px w-8 bg-current opacity-50" />
    </span>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  lead,
  align = "center",
}: {
  eyebrow?: string;
  title: string;
  lead?: string;
  align?: "center" | "left";
}) {
  return (
    <div className={cn("space-y-3", align === "center" && "text-center")}>
      {eyebrow ? (
        <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#8a7a62]">
          {eyebrow}
        </p>
      ) : null}
      <h2 className="font-serif text-3xl font-semibold tracking-[-0.01em] text-[#3a3026] sm:text-4xl">
        {title}
      </h2>
      <Ornament className={align === "center" ? "" : "block"} />
      {lead ? (
        <p
          className={cn(
            "text-base leading-7 text-[#5c5142]",
            align === "center" && "mx-auto max-w-2xl",
          )}
        >
          {lead}
        </p>
      ) : null}
    </div>
  );
}

export function PrimaryButton({
  href,
  children,
  className,
}: {
  href: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <Link
      href={href}
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-[3px] border border-[#5a332c] bg-[#6b3e36] px-7 py-3.5 text-sm font-semibold uppercase tracking-[0.12em] text-[#f3ead8] shadow-[inset_0_1px_0_rgba(255,255,255,0.18),0_2px_8px_-2px_rgba(58,32,26,0.5)] transition-colors hover:bg-[#5a332c]",
        className,
      )}
    >
      {children}
    </Link>
  );
}

export function SecondaryLink({ href, children }: { href: string; children: ReactNode }) {
  return (
    <Link
      href={href}
      className="inline-flex items-center gap-2 text-sm font-semibold text-[#435d7a] underline decoration-[#435d7a]/40 underline-offset-4 hover:decoration-[#435d7a]"
    >
      {children}
    </Link>
  );
}

/** A wax seal drawn in CSS, so the closing band needs no image asset. */
export function WaxSeal({ className }: { className?: string }) {
  return (
    <span
      aria-hidden
      className={cn(
        "relative grid h-24 w-24 shrink-0 place-items-center rounded-full bg-[radial-gradient(circle_at_35%_30%,#9c4a3f,#6b241d_70%)] shadow-[0_6px_14px_-6px_rgba(58,20,16,0.8)]",
        className,
      )}
    >
      <span className="grid h-16 w-16 place-items-center rounded-full border border-[#c98d7f]/30 font-serif text-2xl text-[#e8c4ba]/80">
        ❦
      </span>
    </span>
  );
}

export function ClosingBand({
  title,
  lead,
  ctaHref,
  ctaLabel,
}: {
  title: string;
  lead: string;
  ctaHref: string;
  ctaLabel: string;
}) {
  return (
    <section className="border-t border-[#a67c52]/30 bg-[#efe7d6]">
      <div className="mx-auto flex max-w-5xl flex-col items-center gap-6 px-4 py-16 text-center sm:px-6 md:flex-row md:text-left lg:px-8">
        <WaxSeal />
        <div className="flex-1 space-y-3">
          <h2 className="font-serif text-3xl font-semibold text-[#3a3026] sm:text-4xl">
            {title}
          </h2>
          <p className="text-base leading-7 text-[#5c5142]">{lead}</p>
        </div>
        <PrimaryButton href={ctaHref} className="shrink-0">
          {ctaLabel}
        </PrimaryButton>
      </div>
    </section>
  );
}
