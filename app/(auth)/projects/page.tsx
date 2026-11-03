import { connection } from "next/server";

import { PilotPortfolioPage } from "@/components/pilot/creator-pilot-pages";
import { loadPilotWorkspace } from "@/components/pilot/pilot-project-data";

export default async function ProjectsPage() {
  // The portfolio depends on runtime mode and the live session; never freeze it
  // into a build-time prerender (which could bake in a sign-in redirect).
  await connection();
  const workspace = await loadPilotWorkspace();
  return <PilotPortfolioPage workspace={workspace} />;
}
