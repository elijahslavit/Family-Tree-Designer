import { ArrowRight, BookOpen, Feather, Hourglass } from "lucide-react";
import type { Metadata } from "next";
import Image from "next/image";

import {
  ClosingBand,
  Ornament,
  PrimaryButton,
  SecondaryLink,
  SectionHeading,
} from "@/components/marketing/marketing-ui";
import { AncestorCard } from "@/components/showcase/ancestor-card";
import { TiltCard } from "@/components/showcase/tilt-card";
import { productConfig } from "@/lib/config/product";

export const metadata: Metadata = {
  title: `${productConfig.name} — ${productConfig.tagline}`,
  description:
    "We turn a genealogist's finished research into a private, beautifully presented family archive — delivered under their own name.",
};

export default function HomePage() {
  return (
    <>
      <section className="relative isolate overflow-hidden border-b border-[#a67c52]/30">
        <Image
          src="/landing/hero-atlas.webp"
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover object-[70%_center]"
        />
        <div
          aria-hidden
          className="absolute inset-0 bg-[linear-gradient(180deg,rgba(242,233,216,0.96)_0%,rgba(242,233,216,0.9)_52%,rgba(242,233,216,0.42)_82%,rgba(242,233,216,0.05)_100%)] md:bg-[linear-gradient(90deg,rgba(242,233,216,0.95)_0%,rgba(242,233,216,0.74)_34%,rgba(242,233,216,0)_60%)]"
        />

        <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-4 py-16 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:px-8 lg:py-24">
          <div className="max-w-xl space-y-7">
            <h1 className="font-serif text-5xl font-semibold leading-[0.98] tracking-[-0.04em] text-[#3a3026] sm:text-6xl lg:text-7xl">
              Your research deserves a reveal
            </h1>
            <div>
              <Ornament />
            </div>
            <p className="max-w-lg text-lg leading-8 text-[#5c5142]">
              Months of careful work should not arrive as a PDF attachment. We
              turn your finished research into a private family archive your
              clients will open again for years — delivered under your name.
            </p>
            <div className="flex flex-wrap items-center gap-6">
              <PrimaryButton href="/styles">See a finished reveal</PrimaryButton>
              <SecondaryLink href="/how-it-works">
                See how it works <ArrowRight className="h-4 w-4" />
              </SecondaryLink>
            </div>
            <p className="text-sm leading-6 text-[#6e6353]">
              Keep the research tools you trust. Upgrade what your clients receive.
            </p>
          </div>

          <div className="mx-auto w-full max-w-[380px] lg:max-w-[420px]">
            <TiltCard>
              <AncestorCard
                name="Thomas Alfred Harrington"
                lifespan="1846–1921"
                portraitSrc="/showcase/synthetic-portrait-period.webp"
                portraitAlt=""
                portraitTreatment="period"
                zoom={1.18}
                focalY={28}
              />
            </TiltCard>
            <p className="mt-3 text-center text-[10px] uppercase tracking-[0.14em] text-[#8a7a62]">
              Sample archive · illustrative portrait
            </p>
          </div>
        </div>
      </section>

      <section className="border-b border-[#a67c52]/30 bg-[#efe7d6]">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 py-16 sm:px-6 md:grid-cols-3 lg:px-8">
          <ValueColumn
            icon={<BookOpen className="h-6 w-6" />}
            title="A private, branded archive"
            detail="A considered presentation of the family's history — the people, the lineage, and the stories that make it matter. Invitation-only, and never indexed by search engines."
          />
          <ValueColumn
            icon={<Feather className="h-6 w-6" />}
            title="Your name on it"
            detail="Delivered as your work, credited to your practice. The family sees a curator's plaque, not our software."
          />
          <ValueColumn
            icon={<Hourglass className="h-6 w-6" />}
            title="One year of hosting"
            detail="Twelve months included, so the family can explore without a bill arriving. Renew after that, or export everything and take it with you."
          />
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
        <SectionHeading
          title="One archive. Two presentations."
          lead="Choose the look that best tells your client's story. Both are complete — every screen, not just the cover."
        />

        <div className="mt-12 grid gap-8 lg:grid-cols-2">
          <StylePreview
            name="Linen"
            note="Paper, ink, and reading-room calm."
            src="/marketing/linen-welcome.png"
          />
          <StylePreview
            name="Heirloom"
            note="Candlelit depth and restrained gilding."
            src="/marketing/heirloom-welcome.png"
          />
        </div>

        <div className="mt-10 text-center">
          <SecondaryLink href="/styles">
            Compare both styles in detail <ArrowRight className="h-4 w-4" />
          </SecondaryLink>
        </div>
      </section>

      <ClosingBand
        title="Thoughtful research. Timeless presentation."
        lead="We handle the build, so you can stay focused on the story."
        ctaHref="/how-it-works"
        ctaLabel="See what it costs"
      />
    </>
  );
}

function ValueColumn({
  icon,
  title,
  detail,
}: {
  icon: React.ReactNode;
  title: string;
  detail: string;
}) {
  return (
    <div className="space-y-4 text-center md:text-left">
      <span className="inline-grid h-12 w-12 place-items-center rounded-full border border-[#a67c52]/40 bg-[#f5f1e8] text-[#8a6a43]">
        {icon}
      </span>
      <h3 className="font-serif text-2xl font-semibold text-[#3a3026]">{title}</h3>
      <p className="text-sm leading-6 text-[#5c5142]">{detail}</p>
    </div>
  );
}

/** A real screenshot of the running product in a restrained browser frame. */
function StylePreview({ name, note, src }: { name: string; note: string; src: string }) {
  return (
    <figure className="space-y-4">
      <div className="overflow-hidden rounded-lg border border-[#a67c52]/40 bg-[#e8ddc8] shadow-[0_18px_40px_-24px_rgba(58,44,30,0.7)]">
        <div className="flex items-center gap-1.5 border-b border-[#a67c52]/30 bg-[#e3d7bf] px-3 py-2">
          <span className="h-2.5 w-2.5 rounded-full bg-[#c2724f]/70" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#c9a227]/70" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#6c7a5a]/70" />
        </div>
        <Image
          src={src}
          alt={`The ${name} presentation style, shown on a sample family archive`}
          width={1400}
          height={940}
          className="h-auto w-full"
        />
      </div>
      <figcaption className="text-center">
        <span className="font-serif text-xl font-semibold tracking-[0.08em] text-[#3a3026]">
          {name}
        </span>
        <span className="mt-1 block text-sm text-[#6e6353]">{note}</span>
      </figcaption>
    </figure>
  );
}
