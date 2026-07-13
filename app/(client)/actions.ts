"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";

import {
  authorizePilotBearer,
  authorizePilotIdentity,
} from "@/lib/auth/pilot-authorization";
import { setPilotSessionCookie } from "@/lib/auth/pilot-access";
import {
  acceptPilotHandoff,
  cancelPilotDeletion,
  extendPilotSupport,
  issuePilotInvite,
  PilotDomainError,
  redeemPilotInvite,
  requestPilotExport,
  revokePilotRecipientAccess,
  schedulePilotDeletion,
  submitPilotReview,
} from "@/lib/pilot/store";
import { getAppUrl } from "@/lib/runtime";
import type { InviteIssueState } from "@/components/pilot/owner-access-controls";

const reviewItemsSchema = z
  .array(
    z.object({
      subjectType: z.enum(["welcome", "person", "story", "media", "source", "tree"]),
      subjectLabel: z.string().trim().min(1).max(160),
      request: z.string().trim().min(3).max(2_000),
    }),
  )
  .min(1)
  .max(50);

export async function redeemInvitationAction(
  rawToken: string,
  formData: FormData,
) {
  void formData;
  const result = redeemPilotInvite({ rawToken });
  await setPilotSessionCookie(
    result.rawSessionToken,
    result.session.absoluteExpiresAt,
  );

  if (result.purpose === "client_review") {
    redirect(`/review/${result.projectSlug}`);
  }
  if (result.purpose === "owner_handoff") {
    redirect(`/handoff/${result.projectSlug}`);
  }
  redirect(`/s/${result.projectSlug}`);
}

export async function submitClientReviewAction(
  projectSlug: string,
  formData: FormData,
) {
  const authorization = await authorizePilotBearer({
    projectRef: projectSlug,
    purposes: ["client_review"],
  });
  if (
    !authorization.ok ||
    !authorization.context.actorId ||
    !authorization.context.reviewVersionId ||
    !authorization.context.reviewRound
  ) {
    throw new PilotDomainError("UNAUTHORIZED", "Client review access is not valid.");
  }

  const items = reviewItemsSchema.parse(
    JSON.parse(String(formData.get("itemsJson") ?? "[]")),
  );
  submitPilotReview({
    projectRef: projectSlug,
    actorId: authorization.context.actorId,
    reviewVersionId: authorization.context.reviewVersionId,
    approved: false,
    items: items.map((item) => ({
      subjectType: item.subjectType,
      subjectId: item.subjectLabel,
      request: item.request,
    })),
  });
  revalidatePath(`/review/${projectSlug}`);
}

export async function approveClientReviewAction(
  projectSlug: string,
  formData: FormData,
) {
  void formData;
  const authorization = await authorizePilotBearer({
    projectRef: projectSlug,
    purposes: ["client_review"],
  });
  if (
    !authorization.ok ||
    !authorization.context.actorId ||
    !authorization.context.reviewVersionId ||
    authorization.context.reviewRound !== 2
  ) {
    throw new PilotDomainError("UNAUTHORIZED", "Client approval access is not valid.");
  }

  submitPilotReview({
    projectRef: projectSlug,
    actorId: authorization.context.actorId,
    reviewVersionId: authorization.context.reviewVersionId,
    approved: true,
  });
  revalidatePath(`/review/${projectSlug}`);
}

export async function acceptOwnerHandoffAction(
  projectSlug: string,
  formData: FormData,
) {
  void formData;
  const [bearer, identity] = await Promise.all([
    authorizePilotBearer({
      projectRef: projectSlug,
      purposes: ["owner_handoff"],
    }),
    authorizePilotIdentity({
      projectRef: projectSlug,
      roles: ["owner_candidate", "archive_owner"],
    }),
  ]);

  if (!bearer.ok || !bearer.context.actorId || !identity.ok) {
    throw new PilotDomainError("UNAUTHORIZED", "Verified owner handoff access is required.");
  }
  if (bearer.context.actorId !== identity.actorId) {
    throw new PilotDomainError(
      "UNAUTHORIZED",
      "The verified identity does not match the designated archive owner.",
    );
  }

  acceptPilotHandoff({ projectRef: projectSlug, actorId: identity.actorId });
  revalidatePath(`/handoff/${projectSlug}`);
  redirect(`/archive/${bearer.context.projectId}`);
}

