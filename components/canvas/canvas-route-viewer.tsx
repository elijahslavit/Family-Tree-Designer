"use client";

import { useRouter, useSearchParams } from "next/navigation";
import type { Edge, Node } from "@xyflow/react";

import { FamilyCanvas } from "@/components/canvas/family-canvas";

type CanvasRouteViewerProps = {
  nodes: Node[];
  edges: Edge[];
  basePath: string;
  shareToken?: string | null;
};

export function CanvasRouteViewer({
  nodes,
  edges,
  basePath,
  shareToken,
}: CanvasRouteViewerProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  return (
    <FamilyCanvas
      nodes={nodes}
      edges={edges}
      onNodeSelect={(nodeId) => {
        const params = new URLSearchParams(searchParams.toString());
        params.set("person", nodeId);

        if (shareToken) {
          params.set("share", shareToken);
        }

        router.push(`${basePath}?${params.toString()}`);
      }}
    />
  );
}
