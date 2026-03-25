import { memo } from "react";
import { Handle, Position, type NodeProps } from "@xyflow/react";

import { Badge } from "@/components/foundation/badge";
import { cn } from "@/lib/utils/cn";

type CanvasNodePayload = {
  label: string;
  subtitle?: string | null;
  summary?: string | null;
  isLiving?: boolean;
  isFocus?: boolean;
  isHighlighted?: boolean;
  relationGroup?:
    | "focus"
    | "ancestor"
    | "sibling"
    | "spouse"
    | "descendant"
    | "relative";
  lineageNames?: string[];
};

function initials(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

function relationLabel(group: CanvasNodePayload["relationGroup"]) {
  switch (group) {
    case "focus":
      return "Focus";
    case "ancestor":
      return "Ancestor branch";
    case "sibling":
      return "Sibling branch";
    case "spouse":
      return "Partner branch";
    case "descendant":
      return "Descendant branch";
    default:
      return "Related branch";
  }
}

function relationStyles(group: CanvasNodePayload["relationGroup"]) {
  switch (group) {
    case "focus":
      return {
        border: "var(--accent-primary)",
        badgeBg: "color-mix(in oklab, var(--accent-primary) 18%, transparent)",
        badgeText: "var(--accent-text)",
      };
    case "ancestor":
      return {
        border: "var(--rel-parent-border)",
        badgeBg: "var(--rel-parent-bg)",
        badgeText: "var(--rel-parent-text)",
      };
    case "sibling":
      return {
        border: "var(--rel-sibling-border)",
        badgeBg: "var(--rel-sibling-bg)",
        badgeText: "var(--rel-sibling-text)",
      };
    case "spouse":
      return {
        border: "var(--rel-spouse-border)",
        badgeBg: "var(--rel-spouse-bg)",
        badgeText: "var(--rel-spouse-text)",
      };
    case "descendant":
      return {
        border: "var(--rel-child-border)",
        badgeBg: "var(--rel-child-bg)",
        badgeText: "var(--rel-child-text)",
      };
    default:
      return {
        border: "var(--canvas-node-border)",
        badgeBg: "color-mix(in oklab, var(--bg-elevated) 86%, transparent)",
        badgeText: "var(--text-muted)",
      };
  }
}

const PersonNode = memo(function PersonNode({ data, selected }: NodeProps) {
  const payload = data as CanvasNodePayload;
  const preview =
    payload.summary && payload.summary.length > 150
      ? `${payload.summary.slice(0, 150)}...`
      : payload.summary;
  const tone = relationStyles(payload.relationGroup);
  const primaryLineage = payload.lineageNames?.[0] ?? null;

  return (
    <div
      className={cn(
        "group/node relative w-[15rem] rounded-[1.5rem] border px-4 py-4 backdrop-blur-md transition-all duration-200",
        payload.isHighlighted
          ? "shadow-[0_0_0_1px_color-mix(in_oklab,var(--accent-primary)_26%,transparent),0_18px_42px_color-mix(in_oklab,var(--accent-primary)_14%,transparent)]"
          : "shadow-[var(--shadow-node)]",
        selected && "ring-2 ring-[color-mix(in_oklab,var(--accent-primary)_60%,transparent)] ring-offset-2 ring-offset-transparent",
      )}
      style={{
        background: payload.isHighlighted
          ? "var(--canvas-node-highlight-bg)"
          : "var(--canvas-node-bg)",
        borderColor: payload.isFocus ? "var(--accent-primary)" : "var(--canvas-node-border)",
        boxShadow: payload.isFocus
          ? "0 0 0 1px color-mix(in oklab, var(--accent-primary) 45%, transparent), var(--shadow-node)"
          : undefined,
      }}
    >
      {preview ? (
        <div
          className="pointer-events-none absolute bottom-[calc(100%+0.8rem)] left-1/2 z-30 hidden w-64 -translate-x-1/2 rounded-[1.1rem] border border-[var(--border-default)] px-3.5 py-3 opacity-0 shadow-[var(--shadow-lg)] transition-all duration-150 group-hover/node:block group-hover/node:opacity-100 lg:block"
          style={{ background: "var(--canvas-tooltip-bg)" }}
        >
          <p className="text-[0.7rem] font-semibold text-[var(--text-primary)]">{payload.label}</p>
          {payload.subtitle ? (
            <p className="mt-1 text-[0.65rem] text-[var(--text-muted)]">{payload.subtitle}</p>
          ) : null}
          <p className="mt-2 text-[0.72rem] leading-5 text-[var(--text-secondary)]">
            {preview}
          </p>
        </div>
      ) : null}

      <Handle
        type="target"
        position={Position.Left}
        className="!h-2.5 !w-2.5 !border-0 !bg-[var(--accent-primary)]"
      />
      <Handle
        type="source"
        position={Position.Right}
        className="!h-2.5 !w-2.5 !border-0 !bg-[var(--accent-primary)]"
      />

      <div className="flex items-start gap-3">
        <div
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border text-sm font-semibold tracking-[0.12em] text-[var(--text-primary)]"
          style={{
            background: "var(--canvas-avatar-bg)",
            borderColor: "color-mix(in oklab, var(--text-primary) 10%, transparent)",
          }}
        >
          {initials(payload.label)}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <span
              className="inline-flex rounded-full px-2.5 py-1 text-[0.56rem] font-semibold uppercase tracking-[0.16em]"
              style={{
                background: tone.badgeBg,
                color: tone.badgeText,
                boxShadow: `inset 0 0 0 1px ${tone.border}`,
              }}
            >
              {relationLabel(payload.relationGroup)}
            </span>
            {payload.isHighlighted ? <Badge tone="accent">Lineage</Badge> : null}
            {payload.isLiving ? <Badge tone="warning">Living</Badge> : null}
          </div>
          <p className="mt-2 text-[1.02rem] font-semibold leading-5 text-[var(--text-primary)]">
            {payload.label}
          </p>
          {payload.subtitle ? (
            <p className="mt-1 text-xs leading-5 text-[var(--text-muted)]">{payload.subtitle}</p>
          ) : null}
        </div>
      </div>

      {preview ? (
        <p className="mt-3 text-[0.76rem] leading-[1.55] text-[var(--text-secondary)]">
          {preview}
        </p>
      ) : null}

      <div className="mt-3 flex items-center justify-between gap-3 border-t border-[var(--border-muted)] pt-3">
        <div className="min-w-0">
          <p className="truncate text-[0.62rem] uppercase tracking-[0.18em] text-[var(--text-muted)]">
            {primaryLineage ?? "Family branch"}
          </p>
        </div>
        <div
          className="h-2.5 w-2.5 shrink-0 rounded-full"
          style={{ background: tone.border }}
          aria-hidden="true"
        />
      </div>
    </div>
  );
});

export const nodeTypes = {
  person: PersonNode,
};
