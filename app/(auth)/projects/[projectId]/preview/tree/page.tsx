import { ShowcaseTreeView } from "@/components/pilot/showcase-tree";
import { getSyntheticPilotProject } from "@/lib/showcase/project";

export default async function PilotPreviewTreePage({
  params,
  searchParams,
}: {
  params: Promise<{ projectId: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const { projectId } = await params;
  const project = await getSyntheticPilotProject(projectId);
  return (
    <ShowcaseTreeView
      project={project}
      basePath={`/projects/${project.id}/preview`}
      query={await searchParams}
    />
  );
}
