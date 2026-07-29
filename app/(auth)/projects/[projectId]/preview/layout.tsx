import type { Metadata } from "next";
import type { ReactNode } from "react";

import { ShowcaseShellRouteChrome } from "@/components/pilot/showcase-shell-route-chrome";
import { buildPilotShowcase } from "@/lib/showcase/pilot-showcase";
import { getSyntheticPilotProject } from "@/lib/showcase/project";

export const metadata: Metadata = {
  title: "Client presentation preview",
  robots: { index: false, follow: false, nocache: true },
};

export default async function PilotPreviewLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ projectId: string }>;
}) {
  const { projectId } = await params;
  const project = await getSyntheticPilotProject(projectId);

  const basePath = `/projects/${project.id}/preview`;
  const showcase = buildPilotShowcase(project, basePath);

  return (
    <ShowcaseShellRouteChrome
      brand={showcase.brand}
      basePath={basePath}
      viewerLabel="Genealogist preview"
      themeId={project.branding.themeId}
      hasStories={showcase.stories.length > 0}
    >
      {children}
    </ShowcaseShellRouteChrome>
  );
}
