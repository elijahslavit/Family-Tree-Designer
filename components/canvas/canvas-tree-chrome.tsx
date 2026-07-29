"use client";

import { useEffect, useMemo, useState, type RefObject } from "react";
import {
  Columns2,
  Maximize2,
  Minimize2,
  Rows2,
  Search,
} from "lucide-react";

import { useCanvasActions } from "@/components/canvas/canvas-context";
import type { Lineage } from "@/lib/types";
import { cn } from "@/lib/utils/cn";

export type CanvasSearchItem = {
  id: string;
  label: string;
  subtitle?: string | null;
  lineageNames?: string[];
};

type CanvasTreeChromeProps = {
  depth: number;
  maxDepth: number;
  lineages: Lineage[];
  selectedLineageId?: string | null;
  orientation: "horizontal" | "vertical";
  onDepthChange: (depth: number) => void;
  onLineageChange: (lineageId: string | null) => void;
  onOrientationChange: (orientation: "horizontal" | "vertical") => void;
  searchItems: CanvasSearchItem[];
  searchInputRef: RefObject<HTMLInputElement | null>;
  fullscreenTargetRef?: RefObject<HTMLElement | null>;
};

const DEPTH_HELP = "Number of relationship connections shown from the selected person.";

export function CanvasTreeChrome({
  depth,
  maxDepth,
  lineages,
  selectedLineageId,
  orientation,
  onDepthChange,
  onLineageChange,
  onOrientationChange,
  searchItems,
  searchInputRef,
  fullscreenTargetRef,
}: CanvasTreeChromeProps) {
  const { centerPerson } = useCanvasActions();
  const [query, setQuery] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const results = useMemo(() => {
    const trimmed = query.trim().toLowerCase();
    if (!trimmed) return [];
    return searchItems
      .filter((item) => {
        const haystack = [item.label, item.subtitle ?? "", ...(item.lineageNames ?? [])]
          .join(" ")
          .toLowerCase();
        return haystack.includes(trimmed);
      })
      .slice(0, 8);
  }, [query, searchItems]);

  useEffect(() => {
    const onChange = () => setIsFullscreen(Boolean(document.fullscreenElement));
    document.addEventListener("fullscreenchange", onChange);
    return () => document.removeEventListener("fullscreenchange", onChange);
  }, []);

  async function toggleFullscreen() {
    const target = fullscreenTargetRef?.current;
    if (!target) return;
    try {
      if (document.fullscreenElement) {
        await document.exitFullscreen();
      } else {
        await target.requestFullscreen();
      }
    } catch {
      // Browser denied fullscreen — immersive layout still works.
    }
  }

  function openSearch() {
    setSearchOpen(true);
    window.requestAnimationFrame(() => {
      searchInputRef.current?.focus();
    });
  }

  function collapseSearchIfEmpty() {
    if (!query.trim()) {
      setSearchOpen(false);
    }
  }

  function clearAndCollapseSearch() {
    setQuery("");
    setSearchOpen(false);
  }

  return (
    <div className="absolute right-3 top-3 z-30 flex max-w-[calc(100%-1.5rem)] flex-col items-end gap-1.5">
      <div
        className="flex flex-wrap items-center gap-2 rounded-full border border-[var(--creator-border)] px-2 py-1.5 shadow-[var(--shadow-md)] backdrop-blur-xl"
        style={{ background: "var(--canvas-sidebar-bg)" }}
      >
        <div className="relative flex items-center">
          {!searchOpen ? (
            <button
              type="button"
              aria-label="Find a person"
              title="Search people (/)"
              className="grid h-8 w-8 place-items-center rounded-full text-[var(--creator-text-muted)] transition-colors hover:bg-[var(--creator-surface-muted)] hover:text-[var(--creator-text)]"
              onClick={openSearch}
            >
              <Search className="h-3.5 w-3.5" />
            </button>
          ) : null}

          {/* Always mounted so `/` can focus the ref and expand search. */}
          <div className={cn("relative", !searchOpen && "pointer-events-none absolute opacity-0")}>
            <Search
              className={cn(
                "pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-[var(--creator-text-muted)]",
                !searchOpen && "hidden",
              )}
            />
            <input
              ref={searchInputRef}
              type="search"
              aria-label="Find a person"
              placeholder="Search…"
              value={query}
              tabIndex={searchOpen ? 0 : -1}
              onFocus={() => setSearchOpen(true)}
              onChange={(event) => setQuery(event.target.value)}
              onBlur={() => {
                window.setTimeout(collapseSearchIfEmpty, 120);
              }}
              onKeyDown={(event) => {
                if (event.key === "Escape") {
                  event.preventDefault();
                  clearAndCollapseSearch();
                  searchInputRef.current?.blur();
                }
              }}
              className={cn(
                "h-7 rounded-full border border-[var(--creator-border)] bg-[var(--creator-surface)] py-0 text-xs text-[var(--creator-text)] placeholder:text-[var(--creator-text-muted)] focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-[var(--creator-accent)]",
                searchOpen ? "w-[11rem] pl-8 pr-3" : "w-8 pl-0 pr-0",
              )}
            />
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          <span
            id="canvas-depth-label"
            title={DEPTH_HELP}
            className="cursor-help text-[0.58rem] font-semibold uppercase tracking-[0.16em] text-[var(--creator-text-muted)]"
          >
            Depth
          </span>
          <span id="canvas-depth-help" className="sr-only">
            {DEPTH_HELP}
          </span>
          <div
            role="group"
            aria-labelledby="canvas-depth-label"
            aria-describedby="canvas-depth-help"
            className="flex overflow-hidden rounded-full border border-[var(--creator-border)]"
          >
            {Array.from({ length: maxDepth }, (_, index) => index + 1).map((level) => (
              <button
                key={level}
                type="button"
                aria-pressed={depth === level}
                aria-label={`Depth ${level}`}
                className={cn(
                  "grid h-7 min-w-7 place-items-center px-2 text-xs font-medium transition-colors",
                  depth === level
                    ? "bg-[var(--creator-text)] text-[var(--creator-bg)]"
                    : "bg-[var(--creator-surface)] text-[var(--creator-text-muted)] hover:bg-[var(--creator-surface-muted)] hover:text-[var(--creator-text)]",
                )}
                onClick={() => onDepthChange(level)}
              >
                {level}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          <label
            htmlFor="canvas-lineage-select"
            className="text-[0.58rem] font-semibold uppercase tracking-[0.16em] text-[var(--creator-text-muted)]"
          >
            Lineage
          </label>
          <select
            id="canvas-lineage-select"
            aria-label="Family line filter"
            value={selectedLineageId ?? ""}
            onChange={(event) => onLineageChange(event.target.value || null)}
            className="h-7 max-w-[9.5rem] rounded-full border border-[var(--creator-border)] bg-[var(--creator-surface)] px-2 text-xs text-[var(--creator-text)] focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-[var(--creator-accent)]"
          >
            <option value="">All lines</option>
            {lineages.map((lineage) => (
              <option key={lineage.id} value={lineage.id}>
                {lineage.name} line
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-0.5">
          <button
            type="button"
            aria-pressed={orientation === "vertical"}
            aria-label="Vertical layout"
            title="Vertical"
            className={cn(
              "grid h-8 w-8 place-items-center rounded-full transition-colors",
              orientation === "vertical"
                ? "bg-[var(--creator-text)] text-[var(--creator-bg)]"
                : "text-[var(--creator-text-muted)] hover:bg-[var(--creator-surface-muted)] hover:text-[var(--creator-text)]",
            )}
            onClick={() => onOrientationChange("vertical")}
          >
            <Rows2 className="h-3.5 w-3.5" />
          </button>
          <button
            type="button"
            aria-pressed={orientation === "horizontal"}
            aria-label="Horizontal layout"
            title="Horizontal"
            className={cn(
              "grid h-8 w-8 place-items-center rounded-full transition-colors",
              orientation === "horizontal"
                ? "bg-[var(--creator-text)] text-[var(--creator-bg)]"
                : "text-[var(--creator-text-muted)] hover:bg-[var(--creator-surface-muted)] hover:text-[var(--creator-text)]",
            )}
            onClick={() => onOrientationChange("horizontal")}
          >
            <Columns2 className="h-3.5 w-3.5" />
          </button>
          {fullscreenTargetRef ? (
            <button
              type="button"
              aria-label={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
              title={isFullscreen ? "Exit fullscreen" : "Fullscreen"}
              className="grid h-8 w-8 place-items-center rounded-full text-[var(--creator-text-muted)] transition-colors hover:bg-[var(--creator-surface-muted)] hover:text-[var(--creator-text)]"
              onClick={() => void toggleFullscreen()}
            >
              {isFullscreen ? <Minimize2 className="h-3.5 w-3.5" /> : <Maximize2 className="h-3.5 w-3.5" />}
            </button>
          ) : null}
        </div>
      </div>

      {searchOpen && query.trim() ? (
        <ul
          className="w-[min(18rem,calc(100vw-1.5rem))] max-h-48 space-y-0.5 overflow-y-auto rounded-2xl border border-[var(--creator-border)] p-1.5 shadow-[var(--shadow-lg)] backdrop-blur-xl"
          style={{ background: "var(--canvas-sidebar-bg)" }}
          aria-label="Search results"
        >
          {results.map((item) => (
            <li key={item.id}>
              <button
                type="button"
                className="w-full rounded-xl px-3 py-2 text-left transition-colors hover:bg-[var(--creator-surface-muted)]"
                onMouseDown={(event) => event.preventDefault()}
                onClick={() => {
                  clearAndCollapseSearch();
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
  );
}
