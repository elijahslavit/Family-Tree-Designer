import type { Metadata } from "next";
import Image from "next/image";

import { ClosingBand, Ornament, SectionHeading } from "@/components/marketing/marketing-ui";
import { productConfig } from "@/lib/config/product";
import { SHOWCASE_THEME_LIST } from "@/lib/themes/showcase-themes";

export const metadata: Metadata = {
  title: `Presentation styles — ${productConfig.name}`,
  description:
    "Compare the Linen and Heirloom presentation styles across every screen of a family archive.",
};

/** Each screen of the archive, shown in both styles side by side. */
const screens = [
  {
    id: "welcome",
    title: "The welcome",
    detail:
      "What the family sees first: the name, the span of years, and one person to begin with.",
  },
  {
    id: "people",
    title: "The people",
    detail:
      "Everyone in the archive. Ancestors without a photograph carry a monogram rather than a placeholder.",
  },
  {
    id: "person",
    title: "A single life",
    detail:
      "Dates, places, and the recorded facts, alongside the family around them.",
  },
  {
    id: "tree",
    title: "The family tree",
    detail: "The relationships, explored rather than printed.",
  },
] as const;

export default function StylesPage() {
  return (
    <>
      <section className="border-b border-[#a67c52]/30 bg-[#efe7d6]">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="max-w-2xl space-y-4">
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#8a7a62]">
              Presentation styles
            </p>
            <h1 className="font-serif text-4xl font-semibold tracking-[-0.02em] text-[#3a3026] sm:text-5xl">
              Two distinct presentations. The same archive underneath.
            </h1>
            <div><Ornament /></div>
            <p className="text-base leading-7 text-[#5c5142]">
              Choose the one that best tells your client&apos;s story — with them in
              the room, if you like. Every screen below is the running product,
              not a mockup, shown on a sample family.
            </p>
          </div>

          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:max-w-3xl">
            {SHOWCASE_THEME_LIST.map((theme) => (
              <div
                key={theme.id}
                className="flex items-start gap-4 rounded-lg border border-[#a67c52]/40 bg-[#f5f1e8] p-5"
              >
                {/* Ringed, because a near-white swatch vanishes on a cream card. */}
                <span className="mt-1 flex shrink-0 gap-1.5" aria-hidden>
                  {theme.swatch.map((color) => (
                    <span
                      key={color}
                      className="h-5 w-5 rounded-full ring-1 ring-inset ring-black/25"
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </span>
                <div>
                  <p className="font-serif text-xl font-semibold tracking-[0.06em] text-[#3a3026]">
                    {theme.name}
                  </p>
                  <p className="mt-1 text-sm leading-6 text-[#5c5142]">{theme.tagline}</p>
                  <p className="mt-2 text-xs leading-5 text-[#8a7a62]">{theme.bestFor}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {screens.map((screen, index) => (
        <section
          key={screen.id}
          className={index % 2 === 1 ? "bg-[#efe7d6]" : undefined}
        >
          <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
            <SectionHeading
              eyebrow={`${index + 1} of ${screens.length}`}
              title={screen.title}
              lead={screen.detail}
            />
            <div className="mt-10 grid gap-8 lg:grid-cols-2">
              {SHOWCASE_THEME_LIST.map((theme) => (
                <figure key={theme.id} className="space-y-3">
                  <div className="overflow-hidden rounded-lg border border-[#a67c52]/40 shadow-[0_18px_40px_-26px_rgba(58,44,30,0.7)]">
                    <Image
                      src={`/marketing/${theme.id}-${screen.id}.png`}
                      alt={`${screen.title} in the ${theme.name} style`}
                      width={1400}
                      height={940}
                      className="h-auto w-full"
                    />
                  </div>
                  <figcaption className="text-center font-serif text-lg font-semibold tracking-[0.08em] text-[#3a3026]">
                    {theme.name}
                  </figcaption>
                </figure>
              ))}
            </div>
          </div>
        </section>
      ))}

      <ClosingBand
        title="Both styles are included."
        lead="You are not choosing a price tier — you are choosing a look. Change it at any point before the archive is handed over."
        ctaHref="/how-it-works"
        ctaLabel="See how it works"
      />
    </>
  );
}
