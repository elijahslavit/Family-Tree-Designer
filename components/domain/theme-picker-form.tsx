"use client";

import Link from "next/link";
import { Check, Compass, Palette, Sparkles, Wand2 } from "lucide-react";
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
    <div className="space-y-6">
      <div className="grid gap-6 xl:grid-cols-[minmax(0,1.02fr)_minmax(24rem,0.98fr)] xl:items-start">
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

            <div className="space-y-4">
              <p className="text-xs uppercase tracking-[0.2em] text-[var(--text-muted)]">Theme</p>
              <h2 className="display-name max-w-[14ch] text-4xl font-semibold leading-tight text-[var(--text-primary)] md:text-5xl">
                Choose the archive direction before you choose the colors.
              </h2>
              <p className="max-w-3xl text-base leading-7 text-[var(--text-secondary)] md:text-lg">
                Each skin is modeled as a real family-tree presentation style: heirloom book,
                botanical wall chart, hand-inked manuscript, portrait salon, and more. Pick the
                atmosphere first, then decide which layout gives that mood the right rhythm.
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              <StudioJumpLink href="#theme-preview" label="Preview" />
              <StudioJumpLink href="#theme-pairings" label="Curated pairings" />
              <StudioJumpLink href="#theme-skins" label="Theme houses" />
              <StudioJumpLink href="#theme-layouts" label="Layout rhythm" />
            </div>

            <div className="grid gap-3 lg:grid-cols-3">
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

            <div className="rounded-[28px] border border-[var(--border-default)] bg-[color-mix(in_oklab,var(--bg-surface)_84%,transparent)] p-4">
              <div className="flex flex-wrap items-end justify-between gap-3">
                <div>
                  <p className="text-xs uppercase tracking-[0.18em] text-[var(--text-muted)]">
                    Studio flow
                  </p>
                  <h3 className="mt-1 text-xl font-semibold text-[var(--text-primary)]">
                    Pick the mood, inspect the screens, then save.
                  </h3>
                </div>
                <p className="max-w-xl text-sm leading-6 text-[var(--text-secondary)]">
                  The flow is ordered so the visual direction stays clear before you commit the
                  theme to the archive.
                </p>
              </div>

              <div className="mt-4 grid gap-3 md:grid-cols-3">
                <ChooserStep
                  title="1. Start with a mood"
                  copy="Browse skins first to land on the kind of keepsake or poster you want relatives to feel."
                />
                <ChooserStep
                  title="2. Compare real screens"
                  copy="Use the preview early so the landing page, profile, and canvas all support the same direction."
                />
                <ChooserStep
                  title="3. Tune the structure"
                  copy="Finish with layout rhythm and save once the preview matches the reading experience you want."
                />
              </div>
            </div>
          </div>
        </Card>

        <Card id="theme-preview" className="space-y-5 xl:sticky xl:top-24 xl:scroll-mt-24">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <p className="text-xs uppercase tracking-[0.16em] text-[var(--text-muted)]">
                Live preview
              </p>
              <h3 className="mt-1 text-2xl font-semibold text-[var(--text-primary)]">
                See the archive, not just the picker.
              </h3>
              <p className="mt-2 max-w-xl text-sm leading-6 text-[var(--text-secondary)]">
                Compare the landing page, a profile, and the canvas before you commit to the look.
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Badge tone="accent">{selectedSkin.title}</Badge>
              <Badge tone="default">{selectedLayout.title}</Badge>
            </div>
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

          <div className="grid gap-3 sm:grid-cols-2">
            <DecisionRow label="Mood" value={selectedSkin.mood} />
            <DecisionRow label="Material cues" value={selectedSkin.material} />
            <DecisionRow label="Best use" value={selectedSkin.bestFor} />
            <DecisionRow label="Layout promise" value={selectedLayout.emphasis} />
          </div>

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

          <div className="rounded-[24px] border border-[var(--border-strong)] bg-[color-mix(in_oklab,var(--accent-primary)_8%,var(--bg-surface))] p-4">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Wand2 className="h-4 w-4 text-[var(--accent-text)]" />
                  <p className="text-xs uppercase tracking-[0.16em] text-[var(--text-muted)]">
                    Publish this direction
                  </p>
                </div>
                <p className="max-w-xl text-sm leading-6 text-[var(--text-secondary)]">
                  {hasChanges
                    ? "Draft changes are ready. Save once the live preview feels right."
                    : "This direction is already live in the archive."}
                </p>
              </div>
              <Badge tone={hasChanges ? "warning" : "success"}>
                {hasChanges ? "Draft not saved" : "Saved to archive"}
              </Badge>
            </div>

            <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <Button
                className="sm:flex-1"
                loading={isPending}
                disabled={!hasChanges}
                onClick={saveTheme}
              >
                <Check className="h-4 w-4" />
                Save theme
              </Button>
              <Button
                className="sm:flex-1"
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
                className="inline-flex items-center justify-center rounded-[var(--radius-md)] border border-[var(--border-default)] px-4 py-2 text-sm font-semibold text-[var(--text-secondary)] transition-colors hover:bg-[var(--accent-muted)] hover:text-[var(--text-primary)] sm:basis-full"
              >
                Open public archive
              </Link>
            </div>
          </div>
        </Card>
      </div>

      <section id="theme-pairings" className="scroll-mt-24">
        <Card className="space-y-5">
          <SectionIntro
            eyebrow="Curated pairings"
            title="Start from a fully formed archive direction."
            copy="These are the strongest theme pairings in the studio right now, tuned for actual family-tree presentation styles rather than generic website presets."
          />

          <div className="grid gap-3 lg:grid-cols-2 xl:grid-cols-3">
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
      </section>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1.16fr)_minmax(0,0.84fr)] xl:items-start">
        <section id="theme-skins" className="scroll-mt-24">
          <Card className="space-y-5">
            <SectionIntro
              eyebrow="Theme houses"
              title="Pick the visual artistry relatives will remember."
              copy="The skins are based on the kinds of family-tree treatments people actually share and admire: historical manuscripts, tree-wall posters, ancestry fan charts, and photo-led keepsakes."
            />

            <div className="grid gap-4 md:grid-cols-2">
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
          </Card>
        </section>

        <section id="theme-layouts" className="scroll-mt-24">
          <Card className="space-y-5">
            <SectionIntro
              eyebrow="Layout rhythm"
              title="Decide where attention goes first."
              copy="Layout controls the archive cadence while the skin keeps the atmosphere intact."
            />

            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-1">
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
        </section>
      </div>

      <SelectedSkinPanel
        skin={skin}
        layout={layout}
        onPickLayout={(nextLayout) => setLayout(nextLayout)}
      />
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

function SectionIntro({
  eyebrow,
  title,
  copy,
}: {
  eyebrow: string;
  title: string;
  copy: string;
}) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-3">
      <div>
        <p className="text-xs uppercase tracking-[0.16em] text-[var(--text-muted)]">{eyebrow}</p>
        <h3 className="mt-1 text-2xl font-semibold text-[var(--text-primary)]">{title}</h3>
      </div>
      <p className="max-w-2xl text-sm leading-6 text-[var(--text-secondary)]">{copy}</p>
    </div>
  );
}

function StudioJumpLink({
  href,
  label,
}: {
  href: string;
  label: string;
}) {
  return (
    <a
      href={href}
      className="inline-flex items-center rounded-full border border-[var(--border-default)] bg-[color-mix(in_oklab,var(--bg-surface)_88%,transparent)] px-3 py-2 text-sm font-semibold text-[var(--text-secondary)] transition-colors hover:bg-[var(--accent-muted)] hover:text-[var(--text-primary)]"
    >
      {label}
    </a>
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