export async function issueOwnerViewerInviteAction(
  projectId: string,
  _state: InviteIssueState,
  formData: FormData,
): Promise<InviteIssueState> {
  try {
    const identity = await authorizePilotIdentity({
      projectRef: projectId,
      roles: ["archive_owner"],
    });
    if (!identity.ok) {
      return { status: "error", message: "Archive-owner access is required." };
    }

    const input = z
      .object({
        recipientLabel: z.string().trim().min(2).max(80),
        recipientEmail: z.email(),
        purpose: z.literal("viewer"),
      })
      .parse({
        recipientLabel: formData.get("recipientLabel"),
        recipientEmail: formData.get("recipientEmail"),
        purpose: formData.get("purpose"),
      });
    const result = issuePilotInvite({
      projectRef: projectId,
      actorId: identity.actorId,
      ...input,
    });
    revalidatePath(`/archive/${projectId}`);
    return {
      status: "success",
      message: "Invitation created.",
      rawInvitationUrl: `${getAppUrl()}/invite/${result.rawToken}`,
      expiresLabel: formatActionDate(result.invite.expiresAt),
    };
  } catch (error) {
    return {
      status: "error",
      message:
        error instanceof Error
          ? error.message
          : "The invitation could not be created.",
    };
  }
}

export async function revokeOwnerRecipientAction(
  projectId: string,
  formData: FormData,
) {
  const identity = await requireArchiveOwner(projectId);
  const recipientId = z.string().trim().min(1).max(160).parse(formData.get("recipientId"));
  const reason = z.string().trim().min(8).max(500).parse(formData.get("reason"));
  revokePilotRecipientAccess({
    projectRef: projectId,
    actorId: identity.actorId,
    recipientId,
    reason,
  });
  revalidatePath(`/archive/${projectId}`);
}

export async function requestOwnerExportAction(
  projectId: string,
  formData: FormData,
) {
  void formData;
  const identity = await requireArchiveOwner(projectId);
  requestPilotExport({ projectRef: projectId, actorId: identity.actorId });
  revalidatePath(`/archive/${projectId}`);
}

export async function scheduleOwnerDeletionAction(
  projectId: string,
  formData: FormData,
) {
  const identity = await requireArchiveOwner(projectId);
  const confirmation = z.string().max(500).parse(formData.get("confirmation"));
  schedulePilotDeletion({
    projectRef: projectId,
    actorId: identity.actorId,
    confirmation,
  });
  revalidatePath(`/archive/${projectId}`);
}

export async function cancelOwnerDeletionAction(
  projectId: string,
  formData: FormData,
) {
  void formData;
  const identity = await requireArchiveOwner(projectId);
  cancelPilotDeletion({ projectRef: projectId, actorId: identity.actorId });
  revalidatePath(`/archive/${projectId}`);
}

export async function extendOwnerSupportAction(
  projectId: string,
  formData: FormData,
) {
  void formData;
  const identity = await requireArchiveOwner(projectId);
  extendPilotSupport({ projectRef: projectId, actorId: identity.actorId });
  revalidatePath(`/archive/${projectId}`);
}

async function requireArchiveOwner(projectId: string) {
  const identity = await authorizePilotIdentity({
    projectRef: projectId,
    roles: ["archive_owner"],
  });
  if (!identity.ok) {
    throw new PilotDomainError("UNAUTHORIZED", "Archive-owner access is required.");
  }
  return identity;
}

function formatActionDate(value: string) {
  return new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "UTC",
  }).format(new Date(value));
}
