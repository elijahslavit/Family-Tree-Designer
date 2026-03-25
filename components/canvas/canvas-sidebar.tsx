"use client";

import Link from "next/link";
import { Aperture, ArrowUpRight, Orbit, Sparkles, Users } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import type { ReactNode } from "react";

import { Badge } from "@/components/foundation/badge";
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

function initials(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

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
      <Card className="overflow-hidden border-[color-mix(in_oklab,var(--accent-primary)_28%,var(--border-default))] bg-[linear-gradient(180deg,color-mix(in_oklab,var(--accent-primary)_10%,var(--bg-surface)),var(--bg-surface))]">
        <div className="flex items-start gap-4">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full border border-[color-mix(in_oklab,var(--accent-primary)_30%,transparent)] bg-[color-mix(in_oklab,var(--accent-primary)_16%,transparent)] text-sm font-semibold tracking-[0.16em] text-[var(--text-primary)]">
            {initials(person.fullName)}
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-xs uppercase tracking-[0.16em] text-[var(--text-muted)]">
              Focus person
            </p>
            <h2 className="mt-1 text-[1.9rem] font-semibold leading-none text-[var(--text-primary)]">
              {person.fullName}
            </h2>
            <p className="mt-3 text-sm leading-6 text-[var(--text-secondary)]">
              {person.summary || "Use the canvas to follow branches outward, then open the full profile for the long-form archive view."}
            </p>
          </div>
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          <Badge tone="accent">Centered branch</Badge>
          {person.isLiving ? <Badge tone="warning">Living</Badge> : null}
          {person.lineages.slice(0, 2).map((lineage) => (
            <Badge key={lineage.id} tone="default">
              {lineage.name}
            </Badge>
          ))}
        </div>

        <div className="mt-5 grid grid-cols-3 gap-2">
          <CanvasStat label="Visible" value={visibleCount} icon={<Aperture className="h-3.5 w-3.5" />} />
          <CanvasStat label="Linked" value={relatedCount} icon={<Orbit className="h-3.5 w-3.5" />} />
          <CanvasStat
            label="Relatives"
            value={
              person.relatives.parents.length +
              person.relatives.siblings.length +
              person.relatives.spouses.length +
              person.relatives.children.length
            }
            icon={<Users className="h-3.5 w-3.5" />}
          />
        </div>
      </Card>

      <Card className="space-y-4 bg-[color-mix(in_oklab,var(--bg-elevated)_72%,var(--bg-surface))]">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-xs uppercase tracking-[0.16em] text-[var(--text-muted)]">
              Explorer depth
            </p>
            <p className="mt-1 text-sm text-[var(--text-secondary)]">
              Widen the branch without leaving the focused line.
            </p>
          </div>
          <Badge tone="default">{visibleCount} visible</Badge>
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

        <p className="text-sm leading-6 text-[var(--text-secondary)]">
          Single-click a node to recenter the graph. Double-click a node to jump into its
          full profile.
        </p>
      </Card>

      <Card className="space-y-4">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-xs uppercase tracking-[0.16em] text-[var(--text-muted)]">
              Lineage highlighting
            </p>
            <p className="mt-1 text-sm text-[var(--text-secondary)]">
              Compare the complete neighborhood against a single named descent path.
            </p>
          </div>
          <Badge tone="default">{relatedCount} links</Badge>
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
          <div className="rounded-[var(--radius-md)] border border-[var(--border-default)] bg-[color-mix(in_oklab,var(--accent-primary)_8%,var(--bg-elevated))] p-4">
            <div className="flex items-start gap-3">
              <div className="rounded-full bg-[color-mix(in_oklab,var(--accent-primary)_18%,transparent)] p-2 text-[var(--accent-primary)]">
                <Sparkles className="h-4 w-4" />
              </div>
              <div>
                <p className="text-sm font-semibold text-[var(--text-primary)]">
                  {selectedLineage.name}
                </p>
                <p className="mt-1 text-sm leading-6 text-[var(--text-secondary)]">
                  {selectedLineage.description || "The highlighted route now isolates one named descent path inside the wider archive."}
                </p>
              </div>
            </div>
          </div>
        ) : null}
      </Card>

      <Card className="bg-[color-mix(in_oklab,var(--bg-elevated)_65%,var(--bg-surface))]">
        <Link
          href={profileHref}
          className="inline-flex w-full items-center justify-center gap-2 rounded-[var(--radius-md)] border border-[var(--border-strong)] bg-[var(--bg-surface)] px-4 py-3 text-sm font-semibold text-[var(--text-primary)] transition-colors hover:bg-[var(--accent-muted)]"
        >
          Open full profile
          <ArrowUpRight className="h-4 w-4" />
        </Link>
      </Card>
    </div>
  );
}

function CanvasStat({
  label,
  value,
  icon,
}: {
  label: string;
  value: number;
  icon: ReactNode;
}) {
  return (
    <div className="rounded-[var(--radius-md)] border border-[var(--border-default)] bg-[color-mix(in_oklab,var(--bg-elevated)_68%,var(--bg-surface))] px-3 py-3">
      <div className="flex items-center gap-2 text-[var(--text-muted)]">{icon}</div>
      <p className="mt-2 text-lg font-semibold text-[var(--text-primary)]">{value}</p>
      <p className="text-[0.68rem] uppercase tracking-[0.16em] text-[var(--text-muted)]">
        {label}
      </p>
    </div>
  );
}
