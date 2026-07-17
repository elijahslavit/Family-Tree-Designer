"use client";

import { Panel, useReactFlow, useViewport } from "@xyflow/react";
import { Maximize, Minus, Plus } from "lucide-react";

const FIT_VIEW_OPTIONS = { padding: 0.15, duration: 320 };

export function CanvasToolbar() {
  const { zoomIn, zoomOut, zoomTo, fitView } = useReactFlow();
  const { zoom } = useViewport();

  return (
    <Panel position="bottom-left" className="!m-4">
      <div
        className="flex items-center gap-0.5 rounded-xl border border-[var(--creator-border)] p-1 shadow-[var(--shadow-md)] backdrop-blur-md"
        style={{ background: "var(--canvas-controls-bg)" }}
      >
        <button
          type="button"
          aria-label="Zoom out"
          className="grid h-8 w-8 place-items-center rounded-lg text-[var(--creator-text-muted)] transition-colors hover:bg-[var(--creator-surface-muted)] hover:text-[var(--creator-text)]"
          onClick={() => zoomOut({ duration: 180 })}
        >
          <Minus className="h-4 w-4" />
        </button>
        <button
          type="button"
          aria-label="Reset zoom to 100%"
          title="Reset zoom"
          className="h-8 min-w-[3.25rem] rounded-lg px-1.5 text-center text-xs font-semibold tabular-nums text-[var(--creator-text-muted)] transition-colors hover:bg-[var(--creator-surface-muted)] hover:text-[var(--creator-text)]"
          onClick={() => zoomTo(1, { duration: 220 })}
        >
          {Math.round(zoom * 100)}%
        </button>
        <button
          type="button"
          aria-label="Zoom in"
          className="grid h-8 w-8 place-items-center rounded-lg text-[var(--creator-text-muted)] transition-colors hover:bg-[var(--creator-surface-muted)] hover:text-[var(--creator-text)]"
          onClick={() => zoomIn({ duration: 180 })}
        >
          <Plus className="h-4 w-4" />
        </button>
        <span aria-hidden="true" className="mx-0.5 h-5 w-px bg-[var(--creator-border)]" />
        <button
          type="button"
          aria-label="Fit view"
          title="Fit view (F)"
          className="grid h-8 w-8 place-items-center rounded-lg text-[var(--creator-text-muted)] transition-colors hover:bg-[var(--creator-surface-muted)] hover:text-[var(--creator-text)]"
          onClick={() => fitView(FIT_VIEW_OPTIONS)}
        >
          <Maximize className="h-4 w-4" />
        </button>
      </div>
    </Panel>
  );
}
