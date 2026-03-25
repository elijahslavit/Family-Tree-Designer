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

  return (
    <Card className="space-y-5">
      <div className="space-y-2">
        <p className="text-xs uppercase tracking-[0.16em] text-[var(--text-muted)]">
          Focus person
        </p>
        <h2 className="text-2xl font-semibold text-[var(--text-primary)]">{person.fullName}</h2>
        <p className="text-sm leading-6 text-[var(--text-secondary)]">{person.summary}</p>
      </div>
      <div className="grid gap-3 rounded-[var(--radius-md)] border border-[var(--border-default)] bg-[var(--bg-elevated)] p-4">
        <div className="flex items-center justify-between gap-3">
          <p className="font-semibold text-[var(--text-primary)]">Explorer depth</p>
          <span className="text-xs uppercase tracking-[0.12em] text-[var(--text-muted)]">
            {visibleCount} visible
          </span>
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
            onClick={() =>
              pushParams((params) => {
                params.set("depth", String(depth + 1));
              })
            }
          >
            Expand one more step
          </Button>
        ) : null}
        <p className="text-sm text-[var(--text-secondary)]">
          Single-click a node to recenter the graph. Double-click a node to jump into its full profile.
        </p>
      </div>
      <div className="grid gap-3 rounded-[var(--radius-md)] border border-[var(--border-default)] bg-[var(--bg-elevated)] p-4">
        <div className="flex items-center justify-between gap-3">
          <p className="font-semibold text-[var(--text-primary)]">Lineage highlighting</p>
          <span className="text-xs uppercase tracking-[0.12em] text-[var(--text-muted)]">
            {relatedCount} connection{relatedCount === 1 ? "" : "s"}
          </span>
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
      </div>
      <Link
        href={profileHref}
        className="inline-flex items-center justify-center rounded-[var(--radius-md)] border border-[var(--border-strong)] bg-[var(--bg-surface)] px-4 py-2 text-sm font-semibold text-[var(--text-primary)] transition-colors hover:bg-[var(--accent-muted)]"
      >
        Open full profile
      </Link>
    </Card>
  );
}
