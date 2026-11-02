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
import { startTransition, useCallback, useEffect, useState } from "react";
import { nodeTypes } from "@/components/canvas/canvas-nodes";
import { CANVAS_NODE_HEIGHT, CANVAS_NODE_WIDTH } from "@/lib/data/canvas-layout";

type FamilyCanvasProps = {
  nodes: Node[];
  edges: Edge[];
  focusLabel: string;
  visibleCount: number;
  depth: number;
  selectedLineageName?: string | null;
  onNodeSelect?: (nodeId: string) => void;
  onNodeOpen?: (nodeId: string) => void;
};

export function FamilyCanvas({
  nodes,
  edges,
  focusLabel,
  visibleCount,
  depth,
  selectedLineageName,
  onNodeSelect,
  onNodeOpen,
}: FamilyCanvasProps) {
  const [fitted, setFitted] = useState(false);
  const markFitted = useCallback(() => setFitted(true), []);

  return (
    <div className="canvas-stage relative flex h-[30rem] flex-col overflow-hidden rounded-[var(--radius-md)] border border-[var(--creator-border)] bg-[var(--creator-surface)] sm:h-[36rem] lg:h-[78vh] lg:max-h-[56rem]">
      <div className="z-10 flex flex-wrap items-center justify-between gap-x-6 gap-y-2 border-b border-[var(--creator-border)] bg-[var(--creator-surface)] px-4 py-3 text-sm text-[var(--creator-text)]">
        <p className="min-w-0">
          <span className="font-semibold">{focusLabel}</span>
          <span className="text-[var(--creator-text-muted)]">
            {" "}· {visibleCount} {visibleCount === 1 ? "person" : "people"} · {depth} step{depth === 1 ? "" : "s"} out · {selectedLineageName ?? "All branches"}
          </span>
        </p>
        <ul aria-label="Line legend" className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-[var(--creator-text-muted)]">
          <LegendItem label="Parent & child" dash={undefined} />
          <LegendItem label="Partners" dash="6 5" />
          <LegendItem label="Siblings" dash="2 5" soft />
        </ul>
      </div>

      <div className="relative min-h-0 flex-1">
        <ReactFlow
          className={fitted ? "opacity-100 transition-opacity duration-200" : "opacity-0"}
          minZoom={0.2}
          maxZoom={1.65}
          nodes={nodes}
          edges={edges}
          nodeTypes={nodeTypes}
          nodesDraggable={false}
          nodesConnectable={false}
          elementsSelectable
          proOptions={{ hideAttribution: true }}
          onNodeClick={(_, node) =>
            startTransition(() => {
              onNodeSelect?.(node.id);
            })
          }
          onNodeDoubleClick={(_, node) =>
            startTransition(() => {
              onNodeOpen?.(node.id);
            })
          }
        >
          <CanvasAutoFit
            nodeCount={nodes.length}
            focusNodeId={nodes.find((node) => node.data?.isFocus)?.id ?? null}
            onFitted={markFitted}
          />
          <Controls showInteractive={false} />
          <Background
            variant={BackgroundVariant.Dots}
            gap={28}
            size={1.2}
          />
        </ReactFlow>
      </div>
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
