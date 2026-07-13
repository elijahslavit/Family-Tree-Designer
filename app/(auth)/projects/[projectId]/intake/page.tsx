import { PilotIntakePage } from "@/components/pilot/creator-pilot-pages";
import { loadPilotProject, toWorkspaceProject } from "@/components/pilot/pilot-project-data";
import { PilotWorkspaceShell } from "@/components/pilot/pilot-workspace-shell";

export default async function IntakePage({ params }: { params: Promise<{ projectId: string }> }) {
  const project = await loadPilotProject(params);
  return <PilotWorkspaceShell project={toWorkspaceProject(project)} activeSegment="intake"><PilotIntakePage project={project} /></PilotWorkspaceShell>;
}
