import type { Metadata } from "next";
import type { ReactNode } from "react";

import { ClientAccessNotice, ClientAccessShell } from "@/components/pilot/client-access-shell";
import { ShowcaseShell } from "@/components/pilot/showcase-shell";
import { buildPilotShowcase } from "@/lib/showcase/pilot-showcase";
import { getShowcaseAccess } from "@/lib/showcase/access";

export const metadata: Metadata = {
  title: "Private family archive",
  robots: { index: false, follow: false, nocache: true },
};

export default async function PrivateShowcaseLayout({ children, params }: { children: ReactNode; params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const access = await getShowcaseAccess(slug);
  if (!access.authorized) {
    return (
      <ClientAccessShell eyebrow="Private family archive" title="Invitation required" description="Family presentations open only through recipient-specific invitations.">
        <ClientAccessNotice state={access.state} />
      </ClientAccessShell>
    );
  }
  const basePath = `/s/${access.project.slug}`;
  const showcase = buildPilotShowcase(access.project, basePath);
  return <ShowcaseShell brand={showcase.brand} basePath={basePath} viewerLabel={`Invited: ${access.context.recipientLabel}`}>{children}</ShowcaseShell>;
}
