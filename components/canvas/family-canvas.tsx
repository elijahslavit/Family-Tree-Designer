"use client";

import "@xyflow/react/dist/style.css";

import {
  Background,
  Controls,
  MiniMap,
  ReactFlow,
  type Edge,
  type Node,
} from "@xyflow/react";
import { startTransition } from "react";

import { nodeTypes } from "@/components/canvas/canvas-nodes";

type FamilyCanvasProps = {
  nodes: Node[];
  edges: Edge[];
  onNodeSelect?: (nodeId: string) => void;
};

export function FamilyCanvas({
  nodes,
  edges,
  onNodeSelect,
}: FamilyCanvasProps) {
  return (
    <div className="h-[70vh] overflow-hidden rounded-[var(--radius-lg)] border border-[var(--border-default)] bg-[var(--bg-canvas)]">
      <ReactFlow
        fitView
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        onNodeClick={(_, node) =>
          startTransition(() => {
            onNodeSelect?.(node.id);
          })
        }
      >
        <MiniMap />
        <Controls />
        <Background color="var(--canvas-edge)" gap={24} />
      </ReactFlow>
    </div>
  );
}
