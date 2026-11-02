"use client";

import Link from "next/link";
import type { Edge, Node } from "@xyflow/react";
import { ArrowUpRight, Crosshair } from "lucide-react";

import { generationLabel } from "@/lib/data/canvas-layout";
import type { CanvasNodeData } from "@/lib/types";

type PersonNode = Node<CanvasNodeData>;

function connectionsFor(personId: string, edges: Edge[], names: Map<string, string>) {
  const parents: string[] = [];
  const children: string[] = [];
  const partners: string[] = [];
  for (const edge of edges) {
    const kind = (edge.data as { kind?: string } | undefined)?.kind;
    if (kind === "parent-child") {
      if (edge.target === personId) parents.push(names.get(edge.source) ?? "");
      if (edge.source === personId) children.push(names.get(edge.target) ?? "");
    } else if (kind === "partner" && (edge.source === personId || edge.target === personId)) {
      partners.push(names.get(edge.source === personId ? edge.target : edge.source) ?? "");
    }
  }
  const parts = [
    parents.length ? `Child of ${parents.join(" and ")}` : null,
    partners.length ? `Partner of ${partners.join(" and ")}` : null,
    children.length ? `Parent of ${children.join(", ")}` : null,
  ].filter(Boolean);
  return parts.join(" · ");
}

/**
 * A text version of the family canvas, grouped by generation. It is the
 * accessible equivalent of the visual tree and the easiest view on phones.
 */
export function CanvasOutline({
  nodes,
  edges,
  focusLabel,
  onSelect,
  profileHref,
}: {
  nodes: Node[];
  edges: Edge[];
  focusLabel: string;
  onSelect: (personId: string) => void;
  profileHref: (personId: string) => string;
}) {
  const people = (nodes as PersonNode[]).filter((node) => node.type === "person");
  const names = new Map(people.map((node) => [node.id, String(node.data.label)]));
  const generations = [...new Set(people.map((node) => node.data.generation ?? 0))].sort(
    (left, right) => left - right,
  );

  return (
    <div className="px-4 py-5 sm:px-6">
      <div className="mx-auto max-w-2xl space-y-7">
        {generations.map((generation) => {
          const row = people
            .filter((node) => (node.data.generation ?? 0) === generation)
            .sort((left, right) => left.position.x - right.position.x);
          const headingId = `outline-generation-${generation}`;
          return (
            <section key={generation} aria-labelledby={headingId}>
              <h2
                id={headingId}
                className="mb-3 text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-[var(--creator-text-muted)]"
              >
                {generationLabel(generation, focusLabel)}
              </h2>
              <ul className="space-y-2">
                {row.map((node) => {
                  const relations = connectionsFor(node.id, edges, names);
                  return (
                    <li
                      key={node.id}
                      className={`flex flex-col gap-3 rounded-2xl border px-4 py-3 sm:flex-row sm:items-center sm:justify-between ${
                        node.data.isFocus
                          ? "border-[var(--accent-primary)] bg-[color-mix(in_oklab,var(--accent-primary)_7%,var(--creator-surface))]"
                          : "border-[var(--creator-border)] bg-[var(--creator-surface)]"
                      }`}
                    >
                      <div className="min-w-0">
                        <p className="flex flex-wrap items-baseline gap-x-2 font-semibold text-[var(--creator-text)]">
                          <span>{node.data.label}</span>
                          {node.data.isFocus ? (
                            <span className="text-[0.62rem] font-semibold uppercase tracking-[0.16em] text-[var(--accent-text)]">
                              In focus
                            </span>
                          ) : null}
                        </p>
                        {node.data.subtitle ? (
                          <p className="text-xs tabular-nums text-[var(--creator-text-muted)]">{node.data.subtitle}</p>
                        ) : null}
                        {relations ? (
                          <p className="mt-1 text-xs leading-5 text-[var(--creator-text-muted)]">{relations}</p>
                        ) : null}
                      </div>
                      <div className="flex shrink-0 items-center gap-2">
                        {node.data.isFocus ? null : (
                          <button
                            type="button"
                            onClick={() => onSelect(node.id)}
                            className="inline-flex min-h-9 items-center gap-1.5 rounded-full border border-[var(--creator-border)] px-3 text-xs font-semibold text-[var(--creator-text)] transition-colors hover:bg-[var(--creator-surface-muted)]"
                          >
                            <Crosshair className="h-3.5 w-3.5" aria-hidden="true" />
                            Centre here<span className="sr-only"> on {node.data.label}</span>
                          </button>
                        )}
                        <Link
                          href={profileHref(node.id)}
                          className="inline-flex min-h-9 items-center gap-1.5 rounded-full border border-[var(--creator-border)] px-3 text-xs font-semibold text-[var(--creator-text)] transition-colors hover:bg-[var(--creator-surface-muted)]"
                        >
                          Profile<span className="sr-only"> of {node.data.label}</span>
                          <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
                        </Link>
                      </div>
                    </li>
                  );
                })}
              </ul>
            </section>
          );
        })}
      </div>
    </div>
  );
}
