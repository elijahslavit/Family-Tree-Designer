import { ArrowRight } from "lucide-react";
import type { Metadata } from "next";
import Image from "next/image";

import {
  ClosingBand,
  Ornament,
  SecondaryLink,
} from "@/components/marketing/marketing-ui";
import { getContact } from "@/lib/config/contact";
import { productConfig } from "@/lib/config/product";

export const metadata: Metadata = {
  title: `For families — ${productConfig.name}`,
  description:
    "Have your family's history made into a private archive, whether or not you already work with a genealogist.",
};

export default function ForFamiliesPage() {
  const contact = getContact();

  return (
    <>
      <section className="border-b border-[#a67c52]/30 bg-[#efe7d6]">
        <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 py-16 sm:px-6 lg:grid-cols-[1fr_1fr] lg:px-8">
          <div className="max-w-xl space-y-5">
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#8a7a62]">
              For families
            </p>
            <h1 className="font-serif text-4xl font-semibold leading-tight tracking-[-0.02em] text-[#3a3026] sm:text-5xl">
              Somewhere for your family&apos;s history to live
            </h1>
            <div><Ornament /></div>
            <p className="text-base leading-7 text-[#5c5142]">
              Most of our archives are commissioned by a professional genealogist
              on a family&apos;s behalf. But if you have already gathered your
              family&apos;s history yourself, we can make it into something worth
              passing on.
            </p>
          </div>

          <div className="overflow-hidden rounded-lg border border-[#a67c52]/40 shadow-[0_18px_40px_-26px_rgba(58,44,30,0.7)]">
            <Image
              src="/marketing/linen-welcome.png"
              alt="A sample family archive"
              width={1400}
              height={940}
              className="h-auto w-full"
            />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-10 sm:grid-cols-2">
          <div className="space-y-3">
            <h2 className="font-serif text-2xl font-semibold text-[#3a3026]">
              If you already work with a genealogist
            </h2>
            <p className="text-base leading-7 text-[#5c5142]">
              Ask them about us. They will keep ownership of the research and
              deliver the archive under their own name, which is usually what
              both of you want.
            </p>
            <SecondaryLink href="/how-it-works">
              What that involves <ArrowRight className="h-4 w-4" />
            </SecondaryLink>
          </div>

          <div className="space-y-3">
            <h2 className="font-serif text-2xl font-semibold text-[#3a3026]">
              If you have done the research yourself
            </h2>
            <p className="text-base leading-7 text-[#5c5142]">
              If you can export a GEDCOM file from the software you use, we can
              work from that directly. If you are not sure what that means, write
              to us and we will walk you through it.
            </p>
            <SecondaryLink href="/styles">
              See how it looks <ArrowRight className="h-4 w-4" />
            </SecondaryLink>
          </div>
        </div>

        <div className="mt-12 rounded-lg border border-[#a67c52]/40 bg-[#efe7d6] p-6">
          <h2 className="font-serif text-xl font-semibold text-[#3a3026]">
            About living relatives
          </h2>
          <p className="mt-2 text-sm leading-6 text-[#5c5142]">
            Living people are hidden from the archive by default. They appear only
            where consent has been recorded, and even then only the details that
            were agreed to. The archive itself is invitation-only and is never
            indexed by search engines.
          </p>
        </div>
      </section>

      <ClosingBand
        title="Tell us about your family."
        lead={
          contact.email
            ? `Write to ${contact.email} and describe what you have gathered so far.`
            : "Describe what you have gathered so far, and we will tell you what is possible."
        }
        ctaHref={contact.mailto("Family archive enquiry") ?? "/how-it-works"}
        ctaLabel={contact.email ? "Get in touch" : "See how it works"}
      />
    </>
  );
}
