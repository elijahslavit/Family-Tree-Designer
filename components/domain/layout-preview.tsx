import { Badge } from "@/components/foundation/badge";
import { ThemeProvider } from "@/components/providers/theme-provider";
import type { ThemeLayout, ThemeSkin } from "@/lib/types";
import { cn } from "@/lib/utils/cn";

const layoutCopy: Record<
  ThemeLayout,
  {
    title: string;
    strap: string;
    description: string;
  }
> = {
  classic: {
    title: "Classic",
    strap: "Reference-first structure",
    description: "Library-like navigation, dense browsing, and a dependable companion detail rail.",
  },
  editorial: {
    title: "Editorial",
    strap: "Story-led presentation",
    description: "Large reading surfaces and elegant profile rhythm for heirloom storytelling.",
  },
  explorer: {
    title: "Explorer",
    strap: "Canvas-led experience",
    description: "Spatial browsing with immersive graph space and a guided detail workbench.",
  },
};

export function LayoutPreview({
  layout,
  skin,
  active = false,
}: {
  layout: ThemeLayout;
  skin: ThemeSkin;
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
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,color-mix(in_oklab,var(--accent-primary)_18%,transparent),transparent_40%),linear-gradient(180deg,color-mix(in_oklab,var(--bg-elevated)_70%,transparent),transparent)]" />
          <div className="relative space-y-4">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="text-[11px] uppercase tracking-[0.2em] text-[var(--text-muted)]">
                  {layoutCopy[layout].strap}
                </p>
                <p className="mt-1 text-lg font-semibold text-[var(--text-primary)]">
                  {layoutCopy[layout].title}
                </p>
              </div>
              <Badge tone={active ? "accent" : "default"}>
                {active ? "Selected layout" : "Structure"}
              </Badge>
            </div>

            <div className="overflow-hidden rounded-[20px] border border-[var(--border-default)] bg-[color-mix(in_oklab,var(--bg-surface)_88%,transparent)]">
              <div className="flex items-center justify-between border-b border-[var(--border-muted)] px-3 py-2">
                <div>
                  <p className="text-[10px] uppercase tracking-[0.18em] text-[var(--text-muted)]">
                    Family archive
                  </p>
                  <p className="text-sm font-semibold text-[var(--text-primary)]">Hart Family</p>
                </div>
                <div className="flex gap-1.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-[var(--accent-primary)]" />
                  <span className="h-1.5 w-1.5 rounded-full bg-[var(--border-strong)]" />
                  <span className="h-1.5 w-1.5 rounded-full bg-[var(--text-muted)]" />
                </div>
              </div>
              {layout === "classic" ? <ClassicMiniLayout /> : null}
              {layout === "editorial" ? <EditorialMiniLayout /> : null}
              {layout === "explorer" ? <ExplorerMiniLayout /> : null}
            </div>

            <p className="text-sm leading-6 text-[var(--text-secondary)]">
              {layoutCopy[layout].description}
            </p>
          </div>
        </div>
      </ThemeProvider>
    </div>
  );
}

function ClassicMiniLayout() {
  return (
    <div className="grid gap-3 p-3">
      <div className="grid grid-cols-[minmax(0,1fr)_5.6rem] gap-3">
        <div className="space-y-2">
          <div className="rounded-[16px] border border-[var(--border-default)] bg-[var(--bg-elevated)] p-3">
            <div className="h-2.5 w-20 rounded-full bg-[var(--accent-muted)]" />
            <div className="mt-2 h-4 w-36 rounded-full bg-[color-mix(in_oklab,var(--text-primary)_20%,transparent)]" />
            <div className="mt-2 h-2 w-full rounded-full bg-[var(--border-default)]" />
            <div className="mt-1.5 h-2 w-10/12 rounded-full bg-[var(--border-default)]" />
          </div>
          <div className="grid grid-cols-2 gap-2">
            <MiniPanel label="Directory" />
            <MiniPanel label="Timeline" />
          </div>
        </div>
        <div className="space-y-2">
          <MiniPanel label="Facts" compact />
          <MiniPanel label="Relatives" compact />
          <MiniPanel label="Lineage" compact />
        </div>
      </div>
    </div>
  );
}

