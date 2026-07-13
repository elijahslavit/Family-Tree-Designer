import { ArrowLeft, ArrowRight, CalendarDays, Download, FileCheck2, MapPin, Quote, UsersRound } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";

import type { ShowcasePersonCard, ShowcaseStoryCard } from "@/components/pilot/showcase-home";

export function ShowcaseIndexHeader({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description: string;
}) {
  return (
    <header className="border-b border-[#3c3325]/10 bg-[#eee6d7]">
      <div className="mx-auto max-w-7xl space-y-4 px-4 py-14 sm:px-6 sm:py-20 lg:px-8">
        <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#786b58]">{eyebrow}</p>
        <h1 className="max-w-4xl font-serif text-5xl font-semibold tracking-[-0.03em] sm:text-6xl">{title}</h1>
        <p className="max-w-2xl text-base leading-7 text-[#6f6557]">{description}</p>
      </div>
    </header>
  );
}

export function ShowcasePeopleIndex({ basePath, people }: { basePath: string; people: ShowcasePersonCard[] }) {
  return (
    <div>
      <ShowcaseIndexHeader
        eyebrow="Family directory"
        title="Meet the people in this story"
        description="This focused presentation begins with the closest branches. Search and broader directory tools can be added as the archive grows."
      />
      <div className="mx-auto grid max-w-7xl gap-5 px-4 py-12 sm:grid-cols-2 sm:px-6 lg:grid-cols-3 lg:px-8 xl:grid-cols-4">
        {people.map((person) => (
          <Link key={person.id} href={`${basePath}/people/${person.id}`} className="group overflow-hidden rounded-2xl border border-[#3c3325]/10 bg-white">
            <div className="relative aspect-[4/5] bg-[#d8cfbf]">
              <Image src={person.imagePath} alt={`Synthetic portrait for ${person.name}`} fill sizes="(max-width: 640px) 100vw, 25vw" className="object-cover transition-transform duration-500 group-hover:scale-[1.025]" />
            </div>
            <div className="space-y-2 p-5">
              <p className="font-serif text-2xl font-semibold leading-tight">{person.name}</p>
              <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#7a6f61]">{person.years}</p>
              <p className="line-clamp-3 text-sm leading-6 text-[#6e6456]">{person.summary}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

export function ShowcaseStoriesIndex({ basePath, stories }: { basePath: string; stories: ShowcaseStoryCard[] }) {
  return (
    <div>
      <ShowcaseIndexHeader
        eyebrow="Featured narratives"
        title="Stories that bring the branches to life"
        description="Each narrative is intentionally short, connected to people in the tree, and grounded in cited material."
      />
      <div className="mx-auto grid max-w-7xl gap-7 px-4 py-12 sm:px-6 lg:grid-cols-2 lg:px-8">
        {stories.map((story) => (
          <Link key={story.id} href={`${basePath}/stories/${story.id}`} className="group grid overflow-hidden rounded-2xl border border-[#3c3325]/10 bg-white sm:grid-cols-[220px_1fr]">
            <div className="relative min-h-56 bg-[#d8cfbf]">
              <Image src={story.imagePath} alt="" fill sizes="220px" className="object-cover transition-transform duration-500 group-hover:scale-[1.025]" />
            </div>
            <div className="flex flex-col p-6">
              <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[#7b6d59]">{story.period} · {story.readMinutes} min read</p>
              <h2 className="mt-3 font-serif text-3xl font-semibold leading-tight">{story.title}</h2>
              <p className="mt-3 text-sm leading-6 text-[#6f6557]">{story.dek}</p>
              <span className="mt-auto inline-flex items-center gap-2 pt-5 text-sm font-semibold text-[#425947]">Read story <ArrowRight className="h-4 w-4" /></span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

export function ShowcasePersonDetail({
  basePath,
  person,
  birthPlace,
  biography,
  facts,
  relatives,
  stories,
  source,
}: {
  basePath: string;
  person: ShowcasePersonCard;
  birthPlace: string;
  biography: string[];
  facts: Array<{ label: string; value: string }>;
  relatives: ShowcasePersonCard[];
  stories: ShowcaseStoryCard[];
  source: { id: string; title: string; detail: string };
}) {
  return (
    <div>
      <section className="border-b border-[#3c3325]/10 bg-[#eee6d7]">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 py-10 sm:px-6 lg:grid-cols-[360px_1fr] lg:items-end lg:px-8 lg:py-16">
          <div className="relative aspect-[4/5] overflow-hidden rounded-2xl bg-[#d8cfbf] shadow-xl">
            <Image src={person.imagePath} alt={`Synthetic portrait for ${person.name}`} fill priority sizes="360px" className="object-cover" />
            <span className="absolute bottom-3 right-3 rounded-full bg-black/50 px-3 py-1 text-[9px] uppercase tracking-[0.12em] text-white">Synthetic portrait</span>
          </div>
          <div className="space-y-5 pb-2">
            <Link href={`${basePath}/people`} className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.14em] text-[#66705f]">
              <ArrowLeft className="h-3.5 w-3.5" /> All people
            </Link>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#776a58]">{person.years}</p>
              <h1 className="mt-3 font-serif text-5xl font-semibold leading-[0.98] tracking-[-0.035em] sm:text-7xl">{person.name}</h1>
            </div>
            <p className="max-w-2xl font-serif text-2xl leading-snug text-[#51493e]">{person.summary}</p>
            <div className="flex flex-wrap gap-4 text-sm text-[#6b6255]">
              <span className="inline-flex items-center gap-2"><MapPin className="h-4 w-4" /> {birthPlace}</span>
              <Link href={`${basePath}/tree?person=${person.id}`} className="inline-flex items-center gap-2 font-semibold text-[#425947]"><UsersRound className="h-4 w-4" /> See in family tree</Link>
            </div>
          </div>
        </div>
      </section>

      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:px-6 lg:grid-cols-[minmax(0,1fr)_320px] lg:px-8 lg:py-16">
        <article className="space-y-8">
          <div className="space-y-5">
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#776a58]">Life sketch</p>
            {biography.map((paragraph) => <p key={paragraph.slice(0, 40)} className="font-serif text-xl leading-9 text-[#494137]">{paragraph}</p>)}
          </div>
          {stories.length ? (
            <section className="space-y-4 border-t border-[#3c3325]/10 pt-8">
              <h2 className="font-serif text-3xl font-semibold">Stories featuring {person.name.split(" ")[0]}</h2>
              {stories.map((story) => (
                <Link key={story.id} href={`${basePath}/stories/${story.id}`} className="flex items-center justify-between gap-4 rounded-xl border border-[#3c3325]/10 bg-white p-4 hover:border-[#58705d]">
                  <span><span className="block font-serif text-xl font-semibold">{story.title}</span><span className="mt-1 block text-xs text-[#756b5e]">{story.period} · {story.readMinutes} min read</span></span>
                  <ArrowRight className="h-4 w-4 shrink-0" />
                </Link>
              ))}
            </section>
          ) : null}
        </article>
        <aside className="space-y-5">
          <InfoPanel title="Recorded facts">
            <dl className="space-y-4">{facts.map((fact) => <div key={fact.label}><dt className="text-[10px] font-semibold uppercase tracking-[0.13em] text-[#817667]">{fact.label}</dt><dd className="mt-1 text-sm leading-6">{fact.value}</dd></div>)}</dl>
          </InfoPanel>
          <InfoPanel title="Close family">
            <div className="space-y-3">{relatives.map((relative) => <Link key={relative.id} href={`${basePath}/people/${relative.id}`} className="flex items-center gap-3"><span className="relative h-10 w-10 overflow-hidden rounded-full bg-[#ded5c5]"><Image src={relative.imagePath} alt="" fill sizes="40px" className="object-cover" /></span><span><span className="block text-sm font-semibold">{relative.name}</span><span className="block text-xs text-[#766c5e]">{relative.years}</span></span></Link>)}</div>
          </InfoPanel>
          <InfoPanel title="Source note">
            <Link href={`${basePath}/sources/${source.id}`} className="block rounded-lg bg-[#f4efe5] p-3 text-sm leading-6 hover:bg-[#eee6d7]"><span className="font-semibold">{source.title}</span><span className="mt-1 block text-xs text-[#746b5e]">{source.detail}</span></Link>
          </InfoPanel>
        </aside>
      </div>
    </div>
  );
}

export function ShowcaseStoryDetail({
  basePath,
  story,
  body,
  people,
  source,
}: {
  basePath: string;
  story: ShowcaseStoryCard;
  body: Array<{ heading?: string; paragraphs: string[]; pullQuote?: string }>;
  people: ShowcasePersonCard[];
  source: { id: string; title: string; detail: string };
}) {
  return (
    <article>
      <header className="mx-auto max-w-5xl px-4 pb-10 pt-12 text-center sm:px-6 sm:pt-20">
        <Link href={`${basePath}/stories`} className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.14em] text-[#66705f]"><ArrowLeft className="h-3.5 w-3.5" /> All stories</Link>
        <p className="mt-8 text-[11px] font-semibold uppercase tracking-[0.2em] text-[#776a58]">{story.period} · {story.readMinutes} minute read</p>
        <h1 className="mx-auto mt-4 max-w-4xl font-serif text-5xl font-semibold leading-[1.02] tracking-[-0.035em] sm:text-7xl">{story.title}</h1>
        <p className="mx-auto mt-5 max-w-2xl font-serif text-xl leading-8 text-[#62594c] sm:text-2xl">{story.dek}</p>
      </header>
      <div className="relative mx-auto aspect-[16/8] max-w-7xl overflow-hidden bg-[#d8cfbf] sm:rounded-2xl">
        <Image src={story.imagePath} alt="Synthetic archival illustration for this demonstration story" fill priority sizes="1280px" className="object-cover" />
        <span className="absolute bottom-4 right-4 rounded-full bg-black/50 px-3 py-1 text-[9px] uppercase tracking-[0.12em] text-white">Synthetic media</span>
      </div>
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-12 sm:px-6 lg:grid-cols-[220px_minmax(0,680px)] lg:justify-center lg:py-16">
        <aside className="space-y-5 lg:sticky lg:top-24 lg:self-start">
          <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[#817667]">People in this story</p>
          {people.map((person) => <Link key={person.id} href={`${basePath}/people/${person.id}`} className="flex items-center gap-3"><span className="relative h-10 w-10 overflow-hidden rounded-full bg-[#ded5c5]"><Image src={person.imagePath} alt="" fill sizes="40px" className="object-cover" /></span><span className="text-sm font-semibold">{person.name}</span></Link>)}
        </aside>
        <div className="space-y-9">
          {body.map((section, index) => (
            <section key={section.heading ?? index} className="space-y-5">
              {section.heading ? <h2 className="font-serif text-3xl font-semibold">{section.heading}</h2> : null}
              {section.paragraphs.map((paragraph) => <p key={paragraph.slice(0, 50)} className="font-serif text-xl leading-9 text-[#494137]">{paragraph}</p>)}
              {section.pullQuote ? <blockquote className="border-l-2 border-[#6f866f] py-2 pl-6 font-serif text-3xl leading-snug text-[#405346]"><Quote className="mb-3 h-5 w-5" />{section.pullQuote}</blockquote> : null}
            </section>
          ))}
          <Link href={`${basePath}/sources/${source.id}`} className="flex items-start gap-3 rounded-xl border border-[#3c3325]/10 bg-[#f0eadf] p-5"><FileCheck2 className="mt-0.5 h-5 w-5 shrink-0 text-[#4f6955]" /><span><span className="block text-xs font-semibold uppercase tracking-[0.14em] text-[#746b5e]">Source behind this story</span><span className="mt-1 block font-serif text-xl font-semibold">{source.title}</span><span className="mt-1 block text-sm text-[#6c6255]">{source.detail}</span></span></Link>
        </div>
      </div>
    </article>
  );
}

export function ShowcaseSourceDetail({
  basePath,
  title,
  citation,
  repository,
  date,
  previewPath,
  transcription,
  connectedPeople,
  downloadAvailable,
}: {
  basePath: string;
  title: string;
  citation: string;
  repository: string;
  date: string;
  previewPath: string;
  transcription: string;
  connectedPeople: ShowcasePersonCard[];
  downloadAvailable: boolean;
}) {
  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 lg:py-16">
      <Link href={basePath} className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.14em] text-[#66705f]"><ArrowLeft className="h-3.5 w-3.5" /> Return to archive</Link>
      <div className="mt-8 grid gap-10 lg:grid-cols-[minmax(0,1fr)_380px]">
        <div className="relative min-h-[640px] overflow-hidden rounded-2xl bg-[#d8cfbf] shadow-xl">
          <Image src={previewPath} alt={`Inert synthetic preview of ${title}`} fill priority sizes="(max-width: 1024px) 100vw, 760px" className="object-contain p-4 sm:p-8" />
        </div>
        <aside className="space-y-6">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#776a58]">Source record</p>
            <h1 className="mt-3 font-serif text-4xl font-semibold leading-tight">{title}</h1>
            <p className="mt-4 text-sm leading-7 text-[#6e6456]">{citation}</p>
          </div>
          <InfoPanel title="Record details">
            <dl className="space-y-4"><div><dt className="text-[10px] font-semibold uppercase tracking-[0.13em] text-[#817667]">Repository</dt><dd className="mt-1 text-sm">{repository}</dd></div><div><dt className="text-[10px] font-semibold uppercase tracking-[0.13em] text-[#817667]">Date</dt><dd className="mt-1 flex items-center gap-2 text-sm"><CalendarDays className="h-4 w-4" />{date}</dd></div></dl>
          </InfoPanel>
          <InfoPanel title="Archive note"><p className="text-sm leading-6 text-[#665d50]">{transcription}</p></InfoPanel>
          <InfoPanel title="Connected people"><div className="space-y-2">{connectedPeople.map((person) => <Link key={person.id} href={`${basePath}/people/${person.id}`} className="block text-sm font-semibold text-[#425947]">{person.name}</Link>)}</div></InfoPanel>
          <button type="button" disabled={!downloadAvailable} className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#2d3c32] px-5 py-3 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-50"><Download className="h-4 w-4" />{downloadAvailable ? "Download authenticated original" : "Original download unavailable in demo"}</button>
          <p className="text-xs leading-5 text-[#786f62]">Original files are authenticated attachment downloads. This page displays only a separately generated inert preview.</p>
        </aside>
      </div>
    </div>
  );
}

function InfoPanel({ title, children }: { title: string; children: ReactNode }) {
  return <section className="rounded-xl border border-[#3c3325]/10 bg-white p-5"><h2 className="mb-4 font-serif text-xl font-semibold">{title}</h2>{children}</section>;
}
