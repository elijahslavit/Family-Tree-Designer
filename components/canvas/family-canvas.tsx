"use client";

import "@xyflow/react/dist/style.css";

import {
  Background,
  BackgroundVariant,
  Controls,
  ReactFlow,
  getViewportForBounds,
  useReactFlow,
  useStore,
  type Edge,
  type Node,
} from "@xyflow/react";
import { GitBranch, ListTree } from "lucide-react";
import { startTransition, useCallback, useEffect, useMemo, useState } from "react";
import { CanvasOutline } from "@/components/canvas/canvas-outline";
import { GENERATION_LABEL_WIDTH, nodeTypes } from "@/components/canvas/canvas-nodes";
import { CanvasSearch, type CanvasSearchPerson } from "@/components/canvas/canvas-search";
import { cn } from "@/lib/utils/cn";
import { CANVAS_NODE_HEIGHT, CANVAS_NODE_WIDTH, generationLabel } from "@/lib/data/canvas-layout";

type FamilyCanvasProps = {
  nodes: Node[];
  edges: Edge[];
  focusLabel: string;
  visibleCount: number;
  depth: number;
  selectedLineageName?: string | null;
  onNodeSelect?: (nodeId: string) => void;
  onNodeOpen?: (nodeId: string) => void;
  /** Everyone the viewer may search for, including people outside the current view. */
  searchPeople?: CanvasSearchPerson[];
  view?: CanvasView;
  onViewChange?: (view: CanvasView) => void;
  profileHref?: (personId: string) => string;
};

export type CanvasView = "tree" | "list";

export function FamilyCanvas({
  nodes,
  edges,
  focusLabel,
  visibleCount,
  depth,
  selectedLineageName,
  onNodeSelect,
  onNodeOpen,
  searchPeople,
  view = "tree",
  onViewChange,
  profileHref,
}: FamilyCanvasProps) {
  const showList = view === "list" && Boolean(profileHref);

  return (
    <div
      className={cn(
        "canvas-stage relative flex flex-col rounded-[var(--radius-md)] border border-[var(--creator-border)] bg-[var(--creator-surface)]",
        // The text outline grows with its content and scrolls with the page;
        // the diagram needs a fixed stage to pan and zoom within.
        showList ? "min-h-[30rem]" : "h-[30rem] overflow-hidden sm:h-[36rem] lg:h-[78vh] lg:max-h-[56rem]",
      )}
    >
      <div className="z-10 space-y-2.5 border-b border-[var(--creator-border)] bg-[var(--creator-surface)] px-4 py-3 text-sm text-[var(--creator-text)]">
        {searchPeople?.length || (onViewChange && profileHref) ? (
          <div className="flex flex-wrap items-center justify-between gap-2">
            {searchPeople?.length && onNodeSelect ? (
              <CanvasSearch people={searchPeople} onSelect={onNodeSelect} />
            ) : (
              <span />
            )}
            {onViewChange && profileHref ? <ViewToggle view={view} onChange={onViewChange} /> : null}
          </div>
        ) : null}
        <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-2">
          <p className="min-w-0">
            <span className="font-semibold">{focusLabel}</span>
            <span className="text-[var(--creator-text-muted)]">
              {" "}· {visibleCount} {visibleCount === 1 ? "person" : "people"} · {depth} step{depth === 1 ? "" : "s"} out · {selectedLineageName ?? "All branches"}
            </span>
          </p>
          {showList ? null : (
            <ul aria-label="Line legend" className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-[var(--creator-text-muted)]">
              <LegendItem label="Parent & child" dash={undefined} />
              <LegendItem label="Partners" dash="6 5" />
              <LegendItem label="Siblings" dash="2 5" soft />
            </ul>
          )}
        </div>
      </div>

      <div className={cn("relative flex-1", !showList && "min-h-0")}>
        {showList && profileHref ? (
          <CanvasOutline
            nodes={nodes}
            edges={edges}
            focusLabel={focusLabel}
            onSelect={(personId) => onNodeSelect?.(personId)}
            profileHref={profileHref}
          />
        ) : (
          <TreeStage
            nodes={nodes}
            edges={edges}
            focusLabel={focusLabel}
            hasListView={Boolean(onViewChange && profileHref)}
            onNodeSelect={onNodeSelect}
            onNodeOpen={onNodeOpen}
          />
        )}
      </div>
    </div>
  );
}

function TreeStage({
  nodes,
  edges,
  focusLabel,
  hasListView,
  onNodeSelect,
  onNodeOpen,
}: {
  nodes: Node[];
  edges: Edge[];
  focusLabel: string;
  hasListView: boolean;
  onNodeSelect?: (nodeId: string) => void;
  onNodeOpen?: (nodeId: string) => void;
}) {
  const [fitted, setFitted] = useState(false);
  const markFitted = useCallback(() => setFitted(true), []);
  const nodesWithLabels = useMemo(() => withGenerationLabels(nodes, focusLabel), [nodes, focusLabel]);

  return (
    <div
      role="region"
      aria-label={
        hasListView
          ? "Family tree diagram. Choose List for a text version of the same family."
          : "Family tree diagram"
      }
      className="h-full"
    >
      <ReactFlow
        className={fitted ? "opacity-100 transition-opacity duration-200" : "opacity-0"}
        minZoom={0.2}
        maxZoom={1.65}
        nodes={nodesWithLabels}
        edges={edges}
        nodeTypes={nodeTypes}
        nodesDraggable={false}
        nodesConnectable={false}
        elementsSelectable
        proOptions={{ hideAttribution: true }}
        onNodeClick={(_, node) => {
          if (node.type !== "person") return;
          startTransition(() => {
            onNodeSelect?.(node.id);
          });
        }}
        onNodeDoubleClick={(_, node) => {
          if (node.type !== "person") return;
          startTransition(() => {
            onNodeOpen?.(node.id);
          });
        }}
      >
        <CanvasAutoFit
          nodeCount={nodesWithLabels.length}
          focusNodeId={nodes.find((node) => node.data?.isFocus)?.id ?? null}
          onFitted={markFitted}
        />
        <Controls showInteractive={false} />
        <Background variant={BackgroundVariant.Dots} gap={28} size={1.2} />
      </ReactFlow>
    </div>
  );
}

