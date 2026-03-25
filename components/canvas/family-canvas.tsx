"use client";

import "@xyflow/react/dist/style.css";

import {
  Background,
  Controls,
  MiniMap,
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
  onNodeSelect?: (nodeId: string) => void;
  onNodeOpen?: (nodeId: string) => void;
};

export function FamilyCanvas({
  nodes,
  edges,
  onNodeSelect,
  onNodeOpen,
}: FamilyCanvasProps) {
  return (
    <div className="relative h-[70vh] overflow-hidden rounded-[var(--radius-lg)] border border-[var(--border-default)] bg-[var(--bg-canvas)]">
      <div className="pointer-events-none absolute left-4 top-4 z-10 rounded-full bg-[color-mix(in_oklab,var(--bg-primary)_80%,transparent)] px-3 py-1 text-xs uppercase tracking-[0.12em] text-[var(--text-muted)] backdrop-blur">
        Click to focus · double-click to open profile
      </div>
      <ReactFlow
        fitView
        fitViewOptions={{ padding: 0.18 }}
        minZoom={0.2}
        maxZoom={1.6}
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
        <MiniMap
          pannable
          zoomable
          bgColor="var(--bg-elevated)"
          nodeColor="var(--accent-primary)"
          nodeStrokeColor="var(--border-strong)"
          maskColor="color-mix(in oklab, var(--bg-primary) 18%, transparent)"
        />
        <Controls />
        <Background color="var(--canvas-edge)" gap={24} />
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
        duration: 240,
        padding: 0.24,
      });
    });

    return () => window.cancelAnimationFrame(frame);
  }, [fitView, nodeCount, nodesInitialized]);

  return null;
}
