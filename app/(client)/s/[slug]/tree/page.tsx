import { CanvasExperience } from "@/components/canvas/canvas-experience";
import { ShowcaseEmpty } from "@/components/pilot/showcase-empty";
import { getShowcaseAccess } from "@/lib/showcase/access";
import { getShowcaseCanvas } from "@/lib/showcase/pilot-showcase";

export default async function PrivateTreePage({ params, searchParams }: { params: Promise<{ slug: string }>; searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const { slug } = await params;
  const query = await searchParams;
  const access = await getShowcaseAccess(slug);
  if (!access.authorized) return null;
  const personId = typeof query.person === "string" ? query.person : access.project.focalPersonId ?? "p03";
  const requestedDepth = typeof query.depth === "string" ? Number.parseInt(query.depth, 10) : 1;
  const depth = Number.isFinite(requestedDepth) ? Math.min(2, Math.max(1, requestedDepth)) : 1;
  const canvas = await getShowcaseCanvas(access.project, personId, depth);
  const basePath = `/s/${access.project.slug}`;

  if (!canvas) {
    return (
      <ShowcaseEmpty
        title="The family tree is not ready yet"
        description="Your archive is still being prepared. The family tree will appear here once the records are in place."
      />
    );
  }

  return (
    <CanvasExperience
      nodes={canvas.nodes}
      edges={canvas.edges}
      basePath={`${basePath}/tree`}
      profilePathBase={`${basePath}/people`}
      depth={canvas.depth}
      maxDepth={canvas.maxDepth}
      lineages={canvas.availableLineages}
      focusPerson={canvas.focusPerson}
      profileHref={`${basePath}/people/${canvas.focusPerson.id}`}
      relatedCount={canvas.relatedCount}
      presentation="showcase"
      className="h-[calc(100dvh-4.25rem)] min-h-[560px]"
    />
  );
}
