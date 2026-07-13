import "server-only";

import { loadPilotProject } from "@/components/pilot/pilot-project-data";

export async function getSyntheticPilotProject(idOrSlug: string) {
  return loadPilotProject(Promise.resolve({ projectId: idOrSlug }));
}
