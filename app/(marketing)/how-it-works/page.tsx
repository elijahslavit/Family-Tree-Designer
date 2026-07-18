import { Check } from "lucide-react";
import type { Metadata } from "next";

import {
  ClosingBand,
  Ornament,
  PrimaryButton,
  SectionHeading,
} from "@/components/marketing/marketing-ui";
import { getContact } from "@/lib/config/contact";
import { includedScope, outOfScope, pricing } from "@/lib/config/pricing";
import { productConfig } from "@/lib/config/product";

export const metadata: Metadata = {
  title: `How it works — ${productConfig.name}`,
  description:
    "Send your finished research, choose a presentation style, and hand your client a private family archive under your own name.",
};

/**
 * The real delivery sequence. It must match the workflow in
 * lib/pilot/types.ts — intake, import, curation, review, approval, handoff.
 */
const steps = [
  {
    title: "You send your research",
    detail:
      "A GEDCOM export from whatever software you already use, plus anything you want said about the family. You keep doing the research; we never touch it.",
  },
  {
    title: "You choose a presentation",
    detail:
      "Linen or Heirloom. Many genealogists make this choice with the client, which turns a formality into a pleasant conversation.",
  },
  {
    title: "We build the archive",
    detail:
      "Your practice name on it, the family inside it. Living relatives are hidden by default and only appear with recorded consent.",
  },
  {
    title: "You review it privately",
    detail:
      "You see it before anyone else does. Two consolidated rounds of corrections are included, so small fixes do not turn into an open-ended thread.",
  },
  {
    title: "You hand it over",
    detail:
      "A private, invitation-only link you give the family — never indexed, never public. Hosted for twelve months, and exportable whenever you want it.",
  },
] as const;

export default function HowItWorksPage() {
  const contact = getContact();

  return (
    <>
      <section className="border-b border-[#a67c52]/30 bg-[#efe7d6]">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="max-w-2xl space-y-4">
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#8a7a62]">
              How it works
            </p>
            <h1 className="font-serif text-4xl font-semibold tracking-[-0.02em] text-[#3a3026] sm:text-5xl">
              You did the research. We handle the delivery.
            </h1>
            <div><Ornament /></div>
            <p className="text-base leading-7 text-[#5c5142]">
              Five steps from a finished GEDCOM to a family archive worth opening.
              Nothing about your research process has to change.
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
        <ol className="space-y-10">
          {steps.map((step, index) => (
            <li key={step.title} className="flex gap-6">
              <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full border border-[#a67c52]/50 bg-[#efe7d6] font-serif text-lg font-semibold text-[#6b3e36]">
                {index + 1}
              </span>
              <div className="space-y-2 pt-1.5">
                <h2 className="font-serif text-2xl font-semibold text-[#3a3026]">
                  {step.title}
                </h2>
                <p className="text-base leading-7 text-[#5c5142]">{step.detail}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      <section className="border-y border-[#a67c52]/30 bg-[#efe7d6]">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
          <SectionHeading
            title="What it costs"
            lead="A one-time fee per archive. No subscription, no per-seat pricing, no tiers to decode."
          />

          <div className="mt-12 grid gap-6 lg:grid-cols-2">
            <PriceCard
              name={pricing.foundingPilot.name}
              price={pricing.foundingPilot.priceUsd}
              note={pricing.foundingPilot.note}
              badge={`Only ${pricing.foundingPilot.seatsTotal} available`}
              enquireHref={contact.mailto("Founding pilot enquiry")}
              featured
            />
            <PriceCard
              name={pricing.standard.name}
              price={pricing.standard.priceUsd}
              note={pricing.standard.note}
            />
          </div>

          <p className="mt-6 text-center text-sm text-[#6e6353]">
            Hosting continues at{" "}
            <strong className="font-semibold text-[#3a3026]">
              ${pricing.renewal.priceUsd} {pricing.renewal.cadence}
            </strong>{" "}
            after the first twelve months — optional, and never automatic.
          </p>

          <div className="mt-12 grid gap-8 md:grid-cols-2">
            <div className="rounded-lg border border-[#a67c52]/40 bg-[#f5f1e8] p-6">
              <h3 className="font-serif text-xl font-semibold text-[#3a3026]">
                Every archive includes
              </h3>
              <ul className="mt-4 space-y-2.5">
                {includedScope.map((item) => (
                  <li key={item} className="flex gap-3 text-sm leading-6 text-[#5c5142]">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-[#6c7a5a]" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-lg border border-[#a67c52]/40 bg-[#f5f1e8] p-6">
              <h3 className="font-serif text-xl font-semibold text-[#3a3026]">
                Quoted separately
              </h3>
              <p className="mt-2 text-sm leading-6 text-[#6e6353]">
                So nothing is buried in the base price.
              </p>
              <ul className="mt-4 space-y-2.5">
                {outOfScope.map((item) => (
                  <li key={item} className="flex gap-3 text-sm leading-6 text-[#5c5142]">
                    <span aria-hidden className="mt-2 h-1 w-1 shrink-0 rounded-full bg-[#a67c52]" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      <ClosingBand
        title="Start with one archive."
        lead={
          contact.email
            ? `Tell us about the family and the research you have finished. Write to ${contact.email}.`
            : "Tell us about the family and the research you have finished."
        }
        ctaHref={contact.mailto("Family archive enquiry") ?? "/for-families"}
        ctaLabel="Start a project"
      />
    </>
  );
}

function PriceCard({
  name,
  price,
  note,
  badge,
  enquireHref,
  featured,
}: {
  name: string;
  price: number;
  note: string;
  badge?: string;
  /** Null while no support address is configured; the button is then omitted. */
  enquireHref?: string | null;
  featured?: boolean;
}) {
  return (
    <div
      className={
        featured
          ? "relative rounded-lg border-2 border-[#6b3e36] bg-[#f5f1e8] p-8 shadow-[0_18px_40px_-28px_rgba(58,44,30,0.8)]"
          : "rounded-lg border border-[#a67c52]/40 bg-[#f5f1e8] p-8"
      }
    >
      {badge ? (
        <span className="absolute -top-3 left-8 rounded-sm bg-[#6b3e36] px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-[#f3ead8]">
          {badge}
        </span>
      ) : null}
      <p className="font-serif text-2xl font-semibold tracking-[0.04em] text-[#3a3026]">
        {name}
      </p>
      <p className="mt-4 font-serif text-5xl font-semibold text-[#3a3026]">
        ${price}
        <span className="ml-2 align-middle text-sm font-normal tracking-wide text-[#8a7a62]">
          one time
        </span>
      </p>
      <p className="mt-4 text-sm leading-6 text-[#5c5142]">{note}</p>
      {featured && enquireHref ? (
        <PrimaryButton href={enquireHref} className="mt-6 w-full">
          Enquire
        </PrimaryButton>
      ) : null}
    </div>
  );
}
