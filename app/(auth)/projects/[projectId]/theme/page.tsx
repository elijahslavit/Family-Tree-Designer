import Link from "next/link";

import { loadPilotProject, toWorkspaceProject } from "@/components/pilot/pilot-project-data";
import { PilotWorkspaceShell } from "@/components/pilot/pilot-workspace-shell";
import { PilotPageHeader } from "@/components/pilot/pilot-ui";
import { ThemeChooser } from "@/components/pilot/theme-chooser";

export default async function ThemePage({
  params,
}: {
  params: Promise<{ projectId: string }>;
}) {
  const project = await loadPilotProject(params);

  return (
    <PilotWorkspaceShell project={toWorkspaceProject(project)} activeSegment="theme">
      <PilotPageHeader
        eyebrow="Presentation"
        title="Choose how this family's archive feels"
        description="Two complete presentation worlds. Pick one with the client in the room, then bring their records in."
        actions={
          <Link
            href={`/projects/${project.id}/import`}
            style={{ color: "#ffffff" }}
            className="inline-flex items-center gap-2 rounded-lg bg-[#263a31] px-4 py-2 text-sm font-semibold text-white"
          >
            Continue to import
          </Link>
        }
      />
      <ThemeChooser
        projectRef={project.id}
        familyName={project.welcome.familyName}
        currentThemeId={project.branding.themeId}
      />
    </PilotWorkspaceShell>
  );
}
