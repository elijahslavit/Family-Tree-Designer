import { ArrowLeft, ArrowRight, CalendarDays, Download, FileCheck2, MapPin, Quote, UsersRound } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";

import type { ShowcasePersonCard, ShowcaseStoryCard } from "@/components/pilot/showcase-home";
import { AncestorCard } from "@/components/showcase/ancestor-card";
import { PersonPortrait } from "@/components/showcase/person-portrait";
import { TiltCard } from "@/components/showcase/tilt-card";

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
    <header className="border-b border-[var(--sc-border)] bg-[var(--sc-surface)]">
      <div className="mx-auto max-w-7xl space-y-4 px-4 py-14 sm:px-6 sm:py-20 lg:px-8">
        <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[var(--sc-ink-muted)]">{eyebrow}</p>
        <h1 className="max-w-4xl font-serif text-5xl font-semibold tracking-[-0.03em] sm:text-6xl">{title}</h1>
        <p className="max-w-2xl text-base leading-7 text-[var(--sc-ink-secondary)]">{description}</p>
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
          <Link key={person.id} href={`${basePath}/people/${person.id}`} className="group overflow-hidden rounded-2xl border border-[var(--sc-border)] bg-[var(--sc-elevated)] transition-colors hover:border-[var(--sc-border-strong)]">
            <div className="relative aspect-[4/5] bg-[var(--sc-surface)]">
              <PersonPortrait name={person.name} src={person.imagePath} sizes="(max-width: 640px) 100vw, 25vw" className="transition-transform duration-500 group-hover:scale-[1.025]" monogramClassName="text-6xl" />
            </div>
            <div className="space-y-2 p-5">
              <p className="font-serif text-2xl font-semibold leading-tight">{person.name}</p>
              <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[var(--sc-ink-muted)]">{person.years}</p>
              <p className="line-clamp-3 text-sm leading-6 text-[var(--sc-ink-secondary)]">{person.summary}</p>
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
          <Link key={story.id} href={`${basePath}/stories/${story.id}`} className="group grid overflow-hidden rounded-2xl border border-[var(--sc-border)] bg-[var(--sc-elevated)] transition-colors hover:border-[var(--sc-border-strong)] sm:grid-cols-[220px_1fr]">
            <div className="relative min-h-56 bg-[var(--sc-surface)]">
              <Image src={story.imagePath} alt="" fill sizes="220px" className="object-cover transition-transform duration-500 group-hover:scale-[1.025]" />
            </div>
            <div className="flex flex-col p-6">
              <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[var(--sc-ink-muted)]">{story.period} · {story.readMinutes} min read</p>
              <h2 className="mt-3 font-serif text-3xl font-semibold leading-tight">{story.title}</h2>
              <p className="mt-3 text-sm leading-6 text-[var(--sc-ink-secondary)]">{story.dek}</p>
              <span className="mt-auto inline-flex items-center gap-2 pt-5 text-sm font-semibold text-[var(--sc-accent)]">Read story <ArrowRight className="h-4 w-4" /></span>
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
      <section className="border-b border-[var(--sc-border)] bg-[var(--sc-surface)]">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 py-10 sm:px-6 lg:grid-cols-[360px_1fr] lg:items-end lg:px-8 lg:py-16">
          <div className="mx-auto w-full max-w-[360px]">
            <TiltCard>
              <AncestorCard
                name={person.name}
                lifespan={person.years}
                portraitSrc={person.imagePath ?? undefined}
                portraitAlt={`Portrait of ${person.name}`}
                portraitTreatment="period"
                masked={/living/i.test(person.years)}
                zoom={1.22}
                focalY={30}
              />
            </TiltCard>
          </div>
          <div className="space-y-5 pb-2">
            <Link href={`${basePath}/people`} className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.14em] text-[var(--sc-accent)]">
              <ArrowLeft className="h-3.5 w-3.5" /> All people
            </Link>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--sc-ink-muted)]">{person.years}</p>
              <h1 className="mt-3 font-serif text-5xl font-semibold leading-[0.98] tracking-[-0.035em] sm:text-7xl">{person.name}</h1>
            </div>
            <p className="max-w-2xl font-serif text-2xl leading-snug text-[var(--sc-ink-secondary)]">{person.summary}</p>
            <div className="flex flex-wrap gap-4 text-sm text-[var(--sc-ink-secondary)]">
              <span className="inline-flex items-center gap-2"><MapPin className="h-4 w-4" /> {birthPlace}</span>
              <Link href={`${basePath}/tree?person=${person.id}`} className="inline-flex items-center gap-2 font-semibold text-[var(--sc-accent)]"><UsersRound className="h-4 w-4" /> See in family tree</Link>
            </div>
          </div>
        </div>
      </section>

      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:px-6 lg:grid-cols-[minmax(0,1fr)_320px] lg:px-8 lg:py-16">
        <article className="space-y-8">
          <div className="space-y-5">
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--sc-ink-muted)]">Life sketch</p>
            {biography.map((paragraph) => <p key={paragraph.slice(0, 40)} className="font-serif text-xl leading-9 text-[var(--sc-ink-secondary)]">{paragraph}</p>)}
          </div>
          {stories.length ? (
            <section className="space-y-4 border-t border-[var(--sc-border)] pt-8">
              <h2 className="font-serif text-3xl font-semibold">Stories featuring {person.name.split(" ")[0]}</h2>
              {stories.map((story) => (
                <Link key={story.id} href={`${basePath}/stories/${story.id}`} className="flex items-center justify-between gap-4 rounded-xl border border-[var(--sc-border)] bg-[var(--sc-elevated)] p-4 hover:border-[var(--sc-border-strong)]">
                  <span><span className="block font-serif text-xl font-semibold">{story.title}</span><span className="mt-1 block text-xs text-[var(--sc-ink-muted)]">{story.period} · {story.readMinutes} min read</span></span>
                  <ArrowRight className="h-4 w-4 shrink-0" />
                </Link>
              ))}
            </section>
          ) : null}
        </article>
        <aside className="space-y-5">
          <InfoPanel title="Recorded facts">
            <dl className="space-y-4">{facts.map((fact) => <div key={fact.label}><dt className="text-[10px] font-semibold uppercase tracking-[0.13em] text-[var(--sc-ink-muted)]">{fact.label}</dt><dd className="mt-1 text-sm leading-6">{fact.value}</dd></div>)}</dl>
          </InfoPanel>
          <InfoPanel title="Close family">
            <div className="space-y-3">{relatives.map((relative) => <Link key={relative.id} href={`${basePath}/people/${relative.id}`} className="flex items-center gap-3"><span className="relative h-10 w-10 overflow-hidden rounded-full bg-[var(--sc-surface)]"><PersonPortrait name={relative.name} src={relative.imagePath} sizes="40px" monogramClassName="text-base" /></span><span><span className="block text-sm font-semibold">{relative.name}</span><span className="block text-xs text-[var(--sc-ink-muted)]">{relative.years}</span></span></Link>)}</div>
          </InfoPanel>
          <InfoPanel title="Source note">
            <Link href={`${basePath}/sources/${source.id}`} className="block rounded-lg bg-[var(--sc-accent-wash)] p-3 text-sm leading-6 transition-colors hover:bg-[var(--sc-surface)]"><span className="font-semibold">{source.title}</span><span className="mt-1 block text-xs text-[var(--sc-ink-muted)]">{source.detail}</span></Link>
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
        <Link href={`${basePath}/stories`} className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.14em] text-[var(--sc-accent)]"><ArrowLeft className="h-3.5 w-3.5" /> All stories</Link>
        <p className="mt-8 text-[11px] font-semibold uppercase tracking-[0.2em] text-[var(--sc-ink-muted)]">{story.period} · {story.readMinutes} minute read</p>
        <h1 className="mx-auto mt-4 max-w-4xl font-serif text-5xl font-semibold leading-[1.02] tracking-[-0.035em] sm:text-7xl">{story.title}</h1>
        <p className="mx-auto mt-5 max-w-2xl font-serif text-xl leading-8 text-[var(--sc-ink-secondary)] sm:text-2xl">{story.dek}</p>
      </header>
      <div className="relative mx-auto aspect-[16/8] max-w-7xl overflow-hidden bg-[var(--sc-surface)] sm:rounded-2xl">
        <Image src={story.imagePath} alt="" fill priority sizes="1280px" className="object-cover" />
      </div>
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-12 sm:px-6 lg:grid-cols-[220px_minmax(0,680px)] lg:justify-center lg:py-16">
        <aside className="space-y-5 lg:sticky lg:top-24 lg:self-start">
          <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[var(--sc-ink-muted)]">People in this story</p>
          {people.map((person) => <Link key={person.id} href={`${basePath}/people/${person.id}`} className="flex items-center gap-3"><span className="relative h-10 w-10 overflow-hidden rounded-full bg-[var(--sc-surface)]"><PersonPortrait name={person.name} src={person.imagePath} sizes="40px" monogramClassName="text-base" /></span><span className="text-sm font-semibold">{person.name}</span></Link>)}
        </aside>
        <div className="space-y-9">
          {body.map((section, index) => (
            <section key={section.heading ?? index} className="space-y-5">
              {section.heading ? <h2 className="font-serif text-3xl font-semibold">{section.heading}</h2> : null}
              {section.paragraphs.map((paragraph) => <p key={paragraph.slice(0, 50)} className="font-serif text-xl leading-9 text-[var(--sc-ink-secondary)]">{paragraph}</p>)}
              {section.pullQuote ? <blockquote className="border-l-2 border-[var(--sc-accent)] py-2 pl-6 font-serif text-3xl leading-snug text-[var(--sc-accent)]"><Quote className="mb-3 h-5 w-5" />{section.pullQuote}</blockquote> : null}
            </section>
          ))}
          <Link href={`${basePath}/sources/${source.id}`} className="flex items-start gap-3 rounded-xl border border-[var(--sc-border)] bg-[var(--sc-accent-wash)] p-5"><FileCheck2 className="mt-0.5 h-5 w-5 shrink-0 text-[var(--sc-accent)]" /><span><span className="block text-xs font-semibold uppercase tracking-[0.14em] text-[var(--sc-ink-muted)]">Source behind this story</span><span className="mt-1 block font-serif text-xl font-semibold">{source.title}</span><span className="mt-1 block text-sm text-[var(--sc-ink-secondary)]">{source.detail}</span></span></Link>
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
      <Link href={basePath} className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.14em] text-[var(--sc-accent)]"><ArrowLeft className="h-3.5 w-3.5" /> Return to archive</Link>
      <div className="mt-8 grid gap-10 lg:grid-cols-[minmax(0,1fr)_380px]">
        <div className="relative min-h-[640px] overflow-hidden rounded-2xl bg-[var(--sc-surface)] shadow-[var(--sc-shadow)]">
          <Image src={previewPath} alt={`Preview of ${title}`} fill priority sizes="(max-width: 1024px) 100vw, 760px" className="object-contain p-4 sm:p-8" />
        </div>
        <aside className="space-y-6">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--sc-ink-muted)]">Source record</p>
            <h1 className="mt-3 font-serif text-4xl font-semibold leading-tight">{title}</h1>
            <p className="mt-4 text-sm leading-7 text-[var(--sc-ink-secondary)]">{citation}</p>
          </div>
          <InfoPanel title="Record details">
            <dl className="space-y-4"><div><dt className="text-[10px] font-semibold uppercase tracking-[0.13em] text-[var(--sc-ink-muted)]">Repository</dt><dd className="mt-1 text-sm">{repository}</dd></div><div><dt className="text-[10px] font-semibold uppercase tracking-[0.13em] text-[var(--sc-ink-muted)]">Date</dt><dd className="mt-1 flex items-center gap-2 text-sm"><CalendarDays className="h-4 w-4" />{date}</dd></div></dl>
          </InfoPanel>
          <InfoPanel title="Archive note"><p className="text-sm leading-6 text-[var(--sc-ink-secondary)]">{transcription}</p></InfoPanel>
          <InfoPanel title="Connected people"><div className="space-y-2">{connectedPeople.map((person) => <Link key={person.id} href={`${basePath}/people/${person.id}`} className="block text-sm font-semibold text-[var(--sc-accent)]">{person.name}</Link>)}</div></InfoPanel>
          <button type="button" disabled={!downloadAvailable} className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-[var(--sc-accent)] px-5 py-3 text-sm font-semibold text-[var(--sc-accent-contrast)] transition-colors hover:bg-[var(--sc-accent-hover)] disabled:cursor-not-allowed disabled:opacity-50"><Download className="h-4 w-4" />{downloadAvailable ? "Download original" : "Original not yet attached"}</button>
          <p className="text-xs leading-5 text-[var(--sc-ink-muted)]">Original files are authenticated attachment downloads. This page displays only a separately generated inert preview.</p>
        </aside>
      </div>
    </div>
  );
}

function InfoPanel({ title, children }: { title: string; children: ReactNode }) {
  return <section className="rounded-xl border border-[var(--sc-border)] bg-[var(--sc-elevated)] p-5"><h2 className="mb-4 font-serif text-xl font-semibold">{title}</h2>{children}</section>;
}
