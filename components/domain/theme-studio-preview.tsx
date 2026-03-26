import type { ReactNode } from "react";

import { Badge } from "@/components/foundation/badge";
import { ThemeProvider } from "@/components/providers/theme-provider";
import type { ThemeLayout, ThemeSkin } from "@/lib/types";
import {
  labelizeTheme,
  sceneCopy,
  type ThemeStudioScene,
  themeSkinProfiles,
} from "@/lib/utils/theme-studio";
import { cn } from "@/lib/utils/cn";

export type { ThemeStudioScene } from "@/lib/utils/theme-studio";

export function ThemeStudioPreview({
  layout,
  skin,
  scene,
  treeName,
}: {
  layout: ThemeLayout;
  skin: ThemeSkin;
  scene: ThemeStudioScene;
  treeName: string;
}) {
  const skinProfile = themeSkinProfiles[skin];

  return (
    <ThemeProvider layout={layout} skin={skin} className="min-h-0 rounded-[30px]">
      <div className="relative overflow-hidden rounded-[30px] border border-[var(--border-default)] bg-[var(--bg-primary)] p-4 shadow-[var(--shadow-lg)]">
        <PreviewAtmosphere skin={skin} />

        <div className="relative space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-[11px] uppercase tracking-[0.22em] text-[var(--text-muted)]">
                {sceneCopy[scene].eyebrow}
              </p>
              <h3 className="mt-1 text-2xl font-semibold text-[var(--text-primary)]">
                {sceneCopy[scene].title}
              </h3>
              <p className="mt-2 max-w-xl text-sm leading-6 text-[var(--text-secondary)]">
                {sceneCopy[scene].description}
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Badge tone="accent">{labelizeTheme(layout)} layout</Badge>
              <Badge tone="default">{skinProfile.title}</Badge>
            </div>
          </div>

          <div className="overflow-hidden rounded-[26px] border border-[var(--border-default)] bg-[color-mix(in_oklab,var(--bg-surface)_84%,transparent)]">
            <PreviewChrome treeName={treeName} skin={skin} />
            {scene === "landing" ? <LandingScene layout={layout} skin={skin} /> : null}
            {scene === "profile" ? <ProfileScene layout={layout} skin={skin} /> : null}
            {scene === "canvas" ? <CanvasScene layout={layout} skin={skin} /> : null}
          </div>

          <div className="grid gap-3 sm:grid-cols-3">
            <PreviewMeta
              label="Directory feel"
              value={
                layout === "classic"
                  ? "Structured and dense"
                  : layout === "editorial"
                    ? "Spacious and literary"
                    : "Map-like and guided"
              }
            />
            <PreviewMeta
              label="Profile feel"
              value={
                layout === "classic"
                  ? "Facts beside narrative"
                  : layout === "editorial"
                    ? "Biography takes the lead"
                    : "Details orbit the graph"
              }
            />
            <PreviewMeta label="Skin signature" value={skinProfile.signature} />
          </div>
        </div>
      </div>
    </ThemeProvider>
  );
}

function PreviewChrome({
  treeName,
  skin,
}: {
  treeName: string;
  skin: ThemeSkin;
}) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[var(--border-muted)] px-4 py-3">
      <div>
        <p className="text-[10px] uppercase tracking-[0.18em] text-[var(--text-muted)]">
          Shared archive
        </p>
        <p className="text-sm font-semibold text-[var(--text-primary)]">{treeName}</p>
      </div>
      <div className="flex items-center gap-2 text-[11px] text-[var(--text-muted)]">
        <span>{themeSkinProfiles[skin].mood}</span>
        <span>Directory</span>
        <span>Profile</span>
        <span>Canvas</span>
      </div>
    </div>
  );
}

