import { notFound } from "next/navigation";

import { ShowcaseStoryDetail } from "@/components/pilot/showcase-content";
import { getShowcaseStory } from "@/lib/showcase/pilot-showcase";
import { getSyntheticPilotProject } from "@/lib/showcase/project";

export default async function PilotPreviewStoryPage({ params }: { params: Promise<{ projectId: string; storyId: string }> }) {
  const { projectId, storyId } = await params;
  const project = await getSyntheticPilotProject(projectId);
  const result = getShowcaseStory(project, storyId);
  if (!result) notFound();
  const basePath = `/projects/${project.id}/preview`;
  return <ShowcaseStoryDetail basePath={basePath} story={result.card} body={[{ paragraphs: [result.story.bodyMd], pullQuote: result.story.dek }]} people={result.people} source={{ id: result.story.sourceIds[0] ?? "src01", title: "Hart Reunion Circular", detail: "Source context preserved with the synthetic narrative." }} />;
}
