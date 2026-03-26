"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/foundation/button";
import { Card } from "@/components/foundation/card";
import { useToast } from "@/components/foundation/toast";
import { updateTreeTheme } from "@/lib/actions";
import type { ThemeLayout, ThemeSkin, Tree } from "@/lib/types";

type ThemePreset = {
  id: string;
  label: string;
  notes: string;
  background: string;
  layout: ThemeLayout;
  skin: ThemeSkin;
};

const presets: ThemePreset[] = [
  {
    id: "castle",
    label: "Castle",
    notes: "Formal presentation with a framed, heritage feel.",
    background: "Stone paper with a restrained border treatment.",
    layout: "classic",
    skin: "dark-gold",
  },
  {
    id: "tree",
    label: "Tree",
    notes: "Natural branch presentation for family relationships.",
    background: "Botanical canvas with branch-like structure.",
    layout: "explorer",
    skin: "botanical",
  },
  {
    id: "shield",
    label: "Shield / Emblem",
    notes: "A stately layout for lineage-centered presentation.",
    background: "Parchment paper with heraldic accents.",
    layout: "classic",
    skin: "parchment",
  },
  {
    id: "newspaper",
    label: "Newspaper",
    notes: "Editorial storytelling for biographies and archive notes.",
    background: "Printed-page treatment with quiet contrast.",
    layout: "editorial",
    skin: "inkwash",
  },
  {
    id: "fan-chart",
    label: "Fan Chart",
    notes: "Best when the canvas is the main presentation surface.",
    background: "Clean modern paper with graph-first emphasis.",
    layout: "explorer",
    skin: "modern",
  },
  {
    id: "custom",
    label: "Custom",
    notes: "Photo-led family keepsake with a softer display tone.",
    background: "Gallery paper with room for portraits and notes.",
    layout: "editorial",
    skin: "portrait-gallery",
  },
];

export function ThemePickerForm({ tree }: { tree: Tree }) {
  const initialPresetId =
    presets.find(
      (preset) =>
        preset.layout === tree.themeLayout && preset.skin === tree.themeSkin,
    )?.id ?? presets[0].id;
  const [selectedPresetId, setSelectedPresetId] = useState(initialPresetId);
  const [savedPresetId, setSavedPresetId] = useState(initialPresetId);
  const [isPending, startSaving] = useTransition();
  const { pushToast } = useToast();
  const router = useRouter();

  const selectedPreset =
    presets.find((preset) => preset.id === selectedPresetId) ?? presets[0];
  const hasChanges = selectedPresetId !== savedPresetId;

  function saveTheme() {
    startSaving(async () => {
      await updateTreeTheme({
        treeId: tree.id,
        themeLayout: selectedPreset.layout,
        themeSkin: selectedPreset.skin,
      });
      setSavedPresetId(selectedPreset.id);
      router.refresh();
      pushToast("Presentation preset updated.", "success");
    });
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)]">
      <Card className="space-y-5">
        <div className="space-y-2">
          <p className="text-xs uppercase tracking-[0.16em] text-[var(--creator-text-muted)]">
            Theme Builder
          </p>
          <h2 className="text-3xl font-semibold text-[var(--creator-text)]">
            Presentation preset
          </h2>
          <p className="text-sm leading-6 text-[var(--creator-text-muted)]">
            Choose one preset, review the background direction, and save it to the
            archive. This page should stay quiet and direct.
          </p>
        </div>

        <div className="space-y-2">
          <label
            htmlFor="theme-preset"
            className="text-sm font-medium text-[var(--creator-text)]"
          >
            Background / preset
          </label>
          <select
            id="theme-preset"
            value={selectedPresetId}
            onChange={(event) => setSelectedPresetId(event.target.value)}
            className="w-full rounded-[var(--radius-sm)] border border-[var(--creator-border)] bg-[var(--creator-surface)] px-3 py-2 text-sm text-[var(--creator-text)]"
          >
            {presets.map((preset) => (
              <option key={preset.id} value={preset.id}>
                {preset.label}
              </option>
            ))}
          </select>
        </div>

        <div className="rounded-[var(--radius-sm)] border border-[var(--creator-border)] bg-[var(--creator-surface-muted)] p-4">
          <p className="text-xs uppercase tracking-[0.16em] text-[var(--creator-text-muted)]">
            Selected
          </p>
          <p className="mt-2 text-xl font-semibold text-[var(--creator-text)]">
            {selectedPreset.label}
          </p>
          <p className="mt-2 text-sm leading-6 text-[var(--creator-text-muted)]">
            {selectedPreset.notes}
          </p>
          <p className="mt-3 text-sm text-[var(--creator-text)]">
            {selectedPreset.background}
          </p>
        </div>

        <div className="rounded-[var(--radius-sm)] border border-[var(--creator-border)] bg-[var(--creator-surface)] p-4">
          <p className="text-xs uppercase tracking-[0.16em] text-[var(--creator-text-muted)]">
            Available presets
          </p>
          <div className="mt-3 grid gap-2 text-sm text-[var(--creator-text)]">
            {presets.map((preset) => (
              <p key={preset.id}>
                {preset.label}: {preset.background}
              </p>
            ))}
          </div>
        </div>

        <div className="flex flex-wrap gap-3">
          <Button loading={isPending} onClick={saveTheme}>
            Save preset
          </Button>
          <Button
            variant="secondary"
            disabled={!hasChanges || isPending}
            onClick={() => setSelectedPresetId(savedPresetId)}
          >
            Reset
          </Button>
        </div>
      </Card>

      <Card className="space-y-4">
        <div className="space-y-2">
          <p className="text-xs uppercase tracking-[0.16em] text-[var(--creator-text-muted)]">
            Preview
          </p>
          <h3 className="text-2xl font-semibold text-[var(--creator-text)]">
            Canvas changes based on selection
          </h3>
        </div>
        <ThemePresetPreview preset={selectedPreset} treeName={tree.name} />
      </Card>
    </div>
  );
}

