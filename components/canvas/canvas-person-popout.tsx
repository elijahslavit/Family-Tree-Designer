"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { NodeToolbar, Position } from "@xyflow/react";
import { ArrowUpRight, X } from "lucide-react";

import type { PersonViewModel } from "@/lib/types";

type CanvasPersonPopoutProps = {
  person: PersonViewModel;
  profileHref: string;
  nodeId: string;
  orientation: "horizontal" | "vertical";
};

function lifespanLabel(person: PersonViewModel) {
  const birth = person.birthDateText?.trim() || person.birthDateNormalized?.trim();
  const death = person.deathDateText?.trim() || person.deathDateNormalized?.trim();

  if (birth && death) return `${birth} – ${death}`;
  if (birth && person.isLiving) return `b. ${birth}`;
  if (birth) return `b. ${birth}`;
  if (death) return `d. ${death}`;
  if (person.isLiving) return "Living";
  return null;
}

export function CanvasPersonPopout({
  person,
  profileHref,
  nodeId,
  orientation,
}: CanvasPersonPopoutProps) {
  const [dismissedFor, setDismissedFor] = useState<string | null>(null);

  useEffect(() => {
    setDismissedFor(null);
  }, [person.id]);

  const visible = dismissedFor !== person.id;
  const dates = lifespanLabel(person);
  const summary = person.summary?.trim() || null;
  const side = orientation === "vertical" ? Position.Right : Position.Bottom;

  return (
    <NodeToolbar
      nodeId={nodeId}
      isVisible={visible}
      position={side}
      offset={14}
      align="center"
      className="!pointer-events-auto"
    >
      <div
        className="w-[min(19rem,calc(100vw-2rem))] rounded-2xl border border-[var(--creator-border)] px-4 py-3.5 shadow-[var(--shadow-lg)] backdrop-blur-xl"
        style={{ background: "var(--canvas-sidebar-bg)" }}
        role="dialog"
        aria-label={`${person.fullName} details`}
      >
        <div className="flex items-start gap-1">
          <div className="min-w-0 flex-1">
            <p className="line-clamp-2 font-[family-name:var(--sc-display-font,var(--font-heading))] text-lg font-semibold leading-snug text-[var(--creator-text)]">
              {person.fullName}
            </p>
            {dates ? (
              <p className="mt-1.5 text-[0.7rem] uppercase tracking-[0.08em] text-[var(--creator-text-muted)]">
                {dates}
              </p>
            ) : null}
          </div>
          <button
            type="button"
            aria-label="Close person details"
            title="Close"
            className="grid h-7 w-7 shrink-0 place-items-center rounded-lg text-[var(--creator-text-muted)] transition-colors hover:bg-[var(--creator-surface-muted)] hover:text-[var(--creator-text)]"
            onClick={() => setDismissedFor(person.id)}
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>

        {summary ? (
          <p className="mt-2.5 line-clamp-3 border-t border-[var(--creator-border)] pt-2.5 text-sm leading-relaxed text-[var(--text-secondary,var(--creator-text-muted))]">
            {summary}
          </p>
        ) : null}

        <Link
          href={profileHref}
          className="mt-2.5 inline-flex items-center gap-1 text-xs font-medium text-[var(--creator-accent,var(--accent-primary))] transition-opacity hover:opacity-80"
        >
          Open profile
          <ArrowUpRight className="h-3 w-3" />
        </Link>
      </div>
    </NodeToolbar>
  );
}
