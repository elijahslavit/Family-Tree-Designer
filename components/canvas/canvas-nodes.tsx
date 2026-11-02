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
      return "Ancestor";
    case "sibling":
      return "Sibling";
    case "spouse":
      return "Partner";
    case "descendant":
      return "Descendant";
    default:
      return "Relative";
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

const hiddenHandle = "!h-1.5 !w-1.5 !min-h-0 !min-w-0 !border-0 !bg-transparent !opacity-0 pointer-events-none";

const PersonNode = memo(function PersonNode({ data, selected }: NodeProps) {
  const payload = data as CanvasNodePayload;
  const preview =
    payload.summary && payload.summary.length > 160
      ? `${payload.summary.slice(0, 160).trimEnd()}…`
      : payload.summary;
  const tone = relationStyles(payload.relationGroup);
  const primaryLineage = payload.lineageNames?.[0] ?? null;

  return (
    <div
      className={cn(
        "group/node relative flex h-[7.75rem] w-[15rem] cursor-pointer flex-col justify-between rounded-[1.25rem] border px-4 py-3.5 transition-[box-shadow,transform] duration-200 hover:-translate-y-0.5",
        payload.isHighlighted
          ? "shadow-[0_0_0_1px_color-mix(in_oklab,var(--accent-primary)_26%,transparent),0_18px_42px_color-mix(in_oklab,var(--accent-primary)_14%,transparent)]"
          : "shadow-[var(--shadow-node)] hover:shadow-[var(--shadow-md)]",
        selected && "ring-2 ring-[color-mix(in_oklab,var(--accent-primary)_60%,transparent)] ring-offset-2 ring-offset-transparent",
      )}
      style={{
        background: payload.isFocus
          ? "color-mix(in oklab, var(--accent-primary) 9%, var(--canvas-node-bg))"
          : payload.isHighlighted
            ? "var(--canvas-node-highlight-bg)"
            : "var(--canvas-node-bg)",
        borderColor: payload.isFocus ? "var(--accent-primary)" : "var(--canvas-node-border)",
        boxShadow: payload.isFocus
          ? "0 0 0 3px color-mix(in oklab, var(--accent-primary) 18%, transparent), var(--shadow-node)"
          : undefined,
      }}
    >
      {preview ? (
        <div
          className="pointer-events-none absolute bottom-[calc(100%+0.6rem)] left-1/2 z-30 w-64 -translate-x-1/2 translate-y-1 rounded-[1rem] border border-[var(--border-default)] px-3.5 py-3 opacity-0 shadow-[var(--shadow-lg)] transition-[opacity,transform] duration-150 group-hover/node:translate-y-0 group-hover/node:opacity-100"
          style={{ background: "var(--canvas-tooltip-bg, var(--canvas-node-bg))" }}
          aria-hidden="true"
        >
          <p className="text-[0.72rem] leading-5 text-[var(--text-secondary)]">{preview}</p>
        </div>
      ) : null}

      <Handle id="top" type="target" position={Position.Top} className={hiddenHandle} />
      <Handle id="top-source" type="source" position={Position.Top} className={hiddenHandle} />
      <Handle id="bottom" type="source" position={Position.Bottom} className={hiddenHandle} />
      <Handle id="left" type="target" position={Position.Left} className={hiddenHandle} />
      <Handle id="right" type="source" position={Position.Right} className={hiddenHandle} />

      <div className="flex items-start gap-3">
        <div
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border text-[0.78rem] font-semibold tracking-[0.08em] text-[var(--text-primary)]"
          style={{
            background: payload.isFocus
              ? "color-mix(in oklab, var(--accent-primary) 18%, var(--canvas-avatar-bg, var(--bg-elevated)))"
              : "var(--canvas-avatar-bg, var(--bg-elevated))",
            borderColor: "color-mix(in oklab, var(--text-primary) 12%, transparent)",
          }}
          aria-hidden="true"
        >
          {initials(payload.label)}
        </div>
        <div className="min-w-0 flex-1">
          <p className="line-clamp-2 font-[family-name:var(--font-heading)] text-[1rem] font-semibold leading-[1.2] text-[var(--text-primary)]">
            {payload.label}
          </p>
          {payload.subtitle ? (
            <p className="mt-1 truncate text-[0.7rem] tabular-nums text-[var(--text-muted)]">{payload.subtitle}</p>
          ) : null}
        </div>
      </div>

      <div className="flex items-center justify-between gap-2">
        <div className="flex shrink-0 items-center gap-1.5">
          <span
            className="inline-flex shrink-0 rounded-full px-2 py-0.5 text-[0.56rem] font-semibold uppercase tracking-[0.14em]"
            style={{
              background: tone.badgeBg,
              color: tone.badgeText,
              boxShadow: `inset 0 0 0 1px ${tone.border}`,
            }}
          >
            {relationLabel(payload.relationGroup)}
          </span>
          {payload.isLiving ? <Badge tone="warning">Living</Badge> : null}
          {payload.isHighlighted ? <Badge tone="accent">Lineage</Badge> : null}
        </div>
        {primaryLineage && !payload.isLiving && !payload.isHighlighted ? (
          <span className="min-w-0 truncate text-[0.58rem] uppercase tracking-[0.14em] text-[var(--text-muted)]" title={primaryLineage}>
            {primaryLineage}
          </span>
        ) : null}
      </div>
    </div>
  );
});

export const GENERATION_LABEL_WIDTH = 176;

const GenerationLabelNode = memo(function GenerationLabelNode({ data }: NodeProps) {
  return (
    <div
      className="pointer-events-none flex h-[7.75rem] items-center justify-end text-right"
      style={{ width: GENERATION_LABEL_WIDTH }}
    >
      <p className="text-[0.66rem] font-semibold uppercase leading-4 tracking-[0.16em] text-[var(--text-muted)]">
        {String((data as { label?: string }).label ?? "")}
      </p>
    </div>
  );
});

export const nodeTypes = {
  person: PersonNode,
  generationLabel: GenerationLabelNode,
};
