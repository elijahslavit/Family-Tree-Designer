import { Badge } from "@/components/foundation/badge";
import { ThemeProvider } from "@/components/providers/theme-provider";
import type { ThemeLayout, ThemeSkin } from "@/lib/types";
import { cn } from "@/lib/utils/cn";

const skinCopy: Record<
  ThemeSkin,
  {
    title: string;
    mood: string;
    description: string;
    material: string;
  }
> = {
  "dark-gold": {
    title: "Dark Gold",
    mood: "Heirloom book",
    description: "Leather-bound warmth, restrained gilding, and deep archival contrast.",
    material: "Candlelit reading room",
  },
  parchment: {
    title: "Parchment",
    mood: "Library register",
    description: "Cream paper, softened ink, and dignified genealogy-book calm.",
    material: "Paper, vellum, and marginalia",
  },
  modern: {
    title: "Modern",
    mood: "Clean atlas",
    description: "Refined geometry, airier spacing, and an intentional contemporary finish.",
    material: "Gallery wall and editorial product",
  },
};

export function SkinPreview({
  skin,
  layout,
  active = false,
}: {
  skin: ThemeSkin;
  layout: ThemeLayout;
  active?: boolean;
}) {
  return (
    <div
      className={cn(
        "overflow-hidden rounded-[26px] border text-left transition-all duration-[var(--transition-normal)]",
        active
          ? "border-[var(--border-strong)] shadow-[var(--shadow-lg)]"
          : "border-[var(--border-default)] hover:-translate-y-0.5 hover:border-[var(--border-strong)] hover:shadow-[var(--shadow-md)]",
      )}
    >
      <ThemeProvider layout={layout} skin={skin} className="min-h-0 rounded-[24px]">
        <div className="relative overflow-hidden rounded-[24px] bg-[var(--bg-primary)] p-4">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,color-mix(in_oklab,var(--accent-primary)_18%,transparent),transparent_42%),linear-gradient(180deg,color-mix(in_oklab,var(--bg-elevated)_72%,transparent),transparent)]" />
          <div className="relative space-y-4">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="text-[11px] uppercase tracking-[0.2em] text-[var(--text-muted)]">
                  {skinCopy[skin].mood}
                </p>
                <p className="mt-1 text-lg font-semibold text-[var(--text-primary)]">
                  {skinCopy[skin].title}
                </p>
              </div>
              <Badge tone={active ? "accent" : "default"}>
                {active ? "Selected skin" : skinCopy[skin].material}
              </Badge>
            </div>

            <div className="rounded-[22px] border border-[var(--border-default)] bg-[color-mix(in_oklab,var(--bg-surface)_90%,transparent)] p-3">
              <div className="relative min-h-[12rem] overflow-hidden rounded-[18px] border border-[var(--border-default)] bg-[color-mix(in_oklab,var(--bg-elevated)_88%,transparent)]">
                <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,color-mix(in_oklab,var(--accent-primary)_12%,transparent),transparent_42%)]" />
                <div className="absolute left-1/2 top-4 h-12 w-px -translate-x-1/2 bg-[var(--border-strong)]" />
                <div className="absolute left-[22%] top-[4.4rem] h-px w-[56%] bg-[var(--border-strong)]" />
                <BranchPortrait className="left-1/2 top-3 -translate-x-1/2" name="Elias" active />
                <BranchPortrait className="left-[18%] top-[4.4rem] -translate-y-1/2" name="Mara" />
                <BranchPortrait className="left-[66%] top-[4.4rem] -translate-y-1/2" name="Jonah" />
                <BranchPortrait className="left-1/2 top-[8rem] -translate-x-1/2" name="Helen" compact />

                <div className="absolute bottom-3 left-3 right-3 flex flex-wrap gap-2">
                  <Chip label="Biography" />
                  <Chip label="Canvas" />
                  <Chip label="Lineage" />
                </div>
              </div>
            </div>

            <p className="text-sm leading-6 text-[var(--text-secondary)]">
              {skinCopy[skin].description}
            </p>
          </div>
        </div>
      </ThemeProvider>
    </div>
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

function Chip({ label }: { label: string }) {
  return (
    <span className="rounded-full border border-[var(--border-default)] px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-[var(--text-muted)]">
      {label}
    </span>
  );
}