function LandingScene({
  layout,
  skin,
}: {
  layout: ThemeLayout;
  skin: ThemeSkin;
}) {
  const archiveTitle =
    skin === "portrait-gallery"
      ? "The Hart Family Gallery"
      : skin === "botanical"
        ? "The Hart Family Canopy"
        : "The Hart Family Archive";

  if (layout === "classic") {
    return (
      <div className="grid gap-4 p-4 lg:grid-cols-[minmax(0,1fr)_12rem]">
        <SurfaceCard className="space-y-4">
          <div className="space-y-2">
            <p className="text-[11px] uppercase tracking-[0.2em] text-[var(--text-muted)]">
              Family introduction
            </p>
            <h4 className="text-3xl font-semibold text-[var(--text-primary)]">{archiveTitle}</h4>
            <p className="max-w-xl text-sm leading-6 text-[var(--text-secondary)]">
              A browsable record of migrations, marriages, lineages, and the biographies that
              stitched the family together across three generations.
            </p>
          </div>
          <div className="grid gap-3 sm:grid-cols-3">
            <MetricPill label="People" value="229" />
            <MetricPill label="Lineages" value="6" />
            <MetricPill label="Homes" value="14" />
          </div>
        </SurfaceCard>
        <div className="space-y-3">
          <SurfaceCard className="space-y-2">
            <p className="text-[10px] uppercase tracking-[0.18em] text-[var(--text-muted)]">
              Featured lineages
            </p>
            <LineItem name="Direct Hart Line" />
            <LineItem name="West-Vale Branch" />
          </SurfaceCard>
          <SurfaceCard className="space-y-2">
            <p className="text-[10px] uppercase tracking-[0.18em] text-[var(--text-muted)]">
              Entry
            </p>
            <ActionBar primary="Browse directory" secondary="Open canvas" />
          </SurfaceCard>
        </div>
      </div>
    );
  }

  if (layout === "editorial") {
    return (
      <div className="grid gap-4 p-4 lg:grid-cols-[minmax(0,1fr)_11rem]">
        <SurfaceCard className="space-y-5 px-5 py-6">
          <p className="text-[11px] uppercase tracking-[0.24em] text-[var(--text-muted)]">
            Opening spread
          </p>
          <h4 className="max-w-md text-4xl font-semibold leading-tight text-[var(--text-primary)]">
            {skin === "inkwash"
              ? "A family tree that feels authored by hand."
              : skin === "botanical"
                ? "A family tree that feels hung in a conservatory."
                : "A family tree that reads like a keepsake book."}
          </h4>
          <p className="max-w-2xl text-sm leading-7 text-[var(--text-secondary)]">
            The selected skin sets the emotional temperature before relatives even choose a branch.
          </p>
          <div className="grid gap-3 sm:grid-cols-3">
            <MetricPill label="People" value="229" />
            <MetricPill label="Biographies" value="41" />
            <MetricPill label="Events" value="87" />
          </div>
        </SurfaceCard>
        <div className="space-y-3">
          <SurfaceCard className="space-y-2">
            <p className="text-[10px] uppercase tracking-[0.18em] text-[var(--text-muted)]">
              House note
            </p>
            <p className="text-sm leading-6 text-[var(--text-secondary)]">
              {themeSkinProfiles[skin].strap}
            </p>
          </SurfaceCard>
          <SurfaceCard className="space-y-2">
            <p className="text-[10px] uppercase tracking-[0.18em] text-[var(--text-muted)]">
              Lead lineage
            </p>
            <LineItem name="Hart to Brooks" />
          </SurfaceCard>
        </div>
      </div>
    );
  }

  return (
    <div className="grid gap-4 p-4 lg:grid-cols-[minmax(0,1fr)_12rem]">
      <CanvasSurface skin={skin} />
      <div className="space-y-3">
        <SurfaceCard className="space-y-3">
          <p className="text-[10px] uppercase tracking-[0.18em] text-[var(--text-muted)]">
            Guided entry
          </p>
          <ActionBar primary="Open canvas" secondary="Read profile" stacked />
        </SurfaceCard>
        <SurfaceCard className="space-y-2">
          <p className="text-[10px] uppercase tracking-[0.18em] text-[var(--text-muted)]">
            Branch focus
          </p>
          <LineItem name="Vale migration line" />
        </SurfaceCard>
      </div>
    </div>
  );
}