function ThemePresetPreview({
  preset,
  treeName,
}: {
  preset: ThemePreset;
  treeName: string;
}) {
  return (
    <div className="space-y-4 rounded-[var(--radius-md)] border border-[var(--creator-border)] bg-[var(--creator-surface-muted)] p-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-[0.16em] text-[var(--creator-text-muted)]">
            Preview canvas
          </p>
          <p className="mt-1 text-lg font-semibold text-[var(--creator-text)]">
            {treeName}
          </p>
        </div>
        <div className="rounded-[var(--radius-sm)] border border-[var(--creator-border)] bg-[var(--creator-surface)] px-3 py-2 text-sm text-[var(--creator-text)]">
          {preset.label}
        </div>
      </div>

      <div className="rounded-[var(--radius-md)] border border-[var(--creator-border)] bg-[var(--creator-surface)] p-4">
        <div className="flex flex-wrap items-center gap-2 border-b border-[var(--creator-border)] pb-3 text-sm text-[var(--creator-text-muted)]">
          <span className="font-medium text-[var(--creator-text)]">Canvas</span>
          <span>|</span>
          <span>{preset.background}</span>
        </div>

        <div className="mt-4 grid gap-4 lg:grid-cols-[minmax(0,1fr)_14rem]">
          <div className={`relative min-h-[20rem] overflow-hidden rounded-[var(--radius-md)] border border-[var(--creator-border)] ${previewSurfaceClass[preset.id]}`}>
            <div className="absolute inset-0 opacity-70">
              {preset.id === "tree" ? (
                <>
                  <div className="absolute left-1/2 top-8 h-28 w-px -translate-x-1/2 bg-[rgba(79,93,74,0.35)]" />
                  <div className="absolute left-[29%] top-[7.5rem] h-px w-[22%] rotate-[-18deg] bg-[rgba(79,93,74,0.35)]" />
                  <div className="absolute right-[29%] top-[7.5rem] h-px w-[22%] rotate-[18deg] bg-[rgba(79,93,74,0.35)]" />
                </>
              ) : null}
              {preset.id === "shield" ? (
                <div className="absolute inset-x-[28%] top-8 h-24 rounded-t-[999px] border border-[rgba(84,70,53,0.25)] border-b-0" />
              ) : null}
              {preset.id === "newspaper" ? (
                <>
                  <div className="absolute inset-x-6 top-8 h-px bg-[rgba(38,34,30,0.18)]" />
                  <div className="absolute inset-x-6 top-14 h-px bg-[rgba(38,34,30,0.12)]" />
                </>
              ) : null}
              {preset.id === "castle" ? (
                <>
                  <div className="absolute inset-y-8 left-8 w-px bg-[rgba(122,94,46,0.25)]" />
                  <div className="absolute inset-y-8 right-8 w-px bg-[rgba(122,94,46,0.25)]" />
                </>
              ) : null}
              {preset.id === "custom" ? (
                <div className="absolute left-8 top-8 h-20 w-20 rounded-full border border-[rgba(120,92,110,0.18)] bg-[rgba(255,255,255,0.4)]" />
              ) : null}
            </div>

            <div className="absolute left-6 top-12 rounded-[var(--radius-sm)] border border-[var(--creator-border)] bg-[rgba(255,253,248,0.94)] px-3 py-2 text-sm text-[var(--creator-text)]">
              Preview canvas
            </div>

            <PreviewNode className="left-[10%] top-[40%]" label="Focus" sublabel="Eleanor Hart West" />
            <PreviewNode className="right-[12%] top-[16%]" label="Ancestor" sublabel="June Mercer Hart" />
            <PreviewNode className="right-[8%] top-[41%]" label="Relative" sublabel="Margaret West Vale" />
            <PreviewNode className="right-[14%] bottom-[14%]" label="Relative" sublabel="Samuel West" />
          </div>

          <div className="space-y-3">
            <PreviewMeta label="Background" value={preset.background} />
            <PreviewMeta label="Purpose" value={preset.notes} />
            <PreviewMeta label="Page flow" value={previewLayoutLabel[preset.layout]} />
          </div>
        </div>
      </div>
    </div>
  );
}

