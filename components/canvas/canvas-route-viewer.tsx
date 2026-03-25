"use client";

import { useRouter, useSearchParams } from "next/navigation";
import type { Edge, Node } from "@xyflow/react";

import { FamilyCanvas } from "@/components/canvas/family-canvas";

type CanvasRouteViewerProps = {
  nodes: Node[];
  edges: Edge[];
  basePath: string;
  shareToken?: string | null;
  depth: number;
  selectedLineageId?: string | null;
  selectedLineageName?: string | null;
  profilePathBase: string;
  focusLabel: string;
};

export function CanvasRouteViewer({
  nodes,
  edges,
  basePath,
  shareToken,
  depth,
  selectedLineageId,
  selectedLineageName,
  profilePathBase,
  focusLabel,
}: CanvasRouteViewerProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  return (
    <FamilyCanvas
      nodes={nodes}
      edges={edges}
      depth={depth}
      focusLabel={focusLabel}
      selectedLineageName={selectedLineageName}
      visibleCount={nodes.length}
      onNodeSelect={(nodeId) => {
        const params = new URLSearchParams(searchParams.toString());
        params.set("person", nodeId);

        if (depth > 1) {
          params.set("depth", String(depth));
        } else {
          params.delete("depth");
        }

        if (selectedLineageId) {
          params.set("lineage", selectedLineageId);
        } else {
          params.delete("lineage");
        }

        if (shareToken) {
          params.set("share", shareToken);
        }

        router.push(`${basePath}?${params.toString()}`);
      }}
      onNodeOpen={(nodeId) => {
        const share = shareToken ? `?share=${shareToken}` : "";
        router.push(`${profilePathBase}/${nodeId}${share}`);
      }}
    />
  );
}
