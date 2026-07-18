import { ArrowRight, BookOpenText, FileText, GitBranch, Lock, Users } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { AncestorCard } from "@/components/showcase/ancestor-card";
import { PersonPortrait } from "@/components/showcase/person-portrait";
import { TiltCard } from "@/components/showcase/tilt-card";

export type ShowcasePersonCard = {
  id: string;
  name: string;
  years: string;
  summary: string;
  /** Null when no photograph exists, which renders a monogram instead. */
  imagePath: string | null;
};

export type ShowcaseStoryCard = {
  id: string;
  title: string;
  dek: string;
  period: string;
  imagePath: string;
  readMinutes: number;
};

export function ShowcaseHome({
  basePath,
  familyName,
  eyebrow,
  tagline,
  introduction,
  focalPerson,
  people,
  stories,
  sourcePreviewPath,
  featuredSourceId,
  curatorName,
}: {
  basePath: string;
  familyName: string;
  eyebrow: string;
  tagline: string;
  introduction: string;
  heroPath?: string;
  focalPerson: ShowcasePersonCard | null;
  people: ShowcasePersonCard[];
  stories: ShowcaseStoryCard[];
  sourcePreviewPath: string;
  /** Null when the archive has no cited records yet, which hides the record rail. */
  featuredSourceId?: string | null;
  curatorName?: string;
}) {
  if (!focalPerson) {
    return <ShowcaseAwaitingArchive familyName={familyName} curatorName={curatorName} />;
  }

  return (
    <div>
      <section className="relative overflow-hidden bg-[var(--sc-surface)] text-[var(--sc-ink)]">
        <Image
          src="/showcase/hub-archive-bg.webp"
          alt=""
          fill
          priority
          sizes="100vw"
          className="hidden object-cover md:block"
        />
        <div aria-hidden className="absolute inset-0 hidden bg-[var(--sc-hero-tint)] md:block" />
        <div
          aria-hidden
          className="absolute inset-0 hidden bg-[image:var(--sc-hero-scrim)] md:block"
        />
        <div className="relative mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:px-6 md:py-16 lg:grid-cols-[0.85fr_1.15fr] lg:items-center lg:gap-16 lg:px-8 lg:py-20">
          <TiltCard className="mx-auto w-full max-w-[380px] lg:max-w-[420px]">
            <AncestorCard
              name={focalPerson.name}
              lifespan={focalPerson.years}
              portraitSrc={focalPerson.imagePath ?? undefined}
              portraitTreatment="period"
              zoom={1.22}
              focalY={30}
            />
          </TiltCard>

          <div className="max-w-xl space-y-7">
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[var(--sc-ink-muted)]">{eyebrow}</p>
            <div className="space-y-3">
              <h1 className="font-serif text-5xl font-semibold leading-[0.98] tracking-[-0.035em] sm:text-6xl">
                {familyName}
              </h1>
              <p className="max-w-lg font-serif text-2xl leading-snug text-[var(--sc-ink-secondary)]">{tagline}</p>
            </div>
            <p className="max-w-lg text-sm leading-7 text-[var(--sc-ink-secondary)] sm:text-base">{introduction}</p>

            <div className="flex flex-col gap-3 sm:max-w-md">
              <Link
                href={`${basePath}/people/${focalPerson.id}`}
                className="group flex items-center justify-between gap-4 rounded-lg bg-[var(--sc-accent)] px-5 py-3.5 text-[var(--sc-accent-contrast)] shadow-md transition-colors hover:bg-[var(--sc-accent-hover)]"
              >
                <span>
                  <span className="block text-sm font-semibold">Discover an ancestor</span>
                  <span className="block text-xs opacity-75">Open a person from your family history</span>
                </span>
                <ArrowRight className="h-4 w-4 shrink-0 transition-transform group-hover:translate-x-0.5" />
              </Link>
              <Link
                href={`${basePath}/tree?person=${focalPerson.id}`}
                className="group flex items-center justify-between gap-4 rounded-lg border border-[var(--sc-border-strong)] bg-[var(--sc-elevated)]/70 px-5 py-3.5 text-[var(--sc-ink-secondary)] backdrop-blur-sm transition-colors hover:bg-[var(--sc-elevated)]"
              >
                <span>
                  <span className="block text-sm font-semibold">Browse a family branch</span>
                  <span className="block text-xs opacity-70">Explore relationships across generations</span>
                </span>
                <ArrowRight className="h-4 w-4 shrink-0 transition-transform group-hover:translate-x-0.5" />
              </Link>
            </div>

            <nav aria-label="Archive sections" className="flex flex-wrap gap-2">
              <ChapterChip href={`${basePath}/people`} icon={<Users className="h-3.5 w-3.5" />} label="People" />
              {stories.length ? (
                <ChapterChip href={`${basePath}/stories`} icon={<BookOpenText className="h-3.5 w-3.5" />} label="Stories" />
              ) : null}
              <ChapterChip href={`${basePath}/tree?person=${focalPerson.id}`} icon={<GitBranch className="h-3.5 w-3.5" />} label="Tree" />
              {featuredSourceId ? (
                <ChapterChip href={`${basePath}/sources/${featuredSourceId}`} icon={<FileText className="h-3.5 w-3.5" />} label="Records" />
              ) : null}
            </nav>

            <div className="flex items-start gap-3 rounded-lg border border-[var(--sc-border-strong)] bg-[var(--sc-accent-wash)] px-4 py-3 shadow-sm backdrop-blur-sm">
              <Lock className="mt-0.5 h-4 w-4 shrink-0 text-[var(--sc-accent)]" />
              <p className="text-xs leading-5 text-[var(--sc-ink-secondary)]">
                <span className="font-semibold">
                  Prepared for {familyName}
                  {curatorName ? ` by ${curatorName}` : ""}.
                </span>{" "}
                Private — shared only with invited family.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-[var(--sc-border)] bg-[var(--sc-surface)]">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
          <div className="mb-9 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[var(--sc-ink-muted)]">Featured ancestors</p>
              <h2 className="mt-2 font-serif text-4xl font-semibold tracking-tight sm:text-5xl">People behind the names</h2>
            </div>
            <Link href={`${basePath}/people`} className="inline-flex items-center gap-2 text-sm font-semibold text-[var(--sc-accent)]">
              Meet the family <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {people.slice(0, 4).map((person) => (
              <Link key={person.id} href={`${basePath}/people/${person.id}`} className="group overflow-hidden rounded-2xl bg-[var(--sc-elevated)] shadow-sm">
                <div className="relative aspect-[4/5] overflow-hidden bg-[var(--sc-surface)]">
                  <PersonPortrait name={person.name} src={person.imagePath} sizes="(max-width: 640px) 100vw, 25vw" className="transition-transform duration-500 group-hover:scale-[1.03]" monogramClassName="text-6xl" />
                </div>
                <div className="space-y-1 p-4">
                  <p className="font-serif text-xl font-semibold">{person.name}</p>
                  <p className="text-xs text-[var(--sc-ink-muted)]">{person.years}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {stories.length ? (
        <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
          <div className="mb-9 max-w-2xl space-y-3">
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[var(--sc-ink-muted)]">Curated stories</p>
            <h2 className="font-serif text-4xl font-semibold tracking-tight sm:text-5xl">A few moments worth carrying forward</h2>
            <p className="leading-7 text-[var(--sc-ink-secondary)]">Short, sourced narratives make the structure of a tree feel personal without overwhelming the reader.</p>
          </div>
          <div className="grid gap-6 lg:grid-cols-3">
            {stories.slice(0, 3).map((story) => (
              <Link key={story.id} href={`${basePath}/stories/${story.id}`} className="group overflow-hidden rounded-2xl border border-[var(--sc-border)] bg-[var(--sc-elevated)]">
                <div className="relative aspect-[16/10] overflow-hidden bg-[var(--sc-surface)]">
                  <Image src={story.imagePath} alt="" fill sizes="(max-width: 1024px) 100vw, 33vw" className="object-cover transition-transform duration-500 group-hover:scale-[1.025]" />
                </div>
                <div className="space-y-3 p-5">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[var(--sc-ink-muted)]">{story.period} · {story.readMinutes} min read</p>
                  <h3 className="font-serif text-2xl font-semibold leading-tight">{story.title}</h3>
                  <p className="text-sm leading-6 text-[var(--sc-ink-secondary)]">{story.dek}</p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      ) : null}

      {featuredSourceId ? (
        <section className="bg-[var(--sc-band)] text-[var(--sc-band-ink)]">
          <div className="mx-auto grid max-w-7xl gap-10 px-4 py-16 sm:px-6 lg:grid-cols-[0.9fr_1.1fr] lg:items-center lg:px-8 lg:py-24">
            <div className="relative mx-auto aspect-[4/5] w-full max-w-sm overflow-hidden rounded-2xl bg-[var(--sc-surface)] shadow-2xl">
              <Image src={sourcePreviewPath} alt="Preview of a cited family record" fill sizes="384px" className="object-cover" />
            </div>
            <div className="max-w-2xl space-y-5">
              <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[var(--sc-band-accent)]">Research you can trace</p>
              <h2 className="font-serif text-4xl font-semibold tracking-tight sm:text-5xl">Every story keeps its connection to the record.</h2>
              <p className="leading-7 opacity-75">Dates, memories, and narrative details stay linked to source references, so relatives can enjoy the story and still understand where it came from.</p>
              <Link href={`${basePath}/sources/${featuredSourceId}`} className="inline-flex items-center gap-2 rounded-full border border-current/25 px-5 py-3 text-sm font-semibold transition-colors hover:bg-white/10">
                <FileText className="h-4 w-4" /> View a source
              </Link>
            </div>
          </div>
        </section>
      ) : null}
    </div>
  );
}

/**
 * Shown before a GEDCOM has been imported. Deliberately calm rather than an
 * error: an empty archive is a normal early state, and a genealogist may open
 * this page while still preparing the file.
 */
function ShowcaseAwaitingArchive({
  familyName,
  curatorName,
}: {
  familyName: string;
  curatorName?: string;
}) {
  return (
    <section className="mx-auto flex min-h-[70vh] max-w-2xl flex-col items-center justify-center px-4 py-20 text-center">
      <span className="grid h-14 w-14 place-items-center rounded-full border border-[var(--sc-border-strong)] bg-[var(--sc-accent-wash)] text-[var(--sc-accent)]">
        <BookOpenText className="h-6 w-6" />
      </span>
      <h1 className="mt-6 font-serif text-4xl font-semibold leading-tight sm:text-5xl">
        {familyName}
      </h1>
      <p className="mt-4 text-base leading-7 text-[var(--sc-ink-secondary)]">
        This archive is being prepared. Once the family records are brought in,
        the people, stories, and family tree appear here.
      </p>
      {curatorName ? (
        <p className="mt-8 text-xs font-semibold uppercase tracking-[0.16em] text-[var(--sc-ink-muted)]">
          Curated by {curatorName}
        </p>
      ) : null}
    </section>
  );
}

function ChapterChip({ href, icon, label }: { href: string; icon: React.ReactNode; label: string }) {
  return (
    <Link
      href={href}
      className="inline-flex items-center gap-1.5 rounded-full border border-[var(--sc-border-strong)] bg-[var(--sc-elevated)]/70 px-3.5 py-1.5 text-xs font-semibold uppercase tracking-[0.1em] text-[var(--sc-ink-secondary)] backdrop-blur-sm transition-colors hover:border-[var(--sc-accent)] hover:text-[var(--sc-accent)]"
    >
      {icon}
      {label}
    </Link>
  );
}
