"use client";

import Link from "next/link";
import { useMemo, useState, type RefObject } from "react";
import { PanelRightClose, PanelRightOpen, Search } from "lucide-react";

import { useCanvasActions } from "@/components/canvas/canvas-context";
import { Button } from "@/components/foundation/button";
import type { Lineage, PersonViewModel } from "@/lib/types";
import { cn } from "@/lib/utils/cn";

export type CanvasSearchItem = {
  id: string;
  label: string;
  subtitle?: string | null;
  lineageNames?: string[];
};

type CanvasInspectorProps = {
  person: PersonViewModel;
  profileHref: string;
  depth: number;
  maxDepth: number;
  visibleCount: number;
  relatedCount: number;
  lineages: Lineage[];
  selectedLineageId?: string | null;
  onDepthChange: (depth: number) => void;
  onLineageChange: (lineageId: string | null) => void;
  searchItems: CanvasSearchItem[];
  open: boolean | null;
  onOpenChange: (open: boolean) => void;
  searchInputRef: RefObject<HTMLInputElement | null>;
};

export function CanvasInspector({
  person,
  profileHref,
  depth,
  maxDepth,
  visibleCount,
  relatedCount,
  lineages,
  selectedLineageId,
  onDepthChange,
  onLineageChange,
  searchItems,
  open,
  onOpenChange,
  searchInputRef,
}: CanvasInspectorProps) {
  const { centerPerson } = useCanvasActions();
  const [query, setQuery] = useState("");

  const results = useMemo(() => {
    const trimmed = query.trim().toLowerCase();

    if (!trimmed) {
      return [];
    }

    return searchItems
      .filter((item) => {
        const haystack = [item.label, item.subtitle ?? "", ...(item.lineageNames ?? [])]
          .join(" ")
          .toLowerCase();
        return haystack.includes(trimmed);
      })
      .slice(0, 8);
  }, [query, searchItems]);

  const relativeCount =
    person.relatives.parents.length +
    person.relatives.siblings.length +
    person.relatives.spouses.length +
    person.relatives.children.length;

  return (
    <>
      <button
        type="button"
        aria-label="Show details panel"
        className={cn(
          "absolute right-3 top-3 z-20 items-center gap-2 rounded-full border border-[var(--creator-border)] px-3 py-2 text-xs font-medium text-[var(--creator-text-muted)] shadow-[var(--shadow-md)] backdrop-blur-md transition-colors hover:text-[var(--creator-text)]",
          open === null && "flex lg:hidden",
          open === false && "flex",
          open === true && "hidden",
        )}
        style={{ background: "var(--canvas-controls-bg)" }}
        onClick={() => onOpenChange(true)}
      >
        <PanelRightOpen className="h-3.5 w-3.5" />
        Details
      </button>

      <section
        aria-label="Canvas details"
        className={cn(
          "absolute z-20 flex-col overflow-hidden rounded-2xl border border-[var(--creator-border)] shadow-[var(--shadow-lg)] backdrop-blur-xl",
          "lg:right-3 lg:top-3 lg:max-h-[calc(100%-10.5rem)] lg:w-[19.5rem]",
          "max-lg:inset-x-3 max-lg:bottom-3 max-lg:max-h-[62dvh]",
          open === null && "hidden lg:flex",
          open === false && "hidden",
          open === true && "flex",
        )}
        style={{ background: "var(--canvas-sidebar-bg)" }}
      >
        <header className="flex items-start justify-between gap-3 border-b border-[var(--creator-border)] px-4 py-3.5">
          <div className="min-w-0">
            <p className="text-[0.62rem] uppercase tracking-[0.18em] text-[var(--creator-text-muted)]">
              Focus person
            </p>
            <h2 className="mt-1 truncate text-base font-semibold text-[var(--creator-text)]">
              {person.fullName}
            </h2>
          </div>
          <button
            type="button"
            aria-label="Hide details panel"
            className="grid h-7 w-7 shrink-0 place-items-center rounded-lg text-[var(--creator-text-muted)] transition-colors hover:bg-[var(--creator-surface-muted)] hover:text-[var(--creator-text)]"
            onClick={() => onOpenChange(false)}
          >
            <PanelRightClose className="h-4 w-4" />
          </button>
        </header>

        <div className="min-h-0 flex-1 space-y-5 overflow-y-auto px-4 py-4">
          <div className="space-y-3">
            <p className="text-sm leading-6 text-[var(--creator-text-muted)]">
              {person.summary ||
                "Center this branch, adjust the visible depth, and open the full profile when you need more detail."}
            </p>
            <div className="grid grid-cols-3 gap-2">
              <InspectorStat label="Visible" value={visibleCount} />
              <InspectorStat label="Linked" value={relatedCount} />
              <InspectorStat label="Relatives" value={relativeCount} />
            </div>
            <Link
              href={profileHref}
              className="inline-flex w-full items-center justify-center rounded-[var(--radius-sm)] border border-[var(--creator-border)] bg-[var(--creator-surface)] px-4 py-2.5 text-sm font-medium text-[var(--creator-text)] transition-colors hover:bg-[var(--creator-surface-muted)]"
            >
              Open full profile
            </Link>
          </div>

          <div className="space-y-3 border-t border-[var(--creator-border)] pt-4">
            <div>
              <p className="text-[0.62rem] uppercase tracking-[0.18em] text-[var(--creator-text-muted)]">
                Find a person
              </p>
            </div>
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-[var(--creator-text-muted)]" />
              <input
                ref={searchInputRef}
                type="search"
                aria-label="Find a person"
                placeholder="Search people..."
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                className="w-full rounded-[var(--radius-sm)] border border-[var(--creator-border)] bg-[var(--creator-surface)] py-2 pl-9 pr-8 text-sm text-[var(--creator-text)] placeholder:text-[var(--creator-text-muted)] focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-[var(--creator-accent)]"
              />
              <kbd
                aria-hidden="true"
                className="absolute right-2.5 top-1/2 -translate-y-1/2 rounded border border-[var(--creator-border)] px-1.5 py-0.5 text-[0.6rem] text-[var(--creator-text-muted)]"
              >
                /
              </kbd>
            </div>
            {query.trim() ? (
              <ul className="space-y-1" aria-label="Search results">
                {results.map((item) => (
                  <li key={item.id}>
                    <button
                      type="button"
                      className="w-full rounded-lg px-3 py-2 text-left transition-colors hover:bg-[var(--creator-surface-muted)]"
                      onClick={() => {
                        setQuery("");
                        centerPerson(item.id);
                      }}
                    >
                      <span className="block truncate text-sm font-medium text-[var(--creator-text)]">
                        {item.label}
                      </span>
                      {item.subtitle ? (
                        <span className="block truncate text-xs text-[var(--creator-text-muted)]">
                          {item.subtitle}
                        </span>
                      ) : null}
                    </button>
                  </li>
                ))}
                {results.length === 0 ? (
                  <li className="px-3 py-2 text-sm text-[var(--creator-text-muted)]">
                    No one in view matches that name.
                  </li>
                ) : null}
              </ul>
            ) : null}
          </div>

          <div className="space-y-3 border-t border-[var(--creator-border)] pt-4">
            <div>
              <p className="text-[0.62rem] uppercase tracking-[0.18em] text-[var(--creator-text-muted)]">
                View depth
              </p>
              <p className="mt-1 text-xs leading-5 text-[var(--creator-text-muted)]">
                Widen the branch without leaving the selected person.
              </p>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {[1, 2, 3].map((level) => (
                <Button
                  key={level}
                  type="button"
                  variant={depth === level ? "primary" : "secondary"}
                  className="px-2 py-1.5 text-xs"
                  onClick={() => onDepthChange(level)}
                >
                  {level} hop
                </Button>
              ))}
            </div>
            {depth < maxDepth ? (
              <Button
                type="button"
                variant="ghost"
                className="w-full justify-center py-1.5 text-xs"
                onClick={() => onDepthChange(depth + 1)}
              >
                Expand one more step
              </Button>
            ) : null}
          </div>

          <div className="space-y-3 border-t border-[var(--creator-border)] pt-4">
            <div>
              <p className="text-[0.62rem] uppercase tracking-[0.18em] text-[var(--creator-text-muted)]">
                Branch filter
              </p>
              <p className="mt-1 text-xs leading-5 text-[var(--creator-text-muted)]">
                Limit the view to one named branch when needed.
              </p>
            </div>
            <div className="flex flex-wrap gap-1.5">
              <LineageChip
                label="All branches"
                selected={!selectedLineageId}
                onClick={() => onLineageChange(null)}
              />
              {lineages.map((lineage) => (
                <LineageChip
                  key={lineage.id}
                  label={lineage.name}
                  selected={selectedLineageId === lineage.id}
                  onClick={() => onLineageChange(lineage.id)}
                />
              ))}
            </div>
          </div>

          <p className="border-t border-[var(--creator-border)] pt-4 text-xs leading-5 text-[var(--creator-text-muted)]">
            Click a card to recenter. Double-click to open the profile. Drag cards to
            arrange the view; scroll to pan and pinch to zoom.
          </p>
        </div>
      </section>
    </>
  );
}

function InspectorStat({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-[var(--radius-sm)] border border-[var(--creator-border)] bg-[var(--creator-surface)] px-2.5 py-2">
      <p className="text-base font-semibold text-[var(--creator-text)]">{value}</p>
      <p className="text-[0.6rem] uppercase tracking-[0.14em] text-[var(--creator-text-muted)]">
        {label}
      </p>
    </div>
  );
}

function LineageChip({
  label,
  selected,
  onClick,
}: {
  label: string;
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      aria-pressed={selected}
      className={cn(
        "rounded-full border px-3 py-1.5 text-xs font-medium transition-colors",
        selected
          ? "border-[var(--creator-border-strong)] bg-[var(--creator-text)] text-[var(--creator-bg)]"
          : "border-[var(--creator-border)] bg-[var(--creator-surface)] text-[var(--creator-text-muted)] hover:bg-[var(--creator-surface-muted)] hover:text-[var(--creator-text)]",
      )}
      onClick={onClick}
    >
      {label}
    </button>
  );
}
