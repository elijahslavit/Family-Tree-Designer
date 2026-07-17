"use client";

import "@xyflow/react/dist/style.css";

import {
  Background,
  BackgroundVariant,
  MiniMap,
  ReactFlow,
  useEdgesState,
  useNodesInitialized,
  useNodesState,
  useReactFlow,
  type Edge,
  type Node,
} from "@xyflow/react";
import { useEffect } from "react";

import { nodeTypes } from "@/components/canvas/canvas-nodes";
import { CanvasToolbar } from "@/components/canvas/canvas-toolbar";

const FIT_VIEW_OPTIONS = { padding: 0.15 };

function prefersReducedMotion() {
  return (
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}

type CanvasStageProps = {
  nodes: Node[];
  edges: Edge[];
  onCenter: (personId: string) => void;
  onOpen: (personId: string) => void;
  onSearchShortcut?: () => void;
  isPending?: boolean;
};

export function CanvasStage({
  nodes: incomingNodes,
  edges: incomingEdges,
  onCenter,
  onOpen,
  onSearchShortcut,
  isPending,
}: CanvasStageProps) {
  const [nodes, setNodes, onNodesChange] = useNodesState(incomingNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(incomingEdges);

  useEffect(() => {
    setNodes(incomingNodes);
  }, [incomingNodes, setNodes]);

  useEffect(() => {
    setEdges(incomingEdges);
  }, [incomingEdges, setEdges]);

  return (
    <div className="canvas-stage h-full w-full" aria-busy={isPending || undefined}>
      <ReactFlow
        fitView
        fitViewOptions={FIT_VIEW_OPTIONS}
        minZoom={0.15}
        maxZoom={2}
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        nodeTypes={nodeTypes}
        nodesDraggable
        nodesConnectable={false}
        elementsSelectable
        edgesFocusable={false}
        panOnScroll
        zoomOnScroll={false}
        zoomOnPinch
        zoomOnDoubleClick={false}
        deleteKeyCode={null}
        proOptions={{ hideAttribution: true }}
        onNodeClick={(_, node) => onCenter(node.id)}
        onNodeDoubleClick={(_, node) => onOpen(node.id)}
      >
        <CanvasAutoFit resetKey={incomingNodes} />
        <CanvasShortcuts onSearchShortcut={onSearchShortcut} />
        <CanvasToolbar />
        <Background
          variant={BackgroundVariant.Dots}
          gap={28}
          size={1.2}
          color="var(--canvas-grid-color)"
        />
        <MiniMap
          pannable
          zoomable
          ariaLabel="Canvas overview map"
          style={{ width: 184, height: 128 }}
          bgColor="transparent"
          nodeColor="color-mix(in oklab, var(--accent-primary) 42%, var(--canvas-node-bg))"
          nodeStrokeColor="color-mix(in oklab, var(--accent-primary) 60%, transparent)"
          nodeBorderRadius={14}
        />
      </ReactFlow>
      {incomingNodes.length === 0 ? (
        <div className="pointer-events-none absolute inset-0 grid place-items-center">
          <p className="rounded-full border border-[var(--creator-border)] bg-[var(--canvas-controls-bg)] px-4 py-2 text-sm text-[var(--creator-text-muted)]">
            No people are visible in this view yet.
          </p>
        </div>
      ) : null}
    </div>
  );
}

// Recenter the camera when the server sends a new neighborhood; dragging a node
// changes local state only and must not retrigger the fit.
function CanvasAutoFit({ resetKey }: { resetKey: unknown }) {
  const { fitView } = useReactFlow();
  const nodesInitialized = useNodesInitialized();

  useEffect(() => {
    if (!nodesInitialized) {
      return;
    }

    const frame = window.requestAnimationFrame(() => {
      fitView({
        ...FIT_VIEW_OPTIONS,
        duration: prefersReducedMotion() ? 0 : 380,
      });
    });

    return () => window.cancelAnimationFrame(frame);
  }, [fitView, nodesInitialized, resetKey]);

  return null;
}

function CanvasShortcuts({ onSearchShortcut }: { onSearchShortcut?: () => void }) {
  const { zoomIn, zoomOut, zoomTo, fitView } = useReactFlow();

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.ctrlKey || event.metaKey || event.altKey) {
        return;
      }

      const target = event.target as HTMLElement | null;
      if (target?.closest("input, textarea, select, [contenteditable='true']")) {
        return;
      }

      const duration = prefersReducedMotion() ? 0 : 200;

      switch (event.key) {
        case "+":
        case "=":
          event.preventDefault();
          zoomIn({ duration });
          break;
        case "-":
          event.preventDefault();
          zoomOut({ duration });
          break;
        case "0":
          event.preventDefault();
          zoomTo(1, { duration });
          break;
        case "f":
        case "F":
          event.preventDefault();
          fitView({ ...FIT_VIEW_OPTIONS, duration: duration * 1.6 });
          break;
        case "/":
          if (onSearchShortcut) {
            event.preventDefault();
            onSearchShortcut();
          }
          break;
        default:
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [fitView, onSearchShortcut, zoomIn, zoomOut, zoomTo]);

  return null;
}