function ProfileScene({
  layout,
  skin,
}: {
  layout: ThemeLayout;
  skin: ThemeSkin;
}) {
  if (layout === "classic") {
    return (
      <div className="grid gap-4 p-4 lg:grid-cols-[minmax(0,1fr)_12rem]">
        <SurfaceCard className="space-y-4">
          <div className="space-y-2">
            <p className="text-[11px] uppercase tracking-[0.2em] text-[var(--text-muted)]">
              Profile
            </p>
            <h4 className="text-3xl font-semibold text-[var(--text-primary)]">Mara Hart Vale</h4>
            <p className="text-sm leading-6 text-[var(--text-secondary)]">
              {skin === "portrait-gallery"
                ? "Mara becomes the centerpiece of a portrait-led keepsake page."
                : "Mara kept meticulous letters, organized reunion books, and became the hinge between Hart oral history and the written archive."}
            </p>
          </div>
          <div className="space-y-2">
            <LineBlock width="100%" />
            <LineBlock width="93%" />
            <LineBlock width="86%" />
            <LineBlock width="72%" />
          </div>
        </SurfaceCard>
        <div className="space-y-3">
          <SurfaceCard className="space-y-2">
            <p className="text-[10px] uppercase tracking-[0.18em] text-[var(--text-muted)]">
              Facts
            </p>
            <MetaRow label="Born" value="1928 - Dayton" />
            <MetaRow label="Died" value="2007 - Columbus" />
          </SurfaceCard>
          <SurfaceCard className="space-y-2">
            <p className="text-[10px] uppercase tracking-[0.18em] text-[var(--text-muted)]">
              Relatives
            </p>
            <LineItem name="Jonah Brooks" />
            <LineItem name="Elena Vale" />
          </SurfaceCard>
        </div>
      </div>
    );
  }

  if (layout === "editorial") {
    return (
      <div className="grid gap-4 p-4 lg:grid-cols-[minmax(0,1fr)_11rem]">
        <SurfaceCard className="space-y-5 px-5 py-6">
          <div className="space-y-3">
            <p className="text-[11px] uppercase tracking-[0.24em] text-[var(--text-muted)]">
              Biography
            </p>
            <h4 className="max-w-lg text-4xl font-semibold leading-tight text-[var(--text-primary)]">
              {skin === "inkwash"
                ? "Mara Hart Vale appears inside an illustrated family manuscript."
                : "Mara Hart Vale carried the family memory into print."}
            </h4>
          </div>
          <div className="space-y-2">
            <LineBlock width="100%" />
            <LineBlock width="100%" />
            <LineBlock width="92%" />
            <LineBlock width="88%" />
            <LineBlock width="74%" />
          </div>
        </SurfaceCard>
        <div className="space-y-3">
          <SurfaceCard className="space-y-2">
            <p className="text-[10px] uppercase tracking-[0.18em] text-[var(--text-muted)]">
              Timeline
            </p>
            <LineItem name="1948 marriage" />
            <LineItem name="1969 reunion book" />
          </SurfaceCard>
          <SurfaceCard className="space-y-2">
            <p className="text-[10px] uppercase tracking-[0.18em] text-[var(--text-muted)]">
              Lineage
            </p>
            <LineItem name="Direct Hart Line" />
          </SurfaceCard>
        </div>
      </div>
    );
  }

  return (
    <div className="grid gap-4 p-4 lg:grid-cols-[minmax(0,1fr)_12rem]">
      <CanvasSurface skin={skin} />
      <div className="space-y-3">
        <SurfaceCard className="space-y-2">
          <p className="text-[10px] uppercase tracking-[0.18em] text-[var(--text-muted)]">
            Relatives
          </p>
          <LineItem name="Elias Hart" />
          <LineItem name="Jonah Brooks" />
        </SurfaceCard>
        <SurfaceCard className="space-y-2">
          <p className="text-[10px] uppercase tracking-[0.18em] text-[var(--text-muted)]">
            Context
          </p>
          <LineItem name="1-hop canvas focus" />
        </SurfaceCard>
      </div>
    </div>
  );
}

function CanvasScene({
  layout,
  skin,
}: {
  layout: ThemeLayout;
  skin: ThemeSkin;
}) {
  if (layout === "classic") {
    return (
      <div className="grid gap-4 p-4 lg:grid-cols-[minmax(0,1fr)_12rem]">
        <CanvasSurface skin={skin} />
        <div className="space-y-3">
          <SurfaceCard className="space-y-2">
            <p className="text-[10px] uppercase tracking-[0.18em] text-[var(--text-muted)]">
              Focus
            </p>
            <p className="text-sm font-semibold text-[var(--text-primary)]">Jonah Brooks</p>
            <p className="text-sm leading-6 text-[var(--text-secondary)]">
              2-hop view with parent, spouse, and child context.
            </p>
          </SurfaceCard>
          <SurfaceCard className="space-y-2">
            <p className="text-[10px] uppercase tracking-[0.18em] text-[var(--text-muted)]">
              Highlight
            </p>
            <LineItem name="Direct Hart Line" />
          </SurfaceCard>
        </div>
      </div>
    );
  }

  if (layout === "editorial") {
    return (
      <div className="space-y-4 p-4">
        <CanvasSurface skin={skin} />
        <div className="grid gap-3 lg:grid-cols-[minmax(0,1fr)_11rem]">
          <SurfaceCard className="space-y-2">
            <p className="text-[10px] uppercase tracking-[0.18em] text-[var(--text-muted)]">
              Relationship map
            </p>
            <p className="text-sm leading-6 text-[var(--text-secondary)]">
              The canvas inherits the same atmosphere as the reading surfaces, so branch identity
              and mood stay coherent.
            </p>
          </SurfaceCard>
          <SurfaceCard className="space-y-2">
            <LineItem name="Canvas notes" />
            <LineItem name="Relatives rail" />
          </SurfaceCard>
        </div>
      </div>
    );
  }

  return (
    <div className="grid gap-4 p-4 lg:grid-cols-[minmax(0,1fr)_12rem]">
      <CanvasSurface skin={skin} expansive />
      <div className="space-y-3">
        <SurfaceCard className="space-y-2">
          <p className="text-[10px] uppercase tracking-[0.18em] text-[var(--text-muted)]">
            Explorer rail
          </p>
          <p className="text-sm font-semibold text-[var(--text-primary)]">Jonah Brooks</p>
          <LineItem name="Profile" />
          <LineItem name="Depth 2" />
          <LineItem name="Vale branch" />
        </SurfaceCard>
      </div>
    </div>
  );
}

