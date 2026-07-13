import { notFound } from "next/navigation";

import { ShowcaseSourceDetail } from "@/components/pilot/showcase-content";
import { getShowcaseSource } from "@/lib/showcase/pilot-showcase";
import { getSyntheticPilotProject } from "@/lib/showcase/project";

export default async function PilotPreviewSourcePage({ params }: { params: Promise<{ projectId: string; sourceId: string }> }) {
  const { projectId, sourceId } = await params;
  const project = await getSyntheticPilotProject(projectId);
  const result = getShowcaseSource(project, sourceId);
  if (!result) notFound();
  const basePath = `/projects/${project.id}/preview`;
  return <ShowcaseSourceDetail basePath={basePath} title={result.source.title} citation={`${result.source.author ?? "Unknown author"}. ${result.source.notes ?? "Source note unavailable"}`} repository="Synthetic Hart Family Archive" date="1968" previewPath={result.previewPath} transcription={result.source.notes ?? "No archive note recorded."} connectedPeople={result.connectedPeople} downloadAvailable={false} />;
}
