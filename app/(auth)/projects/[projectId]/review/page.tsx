import { PilotReviewPage } from "@/components/pilot/creator-pilot-pages";
import { loadPilotProject, toWorkspaceProject } from "@/components/pilot/pilot-project-data";
import { PilotWorkspaceShell } from "@/components/pilot/pilot-workspace-shell";
import { evaluatePilotPublishGate } from "@/lib/pilot/store";

export default async function ReviewPage({ params }: { params: Promise<{ projectId: string }> }) {
  const project = await loadPilotProject(params);
  return <PilotWorkspaceShell project={toWorkspaceProject(project)} activeSegment="review"><PilotReviewPage project={project} gate={evaluatePilotPublishGate(project)} /></PilotWorkspaceShell>;
}
