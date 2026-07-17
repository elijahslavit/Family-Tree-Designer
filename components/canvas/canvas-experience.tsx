"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useMemo, useRef, useState, useTransition } from "react";
import { Loader2 } from "lucide-react";
import type { Edge, Node } from "@xyflow/react";

import { CanvasActionsContext } from "@/components/canvas/canvas-context";
import { CanvasInspector, type CanvasSearchItem } from "@/components/canvas/canvas-inspector";
import { CanvasStage } from "@/components/canvas/canvas-stage";
import type { CanvasNodeData, Lineage, PersonViewModel } from "@/lib/types";
import { cn } from "@/lib/utils/cn";

export type CanvasNavItem = {
  href: string;
  label: string;
};

type CanvasTopBar = {
  eyebrow?: string;
  title: string;
  navItems: CanvasNavItem[];
  activeLabel?: string;
};

type CanvasExperienceProps = {
  nodes: Node[];
  edges: Edge[];
  basePath: string;
  profilePathBase: string;
  shareToken?: string | null;
  depth: number;
  maxDepth: number;
  selectedLineageId?: string | null;
  selectedLineageName?: string | null;
  lineages: Lineage[];
  focusPerson: PersonViewModel;
  profileHref: string;
  relatedCount: number;
  topBar?: CanvasTopBar;
  className?: string;
};

export function CanvasExperience({
  nodes,
  edges,
  basePath,
  profilePathBase,
  shareToken,
  depth,
  maxDepth,
  selectedLineageId,
  selectedLineageName,
  lineages,
  focusPerson,
  profileHref,
  relatedCount,
  topBar,
  className,
}: CanvasExperienceProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const [panelOpen, setPanelOpen] = useState<boolean | null>(null);
  const searchInputRef = useRef<HTMLInputElement | null>(null);

  const pushParams = useCallback(
    (mutate: (params: URLSearchParams) => void) => {
      const params = new URLSearchParams(searchParams.toString());
      mutate(params);

      if (shareToken) {
        params.set("share", shareToken);
      }

      if (params.get("depth") === "1") {
        params.delete("depth");
      }

      const query = params.toString();
      startTransition(() => {
        router.push(query ? `${basePath}?${query}` : basePath);
      });
    },
    [basePath, router, searchParams, shareToken],
  );

  const centerPerson = useCallback(
    (personId: string) => {
      pushParams((params) => {
        params.set("person", personId);
      });
    },
    [pushParams],
  );

  const openProfile = useCallback(
    (personId: string) => {
      const share = shareToken ? `?share=${shareToken}` : "";
      startTransition(() => {
        router.push(`${profilePathBase}/${personId}${share}`);
      });
    },
    [profilePathBase, router, shareToken],
  );

  const actions = useMemo(
    () => ({ centerPerson, openProfile, isPending }),
    [centerPerson, openProfile, isPending],
  );

  const searchItems: CanvasSearchItem[] = useMemo(
    () =>
      nodes.map((node) => {
        const data = node.data as Partial<CanvasNodeData>;
        return {
          id: node.id,
          label: data.label ?? node.id,
          subtitle: data.subtitle,
          lineageNames: data.lineageNames,
        };
      }),
    [nodes],
  );

  const focusSearch = () => {
    setPanelOpen(true);
    window.requestAnimationFrame(() => {
      window.requestAnimationFrame(() => {
        searchInputRef.current?.focus();
      });
    });
  };

  const stage = (
    <div className="relative min-h-0 flex-1 overflow-hidden">
      <CanvasStage
        nodes={nodes}
        edges={edges}
        onCenter={centerPerson}
        onOpen={openProfile}
        onSearchShortcut={focusSearch}
        isPending={isPending}
      />

      <div
        className="pointer-events-none absolute left-3 top-3 z-20 flex max-w-[calc(100%-8rem)] items-center gap-2 rounded-full border border-[var(--creator-border)] px-3.5 py-2 shadow-[var(--shadow-md)] backdrop-blur-md"
        style={{ background: "var(--canvas-controls-bg)" }}
      >
        {isPending ? (
          <Loader2
            className="h-3.5 w-3.5 shrink-0 animate-spin text-[var(--creator-text-muted)]"
            aria-label="Loading view"
          />
        ) : null}
        <p className="truncate text-xs text-[var(--creator-text)]">
          <span className="font-semibold">{focusPerson.fullName}</span>
          <span className="text-[var(--creator-text-muted)]">
            {" "}
            · {nodes.length} in view · {depth} step{depth === 1 ? "" : "s"} ·{" "}
            {selectedLineageName ?? "All branches"}
          </span>
        </p>
      </div>

      <CanvasInspector
        person={focusPerson}
        profileHref={profileHref}
        depth={depth}
        maxDepth={maxDepth}
        visibleCount={nodes.length}
        relatedCount={relatedCount}
        lineages={lineages}
        selectedLineageId={selectedLineageId}
        onDepthChange={(level) =>
          pushParams((params) => {
            if (level > 1) {
              params.set("depth", String(level));
            } else {
              params.delete("depth");
            }
          })
        }
        onLineageChange={(lineageId) =>
          pushParams((params) => {
            if (lineageId) {
              params.set("lineage", lineageId);
            } else {
              params.delete("lineage");
            }
          })
        }
        searchItems={searchItems}
        open={panelOpen}
        onOpenChange={setPanelOpen}
        searchInputRef={searchInputRef}
      />
    </div>
  );

  return (
    <CanvasActionsContext.Provider value={actions}>
      {topBar ? (
        <div className="flex h-dvh min-h-[560px] flex-col">
          <header className="z-30 border-b border-[var(--creator-border)] bg-[var(--creator-surface)]/90 backdrop-blur">
            <div className="flex h-14 items-center justify-between gap-4 px-4 sm:px-5">
              <div className="min-w-0">
                {topBar.eyebrow ? (
                  <p className="text-[9px] uppercase tracking-[0.18em] text-[var(--creator-text-muted)]">
                    {topBar.eyebrow}
                  </p>
                ) : null}
                <p className="truncate text-sm font-semibold text-[var(--creator-text)]">
                  {topBar.title}
                </p>
              </div>
              <nav className="flex items-center gap-4 overflow-x-auto whitespace-nowrap">
                {topBar.navItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    aria-current={item.label === topBar.activeLabel ? "page" : undefined}
                    className={cn(
                      "text-sm transition-colors",
                      item.label === topBar.activeLabel
                        ? "font-medium text-[var(--creator-text)]"
                        : "text-[var(--creator-text-muted)] hover:text-[var(--creator-text)]",
                    )}
                  >
                    {item.label}
                  </Link>
                ))}
              </nav>
            </div>
          </header>
          {stage}
        </div>
      ) : (
        <div className={cn("flex flex-col", className ?? "h-[calc(100dvh-8rem)] min-h-[560px]")}>
          {stage}
        </div>
      )}
    </CanvasActionsContext.Provider>
  );
}
