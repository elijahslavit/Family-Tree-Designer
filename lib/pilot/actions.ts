"use server";

import { revalidatePath } from "next/cache";

import { requireAccountSession } from "@/lib/auth/session";
import {
  acceptPilotHandoff,
  cancelPilotDeletion,
  createNextPilotReviewVersion,
  dispositionPilotReviewItem,
  extendPilotSupport,
  issuePilotInvite,
  openPilotReviewVersion,
  publishPilotProject,
  recordPilotMediaQuarantine,
  requestPilotExport,
  resolvePilotActorForIdentity,
  revokePilotRecipientAccess,
  schedulePilotDeletion,
  setPilotChecklistItem,
  setPilotProjectStatus,
} from "@/lib/pilot/store";
import type {
  PilotActorRole,
  PilotChecklistKey,
  PilotInvitePurpose,
  PilotWorkflowStatus,
} from "@/lib/pilot/types";

async function authenticatedActor(projectRef: string, roles: PilotActorRole[]) {
  const identityId = await requireAccountSession();
  return resolvePilotActorForIdentity(projectRef, identityId, roles);
}

function revalidatePilot(projectRef: string) {
  revalidatePath("/projects");
  revalidatePath(`/projects/${projectRef}`);
  revalidatePath(`/projects/${projectRef}/review`);
  revalidatePath(`/projects/${projectRef}/access`);
  revalidatePath(`/projects/${projectRef}/handoff`);
  revalidatePath(`/projects/${projectRef}/preview`);
}

export async function updatePilotProjectStatusAction(input: {
  projectRef: string;
  status: PilotWorkflowStatus;
}) {
  const actorId = await authenticatedActor(input.projectRef, ["operator", "genealogist"]);
  const project = setPilotProjectStatus({ ...input, actorId });
  revalidatePilot(project.id);
  return { ok: true as const, projectId: project.id, status: project.status };
}

export async function updatePilotChecklistAction(input: {
  projectRef: string;
  key: PilotChecklistKey;
  status: "pending" | "complete" | "waived";
  evidenceReference?: string | null;
  overrideReason?: string | null;
}) {
  const actorId = await authenticatedActor(input.projectRef, ["operator", "genealogist"]);
  const project = setPilotChecklistItem({ ...input, actorId });
  revalidatePilot(project.id);
  return { ok: true as const, projectId: project.id };
}

export async function recordPilotMediaQuarantineAction(input: {
  projectRef: string;
  mediaId: string;
  outcome: "passed" | "failed";
  signaturePassed: boolean;
  malwarePassed: boolean;
  malwareScanProcedure?: string | null;
  failureReason?: string | null;
}) {
  const actorId = await authenticatedActor(input.projectRef, ["operator", "genealogist"]);
  const media = recordPilotMediaQuarantine({ ...input, actorId });
  revalidatePilot(input.projectRef);
  return { ok: true as const, mediaId: media.id, status: media.quarantineStatus };
}

export async function dispositionPilotReviewItemAction(input: {
  projectRef: string;
  reviewItemId: string;
  decision: "accepted" | "declined";
  disposition: string;
}) {
  const actorId = await authenticatedActor(input.projectRef, ["operator", "genealogist"]);
  const item = dispositionPilotReviewItem({ ...input, actorId });
  revalidatePilot(input.projectRef);
  return { ok: true as const, reviewItemId: item.id, status: item.status };
}

export async function openPilotReviewVersionAction(input: {
  projectRef: string;
  revisionId?: string;
}) {
  const actorId = await authenticatedActor(input.projectRef, ["operator", "genealogist"]);
  const result = openPilotReviewVersion({ ...input, actorId });
  revalidatePilot(input.projectRef);
  return {
    ok: true as const,
    revisionId: result.revision.id,
    reviewVersionId: result.version.id,
    contentFingerprint: result.version.contentFingerprint,
  };
}

export async function createNextPilotReviewVersionAction(input: {
  projectRef: string;
  previousReviewVersionId: string;
  contentFingerprint: string;
}) {
  const actorId = await authenticatedActor(input.projectRef, ["operator", "genealogist"]);
  const result = createNextPilotReviewVersion({ ...input, actorId });
  revalidatePilot(input.projectRef);
  return {
    ok: true as const,
    revisionId: result.revision.id,
    reviewVersionId: result.version.id,
  };
}