function EditorialMiniLayout() {
  return (
    <div className="grid gap-3 p-3">
      <div className="grid grid-cols-[minmax(0,1fr)_5.8rem] gap-3">
        <div className="space-y-2">
          <div className="rounded-[18px] border border-[var(--border-default)] bg-[var(--bg-elevated)] px-4 py-5">
            <div className="h-2.5 w-24 rounded-full bg-[var(--accent-muted)]" />
            <div className="mt-3 h-5 w-40 rounded-full bg-[color-mix(in_oklab,var(--text-primary)_22%,transparent)]" />
            <div className="mt-2 h-2 w-full rounded-full bg-[var(--border-default)]" />
            <div className="mt-1.5 h-2 w-11/12 rounded-full bg-[var(--border-default)]" />
            <div className="mt-1.5 h-2 w-9/12 rounded-full bg-[var(--border-default)]" />
          </div>
          <div className="rounded-[18px] border border-[var(--border-default)] bg-[color-mix(in_oklab,var(--bg-surface)_88%,transparent)] px-4 py-4">
            <div className="h-2 w-14 rounded-full bg-[var(--accent-muted)]" />
            <div className="mt-3 h-2 w-full rounded-full bg-[var(--border-default)]" />
            <div className="mt-1.5 h-2 w-full rounded-full bg-[var(--border-default)]" />
            <div className="mt-1.5 h-2 w-10/12 rounded-full bg-[var(--border-default)]" />
          </div>
        </div>
        <div className="space-y-2">
          <MiniPanel label="Notes" compact />
          <MiniPanel label="Dates" compact />
          <MiniPanel label="Kin" compact />
        </div>
      </div>
    </div>
  );
}

function ExplorerMiniLayout() {
  return (
    <div className="grid grid-cols-[minmax(0,1fr)_6rem] gap-3 p-3">
      <div className="relative min-h-[12rem] overflow-hidden rounded-[18px] border border-[var(--border-default)] bg-[var(--bg-canvas)]">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,var(--canvas-grid-color),transparent_48%)] opacity-90" />
        <MiniCanvasLine className="left-[26%] top-[36%] h-px w-[48%]" />
        <MiniCanvasLine className="left-[50%] top-[36%] h-[34%] w-px" />
        <MiniCanvasNode className="left-[10%] top-[18%]" label="Ada" />
        <MiniCanvasNode className="left-[40%] top-[18%]" label="Elias" accent />
        <MiniCanvasNode className="left-[70%] top-[18%]" label="Nora" />
        <MiniCanvasNode className="left-[38%] top-[58%]" label="Jonah" compact />
      </div>
      <div className="space-y-2">
        <MiniPanel label="Focus" compact />
        <MiniPanel label="Branch" compact />
        <MiniPanel label="Depth" compact />
      </div>
    </div>
  );
}

function MiniPanel({
  label,
  compact = false,
}: {
  label: string;
  compact?: boolean;
}) {
  return (
    <div
      className={cn(
        "rounded-[14px] border border-[var(--border-default)] bg-[color-mix(in_oklab,var(--bg-surface)_90%,transparent)] px-3 py-2",
        compact && "px-2.5 py-2",
      )}
    >
      <div className="h-2 w-12 rounded-full bg-[var(--accent-muted)]" />
      <div className="mt-2 h-2 w-full rounded-full bg-[var(--border-default)]" />
      <div className="mt-1.5 h-2 w-8/12 rounded-full bg-[var(--border-default)]" />
      <p className="mt-2 text-[10px] uppercase tracking-[0.16em] text-[var(--text-muted)]">
        {label}
      </p>
    </div>
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
