import { ArrowLeft, ArrowRight, CalendarDays, Download, FileCheck2, MapPin, Quote, UsersRound } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";

import { storyMeta, type ShowcasePersonCard, type ShowcaseStoryCard } from "@/components/pilot/showcase-home";

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
        eyebrow="The family"
        title="The people in this history"
        description="Everyone your genealogist has included in this presentation. Open a profile to read their story, see their records, and find their place in the tree."
      />
      <div className="mx-auto grid max-w-7xl grid-cols-2 gap-3 px-4 py-12 sm:gap-5 sm:px-6 lg:grid-cols-3 lg:px-8 xl:grid-cols-4">
        {people.map((person) => (
          <Link key={person.id} href={`${basePath}/people/${person.id}`} className="group overflow-hidden rounded-2xl border border-[#3c3325]/10 bg-white">
            <div className="relative aspect-[4/5] bg-[#d8cfbf]">
              <Image src={person.imagePath} alt={`Portrait of ${person.name}`} fill sizes="(max-width: 1024px) 50vw, 25vw" className="object-cover transition-transform duration-500 group-hover:scale-[1.025]" />
            </div>
            <div className="space-y-2 p-3.5 sm:p-5">
              <p className="font-serif text-lg font-semibold leading-tight sm:text-2xl">{person.name}</p>
              <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#7a6f61]">{person.years}</p>
              <p className="hidden text-sm leading-6 text-[#6e6456] sm:line-clamp-3">{person.summary}</p>
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
        eyebrow="Stories"
        title="Moments from the family's history"
        description="Short stories drawn from letters, photographs, and records. Each one names the people involved and the sources behind it."
      />
      <div className="mx-auto grid max-w-7xl gap-7 px-4 py-12 sm:px-6 lg:grid-cols-2 lg:px-8">
        {stories.map((story) => (
          <Link key={story.id} href={`${basePath}/stories/${story.id}`} className="group grid overflow-hidden rounded-2xl border border-[#3c3325]/10 bg-white sm:grid-cols-[220px_1fr]">
            <div className="relative min-h-56 bg-[#d8cfbf]">
              <Image src={story.imagePath} alt="" fill sizes="220px" className="object-cover transition-transform duration-500 group-hover:scale-[1.025]" />
            </div>
            <div className="flex flex-col p-6">
              <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[#7b6d59]">{storyMeta(story)}</p>
              <h2 className="mt-3 font-serif text-3xl font-semibold leading-tight">{story.title}</h2>
              <p className="mt-3 text-sm leading-6 text-[#6f6557]">{story.dek}</p>
              <span className="mt-auto inline-flex items-center gap-2 pt-5 text-sm font-semibold text-[var(--brand-primary-ink)]">Read story <ArrowRight className="h-4 w-4" /></span>
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
  relatives: Array<ShowcasePersonCard & { relation?: string }>;
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
            <Link href={`${basePath}/people`} className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.14em] text-[var(--brand-primary-ink)]">
              <ArrowLeft className="h-3.5 w-3.5" /> All people
            </Link>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#776a58]">{person.years}</p>
              <h1 className="mt-3 font-serif text-5xl font-semibold leading-[0.98] tracking-[-0.035em] sm:text-7xl">{person.name}</h1>
            </div>
            <p className="max-w-2xl font-serif text-2xl leading-snug text-[#51493e]">{person.summary}</p>
            <div className="flex flex-wrap gap-4 text-sm text-[#6b6255]">
              <span className="inline-flex items-center gap-2"><MapPin className="h-4 w-4" /> {birthPlace}</span>
              <Link href={`${basePath}/tree?person=${person.id}`} className="inline-flex items-center gap-2 font-semibold text-[var(--brand-primary-ink)]"><UsersRound className="h-4 w-4" /> See in family tree</Link>
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
                <Link key={story.id} href={`${basePath}/stories/${story.id}`} className="flex items-center justify-between gap-4 rounded-xl border border-[#3c3325]/10 bg-white p-4 hover:border-[var(--brand-primary-ink)]">
                  <span><span className="block font-serif text-xl font-semibold">{story.title}</span><span className="mt-1 block text-xs text-[#756b5e]">{storyMeta(story)}</span></span>
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
            <div className="space-y-3">{relatives.map((relative) => <Link key={relative.id} href={`${basePath}/people/${relative.id}`} className="flex items-center gap-3"><span className="relative h-10 w-10 overflow-hidden rounded-full bg-[#ded5c5]"><Image src={relative.imagePath} alt="" fill sizes="40px" className="object-cover" /></span><span><span className="block text-sm font-semibold">{relative.name}</span><span className="block text-xs text-[#766c5e]">{relative.relation ? <span className="font-semibold uppercase tracking-[0.12em] text-[10px] text-[var(--brand-accent-ink)]">{relative.relation}</span> : null}{relative.relation ? " · " : null}{relative.years}</span></span></Link>)}</div>
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
  paragraphs,
  pullQuote,
  people,
  sources,
  nextStory,
}: {
  basePath: string;
  story: ShowcaseStoryCard;
  paragraphs: string[];
  pullQuote?: string | null;
  people: ShowcasePersonCard[];
  sources: Array<{ id: string; title: string; detail: string }>;
  nextStory?: ShowcaseStoryCard | null;
}) {
  const showPullQuote = Boolean(pullQuote && pullQuote.trim() !== story.dek.trim());
  const featuring = people.map((person) => person.name);

  return (
    <article>
      <header className="border-b border-[#3c3325]/10 bg-[#efe7d8]">
        <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 py-12 sm:px-6 lg:grid-cols-[minmax(0,1fr)_340px] lg:gap-16 lg:px-8 lg:py-20">
          <div>
            <Link href={`${basePath}/stories`} className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.14em] text-[var(--brand-primary-ink)]">
              <ArrowLeft className="h-3.5 w-3.5" aria-hidden="true" /> All stories
            </Link>
            <p className="mt-8 text-[11px] font-semibold uppercase tracking-[0.2em] text-[var(--brand-accent-ink)]">
              {storyMeta(story, "minute")}
            </p>
            <h1 className="mt-4 font-serif text-4xl font-semibold leading-[1.04] tracking-[-0.03em] sm:text-6xl">{story.title}</h1>
            <p className="mt-5 max-w-xl font-serif text-xl leading-8 text-[#62594c] sm:text-2xl">{story.dek}</p>
            {featuring.length ? (
              <div className="mt-8 flex items-center gap-3">
                <div className="flex -space-x-2">
                  {people.slice(0, 4).map((person) => (
                    <span key={person.id} className="relative h-9 w-9 overflow-hidden rounded-full border-2 border-[#efe7d8] bg-[#ded5c5]">
                      <Image src={person.imagePath} alt="" fill sizes="36px" className="object-cover" />
                    </span>
                  ))}
                </div>
                <p className="text-sm text-[#62594c]">
                  Featuring <span className="font-semibold text-[#2f2a22]">{formatNames(featuring)}</span>
                </p>
              </div>
            ) : null}
          </div>
          <figure className="relative mx-auto w-full max-w-[300px] lg:max-w-none">
            <div className="relative aspect-[4/5] overflow-hidden rounded-2xl bg-[#d8cfbf] shadow-[0_24px_60px_-20px_rgba(47,42,34,0.45)] ring-1 ring-black/5">
              <Image src={story.imagePath} alt="" fill priority sizes="(max-width: 1024px) 300px, 340px" className="object-cover" />
            </div>
            <figcaption className="mt-3 text-center text-[10px] uppercase tracking-[0.14em] text-[#817667]">Synthetic demonstration media</figcaption>
          </figure>
        </div>
      </header>

      <div className="mx-auto max-w-[680px] px-4 py-12 sm:px-6 lg:py-16">
        <div className="space-y-6">
          {paragraphs.map((paragraph, index) => (
            <p
              key={paragraph.slice(0, 50)}
              className={`font-serif text-xl leading-9 text-[#3f382f] ${index === 0 ? "first-letter:float-left first-letter:mr-3 first-letter:mt-1 first-letter:font-serif first-letter:text-6xl first-letter:font-semibold first-letter:leading-[0.85] first-letter:text-[var(--brand-primary-ink)]" : ""}`}
            >
              {paragraph}
            </p>
          ))}
          {showPullQuote ? (
            <blockquote className="my-10 border-l-2 border-[var(--brand-accent)] py-2 pl-6 font-serif text-3xl leading-snug text-[var(--brand-primary-ink)]">
              <Quote className="mb-3 h-5 w-5" aria-hidden="true" />
              {pullQuote}
            </blockquote>
          ) : null}
        </div>

        {sources.length ? (
          <section aria-labelledby="story-sources" className="mt-14 border-t border-[#3c3325]/10 pt-8">
            <h2 id="story-sources" className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#776a58]">
              {sources.length === 1 ? "Source for this story" : "Sources for this story"}
            </h2>
            <ul className="mt-4 space-y-3">
              {sources.map((source) => (
                <li key={source.id}>
                  <Link href={`${basePath}/sources/${source.id}`} className="group flex items-start gap-4 rounded-xl border border-[#3c3325]/10 bg-white p-5 transition-colors hover:border-[var(--brand-primary-ink)]">
                    <FileCheck2 className="mt-1 h-5 w-5 shrink-0 text-[var(--brand-primary-ink)]" aria-hidden="true" />
                    <span className="min-w-0 flex-1">
                      <span className="block font-serif text-xl font-semibold">{source.title}</span>
                      {source.detail ? <span className="mt-1 block text-sm leading-6 text-[#6c6255]">{source.detail}</span> : null}
                    </span>
                    <ArrowRight className="mt-1.5 h-4 w-4 shrink-0 text-[#817667] transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        ) : null}

        {people.length ? (
          <section aria-labelledby="story-people" className="mt-12">
            <h2 id="story-people" className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#776a58]">People in this story</h2>
            <ul className="mt-4 grid gap-3 sm:grid-cols-2">
              {people.map((person) => (
                <li key={person.id}>
                  <Link href={`${basePath}/people/${person.id}`} className="flex items-center gap-3 rounded-xl border border-[#3c3325]/10 bg-white p-3 transition-colors hover:border-[var(--brand-primary-ink)]">
                    <span className="relative h-12 w-12 shrink-0 overflow-hidden rounded-full bg-[#ded5c5]">
                      <Image src={person.imagePath} alt="" fill sizes="48px" className="object-cover" />
                    </span>
                    <span className="min-w-0">
                      <span className="block truncate font-semibold">{person.name}</span>
                      <span className="block text-xs text-[#766c5e]">{person.years}</span>
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        ) : null}

        {nextStory ? (
          <Link href={`${basePath}/stories/${nextStory.id}`} className="group mt-14 flex items-center justify-between gap-6 rounded-2xl bg-[var(--brand-deep)] p-6 text-[var(--brand-on-deep)] sm:p-8">
            <span>
              <span className="block text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--brand-accent-on-deep)]">Next story</span>
              <span className="mt-2 block font-serif text-2xl font-semibold leading-tight sm:text-3xl">{nextStory.title}</span>
              <span className="mt-2 block text-sm opacity-80">{nextStory.dek}</span>
            </span>
            <ArrowRight className="h-5 w-5 shrink-0 transition-transform group-hover:translate-x-1" aria-hidden="true" />
          </Link>
        ) : null}
      </div>
    </article>
  );
}

function formatNames(names: string[]) {
  if (names.length <= 1) return names[0] ?? "";
  if (names.length === 2) return `${names[0]} and ${names[1]}`;
  return `${names.slice(0, -1).join(", ")} and ${names.at(-1)}`;
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
      <Link href={basePath} className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.14em] text-[var(--brand-primary-ink)]"><ArrowLeft className="h-3.5 w-3.5" /> Back to the family archive</Link>
      <div className="mt-8 grid gap-10 lg:grid-cols-[minmax(0,1fr)_380px]">
        <div className="relative min-h-[640px] overflow-hidden rounded-2xl bg-[#d8cfbf] shadow-xl">
          <Image src={previewPath} alt={`Preview of ${title}`} fill priority sizes="(max-width: 1024px) 100vw, 760px" className="object-contain p-4 sm:p-8" />
        </div>
        <aside className="space-y-6">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#776a58]">Record</p>
            <h1 className="mt-3 font-serif text-4xl font-semibold leading-tight">{title}</h1>
            <p className="mt-4 text-sm leading-7 text-[#6e6456]">{citation}</p>
          </div>
          <InfoPanel title="Record details">
            <dl className="space-y-4"><div><dt className="text-[10px] font-semibold uppercase tracking-[0.13em] text-[#817667]">Repository</dt><dd className="mt-1 text-sm">{repository}</dd></div><div><dt className="text-[10px] font-semibold uppercase tracking-[0.13em] text-[#817667]">Date</dt><dd className="mt-1 flex items-center gap-2 text-sm"><CalendarDays className="h-4 w-4" />{date}</dd></div></dl>
          </InfoPanel>
          <InfoPanel title="About this record"><p className="text-sm leading-6 text-[#665d50]">{transcription}</p></InfoPanel>
          <InfoPanel title="Connected people"><div className="space-y-2">{connectedPeople.map((person) => <Link key={person.id} href={`${basePath}/people/${person.id}`} className="block text-sm font-semibold text-[var(--brand-primary-ink)]">{person.name}</Link>)}</div></InfoPanel>
          <button type="button" disabled={!downloadAvailable} className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-[var(--brand-primary)] px-5 py-3 text-sm font-semibold text-[var(--brand-on-primary)] disabled:cursor-not-allowed disabled:opacity-50"><Download className="h-4 w-4" />{downloadAvailable ? "Download authenticated original" : "Original download unavailable in demo"}</button>
          <p className="text-xs leading-5 text-[#786f62]">{downloadAvailable ? "The original file is available only to invited family members." : "This page shows a preview of the record. The original file isn't available in this demonstration."}</p>
        </aside>
      </div>
    </div>
  );
}

function InfoPanel({ title, children }: { title: string; children: ReactNode }) {
  return <section className="rounded-xl border border-[#3c3325]/10 bg-white p-5"><h2 className="mb-4 font-serif text-xl font-semibold">{title}</h2>{children}</section>;
}
