import "server-only";

import { getSessionAccountId } from "@/lib/auth/session";
import { readPilotSessionCredential } from "@/lib/auth/pilot-access";
import {
  getPilotProject,
  getPilotSessionContext,
  PilotDomainError,
  resolvePilotActorForIdentity,
  touchPilotSession,
} from "@/lib/pilot/store";
import type { PilotActorRole, PilotInvitePurpose } from "@/lib/pilot/types";
import { isDemoMode } from "@/lib/runtime";

export type PilotAccessFailure =
  | "missing_session"
  | "expired_session"
  | "revoked_session"
  | "wrong_role"
  | "project_mismatch";

export type PilotBearerAuthorization =
  | {
      ok: true;
      rawSessionToken: string;
      context: ReturnType<typeof getPilotSessionContext>;
    }
  | { ok: false; reason: PilotAccessFailure };

export async function authorizePilotBearer(input: {
  projectRef: string;
  purposes: PilotInvitePurpose[];
}): Promise<PilotBearerAuthorization> {
  const rawSessionToken = await readPilotSessionCredential();
  if (!rawSessionToken) {
    return { ok: false, reason: "missing_session" };
  }

  try {
    const context = getPilotSessionContext(rawSessionToken);
    if (context.status === "revoked") {
      return { ok: false, reason: "revoked_session" };
    }
    if (context.status === "expired") {
      return { ok: false, reason: "expired_session" };
    }
    if (
      context.projectId !== input.projectRef &&
      context.projectSlug !== input.projectRef
    ) {
      return { ok: false, reason: "project_mismatch" };
    }
    if (!input.purposes.includes(context.purpose)) {
      return { ok: false, reason: "wrong_role" };
    }

    touchPilotSession({ rawSessionToken });
    return { ok: true, rawSessionToken, context };
  } catch (error) {
    if (error instanceof PilotDomainError) {
      if (error.code === "INVITE_REVOKED") {
        return { ok: false, reason: "revoked_session" };
      }
      if (error.code === "INVITE_EXPIRED") {
        return { ok: false, reason: "expired_session" };
      }
    }
    return { ok: false, reason: "missing_session" };
  }
}

export type PilotIdentityAuthorization =
  | { ok: true; actorId: string; identityId: string; identityLabel: string }
  | { ok: false; reason: "identity_required" | "identity_mismatch" | "not_ready" };

export async function authorizePilotIdentity(input: {
  projectRef: string;
  roles: PilotActorRole[];
}): Promise<PilotIdentityAuthorization> {
  const project = getPilotProject(input.projectRef);
  if (!project.handoff?.ownerIdentityId) {
    return { ok: false, reason: "not_ready" };
  }

  // Local demonstrations deliberately use a clearly synthetic verified owner.
  // Live handoff must use the authenticated Supabase identity instead.
  const identityId = isDemoMode()
    ? project.handoff.ownerIdentityId
    : await getSessionAccountId();

  if (!identityId) {
    return { ok: false, reason: "identity_required" };
  }

  try {
    const actorId = resolvePilotActorForIdentity(
      project.id,
      identityId,
      input.roles,
    );
    const role = project.roles.find((candidate) => candidate.actorId === actorId);
    return {
      ok: true,
      actorId,
      identityId,
      identityLabel: role?.displayName ?? "Verified archive owner",
    };
  } catch (error) {
    if (error instanceof PilotDomainError && error.code === "UNAUTHORIZED") {
      return { ok: false, reason: "identity_mismatch" };
    }
    throw error;
  }
}