function CanvasSurface({
  expansive = false,
  skin,
}: {
  expansive?: boolean;
  skin: ThemeSkin;
}) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-[22px] border border-[var(--border-default)] bg-[var(--bg-canvas)]",
        expansive ? "min-h-[19rem]" : "min-h-[18rem]",
      )}
    >
      <SkinCanvasOverlay skin={skin} />
      <CanvasPath vertical />
      <CanvasNode className="left-[12%] top-[16%]" label="Ada Hart" />
      <CanvasNode className="left-[40%] top-[14%]" label="Elias Hart" />
      <CanvasNode className="left-[68%] top-[18%]" label="Mara Vale" />
      <CanvasNode className="left-[40%] top-[54%]" label="Jonah Brooks" active />
      <CanvasNode className="left-[72%] top-[60%]" label="Helen Brooks" compact />
      <div className="absolute left-4 top-4 rounded-full border border-[var(--border-default)] bg-[var(--canvas-controls-bg)] px-3 py-1.5 text-[11px] font-semibold text-[var(--text-secondary)] shadow-[var(--shadow-sm)]">
        Canvas
      </div>
    </div>
  );
}

function PreviewAtmosphere({ skin }: { skin: ThemeSkin }) {
  if (skin === "botanical") {
    return (
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,color-mix(in_oklab,var(--accent-primary)_16%,transparent),transparent_36%),radial-gradient(circle_at_bottom_right,rgba(184,134,59,0.09),transparent_26%)]" />
    );
  }

  if (skin === "inkwash") {
    return (
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(23,20,19,0.04),transparent_28%),radial-gradient(circle_at_top_left,rgba(23,20,19,0.08),transparent_34%)]" />
    );
  }

  if (skin === "portrait-gallery") {
    return (
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(123,95,143,0.16),transparent_34%),radial-gradient(circle_at_top_right,rgba(195,139,56,0.12),transparent_26%)]" />
    );
  }

  return (
    <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,color-mix(in_oklab,var(--accent-primary)_18%,transparent),transparent_38%),radial-gradient(circle_at_bottom_right,color-mix(in_oklab,var(--accent-primary)_10%,transparent),transparent_28%)]" />
  );
}

function SkinCanvasOverlay({ skin }: { skin: ThemeSkin }) {
  if (skin === "portrait-gallery") {
    return (
      <>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,var(--canvas-grid-color),transparent_48%)] opacity-90" />
        <div className="absolute inset-x-10 top-8 h-[7rem] rounded-t-[999px] border border-[var(--border-default)] border-b-0 opacity-55" />
      </>
    );
  }

  if (skin === "botanical") {
    return (
      <>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,var(--canvas-grid-color),transparent_48%)] opacity-90" />
        <div className="absolute left-1/2 top-6 h-[8rem] w-[2px] -translate-x-1/2 bg-[color-mix(in_oklab,var(--accent-primary)_26%,transparent)]" />
        <div className="absolute left-[28%] top-[5.5rem] h-[2px] w-[18%] rotate-[-14deg] bg-[color-mix(in_oklab,var(--accent-primary)_26%,transparent)]" />
        <div className="absolute right-[28%] top-[5.5rem] h-[2px] w-[18%] rotate-[14deg] bg-[color-mix(in_oklab,var(--accent-primary)_26%,transparent)]" />
      </>
    );
  }

  if (skin === "inkwash") {
    return (
      <>
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(23,20,19,0.03),transparent_24%),radial-gradient(circle_at_top_left,var(--canvas-grid-color),transparent_48%)] opacity-95" />
        <div className="absolute inset-x-4 top-4 border-t border-dashed border-[color-mix(in_oklab,var(--text-primary)_16%,transparent)]" />
      </>
    );
  }

  return (
    <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,var(--canvas-grid-color),transparent_48%)] opacity-90" />
  );
}

