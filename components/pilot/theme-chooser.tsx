"use client";

import { ArrowRight, Check, LoaderCircle, Lock } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

import { updatePilotThemeAction } from "@/lib/pilot/presentation-actions";
import {
  SHOWCASE_THEME_LIST,
  showcaseThemeStyle,
  type ShowcaseTheme,
  type ShowcaseThemeId,
} from "@/lib/themes/showcase-themes";
import { cn } from "@/lib/utils/cn";

export function ThemeChooser({
  projectRef,
  familyName,
  currentThemeId,
}: {
  projectRef: string;
  familyName: string;
  currentThemeId: ShowcaseThemeId;
}) {
  const router = useRouter();
  const [saved, setSaved] = useState<ShowcaseThemeId>(currentThemeId);
  const [selected, setSelected] = useState<ShowcaseThemeId>(currentThemeId);
  const [pendingId, setPendingId] = useState<ShowcaseThemeId | null>(null);
  const [isSaving, startSaving] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function choose(themeId: ShowcaseThemeId) {
    setSelected(themeId);
    setError(null);

    if (themeId === saved) {
      return;
    }

    setPendingId(themeId);
    startSaving(async () => {
      try {
        await updatePilotThemeAction({ projectRef, themeId });
        setSaved(themeId);
        router.refresh();
      } catch {
        setError("The theme could not be saved. Try again.");
        setSelected(saved);
      } finally {
        setPendingId(null);
      }
    });
  }

  return (
    <div className="space-y-5">
      <div className="grid gap-6 lg:grid-cols-2">
        {SHOWCASE_THEME_LIST.map((theme) => (
          <ThemeOption
            key={theme.id}
            theme={theme}
            familyName={familyName}
            isSelected={selected === theme.id}
            isSaved={saved === theme.id}
            isPending={isSaving && pendingId === theme.id}
            onChoose={() => choose(theme.id)}
          />
        ))}
      </div>

      {error ? (
        <p role="alert" className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-900">
          {error}
        </p>
      ) : null}

      <p className="text-xs leading-5 text-[#746b5e]">
        The theme applies to everything the family sees — welcome page, people,
        stories, and the family tree. It can be changed at any point before publication.
      </p>
    </div>
  );
}

function ThemeOption({
  theme,
  familyName,
  isSelected,
  isSaved,
  isPending,
  onChoose,
}: {
  theme: ShowcaseTheme;
  familyName: string;
  isSelected: boolean;
  isSaved: boolean;
  isPending: boolean;
  onChoose: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onChoose}
      aria-pressed={isSelected}
      className={cn(
        "group overflow-hidden rounded-2xl border text-left transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#637b68]",
        isSelected
          ? "border-[#263a31] shadow-lg ring-2 ring-[#263a31]/25"
          : "border-black/[0.08] hover:border-[#637b68]",
      )}
    >
      <ThemePreview theme={theme} familyName={familyName} />

      <div className="space-y-3 bg-white p-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="font-serif text-2xl font-semibold text-[#302a23]">{theme.name}</p>
            <p className="mt-0.5 text-xs uppercase tracking-[0.14em] text-[#8a8072]">
              {theme.tagline}
            </p>
          </div>
          <span
            className={cn(
              "mt-1 inline-flex shrink-0 items-center gap-1.5 rounded-full px-3 py-1 text-[11px] font-semibold",
              isSaved
                ? "bg-[#263a31] text-white"
                : "bg-[#f0ece3] text-[#6b6255] group-hover:bg-[#e4ecdf]",
            )}
          >
            {isPending ? (
              <>
                <LoaderCircle className="h-3 w-3 animate-spin" /> Saving
              </>
            ) : isSaved ? (
              <>
                <Check className="h-3 w-3" /> Selected
              </>
            ) : (
              "Choose"
            )}
          </span>
        </div>

        <p className="text-sm leading-6 text-[#5f574b]">{theme.description}</p>
        <p className="text-xs leading-5 text-[#7a7165]">{theme.bestFor}</p>

        <div className="flex items-center gap-1.5 pt-1">
          {theme.swatch.map((color) => (
            <span
              key={color}
              aria-hidden
              className="h-4 w-4 rounded-full border border-black/10"
              style={{ backgroundColor: color }}
            />
          ))}
        </div>
      </div>
    </button>
  );
}

/**
 * A miniature of the real welcome screen. The genealogist is selling a feeling,
 * so the choice has to be made against the thing itself rather than a swatch.
 */
function ThemePreview({ theme, familyName }: { theme: ShowcaseTheme; familyName: string }) {
  return (
    <div
      style={showcaseThemeStyle(theme)}
      className="grid gap-4 bg-[var(--sc-surface)] p-6 text-[var(--sc-ink)] sm:grid-cols-[92px_minmax(0,1fr)] sm:items-center"
    >
      <div
        aria-hidden
        className="mx-auto flex h-[118px] w-[92px] flex-col justify-end rounded-lg border border-[var(--sc-border-strong)] bg-[var(--sc-elevated)] p-2 shadow-[var(--sc-shadow)]"
      >
        <div className="h-full rounded bg-[var(--sc-accent-wash)]" />
        <div className="mt-2 h-1.5 w-3/4 rounded-full bg-[var(--sc-border-strong)]" />
        <div className="mt-1 h-1 w-1/2 rounded-full bg-[var(--sc-border)]" />
      </div>

      <div className="min-w-0 space-y-2.5">
        <p className="text-[9px] font-semibold uppercase tracking-[0.24em] text-[var(--sc-ink-muted)]">
          A private family archive
        </p>
        <p className="truncate font-serif text-2xl font-semibold leading-tight">{familyName}</p>
        <div className="space-y-1">
          <div className="h-1.5 w-full rounded-full bg-[var(--sc-border)]" />
          <div className="h-1.5 w-4/5 rounded-full bg-[var(--sc-border)]" />
        </div>
        <div className="flex items-center gap-2 pt-1">
          <span className="inline-flex items-center gap-1.5 rounded bg-[var(--sc-accent)] px-2.5 py-1.5 text-[10px] font-semibold text-[var(--sc-accent-contrast)]">
            Discover an ancestor <ArrowRight className="h-2.5 w-2.5" />
          </span>
          <span className="inline-flex items-center gap-1 rounded border border-[var(--sc-border-strong)] px-2 py-1.5 text-[10px] text-[var(--sc-ink-secondary)]">
            <Lock className="h-2.5 w-2.5" /> Private
          </span>
        </div>
      </div>
    </div>
  );
}
