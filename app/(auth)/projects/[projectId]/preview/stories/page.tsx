import { ShowcaseStoriesIndex } from "@/components/pilot/showcase-content";
import { buildPilotShowcase } from "@/lib/showcase/pilot-showcase";
import { getSyntheticPilotProject } from "@/lib/showcase/project";

export default async function PilotPreviewStoriesPage({ params }: { params: Promise<{ projectId: string }> }) {
  const { projectId } = await params;
  const project = await getSyntheticPilotProject(projectId);
  const basePath = `/projects/${project.id}/preview`;
  const showcase = buildPilotShowcase(project, basePath);
  return <ShowcaseStoriesIndex basePath={basePath} stories={showcase.stories} />;
}
