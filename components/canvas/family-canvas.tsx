"use client";

import "@xyflow/react/dist/style.css";

import {
  Background,
  BackgroundVariant,
  Controls,
  ReactFlow,
  useNodesInitialized,
  useReactFlow,
  type Edge,
  type Node,
} from "@xyflow/react";
import { MoveDiagonal, Sparkles, Waypoints } from "lucide-react";
import { startTransition, useEffect } from "react";

import { Badge } from "@/components/foundation/badge";
import { nodeTypes } from "@/components/canvas/canvas-nodes";

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
  return (
    <div className="canvas-stage relative h-[28rem] overflow-hidden rounded-[1.75rem] border border-[var(--border-default)] bg-[var(--bg-canvas)] shadow-[var(--shadow-lg)] sm:h-[34rem] lg:h-[78vh] lg:max-h-[56rem]">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,color-mix(in_oklab,var(--accent-primary)_14%,transparent),transparent_34%),radial-gradient(circle_at_bottom_right,color-mix(in_oklab,var(--accent-primary)_10%,transparent),transparent_26%)]" />
        <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-[color-mix(in_oklab,var(--bg-elevated)_36%,transparent)] to-transparent" />
      </div>

      <div className="pointer-events-none absolute left-4 top-4 z-10 flex max-w-[calc(100%-1rem)] flex-wrap gap-2">
        <div className="pointer-events-auto inline-flex items-center gap-2 rounded-full border border-[var(--border-default)] bg-[var(--canvas-sidebar-bg)] px-3 py-2 text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-[var(--text-secondary)] shadow-[var(--shadow-sm)] backdrop-blur">
          <Waypoints className="h-3.5 w-3.5 text-[var(--accent-primary)]" />
          Explorer canvas
        </div>
        <div className="pointer-events-auto inline-flex items-center gap-2 rounded-full border border-[var(--border-default)] bg-[var(--canvas-sidebar-bg)] px-3 py-2 text-[0.68rem] text-[var(--text-muted)] shadow-[var(--shadow-sm)] backdrop-blur">
          <span className="font-semibold text-[var(--text-primary)]">{visibleCount}</span>
          people in view
        </div>
        <div className="pointer-events-auto inline-flex items-center gap-2 rounded-full border border-[var(--border-default)] bg-[var(--canvas-sidebar-bg)] px-3 py-2 text-[0.68rem] text-[var(--text-muted)] shadow-[var(--shadow-sm)] backdrop-blur">
          <span className="font-semibold text-[var(--text-primary)]">{depth}</span>
          hop{depth === 1 ? "" : "s"}
        </div>
      </div>

      <div className="pointer-events-none absolute bottom-4 left-4 z-10 hidden max-w-sm rounded-[1.25rem] border border-[var(--border-default)] bg-[var(--canvas-sidebar-bg)] px-4 py-3 text-sm shadow-[var(--shadow-sm)] backdrop-blur md:block">
        <div className="flex items-start gap-3">
          <div className="mt-0.5 rounded-full bg-[color-mix(in_oklab,var(--accent-primary)_18%,transparent)] p-2 text-[var(--accent-primary)]">
            <MoveDiagonal className="h-4 w-4" />
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.16em] text-[var(--text-muted)]">
              Navigate the archive
            </p>
            <p className="mt-1 text-[var(--text-secondary)]">
              Single-click a node to refocus on a branch. Double-click to open the full
              profile.
            </p>
          </div>
        </div>
      </div>

      <div className="pointer-events-none absolute right-4 top-4 z-10 hidden max-w-sm rounded-[1.25rem] border border-[var(--border-default)] bg-[var(--canvas-sidebar-bg)] px-4 py-3 shadow-[var(--shadow-sm)] backdrop-blur lg:block">
        <p className="text-[0.68rem] uppercase tracking-[0.16em] text-[var(--text-muted)]">
          Focus branch
        </p>
        <p className="mt-1 text-sm font-semibold text-[var(--text-primary)]">{focusLabel}</p>
        <div className="mt-3 flex flex-wrap gap-2">
          <Badge tone="accent" className="bg-[color-mix(in_oklab,var(--accent-primary)_18%,transparent)]">
            <Sparkles className="mr-1 h-3.5 w-3.5" />
            {selectedLineageName ?? "All branches"}
          </Badge>
        </div>
      </div>

      <ReactFlow
        fitView
        fitViewOptions={{ padding: 0.1 }}
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
        <CanvasAutoFit nodeCount={nodes.length} />
        <Controls showInteractive={false} />
        <Background
          variant={BackgroundVariant.Dots}
          color="var(--canvas-grid-color)"
          gap={28}
          size={1.2}
        />
      </ReactFlow>
    </div>
  );
}

function CanvasAutoFit({ nodeCount }: { nodeCount: number }) {
  const { fitView } = useReactFlow();
  const nodesInitialized = useNodesInitialized();

  useEffect(() => {
    if (!nodesInitialized) {
      return;
    }

    const frame = window.requestAnimationFrame(() => {
      fitView({
        duration: 280,
        padding: 0.12,
      });
    });

    return () => window.cancelAnimationFrame(frame);
  }, [fitView, nodeCount, nodesInitialized]);

  return null;
}