const GENERATION_LABEL_GAP = 28;

/** Adds a quiet, non-interactive label to the left of each generation row. */
function withGenerationLabels(nodes: Node[], focusLabel: string): Node[] {
  const people = nodes.filter((node) => node.type === "person");
  const rows = new Map<number, number>();
  for (const node of people) {
    const generation = (node.data as { generation?: number }).generation;
    if (typeof generation === "number" && !rows.has(generation)) rows.set(generation, node.position.y);
  }
  if (rows.size < 2) return nodes;

  const left = Math.min(...people.map((node) => node.position.x));
  const labels: Node[] = [...rows.entries()].map(([generation, y]) => ({
    id: `generation-label:${generation}`,
    type: "generationLabel",
    position: { x: left - GENERATION_LABEL_WIDTH - GENERATION_LABEL_GAP, y },
    data: { label: generationLabel(generation, focusLabel) },
    selectable: false,
    draggable: false,
    focusable: false,
    connectable: false,
  }));
  return [...labels, ...nodes];
}

function ViewToggle({ view, onChange }: { view: CanvasView; onChange: (view: CanvasView) => void }) {
  const options: Array<{ value: CanvasView; label: string; icon: typeof GitBranch }> = [
    { value: "tree", label: "Tree", icon: GitBranch },
    { value: "list", label: "List", icon: ListTree },
  ];
  return (
    <div
      role="group"
      aria-label="Family view"
      className="inline-flex rounded-full border border-[var(--creator-border)] bg-[var(--creator-surface-muted)] p-0.5"
    >
      {options.map(({ value, label, icon: Icon }) => (
        <button
          key={value}
          type="button"
          aria-pressed={view === value}
          onClick={() => onChange(value)}
          className={
            view === value
              ? "inline-flex min-h-9 items-center gap-1.5 rounded-full bg-[var(--creator-surface)] px-3.5 text-xs font-semibold text-[var(--creator-text)] shadow-sm"
              : "inline-flex min-h-9 items-center gap-1.5 rounded-full px-3.5 text-xs font-semibold text-[var(--creator-text-muted)] hover:text-[var(--creator-text)]"
          }
        >
          <Icon className="h-3.5 w-3.5" aria-hidden="true" />
          {label}
        </button>
      ))}
    </div>
  );
}

function LegendItem({ label, dash, soft = false }: { label: string; dash?: string; soft?: boolean }) {
  return (
    <li className="inline-flex items-center gap-1.5">
      <svg width="22" height="6" viewBox="0 0 22 6" aria-hidden="true">
        <line
          x1="1"
          y1="3"
          x2="21"
          y2="3"
          stroke={soft ? "var(--canvas-link-soft)" : "var(--canvas-link)"}
          strokeWidth="1.8"
          strokeDasharray={dash}
          strokeLinecap="round"
        />
      </svg>
      {label}
    </li>
  );
}

const MIN_READABLE_ZOOM = 0.62;
const FIT_PADDING = 0.16;

function CanvasAutoFit({
  nodeCount,
  focusNodeId,
  onFitted,
}: {
  nodeCount: number;
  focusNodeId: string | null;
  onFitted: () => void;
}) {
  const { getNodes, setViewport } = useReactFlow();
  const width = useStore((state) => state.width);
  const height = useStore((state) => state.height);

  useEffect(() => {
    if (!width || !height) {
      return;
    }

    const frame = window.requestAnimationFrame(() => {
      // Cards have a fixed size (see canvas-layout), so the fit can be computed
      // from positions alone without waiting for DOM measurement.
      const nodes = getNodes();
      if (!nodes.length) return;
      const xs = nodes.map((node) => node.position.x);
      const ys = nodes.map((node) => node.position.y);
      const bounds = {
        x: Math.min(...xs),
        y: Math.min(...ys),
        width: Math.max(...xs) - Math.min(...xs) + CANVAS_NODE_WIDTH,
        height: Math.max(...ys) - Math.min(...ys) + CANVAS_NODE_HEIGHT,
      };
      const fitted = getViewportForBounds(bounds, width, height, 0.2, 1, FIT_PADDING);
      const focusNode = focusNodeId ? nodes.find((node) => node.id === focusNodeId) : null;

      // On narrow screens the whole family may only fit at an unreadable
      // scale; keep cards legible and centre the focus person instead.
      if (focusNode && fitted.zoom < MIN_READABLE_ZOOM) {
        void setViewport({
          x: width / 2 - (focusNode.position.x + CANVAS_NODE_WIDTH / 2) * MIN_READABLE_ZOOM,
          y: height / 2 - (focusNode.position.y + CANVAS_NODE_HEIGHT / 2) * MIN_READABLE_ZOOM,
          zoom: MIN_READABLE_ZOOM,
        });
      } else {
        void setViewport(fitted);
      }
      onFitted();
    });

    return () => window.cancelAnimationFrame(frame);
  }, [focusNodeId, getNodes, height, nodeCount, onFitted, setViewport, width]);

  return null;
}
