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

  return (
    <div className="space-y-4">
      <Card className="space-y-4">
        <div className="space-y-2">
          <p className="text-xs uppercase tracking-[0.16em] text-[var(--creator-text-muted)]">
            Presentation
          </p>
          <h2 className="text-2xl font-semibold text-[var(--creator-text)]">
            Focus person
          </h2>
        </div>
        <div className="space-y-3 rounded-[var(--radius-sm)] border border-[var(--creator-border)] bg-[var(--creator-surface-muted)] p-4">
          <p className="text-sm font-semibold text-[var(--creator-text)]">{person.fullName}</p>
          <p className="text-sm leading-6 text-[var(--creator-text-muted)]">
            {person.summary ||
              "Center this branch, adjust the visible depth, and open the full profile when you need more detail."}
          </p>
          <div className="grid grid-cols-3 gap-2 text-sm">
            <CanvasStat label="Visible" value={visibleCount} />
            <CanvasStat label="Linked" value={relatedCount} />
            <CanvasStat
              label="Relatives"
              value={
                person.relatives.parents.length +
                person.relatives.siblings.length +
                person.relatives.spouses.length +
                person.relatives.children.length
              }
            />
          </div>
        </div>
      </Card>

      <Card className="space-y-4">
        <div className="space-y-2">
          <p className="text-xs uppercase tracking-[0.16em] text-[var(--creator-text-muted)]">
            View depth
          </p>
          <div>
            <p className="text-sm text-[var(--creator-text-muted)]">
              Widen the branch without leaving the selected person.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-2">
          {[1, 2, 3].map((level) => (
            <Button
              key={level}
              type="button"
              variant={depth === level ? "primary" : "secondary"}
              className="px-2"
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
              {level} hop
            </Button>
          ))}
        </div>

        {depth < maxDepth ? (
          <Button
            type="button"
            variant="ghost"
            className="w-full justify-center"
            onClick={() =>
              pushParams((params) => {
                params.set("depth", String(depth + 1));
              })
            }
          >
            Expand one more step
          </Button>
        ) : null}

        <p className="text-sm leading-6 text-[var(--creator-text-muted)]">
          Single-click a node to recenter the graph. Double-click a node to jump into its
          full profile.
        </p>
      </Card>

      <Card className="space-y-4">
        <div className="space-y-2">
          <p className="text-xs uppercase tracking-[0.16em] text-[var(--creator-text-muted)]">
            Presentation filter
          </p>
          <div>
            <p className="text-sm text-[var(--creator-text-muted)]">
              Limit the preview to one named branch when needed.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <Button
            type="button"
            variant={selectedLineageId ? "secondary" : "primary"}
            className="px-3"
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
                "The preview is now limited to one named descent path within the larger branch."}
            </p>
          </div>
        ) : null}
      </Card>

      <Card>
        <Link
          href={profileHref}
          className="inline-flex w-full items-center justify-center rounded-[var(--radius-sm)] border border-[var(--creator-border)] bg-[var(--creator-surface)] px-4 py-3 text-sm font-medium text-[var(--creator-text)] transition-colors hover:bg-[var(--creator-surface-muted)]"
        >
          Open full profile
        </Link>
      </Card>
    </div>
  );
}

function CanvasStat({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-[var(--radius-sm)] border border-[var(--creator-border)] bg-[var(--creator-surface)] px-3 py-3">
      <p className="text-lg font-semibold text-[var(--creator-text)]">{value}</p>
      <p className="text-[0.68rem] uppercase tracking-[0.16em] text-[var(--creator-text-muted)]">
        {label}
      </p>
    </div>
  );
}
