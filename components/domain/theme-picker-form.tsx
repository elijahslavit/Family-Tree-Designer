"use client";

import Link from "next/link";
import { useState, useTransition } from "react";

import { Badge } from "@/components/foundation/badge";
import { Button } from "@/components/foundation/button";
import { Card } from "@/components/foundation/card";
import { LayoutPreview } from "@/components/domain/layout-preview";
import {
  type ThemeStudioScene,
  ThemeStudioPreview,
} from "@/components/domain/theme-studio-preview";
import { SkinPreview } from "@/components/domain/skin-preview";
import { useToast } from "@/components/foundation/toast";
import { updateTreeTheme } from "@/lib/actions";
import type { ThemeLayout, ThemeSkin, Tree } from "@/lib/types";
import { themeLayouts, themeSkins } from "@/lib/utils/constants";
import { cn } from "@/lib/utils/cn";

const studioPresets: Array<{
  title: string;
  description: string;
  layout: ThemeLayout;
  skin: ThemeSkin;
}> = [
  {
    title: "Heirloom Book",
    description: "Editorial storytelling with warm, archival contrast.",
    layout: "editorial",
    skin: "dark-gold",
  },
  {
    title: "Library Register",
    description: "Classic browsing with paper-and-ink dignity.",
    layout: "classic",
    skin: "parchment",
  },
  {
    title: "Modern Atlas",
    description: "Explorer mapping with a calm contemporary finish.",
    layout: "explorer",
    skin: "modern",
  },
];

const sceneOptions: Array<{
  value: ThemeStudioScene;
  label: string;
}> = [
  { value: "landing", label: "Landing" },
  { value: "profile", label: "Profile" },
  { value: "canvas", label: "Canvas" },
];

const layoutCopy: Record<ThemeLayout, string> = {
  classic: "Best when the archive should feel structured, familiar, and easy to browse fast.",
  editorial: "Best when biography, storytelling, and lineage reading should feel ceremonial.",
  explorer: "Best when the canvas is the main attraction and relationships are the star.",
};

const skinCopy: Record<ThemeSkin, string> = {
  "dark-gold": "Feels like a leather-bound family bible opened on a table.",
  parchment: "Feels like a genealogy volume lifted from a quiet reading room shelf.",
  modern: "Feels like a carefully designed family site built for contemporary sharing.",
};

