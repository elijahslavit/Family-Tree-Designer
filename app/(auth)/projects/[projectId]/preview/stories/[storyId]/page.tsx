import { ShowcaseStoryView } from "@/components/pilot/showcase-story";
import { getSyntheticPilotProject } from "@/lib/showcase/project";

export default async function PilotPreviewStoryPage({
  params,
}: {
  params: Promise<{ projectId: string; storyId: string }>;
}) {
  const { projectId, storyId } = await params;
  const project = await getSyntheticPilotProject(projectId);
  return <ShowcaseStoryView project={project} basePath={`/projects/${project.id}/preview`} storyId={storyId} />;
}
