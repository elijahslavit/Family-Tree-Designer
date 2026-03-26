"use client";

import Link from "next/link";
import { Check, Compass, Eye, Palette, Sparkles, Wand2 } from "lucide-react";
import type { ReactNode } from "react";
import { useState, useTransition } from "react";

import { Badge } from "@/components/foundation/badge";
import { Button } from "@/components/foundation/button";
import { Card } from "@/components/foundation/card";
import { useToast } from "@/components/foundation/toast";
import { LayoutPreview } from "@/components/domain/layout-preview";
import { SkinPreview } from "@/components/domain/skin-preview";
import {
  type ThemeStudioScene,
  ThemeStudioPreview,
} from "@/components/domain/theme-studio-preview";
import { updateTreeTheme } from "@/lib/actions";
import type { ThemeLayout, ThemeSkin, Tree } from "@/lib/types";
import { themeLayouts, themeSkins } from "@/lib/utils/constants";
import {
  labelizeTheme,
  themeLayoutProfiles,
  themeSceneOptions,
  themeSkinProfiles,
  themeStudioPresets,
} from "@/lib/utils/theme-studio";
import { cn } from "@/lib/utils/cn";

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
  const selectedSkin = themeSkinProfiles[skin];
  const selectedLayout = themeLayoutProfiles[layout];
  const matchingPreset = themeStudioPresets.find(
    (preset) => preset.layout === layout && preset.skin === skin,
  );

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
    <div className="grid gap-6 xl:grid-cols-[minmax(0,1.1fr)_minmax(20rem,0.9fr)]">
      <div className="space-y-6">
        <Card className="relative overflow-hidden border-[color-mix(in_oklab,var(--border-strong)_75%,var(--border-default))]">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,color-mix(in_oklab,var(--accent-primary)_18%,transparent),transparent_42%),linear-gradient(180deg,color-mix(in_oklab,var(--bg-elevated)_68%,transparent),transparent)]" />
          <div className="relative space-y-6">
            <div className="flex flex-wrap items-center gap-2">
              <Badge tone="accent">Theme studio</Badge>
              <Badge tone="default">18 combinations</Badge>
              <Badge tone="default">6 archive skins</Badge>
              <Badge tone={hasChanges ? "warning" : "success"}>
                {hasChanges ? "Draft not saved" : "Saved to archive"}
              </Badge>
            </div>

            <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_20rem]">
              <div className="space-y-4">
                <div className="space-y-3">
                  <p className="text-xs uppercase tracking-[0.2em] text-[var(--text-muted)]">
                    Theme
                  </p>
                  <h2 className="display-name text-4xl font-semibold leading-tight text-[var(--text-primary)] md:text-5xl">
                    Choose the archive direction before you choose the colors.
                  </h2>
                  <p className="max-w-3xl text-base leading-7 text-[var(--text-secondary)] md:text-lg">
                    Each skin is modeled as a real family-tree presentation style: heirloom book,
                    botanical wall chart, hand-inked manuscript, portrait salon, and more. Pick
                    the atmosphere first, then decide which layout gives that mood the right rhythm.
                  </p>
                </div>

                <div className="grid gap-3 md:grid-cols-3">
                  <StudioMeta
                    icon={<Palette className="h-4 w-4" />}
                    label="Selected skin"
                    value={selectedSkin.title}
                    detail={selectedSkin.strap}
                  />
                  <StudioMeta
                    icon={<Compass className="h-4 w-4" />}
                    label="Selected layout"
                    value={selectedLayout.title}
                    detail={selectedLayout.emphasis}
                  />
                  <StudioMeta
                    icon={<Sparkles className="h-4 w-4" />}
                    label="Current pairing"
                    value={matchingPreset?.title ?? `${selectedSkin.mood} + ${selectedLayout.title}`}
                    detail={
                      matchingPreset?.description ??
                      "A custom pairing shaped from the selected structure and skin."
                    }
                  />
                </div>
              </div>

              <div className="rounded-[28px] border border-[var(--border-default)] bg-[color-mix(in_oklab,var(--bg-surface)_84%,transparent)] p-4">
                <p className="text-xs uppercase tracking-[0.18em] text-[var(--text-muted)]">
                  Picker guidance
                </p>
                <div className="mt-4 space-y-4">
                  <ChooserStep
                    title="1. Pick a skin"
                    copy="Choose the artistry first so the archive has a distinct emotional temperature."
                  />
                  <ChooserStep
                    title="2. Shape the layout"
                    copy="Switch between browsing, storytelling, or graph-first structure without losing the skin."
                  />
                  <ChooserStep
                    title="3. Inspect real screens"
                    copy="Use the live preview to check landing, profile, and canvas before saving."
                  />
                </div>
              </div>
            </div>
          </div>
        </Card>

        <Card className="space-y-5">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <p className="text-xs uppercase tracking-[0.16em] text-[var(--text-muted)]">
                Theme houses
              </p>
              <h3 className="mt-1 text-2xl font-semibold text-[var(--text-primary)]">
                Pick the visual artistry relatives will remember.
              </h3>
            </div>
            <p className="max-w-2xl text-sm leading-6 text-[var(--text-secondary)]">
              The new skins are based on the kinds of family-tree treatments people actually share
              and admire: historical manuscripts, tree-wall posters, ancestry fan charts, and
              photo-led keepsakes.
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-2 2xl:grid-cols-3">
            {themeSkins.map((item) => (
              <button
                key={item}
                type="button"
                aria-pressed={skin === item}
                onClick={() => setSkin(item)}
                className="rounded-[30px] text-left focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent-primary)]"
              >
                <SkinPreview skin={item} layout={layout} active={skin === item} />
              </button>
            ))}
          </div>

          <SelectedSkinPanel
            skin={skin}
            layout={layout}
            onPickLayout={(nextLayout) => setLayout(nextLayout)}
          />
        </Card>

        <Card className="space-y-5">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <p className="text-xs uppercase tracking-[0.16em] text-[var(--text-muted)]">
                Curated pairings
              </p>
              <h3 className="mt-1 text-2xl font-semibold text-[var(--text-primary)]">
                Start from a fully formed archive direction.
              </h3>
            </div>
            <p className="max-w-xl text-sm leading-6 text-[var(--text-secondary)]">
              These are the strongest theme pairings in the studio right now, tuned for actual
              family-tree presentation styles rather than generic website presets.
            </p>
          </div>

          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
            {themeStudioPresets.map((preset) => {
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
                    "rounded-[24px] border p-4 text-left transition-all duration-[var(--transition-normal)]",
                    selected
                      ? "border-[var(--border-strong)] bg-[color-mix(in_oklab,var(--accent-primary)_12%,var(--bg-surface))] shadow-[var(--shadow-md)]"
                      : "border-[var(--border-default)] bg-[color-mix(in_oklab,var(--bg-surface)_90%,transparent)] hover:-translate-y-0.5 hover:border-[var(--border-strong)] hover:shadow-[var(--shadow-sm)]",
                  )}
                >
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge tone={selected ? "accent" : "default"}>{preset.title}</Badge>
                    <Badge tone="default">
                      {labelizeTheme(preset.layout)} + {themeSkinProfiles[preset.skin].title}
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
                Layout rhythm
              </p>
              <h3 className="mt-1 text-2xl font-semibold text-[var(--text-primary)]">
                Decide where attention goes first.
              </h3>
            </div>
            <p className="max-w-xl text-sm leading-6 text-[var(--text-secondary)]">
              Layout controls the archive cadence while the skin keeps the atmosphere intact.
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            {themeLayouts.map((item) => (
              <button
                key={item}
                type="button"
                aria-pressed={layout === item}
                onClick={() => setLayout(item)}
                className="rounded-[30px] text-left focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent-primary)]"
              >
                <LayoutPreview layout={item} skin={skin} active={layout === item} />
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
                See the archive, not just the picker.
              </h3>
            </div>
            <Badge tone="default">
              {selectedSkin.title} + {selectedLayout.title}
            </Badge>
          </div>

          <div className="flex flex-wrap gap-2">
            {themeSceneOptions.map((option) => (
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
          <div className="flex items-center gap-2">
            <Eye className="h-4 w-4 text-[var(--accent-text)]" />
            <p className="text-xs uppercase tracking-[0.16em] text-[var(--text-muted)]">
              Selection brief
            </p>
          </div>
          <DecisionRow label="Mood" value={selectedSkin.mood} />
          <DecisionRow label="Material cues" value={selectedSkin.material} />
          <DecisionRow label="Best use" value={selectedSkin.bestFor} />
          <DecisionRow label="Layout promise" value={selectedLayout.emphasis} />
          <div className="flex flex-wrap gap-2">
            {selectedSkin.cueWords.map((word) => (
              <span
                key={word}
                className="rounded-full border border-[var(--border-default)] px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-[var(--text-muted)]"
              >
                {word}
              </span>
            ))}
          </div>
        </Card>

        <Card className="space-y-4">
          <div className="flex items-center gap-2">
            <Wand2 className="h-4 w-4 text-[var(--accent-text)]" />
            <p className="text-xs uppercase tracking-[0.16em] text-[var(--text-muted)]">
              Publish this direction
            </p>
          </div>
          <div className="space-y-3">
            <Button loading={isPending} onClick={saveTheme}>
              <Check className="h-4 w-4" />
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
        </Card>
      </div>
    </div>
  );
}

function StudioMeta({
  icon,
  label,
  value,
  detail,
}: {
  icon: ReactNode;
  label: string;
  value: string;
  detail: string;
}) {
  return (
    <div className="rounded-[22px] border border-[var(--border-default)] bg-[color-mix(in_oklab,var(--bg-surface)_88%,transparent)] p-4">
      <div className="flex items-center gap-2 text-[var(--text-muted)]">
        {icon}
        <p className="text-xs uppercase tracking-[0.16em]">{label}</p>
      </div>
      <p className="mt-3 text-lg font-semibold text-[var(--text-primary)]">{value}</p>
      <p className="mt-2 text-sm leading-6 text-[var(--text-secondary)]">{detail}</p>
    </div>
  );
}

function ChooserStep({
  title,
  copy,
}: {
  title: string;
  copy: string;
}) {
  return (
    <div className="rounded-[20px] border border-[var(--border-default)] bg-[color-mix(in_oklab,var(--bg-elevated)_78%,transparent)] p-4">
      <p className="text-sm font-semibold text-[var(--text-primary)]">{title}</p>
      <p className="mt-2 text-sm leading-6 text-[var(--text-secondary)]">{copy}</p>
    </div>
  );
}

function SelectedSkinPanel({
  skin,
  layout,
  onPickLayout,
}: {
  skin: ThemeSkin;
  layout: ThemeLayout;
  onPickLayout: (layout: ThemeLayout) => void;
}) {
  const selectedSkin = themeSkinProfiles[skin];

  return (
    <div className="rounded-[28px] border border-[var(--border-strong)] bg-[color-mix(in_oklab,var(--accent-primary)_8%,var(--bg-surface))] p-5">
      <div className="flex flex-wrap items-center gap-2">
        <Badge tone="accent">Selected skin</Badge>
        <Badge tone="default">{selectedSkin.title}</Badge>
      </div>

      <div className="mt-4 grid gap-5 lg:grid-cols-[minmax(0,1fr)_18rem]">
        <div className="space-y-3">
          <h4 className="text-2xl font-semibold text-[var(--text-primary)]">
            {selectedSkin.mood} with {selectedSkin.signature.toLowerCase()}.
          </h4>
          <p className="text-sm leading-7 text-[var(--text-secondary)]">
            {selectedSkin.bestFor}
          </p>
          <div className="grid gap-3 md:grid-cols-2">
            <DecisionRow label="Material" value={selectedSkin.material} />
            <DecisionRow label="Signature" value={selectedSkin.signature} />
          </div>
        </div>

        <div className="space-y-3">
          <p className="text-xs uppercase tracking-[0.16em] text-[var(--text-muted)]">
            Recommended layouts
          </p>
          {selectedSkin.recommendedLayouts.map((item) => (
            <button
              key={item}
              type="button"
              aria-pressed={layout === item}
              onClick={() => onPickLayout(item)}
              className={cn(
                "w-full rounded-[18px] border px-4 py-3 text-left transition-colors",
                layout === item
                  ? "border-[var(--border-strong)] bg-[var(--accent-muted)] text-[var(--text-primary)]"
                  : "border-[var(--border-default)] bg-[color-mix(in_oklab,var(--bg-elevated)_78%,transparent)] text-[var(--text-secondary)] hover:bg-[var(--accent-muted)] hover:text-[var(--text-primary)]",
              )}
            >
              <p className="text-sm font-semibold">{themeLayoutProfiles[item].title}</p>
              <p className="mt-1 text-sm leading-6">{themeLayoutProfiles[item].emphasis}</p>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

function DecisionRow({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-[18px] border border-[var(--border-default)] bg-[color-mix(in_oklab,var(--bg-surface)_90%,transparent)] px-4 py-3">
      <p className="text-[10px] uppercase tracking-[0.18em] text-[var(--text-muted)]">{label}</p>
      <p className="mt-2 text-sm font-semibold leading-6 text-[var(--text-primary)]">{value}</p>
    </div>
  );
}
