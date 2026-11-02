"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";

import { Button } from "@/components/foundation/button";
import { Card } from "@/components/foundation/card";
import type { Lineage, PersonViewModel } from "@/lib/types";

type CanvasSidebarProps = {
  person: PersonViewModel;
  profileHref: string;
  basePath: string;
  depth: number;
  maxDepth: number;
  visibleCount: number;
  relatedCount: number;
  lineages: Lineage[];
  selectedLineageId?: string | null;
  shareToken?: string | null;
};

export function CanvasSidebar({
  person,
  profileHref,
  basePath,
  depth,
  maxDepth,
  visibleCount,
  relatedCount,
  lineages,
  selectedLineageId,
  shareToken,
}: CanvasSidebarProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const pushParams = (mutate: (params: URLSearchParams) => void) => {
    const params = new URLSearchParams(searchParams.toString());
    mutate(params);

    if (shareToken) {
      params.set("share", shareToken);
    }

    if (depth <= 1 && params.get("depth") === "1") {
      params.delete("depth");
    }

    const query = params.toString();
    router.push(query ? `${basePath}?${query}` : basePath);
  };

  const selectedLineage =
    lineages.find((lineage) => lineage.id === selectedLineageId) ?? null;

  const relativeCount =
    person.relatives.parents.length +
    person.relatives.siblings.length +
    person.relatives.spouses.length +
    person.relatives.children.length;
  const depthLevels = [1, 2, 3].filter((level) => level <= Math.max(1, maxDepth));
  const lifespan = [person.birthDateText, person.deathDateText].filter(Boolean).join(" – ");

  return (
    <div className="space-y-4">
      <Card className="space-y-4">
        <div className="space-y-1.5">
          <p className="text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-[var(--creator-text-muted)]">
            In focus
          </p>
          <h2 className="text-2xl font-semibold leading-tight text-[var(--creator-text)]">
            {person.fullName}
          </h2>
          {lifespan ? (
            <p className="text-sm tabular-nums text-[var(--creator-text-muted)]">{lifespan}</p>
          ) : null}
        </div>
        {person.summary ? (
          <p className="text-sm leading-6 text-[var(--creator-text-muted)]">{person.summary}</p>
        ) : null}
        <p className="text-xs text-[var(--creator-text-muted)]">
          {relativeCount} close {relativeCount === 1 ? "relative" : "relatives"} · {visibleCount} shown
          {relatedCount !== visibleCount - 1 ? ` · ${relatedCount} linked` : ""}
        </p>
        <Link
          href={profileHref}
          className="inline-flex w-full items-center justify-center rounded-[var(--radius-sm)] bg-[var(--creator-text)] px-4 py-2.5 text-sm font-semibold text-[var(--creator-surface)] transition-opacity hover:opacity-90"
        >
          Open full profile
        </Link>
      </Card>

      {depthLevels.length > 1 ? (
        <Card className="space-y-3">
          <div className="space-y-1">
            <p className="text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-[var(--creator-text-muted)]">
              How far to look
            </p>
            <p className="text-sm text-[var(--creator-text-muted)]">
              Widen the view without losing your place.
            </p>
          </div>
          <div
            role="group"
            aria-label="Family depth"
            className="grid gap-1 rounded-[var(--radius-sm)] border border-[var(--creator-border)] bg-[var(--creator-surface-muted)] p-1"
            style={{ gridTemplateColumns: `repeat(${depthLevels.length}, minmax(0, 1fr))` }}
          >
            {depthLevels.map((level) => (
              <button
                key={level}
                type="button"
                aria-pressed={depth === level}
                className={
                  depth === level
                    ? "min-h-10 rounded-[calc(var(--radius-sm)-2px)] bg-[var(--creator-surface)] px-2 text-sm font-semibold text-[var(--creator-text)] shadow-sm"
                    : "min-h-10 rounded-[calc(var(--radius-sm)-2px)] px-2 text-sm text-[var(--creator-text-muted)] transition-colors hover:text-[var(--creator-text)]"
                }
                onClick={() =>
                  pushParams((params) => {
                    if (level > 1) {
                      params.set("depth", String(level));
                    } else {
                      params.delete("depth");
                    }
                  })
                }
              >
                {depthLabel(level)}
              </button>
            ))}
          </div>
          <p className="text-xs leading-5 text-[var(--creator-text-muted)]">
            Select a person to centre the tree on them. Double-click to open their profile.
          </p>
        </Card>
      ) : null}

      {lineages.length ? (
        <Card className="space-y-3">
          <div className="space-y-1">
            <p className="text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-[var(--creator-text-muted)]">
              Highlight a branch
            </p>
            <p className="text-sm text-[var(--creator-text-muted)]">
              Trace one named line of descent through the tree.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <Button
              type="button"
              variant={selectedLineageId ? "secondary" : "primary"}
              className="px-3"
              aria-pressed={!selectedLineageId}
              onClick={() =>
                pushParams((params) => {
                  params.delete("lineage");
                })
              }
            >
              All branches
            </Button>
            {lineages.map((lineage) => (
              <Button
                key={lineage.id}
                type="button"
                variant={selectedLineageId === lineage.id ? "primary" : "secondary"}
                className="px-3"
                aria-pressed={selectedLineageId === lineage.id}
                onClick={() =>
                  pushParams((params) => {
                    params.set("lineage", lineage.id);
                  })
                }
              >
                {lineage.name}
              </Button>
            ))}
          </div>

          {selectedLineage ? (
            <div className="rounded-[var(--radius-sm)] border border-[var(--creator-border)] bg-[var(--creator-surface-muted)] p-4">
              <p className="text-sm font-semibold text-[var(--creator-text)]">
                {selectedLineage.name}
              </p>
              <p className="mt-1 text-sm leading-6 text-[var(--creator-text-muted)]">
                {selectedLineage.description ||
                  "Highlighted people and connections follow one named line of descent."}
              </p>
            </div>
          ) : null}
        </Card>
      ) : null}
    </div>
  );
}

function depthLabel(level: number) {
  if (level === 1) return "Close family";
  if (level === 2) return "Extended";
  return "Wider circle";
}