export async function publishPilotProjectAction(input: { projectRef: string }) {
  const actorId = await authenticatedActor(input.projectRef, ["operator", "genealogist"]);
  const publication = publishPilotProject({ ...input, actorId });
  revalidatePilot(input.projectRef);
  return {
    ok: true as const,
    revisionId: publication.revisionId,
    privatePath: publication.privatePath,
  };
}

export async function issuePilotInviteAction(input: {
  projectRef: string;
  recipientId?: string;
  recipientLabel: string;
  recipientEmail: string;
  purpose: PilotInvitePurpose;
  reviewVersionId?: string | null;
  reissuedFromInviteId?: string | null;
}) {
  const actorId = await authenticatedActor(input.projectRef, [
    "operator",
    "genealogist",
    "archive_owner",
  ]);
  const result = issuePilotInvite({ ...input, actorId });
  revalidatePilot(input.projectRef);
  // This is the only response containing the generated raw invitation token.
  return {
    ok: true as const,
    rawToken: result.rawToken,
    invite: {
      id: result.invite.id,
      recipientId: result.invite.recipientId,
      recipientLabel: result.invite.recipientLabel,
      purpose: result.invite.purpose,
      reviewVersionId: result.invite.reviewVersionId ?? null,
      reviewRound: result.invite.reviewRound ?? null,
      tokenHint: result.invite.tokenHint,
      status: result.invite.status,
      issuedAt: result.invite.issuedAt,
      expiresAt: result.invite.expiresAt,
    },
  };
}

export async function revokePilotRecipientAccessAction(input: {
  projectRef: string;
  recipientId: string;
  reason: string;
}) {
  const actorId = await authenticatedActor(input.projectRef, [
    "operator",
    "genealogist",
    "archive_owner",
  ]);
  const result = revokePilotRecipientAccess({ ...input, actorId });
  revalidatePilot(input.projectRef);
  return { ok: true as const, ...result };
}

export async function acceptPilotHandoffAction(input: { projectRef: string }) {
  const actorId = await authenticatedActor(input.projectRef, ["owner_candidate"]);
  const handoff = acceptPilotHandoff({ ...input, actorId });
  revalidatePilot(input.projectRef);
  return { ok: true as const, handoffId: handoff.id, status: handoff.status };
}

export async function extendPilotSupportAction(input: { projectRef: string }) {
  const actorId = await authenticatedActor(input.projectRef, ["archive_owner"]);
  const handoff = extendPilotSupport({ ...input, actorId });
  revalidatePilot(input.projectRef);
  return {
    ok: true as const,
    handoffId: handoff.id,
    supportExpiresAt: handoff.professionalSupportExpiresAt,
  };
}

export async function requestPilotExportAction(input: { projectRef: string }) {
  const actorId = await authenticatedActor(input.projectRef, [
    "operator",
    "genealogist",
    "archive_owner",
  ]);
  const exportRequest = requestPilotExport({ ...input, actorId });
  revalidatePilot(input.projectRef);
  return {
    ok: true as const,
    exportId: exportRequest.id,
    status: exportRequest.status,
    expiresAt: exportRequest.expiresAt,
  };
}

export async function schedulePilotDeletionAction(input: {
  projectRef: string;
  confirmation: string;
}) {
  const actorId = await authenticatedActor(input.projectRef, ["archive_owner"]);
  const deletion = schedulePilotDeletion({ ...input, actorId });
  revalidatePilot(input.projectRef);
  return {
    ok: true as const,
    deletionId: deletion.id,
    cancelUntil: deletion.cancelUntil,
    primaryDeletionDueAt: deletion.primaryDeletionDueAt,
  };
}

export async function cancelPilotDeletionAction(input: { projectRef: string }) {
  const actorId = await authenticatedActor(input.projectRef, ["archive_owner"]);
  const deletion = cancelPilotDeletion({ ...input, actorId });
  revalidatePilot(input.projectRef);
  return { ok: true as const, deletionId: deletion.id, status: deletion.status };
}
