import { ArrowRight, BookOpenText, FileText, GitBranch, Quote } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export type ShowcasePersonCard = {
  id: string;
  name: string;
  years: string;
  summary: string;
  imagePath: string;
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
  heroPath,
  focalPerson,
  people,
  stories,
  sourcePreviewPath,
}: {
  basePath: string;
  familyName: string;
  eyebrow: string;
  tagline: string;
  introduction: string;
  heroPath: string;
  focalPerson: ShowcasePersonCard;
  people: ShowcasePersonCard[];
  stories: ShowcaseStoryCard[];
  sourcePreviewPath: string;
}) {
  return (
    <div>
      <section className="relative min-h-[min(780px,calc(100vh-65px))] overflow-hidden bg-[#252a24] text-white">
        <Image
          src={heroPath}
          alt="A clearly synthetic archival collage representing the Hart family demonstration"
          fill
          priority
          sizes="100vw"
          className="object-cover opacity-70"
        />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(25,28,24,.88)_0%,rgba(25,28,24,.54)_55%,rgba(25,28,24,.24)_100%),linear-gradient(0deg,rgba(20,23,20,.65),transparent_55%)]" />
        <div className="relative mx-auto flex min-h-[min(780px,calc(100vh-65px))] max-w-7xl items-end px-4 py-14 sm:px-6 sm:py-20 lg:px-8">
          <div className="max-w-3xl space-y-7">
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#e9d8b4]">{eyebrow}</p>
            <div className="space-y-4">
              <h1 className="font-serif text-5xl font-semibold leading-[0.96] tracking-[-0.035em] sm:text-6xl lg:text-8xl">
                {familyName}
              </h1>
              <p className="max-w-2xl font-serif text-2xl leading-snug text-[#f2eadb] sm:text-3xl">{tagline}</p>
            </div>
            <p className="max-w-xl text-sm leading-7 text-white/80 sm:text-base">{introduction}</p>
            <div className="flex flex-wrap gap-3">
              <Link
                href={`${basePath}/tree?person=${focalPerson.id}`}
                className="pilot-cream-cta inline-flex items-center gap-2 rounded-full bg-[#f6efe0] px-5 py-3 text-sm font-semibold text-[#2e322d] transition-transform hover:-translate-y-0.5"
              >
                Explore your family
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href={`${basePath}/stories`}
                className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/10 px-5 py-3 text-sm font-semibold text-white backdrop-blur hover:bg-white/15"
              >
                Begin with a story
              </Link>
            </div>
          </div>
        </div>
        <p className="absolute bottom-5 right-5 rounded-full bg-black/35 px-3 py-1 text-[10px] uppercase tracking-[0.14em] text-white/75 backdrop-blur">
          Synthetic demonstration media
        </p>
      </section>

      <section className="mx-auto grid max-w-7xl gap-5 px-4 py-16 sm:px-6 lg:grid-cols-3 lg:px-8 lg:py-24">
        <JourneyCard
          href={`${basePath}/tree?person=${focalPerson.id}`}
          icon={<GitBranch className="h-5 w-5" />}
          eyebrow="See the relationships"
          title="Explore the family tree"
          detail={`Begin with ${focalPerson.name} and unfold the nearest generations at your own pace.`}
        />
        <JourneyCard
          href={`${basePath}/people/${focalPerson.id}`}
          icon={<Quote className="h-5 w-5" />}
          eyebrow="Meet someone"
          title={`The life of ${focalPerson.name}`}
          detail={focalPerson.summary}
        />
        <JourneyCard
          href={`${basePath}/stories/${stories[0]?.id ?? "story-letters-home"}`}
          icon={<BookOpenText className="h-5 w-5" />}
          eyebrow="Follow a thread"
          title={stories[0]?.title ?? "A family story"}
          detail={stories[0]?.dek ?? "Follow one carefully sourced moment through the archive."}
        />
      </section>

      <section className="border-y border-[#3c3325]/10 bg-[#eee6d7]">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
          <div className="mb-9 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#776a58]">Featured ancestors</p>
              <h2 className="mt-2 font-serif text-4xl font-semibold tracking-tight sm:text-5xl">People behind the names</h2>
            </div>
            <Link href={`${basePath}/people`} className="inline-flex items-center gap-2 text-sm font-semibold text-[#425947]">
              Meet the family <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {people.slice(0, 4).map((person) => (
              <Link key={person.id} href={`${basePath}/people/${person.id}`} className="group overflow-hidden rounded-2xl bg-[#fbf8f0] shadow-sm">
                <div className="relative aspect-[4/5] overflow-hidden bg-[#d8cfbf]">
                  <Image src={person.imagePath} alt={`Synthetic portrait for ${person.name}`} fill sizes="(max-width: 640px) 100vw, 25vw" className="object-cover transition-transform duration-500 group-hover:scale-[1.03]" />
                </div>
                <div className="space-y-1 p-4">
                  <p className="font-serif text-xl font-semibold">{person.name}</p>
                  <p className="text-xs text-[#776d5f]">{person.years}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
        <div className="mb-9 max-w-2xl space-y-3">
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#776a58]">Curated stories</p>
          <h2 className="font-serif text-4xl font-semibold tracking-tight sm:text-5xl">A few moments worth carrying forward</h2>
          <p className="leading-7 text-[#6d6253]">Short, sourced narratives make the structure of a tree feel personal without overwhelming the reader.</p>
        </div>
        <div className="grid gap-6 lg:grid-cols-3">
          {stories.slice(0, 3).map((story) => (
            <Link key={story.id} href={`${basePath}/stories/${story.id}`} className="group overflow-hidden rounded-2xl border border-[#3c3325]/10 bg-white">
              <div className="relative aspect-[16/10] overflow-hidden bg-[#ded5c5]">
                <Image src={story.imagePath} alt="" fill sizes="(max-width: 1024px) 100vw, 33vw" className="object-cover transition-transform duration-500 group-hover:scale-[1.025]" />
              </div>
              <div className="space-y-3 p-5">
                <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[#7b6d59]">{story.period} · {story.readMinutes} min read</p>
                <h3 className="font-serif text-2xl font-semibold leading-tight">{story.title}</h3>
                <p className="text-sm leading-6 text-[#6f6557]">{story.dek}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="bg-[#2b332d] text-white">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 py-16 sm:px-6 lg:grid-cols-[0.9fr_1.1fr] lg:items-center lg:px-8 lg:py-24">
          <div className="relative mx-auto aspect-[4/5] w-full max-w-sm overflow-hidden rounded-2xl bg-[#ded5c5] shadow-2xl">
            <Image src={sourcePreviewPath} alt="Synthetic preview of a cited family record" fill sizes="384px" className="object-cover" />
          </div>
          <div className="max-w-2xl space-y-5">
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#dac69e]">Research you can trace</p>
            <h2 className="font-serif text-4xl font-semibold tracking-tight sm:text-5xl">Every story keeps its connection to the record.</h2>
            <p className="leading-7 text-white/75">Dates, memories, and narrative details stay linked to source references, so relatives can enjoy the story and still understand where it came from.</p>
            <Link href={`${basePath}/sources/src01`} className="inline-flex items-center gap-2 rounded-full border border-white/25 px-5 py-3 text-sm font-semibold hover:bg-white/10">
              <FileText className="h-4 w-4" /> View a source
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

function JourneyCard({
  href,
  icon,
  eyebrow,
  title,
  detail,
}: {
  href: string;
  icon: React.ReactNode;
  eyebrow: string;
  title: string;
  detail: string;
}) {
  return (
    <Link href={href} className="group flex min-h-56 flex-col rounded-2xl border border-[#3c3325]/10 bg-white p-6 transition-transform hover:-translate-y-1 hover:shadow-lg">
      <span className="grid h-10 w-10 place-items-center rounded-full bg-[#e8eee8] text-[#3f5b47]">{icon}</span>
      <div className="mt-auto space-y-2 pt-8">
        <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[#807463]">{eyebrow}</p>
        <h2 className="font-serif text-2xl font-semibold leading-tight">{title}</h2>
        <p className="text-sm leading-6 text-[#6f6557]">{detail}</p>
      </div>
    </Link>
  );
}
