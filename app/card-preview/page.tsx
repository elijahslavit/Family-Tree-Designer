import type { Metadata } from "next";

import { AncestorCard } from "@/components/showcase/ancestor-card";

export const metadata: Metadata = {
  title: "Ancestor Card preview",
  robots: { index: false },
};

export default function CardPreviewPage() {
  return (
    <main className="min-h-screen bg-[#efe6d4] px-6 py-12 text-[#26231e]">
      <div className="mx-auto max-w-6xl space-y-10">
        <header className="space-y-2">
          <h1 className="font-serif text-3xl font-semibold">Ancestor Card — component preview</h1>
          <p className="max-w-3xl text-sm leading-6 text-[#655e54]">
            Temporary review surface for the client-hub centerpiece card. All portraits are
            synthetic demonstration images — no real people. The era policy drives treatment:
            period portraits seat almost untouched, modern photos receive the monochrome
            archival grade, living people stay veiled.
          </p>
        </header>

        <div className="grid gap-8 sm:grid-cols-2 xl:grid-cols-4">
          <div className="space-y-3">
            <AncestorCard
              name="Elias Hart"
              lifespan="1848–1911"
              descriptor="Stonemason · Kentucky"
              portraitSrc="/showcase/synthetic-portrait-period.webp"
              portraitTreatment="period"
            />
            <p className="text-center text-xs font-semibold uppercase tracking-wide text-[#6e6353]">
              Period portrait · soft seating
            </p>
          </div>

          <div className="space-y-3">
            <AncestorCard
              name="Daniel Hart"
              lifespan="1948–2019"
              descriptor="Teacher · Indiana"
              portraitSrc="/showcase/synthetic-portrait-modern.webp"
              portraitTreatment="modern"
              frameVariant="plain"
            />
            <p className="text-center text-xs font-semibold uppercase tracking-wide text-[#6e6353]">
              Modern era · plain mat + monochrome
            </p>
          </div>

          <div className="space-y-3">
            <AncestorCard name="June Mercer Hart" lifespan="Living" masked />
            <p className="text-center text-xs font-semibold uppercase tracking-wide text-[#6e6353]">
              Living person · veiled
            </p>
          </div>

          <div className="space-y-3">
            <AncestorCard name="Margaret West Vale" lifespan="1799–1846" descriptor="Record sought" />
            <p className="text-center text-xs font-semibold uppercase tracking-wide text-[#6e6353]">
              No portrait · monogram
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
