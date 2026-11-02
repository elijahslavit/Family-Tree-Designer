"use client";

import { useRouter, useSearchParams } from "next/navigation";
import type { Edge, Node } from "@xyflow/react";

import { FamilyCanvas, type CanvasView } from "@/components/canvas/family-canvas";
import type { CanvasSearchPerson } from "@/components/canvas/canvas-search";

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
  searchPeople?: CanvasSearchPerson[];
  /** Enables the Tree / List toggle (kept in the URL as ?view=list). */
  enableListView?: boolean;
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
  searchPeople,
  enableListView = false,
}: CanvasRouteViewerProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const view: CanvasView = enableListView && searchParams.get("view") === "list" ? "list" : "tree";
  const share = shareToken ? `?share=${shareToken}` : "";

  return (
    <FamilyCanvas
      nodes={nodes}
      edges={edges}
      depth={depth}
      focusLabel={focusLabel}
      selectedLineageName={selectedLineageName}
      visibleCount={nodes.filter((node) => node.type === "person").length}
      searchPeople={searchPeople}
      view={view}
      onViewChange={
        enableListView
          ? (nextView) => {
              const params = new URLSearchParams(searchParams.toString());
              if (nextView === "list") params.set("view", "list");
              else params.delete("view");
              const query = params.toString();
              router.replace(query ? `${basePath}?${query}` : basePath, { scroll: false });
            }
          : undefined
      }
      profileHref={enableListView ? (personId) => `${profilePathBase}/${personId}${share}` : undefined}
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
        router.push(`${profilePathBase}/${nodeId}${share}`);
      }}
    />
  );
}
