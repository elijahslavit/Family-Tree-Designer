import { ArrowRight, BookOpenText, FileArchive, ShieldCheck, Sparkles } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { productConfig } from "@/lib/config/product";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-[#f5f1e8] text-[#26231e]">
      <section className="relative isolate overflow-hidden">
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
          className="absolute inset-0 bg-[linear-gradient(180deg,rgba(242,233,216,0.96)_0%,rgba(242,233,216,0.9)_52%,rgba(242,233,216,0.42)_82%,rgba(242,233,216,0.05)_100%)] md:bg-[linear-gradient(90deg,rgba(242,233,216,0.94)_0%,rgba(242,233,216,0.72)_32%,rgba(242,233,216,0)_58%)] lg:bg-[linear-gradient(90deg,rgba(242,233,216,0.55)_0%,rgba(242,233,216,0.25)_28%,rgba(242,233,216,0)_46%)]"
        />
        <div aria-hidden className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-b from-transparent to-[#ebe5d9]" />

        <header className="relative">
          <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
            <Link href="/" className="flex items-center gap-3">
              <span className="grid h-9 w-9 place-items-center rounded-xl bg-[#293a31] text-white">
                <FileArchive className="h-4 w-4" />
              </span>
              <span>
                <span className="block text-[10px] font-semibold uppercase tracking-[0.18em] text-[#6e6353]">
                  Professional delivery studio
                </span>
                <span className="block font-semibold">{productConfig.name}</span>
              </span>
            </Link>
            <nav className="flex items-center gap-2">
              <Link href="/sign-in" className="rounded-full bg-[#f2e9d8]/85 px-4 py-2 text-sm font-semibold text-[#54493a] shadow-sm ring-1 ring-black/10 backdrop-blur-sm hover:bg-[#f2e9d8]">
                Sign in
              </Link>
            </nav>
          </div>
        </header>

        <div className="relative mx-auto flex min-h-[540px] max-w-7xl items-center px-4 pb-24 pt-10 sm:px-6 sm:pt-14 lg:min-h-[680px] lg:px-8">
          <div className="max-w-xl space-y-7">
            <h1 className="font-serif text-5xl font-semibold leading-[0.98] tracking-[-0.045em] sm:text-6xl lg:text-7xl">
              Your research deserves a reveal—not another folder.
            </h1>
            <p className="max-w-lg text-lg leading-8 text-[#5c5142]">
              Months of careful research shouldn&apos;t end as an email attachment. {productConfig.name} turns your finished work into a beautiful, interactive experience—the tree, the stories, the photographs, the records—delivered as a moment your clients will never forget.
            </p>
            <div className="flex flex-wrap items-center gap-4">
              <Link href="/projects/pilot-hart-001/preview" className="inline-flex items-center gap-2 rounded-lg bg-[#6b3e36] px-6 py-3.5 text-sm font-semibold text-[#f3ead8] shadow-md transition-colors hover:bg-[#5a332c]">
                See a finished reveal <ArrowRight className="h-4 w-4" />
              </Link>
              <Link href="/projects" className="inline-flex items-center gap-2 text-sm font-semibold text-[#54493a] underline decoration-[#a67c52]/60 underline-offset-4 hover:decoration-[#6b3e36]">
                Open the pilot workspace <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
            <p className="inline-block rounded bg-[#f2e9d8]/70 px-1.5 py-0.5 text-sm font-medium leading-6 text-[#4c4234]">
              Keep the research tools you trust. Upgrade what your clients receive.
            </p>
          </div>
        </div>
      </section>

      <section className="border-y border-black/10 bg-[#ebe5d9]">
        <div className="mx-auto max-w-7xl px-4 pt-10 sm:px-6 lg:px-8">
          <p className="inline-flex items-center gap-2 rounded-full border border-amber-200/80 bg-amber-50 px-3 py-1.5 text-xs font-semibold text-amber-900">
            <Sparkles className="h-3.5 w-3.5" />
            Founding-pilot workspace · synthetic data only
          </p>
        </div>
        <div className="mx-auto grid max-w-7xl gap-5 px-4 pb-6 pt-8 sm:px-6 md:grid-cols-3 lg:px-8">
          <ValueCard icon={<FileArchive className="h-5 w-5" />} step="01" title="Bring finished research" detail="Stage a GEDCOM, brand, selected media, stories, and source references in a guided professional workflow." />
          <ValueCard icon={<BookOpenText className="h-5 w-5" />} step="02" title="Curate the client reveal" detail="Choose a focal branch, shape the welcome, and connect a few meaningful stories to people and records." />
          <ValueCard icon={<ShieldCheck className="h-5 w-5" />} step="03" title="Review and hand off privately" detail="Freeze review versions, invite the client, collect approval, and transfer archive authority with an audit trail." />
        </div>
        <div className="mx-auto flex max-w-7xl items-start gap-3 px-4 pb-10 text-sm leading-6 text-[#6e675d] sm:px-6 lg:px-8">
          <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-[#4d6755]" />
          <p>Private by default. Real client data remains blocked until infrastructure and attorney review are complete.</p>
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
