import type { Metadata } from "next";

import { redeemInvitationAction } from "@/app/(client)/actions";
import {
  InvitationGate,
  type InvitationGateState,
} from "@/components/pilot/invitation-gate";
import {
  getPilotInviteContext,
  getPilotProject,
  PilotDomainError,
} from "@/lib/pilot/store";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Private invitation",
  description: "Recipient-specific access to a private family archive.",
};

export default async function InvitationPage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;
  let context: ReturnType<typeof getPilotInviteContext> | null = null;
  let state: InvitationGateState = "invalid";

  try {
    context = getPilotInviteContext(token);
    state = context.status === "issued" ? "valid" : context.status;
  } catch (error) {
    if (!(error instanceof PilotDomainError) || error.code !== "NOT_FOUND") {
      throw error;
    }
  }

  if (!context || state !== "valid") {
    return <InvitationGate state={state} />;
  }

  const project = getPilotProject(context.projectId);
  const acceptAction = redeemInvitationAction.bind(null, token);
  const purposeLabel = {
    viewer: "explore",
    client_review: "review the pending delivery for",
    owner_handoff: "accept archive stewardship of",
  }[context.purpose];

  return (
    <InvitationGate
      state="valid"
      recipientLabel={context.recipientLabel}
      projectTitle={context.projectTitle}
      practiceName={project.branding.practiceName}
      purposeLabel={purposeLabel}
      expiresLabel={formatInviteDate(context.expiresAt)}
      acceptAction={acceptAction}
    />
  );
}

function formatInviteDate(value: string) {
  return new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "UTC",
  }).format(new Date(value));
}
