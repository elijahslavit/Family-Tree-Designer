import type { Metadata } from "next";
import type { ReactNode } from "react";

import { ReplayRevealButton } from "@/components/pilot/showcase-reveal";
import { ShowcaseShell } from "@/components/pilot/showcase-shell";
import { revealKeyFor } from "@/lib/showcase/reveal";
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
    <div>
      <aside aria-label="Professional preview" className="flex flex-col gap-2 border-b border-amber-300 bg-amber-50 px-4 py-2 text-xs text-amber-950 sm:flex-row sm:items-center sm:justify-center">
        <strong>Authorized professional preview</strong>
        <span>Exactly what invited clients see, with the same privacy rules. Synthetic data only.</span>
        <ReplayRevealButton revealKey={revealKeyFor(basePath)} homePath={basePath} />
      </aside>
      <ShowcaseShell
        brand={showcase.brand}
        basePath={basePath}
        viewerLabel="Genealogist preview"
      >
        {children}
      </ShowcaseShell>
    </div>
  );
}
