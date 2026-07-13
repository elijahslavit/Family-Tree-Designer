import { ArrowRight, BookOpenText, FileArchive, ShieldCheck, Sparkles } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { productConfig } from "@/lib/config/product";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-[#f5f1e8] text-[#26231e]">
      <header className="border-b border-black/10 bg-[#faf8f2]">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
          <Link href="/" className="flex items-center gap-3">
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-[#293a31] text-white">
              <FileArchive className="h-4 w-4" />
            </span>
            <span>
              <span className="block text-[10px] font-semibold uppercase tracking-[0.18em] text-[#746d62]">
                Professional delivery studio
              </span>
              <span className="block font-semibold">{productConfig.name}</span>
            </span>
          </Link>
          <nav className="flex items-center gap-2">
            <Link href="/sign-in" className="hidden rounded-full px-4 py-2 text-sm font-semibold text-[#615a50] hover:bg-black/[0.04] sm:inline-flex">
              Sign in
            </Link>
            <Link href="/projects" className="inline-flex items-center gap-2 rounded-full bg-[#293a31] px-4 py-2 text-sm font-semibold text-white">
              Open synthetic studio <ArrowRight className="h-4 w-4" />
            </Link>
          </nav>
        </div>
      </header>

      <section className="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:px-6 lg:grid-cols-[0.92fr_1.08fr] lg:items-center lg:px-8 lg:py-20">
        <div className="space-y-7">
          <div className="inline-flex items-center gap-2 rounded-full border border-amber-200 bg-amber-50 px-3 py-1.5 text-xs font-semibold text-amber-900">
            <Sparkles className="h-3.5 w-3.5" />
            Founding-pilot workspace · synthetic data only
          </div>
          <div className="space-y-5">
            <h1 className="max-w-3xl font-serif text-5xl font-semibold leading-[0.98] tracking-[-0.045em] sm:text-6xl lg:text-7xl">
              Your research deserves a reveal—not another folder.
            </h1>
            <p className="max-w-2xl text-lg leading-8 text-[#655e54]">
              Turn a completed GEDCOM, photographs, short family stories, and source records into one private, branded client experience without building a custom website.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link href="/projects" className="inline-flex items-center gap-2 rounded-full bg-[#293a31] px-5 py-3 text-sm font-semibold text-white">
              Open the pilot workspace <ArrowRight className="h-4 w-4" />
            </Link>
            <Link href="/projects/pilot-hart-001/preview" className="inline-flex items-center gap-2 rounded-full border border-black/15 bg-white px-5 py-3 text-sm font-semibold">
              Preview the client experience
            </Link>
          </div>
          <div className="flex items-start gap-3 border-t border-black/10 pt-5 text-sm leading-6 text-[#6e675d]">
            <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-[#4d6755]" />
            <p>Private by default. Real client data remains blocked until infrastructure and attorney review are complete.</p>
          </div>
        </div>

        <div className="relative overflow-hidden rounded-[28px] bg-[#273029] shadow-2xl">
          <div className="relative aspect-[16/12] sm:aspect-[16/11] lg:aspect-[4/4.2] xl:aspect-[16/13]">
            <Image
              src="/demo/pilot/hart-family-hero.svg"
              alt="Clearly synthetic Hart family archival collage used for the pilot demonstration"
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 55vw"
              className="object-cover opacity-90"
            />
            <div className="absolute inset-0 bg-[linear-gradient(0deg,rgba(25,29,25,.75),transparent_50%)]" />
            <div className="absolute inset-x-0 bottom-0 p-6 text-white sm:p-8">
              <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#ead8b4]">The Hart Family Legacy</p>
              <p className="mt-2 max-w-xl font-serif text-3xl font-semibold leading-tight sm:text-4xl">Four generations, one unfolding story.</p>
              <p className="mt-3 text-xs text-white/70">Synthetic people, media, records, and events</p>
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-black/10 bg-[#ebe5d9]">
        <div className="mx-auto grid max-w-7xl gap-5 px-4 py-12 sm:px-6 md:grid-cols-3 lg:px-8 lg:py-16">
          <ValueCard icon={<FileArchive className="h-5 w-5" />} step="01" title="Bring finished research" detail="Stage a GEDCOM, brand, selected media, stories, and source references in a guided professional workflow." />
          <ValueCard icon={<BookOpenText className="h-5 w-5" />} step="02" title="Curate the client reveal" detail="Choose a focal branch, shape the welcome, and connect a few meaningful stories to people and records." />
          <ValueCard icon={<ShieldCheck className="h-5 w-5" />} step="03" title="Review and hand off privately" detail="Freeze review versions, invite the client, collect approval, and transfer archive authority with an audit trail." />
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-4 py-16 text-center sm:px-6 lg:py-24">
        <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#746b5e]">Built around the professional handoff</p>
        <h2 className="mt-4 font-serif text-4xl font-semibold tracking-tight sm:text-5xl">Keep the tools you trust. Upgrade what your client receives.</h2>
        <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-[#655e54]">Family Tree Designer complements research software and narrative reports with a presentation layer clients can understand, revisit, and safely share.</p>
      </section>
    </main>
  );
}

function ValueCard({ icon, step, title, detail }: { icon: React.ReactNode; step: string; title: string; detail: string }) {
  return (
    <div className="rounded-2xl border border-black/10 bg-[#f8f5ee] p-6">
      <div className="flex items-center justify-between">
        <span className="grid h-10 w-10 place-items-center rounded-full bg-[#dfe8df] text-[#36503e]">{icon}</span>
        <span className="text-xs font-semibold text-[#8a8174]">{step}</span>
      </div>
      <h3 className="mt-8 font-serif text-2xl font-semibold">{title}</h3>
      <p className="mt-3 text-sm leading-6 text-[#6d655a]">{detail}</p>
    </div>
  );
}
