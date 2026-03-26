import type { ReactNode } from "react";

import { Badge } from "@/components/foundation/badge";
import { ThemeProvider } from "@/components/providers/theme-provider";
import type { ThemeLayout, ThemeSkin } from "@/lib/types";
import { themeSkinProfiles } from "@/lib/utils/theme-studio";
import { cn } from "@/lib/utils/cn";

export function SkinPreview({
  skin,
  layout,
  active = false,
}: {
  skin: ThemeSkin;
  layout: ThemeLayout;
  active?: boolean;
}) {
  const profile = themeSkinProfiles[skin];

  return (
    <div
      className={cn(
        "overflow-hidden rounded-[30px] border text-left transition-all duration-[var(--transition-normal)]",
        active
          ? "border-[var(--border-strong)] shadow-[var(--shadow-lg)]"
          : "border-[var(--border-default)] hover:-translate-y-0.5 hover:border-[var(--border-strong)] hover:shadow-[var(--shadow-md)]",
      )}
    >
      <ThemeProvider layout={layout} skin={skin} className="min-h-0 rounded-[28px]">
        <div className="relative overflow-hidden rounded-[28px] bg-[var(--bg-primary)] p-4">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,color-mix(in_oklab,var(--accent-primary)_18%,transparent),transparent_42%),linear-gradient(180deg,color-mix(in_oklab,var(--bg-elevated)_72%,transparent),transparent)]" />
          <div className="relative space-y-4">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div className="space-y-1">
                <p className="text-[11px] uppercase tracking-[0.2em] text-[var(--text-muted)]">
                  {profile.mood}
                </p>
                <p className="text-xl font-semibold text-[var(--text-primary)]">{profile.title}</p>
              </div>
              <Badge tone={active ? "accent" : "default"}>
                {active ? "Selected skin" : profile.material}
              </Badge>
            </div>

            <div className="rounded-[24px] border border-[var(--border-default)] bg-[color-mix(in_oklab,var(--bg-surface)_92%,transparent)] p-3">
              <div className="relative min-h-[13rem] overflow-hidden rounded-[20px] border border-[var(--border-default)] bg-[color-mix(in_oklab,var(--bg-elevated)_92%,transparent)]">
                <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,color-mix(in_oklab,var(--accent-primary)_14%,transparent),transparent_42%)]" />
                {skin === "dark-gold" ? <DarkGoldPoster /> : null}
                {skin === "parchment" ? <ParchmentPoster /> : null}
                {skin === "modern" ? <ModernPoster /> : null}
                {skin === "botanical" ? <BotanicalPoster /> : null}
                {skin === "inkwash" ? <InkWashPoster /> : null}
                {skin === "portrait-gallery" ? <PortraitPoster /> : null}
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              {profile.cueWords.map((word) => (
                <span
                  key={word}
                  className="rounded-full border border-[var(--border-default)] bg-[color-mix(in_oklab,var(--bg-surface)_86%,transparent)] px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-[var(--text-muted)]"
                >
                  {word}
                </span>
              ))}
            </div>

            <p className="text-sm leading-6 text-[var(--text-secondary)]">{profile.description}</p>
          </div>
        </div>
      </ThemeProvider>
    </div>
  );
}

function DarkGoldPoster() {
  return (
    <>
      <div className="absolute left-1/2 top-4 h-12 w-px -translate-x-1/2 bg-[var(--border-strong)]" />
      <div className="absolute left-[24%] top-[4.5rem] h-px w-[52%] bg-[var(--border-strong)]" />
      <BranchPortrait className="left-1/2 top-3 -translate-x-1/2" name="Elias" active />
      <BranchPortrait className="left-[20%] top-[4.5rem] -translate-y-1/2" name="Mara" />
      <BranchPortrait className="left-[64%] top-[4.5rem] -translate-y-1/2" name="Jonah" />
      <BranchPortrait className="left-1/2 top-[8.1rem] -translate-x-1/2" name="Helen" compact />
      <div className="absolute bottom-3 left-3 right-3 flex flex-wrap gap-2">
        <MiniChip label="Biography" />
        <MiniChip label="Canvas" />
        <MiniChip label="Lineage" />
      </div>
    </>
  );
}

function ParchmentPoster() {
  return (
    <div className="grid gap-3 p-4">
      <PosterCard title="Directory register">
        <div className="grid gap-2">
          <PosterLine width="34%" />
          <PosterLine width="82%" />
          <PosterLine width="76%" />
        </div>
      </PosterCard>
      <div className="grid grid-cols-2 gap-3">
        <PosterCard title="Family facts">
          <PosterLine width="72%" />
          <PosterLine width="54%" />
        </PosterCard>
        <PosterCard title="Lineage note">
          <PosterLine width="84%" />
          <PosterLine width="48%" />
        </PosterCard>
      </div>
    </div>
  );
}