function PreviewNode({
  className,
  label,
  sublabel,
}: {
  className?: string;
  label: string;
  sublabel: string;
}) {
  return (
    <div className={`absolute w-40 rounded-[var(--radius-sm)] border border-[var(--creator-border)] bg-[rgba(255,253,248,0.96)] p-3 ${className ?? ""}`}>
      <p className="text-[10px] uppercase tracking-[0.16em] text-[var(--creator-text-muted)]">
        {label}
      </p>
      <p className="mt-2 text-sm font-medium text-[var(--creator-text)]">{sublabel}</p>
    </div>
  );
}

function PreviewMeta({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[var(--radius-sm)] border border-[var(--creator-border)] bg-[var(--creator-surface)] p-3">
      <p className="text-[10px] uppercase tracking-[0.16em] text-[var(--creator-text-muted)]">
        {label}
      </p>
      <p className="mt-2 text-sm leading-6 text-[var(--creator-text)]">{value}</p>
    </div>
  );
}

const previewLayoutLabel: Record<ThemeLayout, string> = {
  classic: "Boxed records with a formal archive frame.",
  editorial: "Reading-first presentation with more narrative space.",
  explorer: "Canvas-led presentation with graph structure up front.",
};

const previewSurfaceClass: Record<ThemePreset["id"], string> = {
  castle: "bg-[linear-gradient(180deg,#f7f0df,#efe3c3)]",
  tree: "bg-[linear-gradient(180deg,#eef5e8,#e1ecd8)]",
  shield: "bg-[linear-gradient(180deg,#f8f2e6,#efe6d5)]",
  newspaper: "bg-[linear-gradient(180deg,#f3f0ea,#ebe7df)]",
  "fan-chart": "bg-[linear-gradient(180deg,#eef2f5,#e2e8ee)]",
  custom: "bg-[linear-gradient(180deg,#f3ecef,#ece4e9)]",
};
