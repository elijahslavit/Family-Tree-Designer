import { PilotPortfolioPage } from "@/components/pilot/creator-pilot-pages";
import { loadPilotWorkspace } from "@/components/pilot/pilot-project-data";

export default async function ProjectsPage() {
  const workspace = await loadPilotWorkspace();
  return <PilotPortfolioPage workspace={workspace} />;
}