function ModernPoster() {
  return (
    <>
      <div className="absolute inset-x-4 top-4 h-9 rounded-full border border-[var(--border-default)] bg-[color-mix(in_oklab,var(--bg-surface)_84%,transparent)]" />
      <MiniCanvasLine className="left-[25%] top-[47%] h-px w-[48%]" />
      <MiniCanvasLine className="left-[49%] top-[47%] h-[28%] w-px" />
      <MiniCanvasNode className="left-[9%] top-[28%]" label="Ada" />
      <MiniCanvasNode className="left-[39%] top-[26%]" label="Elias" accent />
      <MiniCanvasNode className="left-[69%] top-[28%]" label="Mara" />
      <MiniCanvasNode className="left-[38%] top-[60%]" label="Jonah" compact />
      <div className="absolute bottom-3 right-3 rounded-full border border-[var(--border-default)] bg-[var(--canvas-controls-bg)] px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-[var(--text-muted)]">
        Graph
      </div>
    </>
  );
}

function BotanicalPoster() {
  return (
    <>
      <div className="absolute left-1/2 top-[2.25rem] h-[7.2rem] w-2 -translate-x-1/2 rounded-full bg-[color-mix(in_oklab,var(--accent-primary)_34%,transparent)]" />
      <div className="absolute left-[26%] top-[5.1rem] h-[2px] w-[22%] rotate-[-16deg] bg-[color-mix(in_oklab,var(--accent-primary)_34%,transparent)]" />
      <div className="absolute right-[26%] top-[5.1rem] h-[2px] w-[22%] rotate-[16deg] bg-[color-mix(in_oklab,var(--accent-primary)_34%,transparent)]" />
      <LeafMedallion className="left-1/2 top-[1.25rem] -translate-x-1/2" label="Elias" active />
      <LeafMedallion className="left-[12%] top-[4.6rem]" label="Mara" />
      <LeafMedallion className="right-[12%] top-[4.6rem]" label="Jonah" />
      <LeafMedallion className="left-1/2 top-[8.4rem] -translate-x-1/2" label="Helen" small />
      <div className="absolute bottom-3 left-3 text-[10px] uppercase tracking-[0.18em] text-[var(--text-muted)]">
        Botanical poster
      </div>
    </>
  );
}

function InkWashPoster() {
  return (
    <div className="p-4">
      <div className="relative h-[10.8rem] overflow-hidden rounded-[18px] border border-[color-mix(in_oklab,var(--text-primary)_16%,transparent)] bg-[color-mix(in_oklab,var(--bg-surface)_90%,transparent)]">
        <div className="absolute left-4 right-4 top-4 h-[2px] bg-[color-mix(in_oklab,var(--text-primary)_44%,transparent)]" />
        <div className="absolute left-1/2 top-4 h-[6rem] w-px -translate-x-1/2 bg-[color-mix(in_oklab,var(--text-primary)_34%,transparent)]" />
        <div className="absolute left-[23%] top-[4.1rem] h-px w-[54%] bg-[color-mix(in_oklab,var(--text-primary)_28%,transparent)]" />
        <InkLabel className="left-6 top-6" label="Ada" />
        <InkLabel className="left-[38%] top-6" label="Elias" active />
        <InkLabel className="right-6 top-6" label="Mara" />
        <InkLabel className="left-[40%] top-[6.5rem]" label="Jonah" compact />
        <div className="absolute bottom-3 left-4 right-4 h-px border-b border-dashed border-[color-mix(in_oklab,var(--text-primary)_18%,transparent)]" />
      </div>
    </div>
  );
}

function PortraitPoster() {
  return (
    <>
      <div className="absolute left-1/2 top-[2rem] h-[7rem] w-[11rem] -translate-x-1/2 rounded-t-[999px] border border-[var(--border-default)] border-b-0" />
      <Medallion className="left-1/2 top-[1.4rem] -translate-x-1/2" label="Elias" active />
      <Medallion className="left-[16%] top-[4.2rem]" label="Mara" />
      <Medallion className="right-[16%] top-[4.2rem]" label="Jonah" />
      <Medallion className="left-1/2 top-[7.9rem] -translate-x-1/2" label="Helen" small />
      <div className="absolute bottom-3 left-3 right-3 rounded-[16px] border border-[var(--border-default)] bg-[color-mix(in_oklab,var(--bg-surface)_88%,transparent)] px-3 py-2">
        <p className="text-[10px] uppercase tracking-[0.16em] text-[var(--text-muted)]">
          Portrait-led lineage
        </p>
      </div>
    </>
  );
}

