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
import { startTransition, useEffect } from "react";
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
    <div className="canvas-stage relative h-[28rem] overflow-hidden rounded-[var(--radius-md)] border border-[var(--creator-border)] bg-[var(--creator-surface)] sm:h-[34rem] lg:h-[78vh] lg:max-h-[56rem]">
      <div className="absolute inset-x-0 top-0 z-10 flex flex-wrap items-center gap-2 border-b border-[var(--creator-border)] bg-[var(--creator-surface)] px-4 py-3 text-sm text-[var(--creator-text)]">
        <span className="font-medium">Canvas</span>
        <span className="text-[var(--creator-text-muted)]">{focusLabel}</span>
        <span className="text-[var(--creator-text-muted)]">|</span>
        <span className="text-[var(--creator-text-muted)]">{visibleCount} in view</span>
        <span className="text-[var(--creator-text-muted)]">|</span>
        <span className="text-[var(--creator-text-muted)]">
          {depth} step{depth === 1 ? "" : "s"}
        </span>
        <span className="text-[var(--creator-text-muted)]">|</span>
        <span className="text-[var(--creator-text-muted)]">
          {selectedLineageName ?? "All branches"}
        </span>
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
