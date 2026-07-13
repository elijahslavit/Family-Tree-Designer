import "server-only";

import { readPilotSessionCredential } from "@/lib/auth/pilot-access";
import {
  PilotDomainError,
  getPilotProject,
  getPilotSessionContext,
  touchPilotSession,
} from "@/lib/pilot/store";

export type ShowcaseAccessFailure =
  | "missing_session"
  | "expired_session"
  | "revoked_session"
  | "wrong_role"
  | "project_mismatch"
  | "not_ready";

export async function getShowcaseAccess(projectSlug: string) {
  const rawSessionToken = await readPilotSessionCredential();
  if (!rawSessionToken) {
    return { authorized: false as const, state: "missing_session" as const };
  }

  try {
    const context = getPilotSessionContext(rawSessionToken);
    if (context.projectSlug !== projectSlug) {
      return { authorized: false as const, state: "project_mismatch" as const };
    }
    if (context.status === "expired") {
      return { authorized: false as const, state: "expired_session" as const };
    }
    if (context.status === "revoked") {
      return { authorized: false as const, state: "revoked_session" as const };
    }
    if (context.purpose !== "viewer" && context.purpose !== "client_review") {
      return { authorized: false as const, state: "wrong_role" as const };
    }

    const project = getPilotProject(projectSlug);
    const hasApprovedPresentation = Boolean(project.publication);
    const isReviewPreview = context.purpose === "client_review";
    if (!hasApprovedPresentation && !isReviewPreview) {
      return { authorized: false as const, state: "not_ready" as const };
    }
    if (isReviewPreview) {
      const reviewerRole = project.roles.find(
        (assignment) =>
          assignment.actorId === context.actorId &&
          assignment.role === "client_reviewer" &&
          assignment.status === "active",
      );
      if (
        !reviewerRole ||
        (reviewerRole.expiresAt && new Date(reviewerRole.expiresAt) <= new Date())
      ) {
        return { authorized: false as const, state: "wrong_role" as const };
      }
    }

    const refreshed = touchPilotSession({ rawSessionToken });
    return {
      authorized: true as const,
      project,
      context: refreshed,
    };
  } catch (error) {
    if (error instanceof PilotDomainError) {
      if (error.code === "INVITE_EXPIRED") {
        return { authorized: false as const, state: "expired_session" as const };
      }
      if (error.code === "INVITE_REVOKED") {
        return { authorized: false as const, state: "revoked_session" as const };
      }
      if (error.code === "NOT_FOUND") {
        return { authorized: false as const, state: "missing_session" as const };
      }
    }
    throw error;
  }
}