function BranchPortrait({
  name,
  className,
  active = false,
  compact = false,
}: {
  name: string;
  className?: string;
  active?: boolean;
  compact?: boolean;
}) {
  return (
    <div
      className={cn(
        "absolute rounded-full border px-3 py-2 text-center shadow-[var(--shadow-sm)]",
        compact ? "w-16" : "w-20",
        active
          ? "border-[var(--border-strong)] bg-[var(--accent-muted)] text-[var(--text-primary)]"
          : "border-[var(--border-default)] bg-[var(--bg-surface)] text-[var(--text-secondary)]",
        className,
      )}
    >
      <span className="block truncate text-[11px] font-semibold">{name}</span>
    </div>
  );
}

function LeafMedallion({
  label,
  className,
  active = false,
  small = false,
}: {
  label: string;
  className?: string;
  active?: boolean;
  small?: boolean;
}) {
  return (
    <div
      className={cn(
        "absolute flex items-center justify-center rounded-[999px_999px_999px_999px/70%_70%_100%_100%] border px-3 text-[10px] font-semibold shadow-[var(--shadow-sm)]",
        small ? "h-11 w-16" : "h-12 w-20",
        active
          ? "border-[var(--border-strong)] bg-[var(--accent-muted)] text-[var(--text-primary)]"
          : "border-[var(--border-default)] bg-[var(--bg-surface)] text-[var(--text-secondary)]",
        className,
      )}
    >
      {label}
    </div>
  );
}

function InkLabel({
  label,
  className,
  active = false,
  compact = false,
}: {
  label: string;
  className?: string;
  active?: boolean;
  compact?: boolean;
}) {
  return (
    <div
      className={cn(
        "absolute rounded-[14px] border px-2.5 py-1.5 text-[10px] font-semibold",
        compact ? "w-16" : "w-20",
        active
          ? "border-[var(--border-strong)] bg-[color-mix(in_oklab,var(--text-primary)_6%,var(--bg-surface))] text-[var(--text-primary)]"
          : "border-[var(--border-default)] bg-[var(--bg-surface)] text-[var(--text-secondary)]",
        className,
      )}
    >
      {label}
    </div>
  );
}

function Medallion({
  label,
  className,
  active = false,
  small = false,
}: {
  label: string;
  className?: string;
  active?: boolean;
  small?: boolean;
}) {
  return (
    <div
      className={cn(
        "absolute flex items-center justify-center rounded-full border text-[10px] font-semibold shadow-[var(--shadow-sm)]",
        small ? "h-12 w-12" : "h-14 w-14",
        active
          ? "border-[var(--border-strong)] bg-[var(--accent-muted)] text-[var(--text-primary)]"
          : "border-[var(--border-default)] bg-[var(--bg-surface)] text-[var(--text-secondary)]",
        className,
      )}
    >
      <span className="max-w-[70%] text-center leading-tight">{label}</span>
    </div>
  );
}

function PosterCard({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <div className="rounded-[18px] border border-[var(--border-default)] bg-[color-mix(in_oklab,var(--bg-surface)_90%,transparent)] p-3">
      <p className="text-[10px] uppercase tracking-[0.16em] text-[var(--text-muted)]">{title}</p>
      <div className="mt-2">{children}</div>
    </div>
  );
}

function PosterLine({ width }: { width: string }) {
  return <div className="h-2 rounded-full bg-[var(--border-default)]" style={{ width }} />;
}

function MiniChip({ label }: { label: string }) {
  return (
    <span className="rounded-full border border-[var(--border-default)] px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-[var(--text-muted)]">
      {label}
    </span>
  );
}

function MiniCanvasNode({
  label,
  className,
  compact = false,
  accent = false,
}: {
  label: string;
  className?: string;
  compact?: boolean;
  accent?: boolean;
}) {
  return (
    <div
      className={cn(
        "absolute rounded-[14px] border px-2 py-1.5 text-[10px] font-semibold shadow-[var(--shadow-sm)]",
        compact ? "w-16" : "w-20",
        accent
          ? "border-[var(--border-strong)] bg-[var(--canvas-node-highlight-bg)] text-[var(--text-primary)]"
          : "border-[var(--canvas-node-border)] bg-[var(--canvas-node-bg)] text-[var(--canvas-node-text)]",
        className,
      )}
    >
      <span className="block truncate">{label}</span>
      {!compact ? (
        <span className="mt-1 block h-1.5 w-8 rounded-full bg-[var(--accent-muted)]" />
      ) : null}
    </div>
  );
}

function MiniCanvasLine({ className }: { className?: string }) {
  return <div className={cn("absolute bg-[var(--canvas-edge)]", className)} />;
}