export function ThemePickerForm({
  tree,
  publicHref,
}: {
  tree: Tree;
  publicHref: string;
}) {
  const [layout, setLayout] = useState<ThemeLayout>(tree.themeLayout);
  const [skin, setSkin] = useState<ThemeSkin>(tree.themeSkin);
  const [scene, setScene] = useState<ThemeStudioScene>("landing");
  const [isPending, startSaving] = useTransition();
  const { pushToast } = useToast();

  const hasChanges = layout !== tree.themeLayout || skin !== tree.themeSkin;

  function saveTheme() {
    startSaving(async () => {
      await updateTreeTheme({
        treeId: tree.id,
        themeLayout: layout,
        themeSkin: skin,
      });
      pushToast("Theme updated.", "success");
    });
  }

  return (
    <div className="grid gap-6 xl:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)]">
      <div className="space-y-6">
        <Card className="relative overflow-hidden">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,color-mix(in_oklab,var(--accent-primary)_18%,transparent),transparent_40%),linear-gradient(180deg,color-mix(in_oklab,var(--bg-elevated)_74%,transparent),transparent)]" />
          <div className="relative space-y-6">
            <div className="flex flex-wrap items-center gap-2">
              <Badge tone="accent">Theme studio</Badge>
              <Badge tone="default">9 combinations</Badge>
              <Badge tone={hasChanges ? "warning" : "success"}>
                {hasChanges ? "Draft not saved" : "Saved to archive"}
              </Badge>
            </div>

            <div className="grid gap-6 xl:grid-cols-[minmax(0,1.05fr)_19rem]">
              <div className="space-y-5">
                <div className="space-y-3">
                  <p className="text-xs uppercase tracking-[0.2em] text-[var(--text-muted)]">
                    Theme
                  </p>
                  <h2 className="display-name text-4xl font-semibold leading-tight text-[var(--text-primary)] md:text-5xl">
                    Choose how the family tree feels when relatives open it.
                  </h2>
                  <p className="max-w-3xl text-base leading-7 text-[var(--text-secondary)] md:text-lg">
                    Layout changes the structural rhythm. Skin changes the visual atmosphere. Pick
                    them independently, then inspect the landing page, profile, and canvas before
                    publishing the result to viewers.
                  </p>
                </div>

                <div className="flex flex-wrap gap-3">
                  <Button loading={isPending} onClick={saveTheme}>
                    Save theme
                  </Button>
                  <Button
                    variant="secondary"
                    disabled={!hasChanges || isPending}
                    onClick={() => {
                      setLayout(tree.themeLayout);
                      setSkin(tree.themeSkin);
                      pushToast("Draft reset to the saved theme.");
                    }}
                  >
                    Reset draft
                  </Button>
                  <Link
                    href={publicHref}
                    className="inline-flex items-center justify-center rounded-[var(--radius-md)] border border-[var(--border-default)] px-4 py-2 text-sm font-semibold text-[var(--text-secondary)] transition-colors hover:bg-[var(--accent-muted)] hover:text-[var(--text-primary)]"
                  >
                    Open public archive
                  </Link>
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-3 xl:grid-cols-1">
                <StudioMeta
                  label="Current layout"
                  value={labelize(layout)}
                  detail={layoutCopy[layout]}
                />
                <StudioMeta
                  label="Current skin"
                  value={labelize(skin)}
                  detail={skinCopy[skin]}
                />
                <StudioMeta
                  label="Viewer promise"
                  value="Same theme everywhere"
                  detail="Directory, profiles, lineages, and canvas all inherit the selected combination."
                />
              </div>
            </div>
          </div>
        </Card>

        <Card className="space-y-5">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <p className="text-xs uppercase tracking-[0.16em] text-[var(--text-muted)]">
                Curated pairings
              </p>
              <h3 className="mt-1 text-2xl font-semibold text-[var(--text-primary)]">
                Start from a family-tree mood board, not from raw controls.
              </h3>
            </div>
            <p className="max-w-lg text-sm leading-6 text-[var(--text-secondary)]">
              These combinations are meant to feel like actual archive directions: heirloom,
              library, or contemporary.
            </p>
          </div>

          <div className="grid gap-3 md:grid-cols-3">
            {studioPresets.map((preset) => {
              const selected = layout === preset.layout && skin === preset.skin;

              return (
                <button
                  key={preset.title}
                  type="button"
                  aria-pressed={selected}
                  onClick={() => {
                    setLayout(preset.layout);
                    setSkin(preset.skin);
                  }}
                  className={cn(
                    "rounded-[var(--radius-lg)] border p-4 text-left transition-all duration-[var(--transition-normal)]",
                    selected
                      ? "border-[var(--border-strong)] bg-[color-mix(in_oklab,var(--accent-primary)_12%,var(--bg-surface))] shadow-[var(--shadow-md)]"
                      : "border-[var(--border-default)] bg-[color-mix(in_oklab,var(--bg-surface)_90%,transparent)] hover:-translate-y-0.5 hover:border-[var(--border-strong)] hover:shadow-[var(--shadow-sm)]",
                  )}
                >
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge tone={selected ? "accent" : "default"}>{preset.title}</Badge>
                    <Badge tone="default">
                      {labelize(preset.layout)} + {labelize(preset.skin)}
                    </Badge>
                  </div>
                  <p className="mt-3 text-sm leading-6 text-[var(--text-secondary)]">
                    {preset.description}
                  </p>
                </button>
              );
            })}
          </div>
        </Card>

        <Card className="space-y-5">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <p className="text-xs uppercase tracking-[0.16em] text-[var(--text-muted)]">
                Layout
              </p>
              <h3 className="mt-1 text-2xl font-semibold text-[var(--text-primary)]">
                Pick the structural rhythm.
              </h3>
            </div>
            <p className="max-w-lg text-sm leading-6 text-[var(--text-secondary)]">
              Every layout still renders directory, profile, lineage, and canvas. The difference is
              where the eye goes first and how much reading room each screen gets.
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            {themeLayouts.map((item) => (
              <button
                key={item}
                type="button"
                aria-pressed={layout === item}
                onClick={() => setLayout(item)}
                className="rounded-[26px] text-left focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent-primary)]"
              >
                <LayoutPreview layout={item} skin={skin} active={layout === item} />
              </button>
            ))}
          </div>
        </Card>

        <Card className="space-y-5">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <p className="text-xs uppercase tracking-[0.16em] text-[var(--text-muted)]">
                Skin
              </p>
              <h3 className="mt-1 text-2xl font-semibold text-[var(--text-primary)]">
                Pick the visual atmosphere.
              </h3>
            </div>
            <p className="max-w-lg text-sm leading-6 text-[var(--text-secondary)]">
              These skins are meant to feel like family-tree presentations, not generic web themes.
              They change typography, contrast, materials, and the emotional temperature of the archive.
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            {themeSkins.map((item) => (
              <button
                key={item}
                type="button"
                aria-pressed={skin === item}
                onClick={() => setSkin(item)}
                className="rounded-[26px] text-left focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent-primary)]"
              >
                <SkinPreview skin={item} layout={layout} active={skin === item} />
              </button>
            ))}
          </div>
        </Card>
      </div>

      <div className="space-y-6 self-start xl:sticky xl:top-6">
        <Card className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-xs uppercase tracking-[0.16em] text-[var(--text-muted)]">
                Live preview
              </p>
              <h3 className="mt-1 text-2xl font-semibold text-[var(--text-primary)]">
                See the archive, not just the palette.
              </h3>
            </div>
            <Badge tone="default">
              {labelize(layout)} + {labelize(skin)}
            </Badge>
          </div>

          <div className="flex flex-wrap gap-2">
            {sceneOptions.map((option) => (
              <button
                key={option.value}
                type="button"
                aria-pressed={scene === option.value}
                aria-label={`Preview ${option.label.toLowerCase()} screen`}
                onClick={() => setScene(option.value)}
                className={cn(
                  "rounded-full border px-3 py-2 text-sm font-semibold transition-colors",
                  scene === option.value
                    ? "border-[var(--border-strong)] bg-[var(--accent-primary)] text-[var(--text-inverse)]"
                    : "border-[var(--border-default)] bg-[color-mix(in_oklab,var(--bg-surface)_88%,transparent)] text-[var(--text-secondary)] hover:bg-[var(--accent-muted)] hover:text-[var(--text-primary)]",
                )}
              >
                {option.label}
              </button>
            ))}
          </div>

          <ThemeStudioPreview layout={layout} skin={skin} scene={scene} treeName={tree.name} />
        </Card>

        <Card className="space-y-4">
          <p className="text-xs uppercase tracking-[0.16em] text-[var(--text-muted)]">
            What changes
          </p>
          <div className="grid gap-3">
            <ReviewPoint
              title="Directory"
              copy="Card density, profile hierarchy, and how quickly relatives can scan names and context."
            />
            <ReviewPoint
              title="Profiles"
              copy="Whether biographies feel like quick records, keepsake essays, or graph-connected briefs."
            />
            <ReviewPoint
              title="Canvas"
              copy="The emotional tone of the graph surface, node presence, and how branch identity reads at a glance."
            />
          </div>
        </Card>
      </div>
    </div>
  );
}

function StudioMeta({
  label,
  value,
  detail,
}: {
  label: string;
  value: string;
  detail: string;
}) {
  return (
    <div className="rounded-[var(--radius-md)] border border-[var(--border-default)] bg-[color-mix(in_oklab,var(--bg-surface)_88%,transparent)] p-4 backdrop-blur">
      <p className="text-xs uppercase tracking-[0.16em] text-[var(--text-muted)]">{label}</p>
      <p className="mt-2 text-lg font-semibold text-[var(--text-primary)]">{value}</p>
      <p className="mt-2 text-sm leading-6 text-[var(--text-secondary)]">{detail}</p>
    </div>
  );
}

function ReviewPoint({ title, copy }: { title: string; copy: string }) {
  return (
    <div className="rounded-[var(--radius-md)] border border-[var(--border-default)] bg-[color-mix(in_oklab,var(--bg-elevated)_82%,transparent)] p-4">
      <p className="text-sm font-semibold text-[var(--text-primary)]">{title}</p>
      <p className="mt-2 text-sm leading-6 text-[var(--text-secondary)]">{copy}</p>
    </div>
  );
}

function labelize(value: string) {
  return value
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}