function PreviewMeta({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[18px] border border-[var(--border-default)] bg-[color-mix(in_oklab,var(--bg-surface)_88%,transparent)] px-4 py-3">
      <p className="text-[10px] uppercase tracking-[0.18em] text-[var(--text-muted)]">{label}</p>
      <p className="mt-2 text-sm font-semibold text-[var(--text-primary)]">{value}</p>
    </div>
  );
}

function SurfaceCard({
  className,
  children,
}: {
  className?: string;
  children: ReactNode;
}) {
  return (
    <div
      className={cn(
        "rounded-[20px] border border-[var(--border-default)] bg-[color-mix(in_oklab,var(--bg-surface)_92%,transparent)] p-4 shadow-[var(--shadow-sm)]",
        className,
      )}
    >
      {children}
    </div>
  );
}

function MetricPill({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[18px] border border-[var(--border-default)] bg-[color-mix(in_oklab,var(--bg-elevated)_84%,transparent)] px-4 py-3">
      <p className="text-[10px] uppercase tracking-[0.18em] text-[var(--text-muted)]">{label}</p>
      <p className="mt-2 text-2xl font-semibold text-[var(--text-primary)]">{value}</p>
    </div>
  );
}

function LineItem({ name }: { name: string }) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-[16px] border border-[var(--border-default)] bg-[color-mix(in_oklab,var(--bg-elevated)_70%,transparent)] px-3 py-2">
      <span className="text-sm font-medium text-[var(--text-primary)]">{name}</span>
      <span className="h-2 w-2 rounded-full bg-[var(--accent-primary)]" />
    </div>
  );
}

function ActionBar({
  primary,
  secondary,
  stacked = false,
}: {
  primary: string;
  secondary: string;
  stacked?: boolean;
}) {
  return (
    <div className={cn("flex gap-2", stacked ? "flex-col" : "flex-wrap")}>
      <div className="rounded-full bg-[var(--accent-primary)] px-3 py-2 text-[11px] font-semibold text-[var(--text-inverse)]">
        {primary}
      </div>
      <div className="rounded-full border border-[var(--border-default)] px-3 py-2 text-[11px] font-semibold text-[var(--text-secondary)]">
        {secondary}
      </div>
    </div>
  );
}

function MetaRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-[14px] border border-[var(--border-default)] px-3 py-2">
      <span className="text-[11px] uppercase tracking-[0.14em] text-[var(--text-muted)]">{label}</span>
      <span className="text-sm font-medium text-[var(--text-primary)]">{value}</span>
    </div>
  );
}

function LineBlock({ width }: { width: string }) {
  return <div className="h-2 rounded-full bg-[var(--border-default)]" style={{ width }} />;
}

function CanvasNode({
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
        "absolute rounded-[16px] border px-3 py-2 text-sm font-semibold shadow-[var(--shadow-node)]",
        compact ? "w-28" : "w-32",
        active
          ? "border-[var(--border-strong)] bg-[var(--canvas-node-highlight-bg)] text-[var(--text-primary)]"
          : "border-[var(--canvas-node-border)] bg-[var(--canvas-node-bg)] text-[var(--canvas-node-text)]",
        className,
      )}
    >
      <span className="block truncate">{label}</span>
      <span className="mt-2 block h-1.5 w-10 rounded-full bg-[var(--accent-muted)]" />
    </div>
  );
}

function CanvasPath({ vertical = false }: { vertical?: boolean }) {
  return (
    <>
      <div className="absolute left-[28%] top-[31%] h-px w-[42%] bg-[var(--canvas-edge)]" />
      <div className="absolute left-[54%] top-[31%] h-[28%] w-px bg-[var(--canvas-edge)]" />
      {vertical ? (
        <div className="absolute left-[72%] top-[31%] h-[30%] w-px bg-[var(--canvas-edge)]" />
      ) : null}
    </>
  );
}
