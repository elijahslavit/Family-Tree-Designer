import {
  ArrowRight,
  BookOpenText,
  FileArchive,
  FileCheck2,
  Handshake,
  KeyRound,
  MessageSquareText,
  Palette,
  ShieldCheck,
  Upload,
  Wand2,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { productConfig } from "@/lib/config/product";

const EXAMPLE_HREF = "/projects/pilot-hart-001/preview";

export default function HomePage() {
  return (
    <main data-light-only className="min-h-screen bg-[#f5f1e8] text-[#26231e]">
      <Hero />
      <ClientExperience />
      <HowItWorks />
      <Guarantees />
      <PilotInvitation />
      <SiteFooter />
    </main>
  );
}

function Hero() {
  return (
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
        className="absolute inset-0 bg-[linear-gradient(180deg,rgba(242,233,216,0.97)_0%,rgba(242,233,216,0.92)_55%,rgba(242,233,216,0.5)_85%,rgba(242,233,216,0.1)_100%)] md:bg-[linear-gradient(90deg,rgba(242,233,216,0.96)_0%,rgba(242,233,216,0.8)_36%,rgba(242,233,216,0)_62%)] lg:bg-[linear-gradient(90deg,rgba(242,233,216,0.9)_0%,rgba(242,233,216,0.7)_34%,rgba(242,233,216,0)_56%)]"
      />
      <div aria-hidden className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-b from-transparent to-[#f5f1e8]" />

      <header className="relative">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
          <Link href="/" className="flex items-center gap-3">
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-[#293a31] text-white">
              <FileArchive className="h-4 w-4" aria-hidden="true" />
            </span>
            <span className="font-semibold">{productConfig.name}</span>
          </Link>
          <nav aria-label="Site" className="flex items-center gap-1 rounded-full bg-[#f2e9d8]/85 p-1 shadow-sm ring-1 ring-black/10 backdrop-blur-sm">
            <a href="#example" className="hidden rounded-full px-3.5 py-1.5 text-sm font-medium text-[#54493a] transition-colors hover:bg-white/60 hover:text-[#26231e] md:inline-flex">
              What clients see
            </a>
            <a href="#how" className="hidden rounded-full px-3.5 py-1.5 text-sm font-medium text-[#54493a] transition-colors hover:bg-white/60 hover:text-[#26231e] md:inline-flex">
              How it works
            </a>
            <Link href="/sign-in" className="rounded-full bg-[#293a31] px-4 py-1.5 text-sm font-semibold text-white transition-colors hover:bg-[#1f2d26]">
              Sign in
            </Link>
          </nav>
        </div>
      </header>

      <div className="relative mx-auto flex min-h-[560px] max-w-7xl items-center px-4 pb-28 pt-10 sm:px-6 sm:pt-14 lg:min-h-[700px] lg:px-8">
        <div className="max-w-xl space-y-7">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#6b5d47]">For professional genealogists</p>
          <h1 className="font-serif text-5xl font-semibold leading-[0.98] tracking-[-0.045em] sm:text-6xl lg:text-7xl">
            Your research deserves a reveal—not another folder.
          </h1>
          <p className="max-w-lg text-lg leading-8 text-[#4f4538]">
            {productConfig.name} turns your finished research—the tree, photographs, stories, and
            sources—into a private, branded presentation your client explores with their family.
          </p>
          <div className="flex flex-wrap items-center gap-4">
            <Link href={EXAMPLE_HREF} className="inline-flex items-center gap-2 rounded-lg bg-[#6b3e36] px-6 py-3.5 text-sm font-semibold text-[#f3ead8] shadow-md transition-colors hover:bg-[#5a332c]">
              See an example presentation <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
            <a href="#how" className="inline-flex items-center gap-2 text-sm font-semibold text-[#54493a] underline decoration-[#a67c52]/60 underline-offset-4 hover:decoration-[#6b3e36]">
              How it works
            </a>
          </div>
          <ul className="flex flex-wrap gap-x-5 gap-y-2 text-sm text-[#5c5142]">
            {["Private by invitation", "Your branding", "Sources stay attached"].map((item) => (
              <li key={item} className="inline-flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-[#4d6755]" aria-hidden="true" />
                {item}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

function SectionHeading({ id, eyebrow, title, intro }: { id: string; eyebrow: string; title: string; intro: string }) {
  return (
    <div className="mx-auto max-w-2xl text-center">
      <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#6b5d47]">{eyebrow}</p>
      <h2 id={id} className="mt-3 font-serif text-4xl font-semibold tracking-tight sm:text-5xl">
        {title}
      </h2>
      <p className="mt-4 text-base leading-7 text-[#62594c] sm:text-lg">{intro}</p>
    </div>
  );
}

function BrowserFrame({ src, alt, priority = false }: { src: string; alt: string; priority?: boolean }) {
  return (
    <div className="overflow-hidden rounded-xl border border-black/10 bg-white shadow-[0_30px_70px_-30px_rgba(38,35,30,0.45)]">
      <div aria-hidden className="flex items-center gap-1.5 border-b border-black/10 bg-[#f3eee4] px-3 py-2">
        <span className="h-2.5 w-2.5 rounded-full bg-[#d8cdbb]" />
        <span className="h-2.5 w-2.5 rounded-full bg-[#d8cdbb]" />
        <span className="h-2.5 w-2.5 rounded-full bg-[#d8cdbb]" />
      </div>
      <div className="relative aspect-[16/10]">
        <Image src={src} alt={alt} fill sizes="(max-width: 1024px) 100vw, 640px" className="object-cover object-top" priority={priority} />
      </div>
    </div>
  );
}

function ClientExperience() {
  const moments = [
    {
      src: "/landing/example-welcome.jpg",
      alt: "The opening welcome of a client presentation: the family name, a portrait of the focal ancestor, and the genealogist’s practice name.",
      title: "A welcome made for them",
      detail: "The presentation opens with the family’s name, a focal ancestor, and your practice’s name.",
    },
    {
      src: "/landing/example-tree.jpg",
      alt: "The family tree view with parents above, the focal person and partner in the middle, and children below.",
      title: "A tree anyone can follow",
      detail: "Generations laid out clearly, with search and a text view for every relationship.",
    },
    {
      src: "/landing/example-story.jpg",
      alt: "A short family story with a framed portrait and the record it is based on.",
      title: "Stories with their sources",
      detail: "Short narratives linked to the people in them and the records behind them.",
    },
  ];

  return (
    <section id="example" aria-labelledby="example-title" className="mx-auto max-w-7xl scroll-mt-8 px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
      <SectionHeading
        id="example-title"
        eyebrow="What your client receives"
        title="A family history they’ll actually open"
        intro="Instead of a PDF that’s read once, your client gets a private presentation the whole family can explore on any device."
      />
      <div className="mt-14 grid gap-10 lg:grid-cols-3 lg:gap-8">
        {moments.map((moment, index) => (
          <figure key={moment.title} className="space-y-5">
            <BrowserFrame src={moment.src} alt={moment.alt} priority={index === 0} />
            <figcaption>
              <p className="font-serif text-2xl font-semibold">{moment.title}</p>
              <p className="mt-2 text-sm leading-6 text-[#62594c]">{moment.detail}</p>
            </figcaption>
          </figure>
        ))}
      </div>
      <div className="mt-12 text-center">
        <Link href={EXAMPLE_HREF} className="inline-flex items-center gap-2 text-sm font-semibold text-[#6b3e36] underline decoration-[#6b3e36]/30 underline-offset-4 hover:decoration-[#6b3e36]">
          Open the full example <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </Link>
      </div>
    </section>
  );
}

function HowItWorks() {
  const steps = [
    {
      icon: Upload,
      title: "Bring your finished research",
      detail: "Upload the GEDCOM you already have, then add selected photographs, records, and up to five short stories.",
    },
    {
      icon: Wand2,
      title: "Shape the reveal",
      detail: "Choose the focal ancestor, write the welcome, and check every page in a preview that shows exactly what your client will see.",
    },
    {
      icon: Handshake,
      title: "Deliver it privately",
      detail: "Invite your client to review and approve, then hand the finished archive to the family.",
    },
  ];

  return (
    <section id="how" aria-labelledby="how-title" className="scroll-mt-8 border-y border-black/10 bg-[#ebe5d9]">
      <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
        <SectionHeading
          id="how-title"
          eyebrow="How it works"
          title="Keep your research tools. Upgrade the delivery."
          intro="You keep researching in the software you trust. We turn the result into something your client remembers."
        />
        <ol className="mt-14 grid gap-5 md:grid-cols-3">
          {steps.map((step, index) => (
            <li key={step.title} className="rounded-2xl border border-black/10 bg-[#f8f5ee] p-7">
              <div className="flex items-center justify-between">
                <span className="grid h-11 w-11 place-items-center rounded-full bg-[#dfe8df] text-[#36503e]">
                  <step.icon className="h-5 w-5" aria-hidden="true" />
                </span>
                <span className="font-serif text-3xl font-semibold text-[#cdbfa6]" aria-hidden="true">
                  {index + 1}
                </span>
              </div>
              <h3 className="mt-7 font-serif text-2xl font-semibold">{step.title}</h3>
              <p className="mt-3 text-sm leading-6 text-[#62594c]">{step.detail}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

function Guarantees() {
  const items = [
    { icon: Palette, title: "Your brand, not ours", detail: "Your practice name and colours appear throughout the presentation." },
    { icon: KeyRound, title: "Private by invitation", detail: "No public links. Every invitation is personal, single-use, and can be revoked." },
    { icon: ShieldCheck, title: "Living relatives protected", detail: "Living adults show only the details they agreed to. Living children never appear." },
    { icon: MessageSquareText, title: "Reviews without the email chain", detail: "Clients comment on a fixed version, and every request gets a recorded response." },
    { icon: FileCheck2, title: "Sources stay attached", detail: "Stories and profiles link to the records they rest on, so the evidence travels with the narrative." },
    { icon: BookOpenText, title: "A clean handoff", detail: "Transfer the archive to the family, with export and deletion on their terms." },
  ];

  return (
    <section aria-labelledby="guarantees-title" className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
      <SectionHeading
        id="guarantees-title"
        eyebrow="Built for professional delivery"
        title="Everything a client handoff should be"
        intro="The details that protect your client’s family—and your reputation."
      />
      <ul className="mt-14 grid gap-x-10 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((item) => (
          <li key={item.title} className="flex gap-4">
            <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-[#efe6d4] text-[#6b3e36]">
              <item.icon className="h-5 w-5" aria-hidden="true" />
            </span>
            <div>
              <h3 className="font-semibold">{item.title}</h3>
              <p className="mt-1.5 text-sm leading-6 text-[#62594c]">{item.detail}</p>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}

function PilotInvitation() {
  return (
    <section aria-labelledby="pilot-title" className="px-4 pb-20 sm:px-6 lg:px-8 lg:pb-28">
      <div className="relative mx-auto max-w-7xl overflow-hidden rounded-3xl bg-[#263a31] px-6 py-14 text-center text-[#f6efe0] sm:px-12 lg:py-20">
        <div aria-hidden className="absolute inset-0 opacity-[0.12]">
          <Image src="/landing/hero-atlas.webp" alt="" fill sizes="100vw" className="object-cover mix-blend-luminosity" />
        </div>
        <div className="relative mx-auto max-w-2xl">
          <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#d8bf8e]">Founding pilot</p>
          <h2 id="pilot-title" className="mt-3 font-serif text-4xl font-semibold tracking-tight text-[#f6efe0] sm:text-5xl">
            Deliver your next client project with us
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-base leading-7 text-[#f6efe0]/80">
            We’re working closely with a small number of genealogists on their first presentations. Explore the
            example, then try the studio yourself.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Link href={EXAMPLE_HREF} className="inline-flex items-center gap-2 rounded-lg bg-[#f6efe0] px-6 py-3.5 text-sm font-semibold text-[#263a31] transition-colors hover:bg-white">
              See an example presentation <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
            <Link href="/projects" className="inline-flex items-center gap-2 rounded-lg border border-[#f6efe0]/35 px-6 py-3.5 text-sm font-semibold text-[#f6efe0] transition-colors hover:bg-[#f6efe0]/10">
              Open the demo studio
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

function SiteFooter() {
  return (
    <footer className="border-t border-black/10 bg-[#ebe5d9]">
      <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-8 text-sm text-[#5f584e] sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
        <p className="flex items-center gap-2 font-semibold text-[#3d352b]">
          <FileArchive className="h-4 w-4" aria-hidden="true" />
          {productConfig.name}
        </p>
        <p>Private family presentations for professional genealogists. Demonstrations use fictional families.</p>
      </div>
    </footer>
  );
}
