import { ArrowRight, BookOpenText, FileText, GitBranch, Lock, Users } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { ShowcaseReveal } from "@/components/pilot/showcase-reveal";
import { AncestorCard } from "@/components/showcase/ancestor-card";
import { TiltCard } from "@/components/showcase/tilt-card";
import { revealKeyFor, revealPreloadScript, revealPreloadStyle } from "@/lib/showcase/reveal";

export type ShowcasePersonCard = {
  id: string;
  name: string;
  years: string;
  summary: string;
  imagePath: string;
};

/** "Summer 1968 · 2 min read", omitting the period when a story has none. */
export function storyMeta(story: Pick<ShowcaseStoryCard, "period" | "readMinutes">, unit: "min" | "minute" = "min") {
  return [story.period, `${story.readMinutes} ${unit} read`].filter(Boolean).join(" · ");
}

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
  curatorName,
}: {
  basePath: string;
  familyName: string;
  eyebrow: string;
  tagline: string;
  introduction: string;
  heroPath?: string;
  focalPerson: ShowcasePersonCard;
  people: ShowcasePersonCard[];
  stories: ShowcaseStoryCard[];
  sourcePreviewPath: string;
  curatorName?: string;
}) {
  const revealKey = revealKeyFor(basePath);

  return (
    <div>
      <style>{revealPreloadStyle(revealKey)}</style>
      <script dangerouslySetInnerHTML={{ __html: revealPreloadScript(revealKey) }} />
      <ShowcaseReveal
        revealKey={revealKey}
        familyName={familyName}
        eyebrow={eyebrow}
        tagline={tagline}
        curatorName={curatorName}
        portrait={{ src: focalPerson.imagePath, name: focalPerson.name, years: focalPerson.years }}
      />
      <section className="relative overflow-hidden bg-[#efe6d4] text-[#26231e]">
        <Image
          src="/showcase/hub-archive-bg.webp"
          alt=""
          fill
          priority
          sizes="100vw"
          className="hidden object-cover md:block"
        />
        <div
          aria-hidden
          className="absolute inset-0 hidden bg-[linear-gradient(90deg,rgba(242,233,216,0)_0%,rgba(242,233,216,0)_38%,rgba(242,233,216,0.62)_58%,rgba(242,233,216,0.8)_100%)] md:block"
        />
        <div className="relative mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:px-6 md:py-16 lg:grid-cols-[0.85fr_1.15fr] lg:items-center lg:gap-16 lg:px-8 lg:py-20">
          <TiltCard className="mx-auto w-full max-w-[380px] lg:max-w-[420px]">
            <AncestorCard
              name={focalPerson.name}
              lifespan={focalPerson.years}
              portraitSrc={focalPerson.imagePath}
              portraitTreatment="period"
              zoom={1.22}
              focalY={30}
            />
          </TiltCard>

          <div className="max-w-xl space-y-7">
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#6b5d47]">{eyebrow}</p>
            <div className="space-y-3">
              <h1 className="font-serif text-5xl font-semibold leading-[0.98] tracking-[-0.035em] sm:text-6xl">
                {familyName}
              </h1>
              <p className="max-w-lg font-serif text-2xl leading-snug text-[#4f4335]">{tagline}</p>
            </div>
            <p className="max-w-lg text-sm leading-7 text-[#5c5142] sm:text-base">{introduction}</p>

            <div className="flex flex-col gap-3 sm:max-w-md">
              <Link
                href={`${basePath}/people/${focalPerson.id}`}
                className="group flex items-center justify-between gap-4 rounded-lg bg-[var(--brand-primary)] px-5 py-3.5 text-[var(--brand-on-primary)] shadow-md transition-colors hover:bg-[var(--brand-primary-hover)]"
              >
                <span>
                  <span className="block text-sm font-semibold">Discover an ancestor</span>
                  <span className="block text-xs opacity-80">Open a person from your family history</span>
                </span>
                <ArrowRight className="h-4 w-4 shrink-0 transition-transform group-hover:translate-x-0.5" />
              </Link>
              <Link
                href={`${basePath}/tree?person=${focalPerson.id}`}
                className="group flex items-center justify-between gap-4 rounded-lg border border-[color-mix(in_oklab,var(--brand-accent-ink)_50%,transparent)] bg-[#f6efe0]/70 px-5 py-3.5 text-[#4f4335] backdrop-blur-sm transition-colors hover:bg-[#f6efe0]"
              >
                <span>
                  <span className="block text-sm font-semibold">Browse a family branch</span>
                  <span className="block text-xs text-[#4f4335]/70">Explore relationships across generations</span>
                </span>
                <ArrowRight className="h-4 w-4 shrink-0 transition-transform group-hover:translate-x-0.5" />
              </Link>
            </div>

            <nav aria-label="Archive sections" className="flex flex-wrap gap-2">
              <ChapterChip href={`${basePath}/people`} icon={<Users className="h-3.5 w-3.5" />} label="People" />
              <ChapterChip href={`${basePath}/stories`} icon={<BookOpenText className="h-3.5 w-3.5" />} label="Stories" />
              <ChapterChip href={`${basePath}/tree?person=${focalPerson.id}`} icon={<GitBranch className="h-3.5 w-3.5" />} label="Tree" />
              <ChapterChip href={`${basePath}/sources/src01`} icon={<FileText className="h-3.5 w-3.5" />} label="Records" />
            </nav>

            <div className="flex items-start gap-3 rounded-lg border border-[color-mix(in_oklab,var(--brand-accent-ink)_45%,transparent)] bg-[color-mix(in_oklab,var(--brand-accent-soft)_85%,transparent)] px-4 py-3 shadow-sm backdrop-blur-sm">
              <Lock className="mt-0.5 h-4 w-4 shrink-0 text-[var(--brand-accent-ink)]" />
              <p className="text-xs leading-5 text-[#5c5142]">
                <span className="font-semibold">
                  Prepared for {familyName}
                  {curatorName ? ` by ${curatorName}` : ""}.
                </span>{" "}
                Private — shared only with invited family.
              </p>
            </div>
          </div>
        </div>
        <p className="absolute bottom-4 right-4 rounded-full bg-[#26231e]/25 px-3 py-1 text-[10px] uppercase tracking-[0.14em] text-[#26231e]/70 backdrop-blur">
          Synthetic demonstration media
        </p>
      </section>

      <section className="border-y border-[#3c3325]/10 bg-[#eee6d7]">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
          <div className="mb-9 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#62574a]">Featured ancestors</p>
              <h2 className="mt-2 font-serif text-4xl font-semibold tracking-tight sm:text-5xl">People behind the names</h2>
            </div>
            <Link href={`${basePath}/people`} className="inline-flex items-center gap-2 text-sm font-semibold text-[var(--brand-primary-ink)]">
              Meet the family <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-4">
            {people.slice(0, 4).map((person) => (
              <Link key={person.id} href={`${basePath}/people/${person.id}`} className="group overflow-hidden rounded-2xl bg-[#fbf8f0] shadow-sm">
                <div className="relative aspect-[4/5] overflow-hidden bg-[#d8cfbf]">
                  <Image src={person.imagePath} alt={`Synthetic portrait for ${person.name}`} fill sizes="(max-width: 1024px) 50vw, 25vw" className="object-cover transition-transform duration-500 group-hover:scale-[1.03]" />
                </div>
                <div className="space-y-1 p-3 sm:p-4">
                  <p className="font-serif text-base font-semibold leading-tight sm:text-xl">{person.name}</p>
                  <p className="text-xs text-[#645a4e]">{person.years}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
        <div className="mb-9 max-w-2xl space-y-3">
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#62574a]">Curated stories</p>
          <h2 className="font-serif text-4xl font-semibold tracking-tight sm:text-5xl">A few moments worth carrying forward</h2>
          <p className="leading-7 text-[#6d6253]">Short, sourced narratives make the structure of a tree feel personal without overwhelming the reader.</p>
        </div>
        <div className="grid gap-6 lg:grid-cols-3">
          {stories.slice(0, 3).map((story) => (
            <Link key={story.id} href={`${basePath}/stories/${story.id}`} className="group overflow-hidden rounded-2xl border border-[#3c3325]/10 bg-white">
              <div className="relative aspect-[16/10] overflow-hidden bg-[#ded5c5]">
                <Image src={story.imagePath} alt="" fill sizes="(max-width: 1024px) 100vw, 33vw" className="object-cover object-top transition-transform duration-500 group-hover:scale-[1.025]" />
              </div>
              <div className="space-y-3 p-5">
                <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[#64584a]">{storyMeta(story)}</p>
                <h3 className="font-serif text-2xl font-semibold leading-tight">{story.title}</h3>
                <p className="text-sm leading-6 text-[#6f6557]">{story.dek}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="bg-[var(--brand-deep)] text-[var(--brand-on-deep)]">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 py-16 sm:px-6 lg:grid-cols-[0.9fr_1.1fr] lg:items-center lg:px-8 lg:py-24">
          <div className="relative mx-auto aspect-[4/5] w-full max-w-sm overflow-hidden rounded-2xl bg-[#ded5c5] shadow-2xl">
            <Image src={sourcePreviewPath} alt="Synthetic preview of a cited family record" fill sizes="384px" className="object-cover" />
          </div>
          <div className="max-w-2xl space-y-5">
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[var(--brand-accent-on-deep)]">Research you can trace</p>
            <h2 className="font-serif text-4xl font-semibold tracking-tight text-[var(--brand-on-deep)] sm:text-5xl">Every story keeps its connection to the record.</h2>
            <p className="leading-7 opacity-80">Dates, memories, and narrative details stay linked to source references, so relatives can enjoy the story and still understand where it came from.</p>
            <Link href={`${basePath}/sources/src01`} className="inline-flex items-center gap-2 rounded-full border border-[color-mix(in_oklab,var(--brand-on-deep)_30%,transparent)] px-5 py-3 text-sm font-semibold transition-colors hover:bg-[color-mix(in_oklab,var(--brand-on-deep)_10%,transparent)]">
              <FileText className="h-4 w-4" /> View a source
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

function ChapterChip({ href, icon, label }: { href: string; icon: React.ReactNode; label: string }) {
  return (
    <Link
      href={href}
      className="inline-flex items-center gap-1.5 rounded-full border border-[color-mix(in_oklab,var(--brand-accent-ink)_45%,transparent)] bg-[#f6efe0]/70 px-3.5 py-1.5 text-xs font-semibold uppercase tracking-[0.1em] text-[#5c5142] backdrop-blur-sm transition-colors hover:border-[var(--brand-primary-ink)] hover:text-[var(--brand-primary-ink)]"
    >
      {icon}
      {label}
    </Link>
  );
}
