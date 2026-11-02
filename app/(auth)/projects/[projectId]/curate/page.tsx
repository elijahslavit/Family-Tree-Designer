import { PilotCuratePage } from "@/components/pilot/creator-pilot-pages";
import { loadPilotProject, toWorkspaceProject } from "@/components/pilot/pilot-project-data";
import { PilotWorkspaceShell } from "@/components/pilot/pilot-workspace-shell";
import { getDemoStore } from "@/lib/data/demo-store";

export default async function CuratePage({ params }: { params: Promise<{ projectId: string }> }) {
  const project = await loadPilotProject(params);
  const focalPersonName = project.focalPersonId
    ? getDemoStore().people.find((person) => person.id === project.focalPersonId)?.fullName ?? null
    : null;
  return <PilotWorkspaceShell project={toWorkspaceProject(project)} activeSegment="curate"><PilotCuratePage project={project} focalPersonName={focalPersonName} /></PilotWorkspaceShell>;
}
