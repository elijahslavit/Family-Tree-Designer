import { ShowcaseHome } from "@/components/pilot/showcase-home";
import { buildPilotShowcase } from "@/lib/showcase/pilot-showcase";
import { getSyntheticPilotProject } from "@/lib/showcase/project";

export default async function PilotPreviewPage({
  params,
}: {
  params: Promise<{ projectId: string }>;
}) {
  const { projectId } = await params;
  const project = await getSyntheticPilotProject(projectId);

  const basePath = `/projects/${project.id}/preview`;
  const showcase = buildPilotShowcase(project, basePath);

  return (
    <ShowcaseHome
      basePath={basePath}
      familyName={project.welcome.familyName}
      eyebrow={project.welcome.eyebrow}
      tagline={project.welcome.headline}
      introduction={project.welcome.introduction}
      heroPath={showcase.heroPath}
      curatorName={project.branding.practiceName}
      focalPerson={showcase.focalPerson}
      people={showcase.people}
      stories={showcase.stories}
      sourcePreviewPath={showcase.sourcePreviewPath}
    />
  );
}
