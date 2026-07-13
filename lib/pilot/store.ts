import { createHash, randomBytes, randomUUID } from "node:crypto";

import { z } from "zod";

import { createPilotDemoWorkspace } from "@/lib/pilot/demo";
import { isDemoMode } from "@/lib/runtime";
import {
  PILOT_WORKFLOW,
  PILOT_WORKFLOW_LABELS,
  type PilotActorRole,
  type PilotAuditEvent,
  type PilotAuditEventType,
  type PilotChecklistKey,
  type PilotInvitePurpose,
  type PilotInviteRecord,
  type PilotProject,
  type PilotPublishGateResult,
  type PilotReviewItem,
  type PilotSessionRecord,
  type PilotWorkflowStatus,
  type PilotWorkspace,
} from "@/lib/pilot/types";

declare global {
  var __familyTreePilotWorkspace: PilotWorkspace | undefined;
}

export type PilotDomainErrorCode =
  | "NOT_FOUND"
  | "NOT_READY"
  | "UNAUTHORIZED"
  | "INVALID_STATE"
  | "VALIDATION"
  | "PUBLISH_BLOCKED"
  | "INVITE_EXPIRED"
  | "INVITE_REVOKED"
  | "INVITE_USED";

export class PilotDomainError extends Error {
  constructor(
    public readonly code: PilotDomainErrorCode,
    message: string,
    public readonly details?: Record<string, unknown>,
  ) {
    super(message);
    this.name = "PilotDomainError";
  }
}

const idSchema = z.string().trim().min(1).max(160);
const isoDateSchema = z.string().datetime({ offset: true });

const mutationBaseSchema = z.object({
  projectRef: idSchema,
  actorId: idSchema,
  now: isoDateSchema.optional(),
});

const workflowStatusSchema = z.enum(PILOT_WORKFLOW);

const checklistKeySchema = z.enum([
  "legal_review",
  "rights_attestation",
  "living_person_consent",
  "focal_branch",
  "welcome_page",
  "featured_stories",
  "import_review_acknowledged",
  "media_safety",
  "professional_preview",
  "client_approval",
]);

function requireDemoPilotStore() {
  if (!isDemoMode()) {
    throw new PilotDomainError(
      "NOT_READY",
      "The process-global synthetic pilot store is disabled outside demo mode. Configure persistent pilot storage before serving real project data.",
    );
  }
}

function mutableWorkspace() {
  requireDemoPilotStore();
  if (!globalThis.__familyTreePilotWorkspace) {
    globalThis.__familyTreePilotWorkspace = prepareWorkspace(createPilotDemoWorkspace());
  }

  return prepareWorkspace(globalThis.__familyTreePilotWorkspace);
}

function prepareWorkspace(workspace: PilotWorkspace) {
  // Backfill the synthetic seed generated before review capabilities were
  // explicit. Persisted production records must be migrated, never rebound at
  // request time, so every credential is stable for its entire lifetime.
  for (const project of workspace.projects) {
    for (const version of project.reviewVersions) {
      const revision = project.revisions.find(
        (candidate) => candidate.id === version.revisionId,
      );
      if (revision && !revision.contentSnapshotHash) {
        revision.contentSnapshotHash = version.contentFingerprint;
        revision.contentSnapshotVersion = "pilot-review-v1";
      }
    }
    for (const invite of project.invites) {
      if (invite.purpose !== "client_review" || invite.reviewVersionId) continue;
      const version = [...project.reviewVersions].sort(
        (left, right) =>
          right.round - left.round ||
          new Date(right.openedAt).getTime() - new Date(left.openedAt).getTime(),
      )[0];
      if (version) {
        invite.reviewVersionId = version.id;
        invite.reviewRound = version.round;
      }
    }
    for (const session of project.sessions) {
      const invite = project.invites.find((candidate) => candidate.id === session.inviteId);
      if (session.reviewVersionId === undefined) {
        session.reviewVersionId = invite?.reviewVersionId ?? null;
      }
      if (session.reviewRound === undefined) {
        session.reviewRound = invite?.reviewRound ?? null;
      }
    }
  }
  return workspace;
}

function snapshot<T>(value: T): T {
  return structuredClone(value);
}

function nowIso(input?: string) {
  return input ?? new Date().toISOString();
}

function addDuration(iso: string, input: { days?: number; minutes?: number }) {
  const date = new Date(iso);
  date.setUTCDate(date.getUTCDate() + (input.days ?? 0));
  date.setUTCMinutes(date.getUTCMinutes() + (input.minutes ?? 0));
  return date.toISOString();
}

function findMutableProject(projectRef: string) {
  const project = mutableWorkspace().projects.find(
    (candidate) => candidate.id === projectRef || candidate.slug === projectRef,
  );

  if (!project) {
    throw new PilotDomainError("NOT_FOUND", "Pilot project not found.");
  }

  return project;
}

function requireActor(
  project: PilotProject,
  actorId: string,
  allowedRoles: PilotActorRole[],
  options: { allowPending?: boolean; now?: string } = {},
) {
  const at = new Date(nowIso(options.now));
  const assignment = project.roles.find(
    (candidate) =>
      candidate.actorId === actorId &&
      (candidate.status === "active" ||
        (options.allowPending && candidate.status === "pending")) &&
      (!candidate.expiresAt || new Date(candidate.expiresAt) > at),
  );

  if (!assignment || !allowedRoles.includes(assignment.role)) {
    throw new PilotDomainError(
      "UNAUTHORIZED",
      "This identity is not permitted to perform that project action.",
    );
  }

  return assignment;
}

function isArchiveOffline(project: PilotProject) {
  return (
    project.deletion?.status === "scheduled" ||
    project.deletion?.status === "processing" ||
    project.deletion?.status === "complete"
  );
}

function requireArchiveOnline(project: PilotProject) {
  if (isArchiveOffline(project)) {
    throw new PilotDomainError(
      "INVALID_STATE",
      "This archive is offline while deletion is pending or complete.",
    );
  }
}

function requireRoutineArchiveAuthority(
  project: PilotProject,
  actor: ReturnType<typeof requireActor>,
) {
  if (
    project.handoff?.status === "accepted" &&
    (actor.role !== "archive_owner" || actor.actorId !== project.handoff.ownerActorId)
  ) {
    throw new PilotDomainError(
      "UNAUTHORIZED",
      "After handoff, routine archive operations require the designated archive owner.",
    );
  }
}

function canonicalReviewSnapshot(project: PilotProject) {
  const byId = <T extends { id: string }>(items: T[]) =>
    [...items].sort((left, right) => left.id.localeCompare(right.id));

  return {
    version: "pilot-review-v1",
    project: {
      id: project.id,
      slug: project.slug,
      title: project.title,
      focalPersonId: project.focalPersonId ?? null,
    },
    branding: project.branding,
    welcome: project.welcome,
    stories: byId(project.stories),
    media: byId(project.media).map((media) => ({
      id: media.id,
      kind: media.kind,
      caption: media.caption,
      altText: media.altText ?? null,
      decorative: media.decorative,
      provenance: media.provenance,
      rightsBasis: media.rightsBasis,
      consentStatus: media.consentStatus,
      visibility: media.visibility,
      linkedPersonIds: [...media.linkedPersonIds].sort(),
      sourceIds: [...media.sourceIds].sort(),
      featured: media.featured,
      derivativePath: media.derivativePath ?? null,
      inertPreviewPath: media.inertPreviewPath ?? null,
      quarantineStatus: media.quarantineStatus,
      signatureStatus: media.signatureStatus,
      malwareScanStatus: media.malwareScanStatus,
    })),
    consents: byId(project.consents),
  };
}

function reviewSnapshotHash(project: PilotProject) {
  return createHash("sha256")
    .update(JSON.stringify(canonicalReviewSnapshot(project)), "utf8")
    .digest("hex");
}

function appendAudit(
  project: PilotProject,
  input: {
    actorId: string;
    type: PilotAuditEventType;
    occurredAt: string;
    summary: string;
    metadata?: PilotAuditEvent["metadata"];
  },
) {
  project.audit.push({
    id: randomUUID(),
    projectId: project.id,
    actorId: input.actorId,
    type: input.type,
    occurredAt: input.occurredAt,
    summary: input.summary,
    metadata: input.metadata ?? {},
  });
  project.updatedAt = input.occurredAt;
}

function syncWorkflow(project: PilotProject, status: PilotWorkflowStatus, at: string) {
  const activeIndex = PILOT_WORKFLOW.indexOf(status);
  project.status = status;
  project.workflow = PILOT_WORKFLOW.map((step, index) => ({
    status: step,
    label: PILOT_WORKFLOW_LABELS[step],
    state: index < activeIndex ? "complete" : index === activeIndex ? "current" : "up_next",
    completedAt: index < activeIndex ? at : null,
  }));
}

function hashToken(rawToken: string) {
  const pepper = process.env.INVITE_TOKEN_PEPPER;
  const value = pepper ? `${pepper}:${rawToken}` : rawToken;
  return createHash("sha256").update(value, "utf8").digest("hex");
}

function safeInvite(invite: PilotInviteRecord) {
  return snapshot(invite);
}

export function getPilotWorkspace() {
  return snapshot(mutableWorkspace());
}

export function getPilotProject(projectRef: string) {
  return snapshot(findMutableProject(idSchema.parse(projectRef)));
}

export function getPilotProjectSnapshot(projectRef: string) {
  return getPilotProject(projectRef);
}

export function getPilotReviewSnapshotHash(projectRef: string) {
  return reviewSnapshotHash(findMutableProject(idSchema.parse(projectRef)));
}

export function resetPilotWorkspace() {
  requireDemoPilotStore();
  globalThis.__familyTreePilotWorkspace = prepareWorkspace(createPilotDemoWorkspace());
  return getPilotWorkspace();
}

export function resolvePilotActorForIdentity(
  projectRef: string,
  identityId: string,
  allowedRoles?: PilotActorRole[],
  now?: string,
) {
  const project = findMutableProject(idSchema.parse(projectRef));
  const at = new Date(nowIso(now ? isoDateSchema.parse(now) : undefined));
  const assignment = project.roles.find(
    (candidate) =>
      candidate.identityId === identityId &&
      (candidate.status === "active" || candidate.status === "pending") &&
      (!candidate.expiresAt || new Date(candidate.expiresAt) > at) &&
      (!allowedRoles || allowedRoles.includes(candidate.role)),
  );

  if (!assignment) {
    throw new PilotDomainError(
      "UNAUTHORIZED",
      "The authenticated identity has no matching project role.",
    );
  }

  return assignment.actorId;
}

export function setPilotProjectStatus(input: {
  projectRef: string;
  actorId: string;
  status: PilotWorkflowStatus;
  now?: string;
}) {
  const data = mutationBaseSchema
    .extend({ status: workflowStatusSchema })
    .parse(input);
  const project = findMutableProject(data.projectRef);
  requireActor(project, data.actorId, ["operator", "genealogist"], { now: data.now });
  requireArchiveOnline(project);

  if (project.status === data.status) {
    return snapshot(project);
  }

  const fromIndex = PILOT_WORKFLOW.indexOf(project.status);
  const toIndex = PILOT_WORKFLOW.indexOf(data.status);

  if (Math.abs(toIndex - fromIndex) > 1) {
    throw new PilotDomainError(
      "INVALID_STATE",
      "Workflow changes must move one stage at a time.",
      { from: project.status, to: data.status },
    );
  }

  const at = nowIso(data.now);
  const previousStatus = project.status;
  syncWorkflow(project, data.status, at);
  appendAudit(project, {
    actorId: data.actorId,
    type: "project_status_changed",
    occurredAt: at,
    summary: `Project moved from ${PILOT_WORKFLOW_LABELS[previousStatus]} to ${PILOT_WORKFLOW_LABELS[data.status]}.`,
    metadata: { from: previousStatus, to: data.status },
  });
  return snapshot(project);
}

export function setPilotChecklistItem(input: {
  projectRef: string;
  actorId: string;
  key: PilotChecklistKey;
  status: "pending" | "complete" | "waived";
  evidenceReference?: string | null;
  overrideReason?: string | null;
  now?: string;
}) {
  const data = mutationBaseSchema
    .extend({
      key: checklistKeySchema,
      status: z.enum(["pending", "complete", "waived"]),
      evidenceReference: z.string().trim().max(500).nullable().optional(),
      overrideReason: z.string().trim().min(12).max(500).nullable().optional(),
    })
    .parse(input);
  const project = findMutableProject(data.projectRef);
  const actor = requireActor(project, data.actorId, ["operator", "genealogist"], {
    now: data.now,
  });
  const item = project.checklist.find((candidate) => candidate.key === data.key);

  if (!item) {
    throw new PilotDomainError("NOT_FOUND", "Checklist item not found.");
  }

  if (data.key === "client_approval") {
    throw new PilotDomainError(
      "INVALID_STATE",
      "Client approval can only be recorded by approving a frozen review version.",
    );
  }

  if (data.status === "waived") {
    if (data.key !== "featured_stories" || actor.role !== "operator") {
      throw new PilotDomainError(
        "UNAUTHORIZED",
        "Only an operator may record the documented story-light override.",
      );
    }
    if (!data.overrideReason) {
      throw new PilotDomainError("VALIDATION", "A waiver requires an override reason.");
    }
  }

  if (
    data.key === "featured_stories" &&
    data.status === "complete" &&
    project.stories.filter((story) => story.featured && story.status !== "draft").length <
      project.scope.minFeaturedStories
  ) {
    throw new PilotDomainError(
      "VALIDATION",
      `At least ${project.scope.minFeaturedStories} featured stories are required.`,
    );
  }

  const at = nowIso(data.now);
  item.status = data.status;
  item.completedAt = data.status === "pending" ? null : at;
  item.completedByActorId = data.status === "pending" ? null : data.actorId;
  item.evidenceReference = data.status === "pending" ? null : data.evidenceReference ?? null;
  item.overrideReason = data.status === "waived" ? data.overrideReason ?? null : null;

  if (data.key === "legal_review") {
    project.legalReviewCompletedAt = data.status === "complete" ? at : null;
  }

  appendAudit(project, {
    actorId: data.actorId,
    type: "checklist_updated",
    occurredAt: at,
    summary: `${item.label} marked ${data.status}.`,
    metadata: { checklistKey: data.key, status: data.status },
  });
  return snapshot(project);
}

export function recordPilotMediaQuarantine(input: {
  projectRef: string;
  actorId: string;
  mediaId: string;
  outcome: "passed" | "failed";
  signaturePassed: boolean;
  malwarePassed: boolean;
  malwareScanProcedure?: string | null;
  failureReason?: string | null;
  now?: string;
}) {
  const data = mutationBaseSchema
    .extend({
      mediaId: idSchema,
      outcome: z.enum(["passed", "failed"]),
      signaturePassed: z.boolean(),
      malwarePassed: z.boolean(),
      malwareScanProcedure: z.string().trim().min(3).max(240).nullable().optional(),
      failureReason: z.string().trim().min(8).max(500).nullable().optional(),
    })
    .parse(input);
  const project = findMutableProject(data.projectRef);
  requireActor(project, data.actorId, ["operator", "genealogist"], { now: data.now });
  const media = project.media.find((candidate) => candidate.id === data.mediaId);

  if (!media) {
    throw new PilotDomainError("NOT_FOUND", "Media asset not found.");
  }

  if (data.outcome === "passed") {
    if (!data.signaturePassed || !data.malwarePassed || !data.malwareScanProcedure) {
      throw new PilotDomainError(
        "VALIDATION",
        "A media pass requires signature validation and a named malware scan procedure.",
      );
    }
    if (!media.decorative && !media.altText?.trim()) {
      throw new PilotDomainError(
        "VALIDATION",
        "Meaningful alt text or an explicit decorative designation is required.",
      );
    }
  } else if (!data.failureReason) {
    throw new PilotDomainError("VALIDATION", "A failed quarantine check requires a reason.");
  }

  const at = nowIso(data.now);
  media.signatureStatus = data.signaturePassed ? "passed" : "failed";
  media.malwareScanStatus = data.malwarePassed ? "passed" : "failed";
  media.quarantineStatus = data.outcome;
  media.malwareScanProcedure = data.malwareScanProcedure ?? null;
  media.quarantineCheckedAt = at;
  media.quarantineCheckedByActorId = data.actorId;
  media.quarantineFailureReason = data.outcome === "failed" ? data.failureReason ?? null : null;

  if (data.outcome === "failed") {
    media.derivativePath = null;
    media.inertPreviewPath = null;
    media.featured = false;
    media.visibility = "private";
  }

  appendAudit(project, {
    actorId: data.actorId,
    type:
      data.outcome === "passed"
        ? "media_quarantine_passed"
        : "media_quarantine_failed",
    occurredAt: at,
    summary: `${media.fileName} ${data.outcome} quarantine review.`,
    metadata: { mediaId: media.id, outcome: data.outcome },
  });
  return snapshot(media);
}

const reviewRequestItemSchema = z.object({
  subjectType: z.enum(["welcome", "person", "story", "media", "source", "tree"]),
  subjectId: idSchema,
  fieldPath: z.string().trim().max(240).nullable().optional(),
  request: z.string().trim().min(3).max(2_000),
});

export function openPilotReviewVersion(input: {
  projectRef: string;
  actorId: string;
  revisionId?: string;
  now?: string;
}) {
  const data = mutationBaseSchema
    .extend({ revisionId: idSchema.optional() })
    .parse(input);
  const project = findMutableProject(data.projectRef);
  requireActor(project, data.actorId, ["operator", "genealogist"], { now: data.now });
  requireArchiveOnline(project);

  if (
    project.status !== "professional_preview" &&
    project.status !== "client_review_round_1"
  ) {
    throw new PilotDomainError(
      "INVALID_STATE",
      "Round-one review can only open after professional preview.",
    );
  }
  if (project.reviewVersions.some((candidate) => candidate.round === 1)) {
    throw new PilotDomainError("INVALID_STATE", "Round-one review already exists.");
  }

  const revision = data.revisionId
    ? project.revisions.find((candidate) => candidate.id === data.revisionId)
    : [...project.revisions]
        .sort((left, right) => right.sequence - left.sequence)
        .find((candidate) => candidate.status === "draft");
  if (!revision) {
    throw new PilotDomainError("NOT_FOUND", "A draft revision is required to open review.");
  }
  if (revision.status !== "draft") {
    throw new PilotDomainError("INVALID_STATE", "Only a draft revision can open review.");
  }

  const at = nowIso(data.now);
  const contentSnapshotHash = reviewSnapshotHash(project);
  revision.status = "in_review";
  revision.contentSnapshotHash = contentSnapshotHash;
  revision.contentSnapshotVersion = "pilot-review-v1";
  const version = {
    id: randomUUID(),
    projectId: project.id,
    revisionId: revision.id,
    round: 1 as const,
    label: "Client review · Round 1",
    status: "open" as const,
    contentFingerprint: contentSnapshotHash,
    createdAt: at,
    openedAt: at,
    frozenAt: null,
    submittedAt: null,
    approvedAt: null,
    submittedByActorId: null,
  };
  project.reviewVersions.push(version);
  syncWorkflow(project, "client_review_round_1", at);
  appendAudit(project, {
    actorId: data.actorId,
    type: "review_version_created",
    occurredAt: at,
    summary: "The first client review opened against an immutable presentation snapshot.",
    metadata: {
      reviewVersionId: version.id,
      revisionId: revision.id,
      round: version.round,
      contentSnapshotHash,
    },
  });
  return snapshot({ revision, version });
}

export function submitPilotReview(input: {
  projectRef: string;
  actorId: string;
  reviewVersionId: string;
  approved: boolean;
  items?: Array<z.input<typeof reviewRequestItemSchema>>;
  now?: string;
}) {
  const data = mutationBaseSchema
    .extend({
      reviewVersionId: idSchema,
      approved: z.boolean(),
      items: z.array(reviewRequestItemSchema).max(50).optional(),
    })
    .superRefine((value, context) => {
      if (value.approved && value.items?.length) {
        context.addIssue({
          code: "custom",
          path: ["items"],
          message: "An approval cannot include unresolved correction requests.",
        });
      }
      if (!value.approved && !value.items?.length) {
        context.addIssue({
          code: "custom",
          path: ["items"],
          message: "A consolidated correction submission requires at least one request.",
        });
      }
    })
    .parse(input);
  const project = findMutableProject(data.projectRef);
  requireActor(project, data.actorId, ["client_reviewer"], { now: data.now });
  requireArchiveOnline(project);
  const version = project.reviewVersions.find(
    (candidate) => candidate.id === data.reviewVersionId,
  );

  if (!version) {
    throw new PilotDomainError("NOT_FOUND", "Review version not found.");
  }
  const isOpenSubmission = version.status === "open" && !version.frozenAt;
  const isResolvedFinalApproval =
    data.approved &&
    version.round === 2 &&
    version.status === "resolved" &&
    Boolean(version.frozenAt);
  const isDirectFinalApproval = data.approved && version.round === 2 && isOpenSubmission;
  if (
    (!data.approved && !isOpenSubmission) ||
    (data.approved && !isResolvedFinalApproval && !isDirectFinalApproval)
  ) {
    throw new PilotDomainError(
      "INVALID_STATE",
      "This frozen review version has already been submitted.",
    );
  }

  const at = nowIso(data.now);
  const revision = project.revisions.find((candidate) => candidate.id === version.revisionId);
  if (!revision) {
    throw new PilotDomainError("INVALID_STATE", "The review has no matching revision.");
  }

  if (data.approved) {
    if (
      project.reviewItems.some(
        (item) => item.reviewVersionId === version.id && item.status === "open",
      )
    ) {
      throw new PilotDomainError(
        "INVALID_STATE",
        "Every request needs a disposition before final approval.",
      );
    }
    const currentSnapshotHash = reviewSnapshotHash(project);
    if (
      revision.contentSnapshotVersion !== "pilot-review-v1" ||
      !revision.contentSnapshotHash ||
      revision.contentSnapshotHash !== version.contentFingerprint ||
      currentSnapshotHash !== revision.contentSnapshotHash
    ) {
      throw new PilotDomainError(
        "INVALID_STATE",
        "The presentation changed after this review opened; open a new frozen review version.",
        {
          reviewVersionId: version.id,
          expectedSnapshotHash: revision.contentSnapshotHash ?? null,
          currentSnapshotHash,
        },
      );
    }
    if (isDirectFinalApproval) {
      version.frozenAt = at;
      version.submittedAt = at;
      version.submittedByActorId = data.actorId;
    }
    version.status = "approved";
    version.approvedAt = at;
    revision.status = "approved";
    revision.approvedAt = at;
    const approval = project.checklist.find((item) => item.key === "client_approval");
    if (approval) {
      approval.status = "complete";
      approval.completedAt = at;
      approval.completedByActorId = data.actorId;
      approval.evidenceReference = `review://${version.id}`;
    }
    appendAudit(project, {
      actorId: data.actorId,
      type: "client_approved",
      occurredAt: at,
      summary: `${version.label} was frozen and explicitly approved.`,
      metadata: { reviewVersionId: version.id, revisionId: revision.id, round: version.round },
    });
  } else {
    version.frozenAt = at;
    version.submittedAt = at;
    version.submittedByActorId = data.actorId;
    version.status = "submitted";
    revision.status = "in_review";
    const items = (data.items ?? []).map<PilotReviewItem>((item) => ({
      id: randomUUID(),
      projectId: project.id,
      reviewVersionId: version.id,
      subjectType: item.subjectType,
      subjectId: item.subjectId,
      fieldPath: item.fieldPath ?? null,
      request: item.request,
      status: "open",
      disposition: null,
      resolvedAt: null,
      resolvedByActorId: null,
    }));
    project.reviewItems.push(...items);
    appendAudit(project, {
      actorId: data.actorId,
      type: "review_submitted",
      occurredAt: at,
      summary: `${version.label} was frozen with ${items.length} consolidated request${items.length === 1 ? "" : "s"}.`,
      metadata: { reviewVersionId: version.id, round: version.round, itemCount: items.length },
    });
  }

  return snapshot({
    version,
    items: project.reviewItems.filter((item) => item.reviewVersionId === version.id),
  });
}

export function dispositionPilotReviewItem(input: {
  projectRef: string;
  actorId: string;
  reviewItemId: string;
  decision: "accepted" | "declined";
  disposition: string;
  now?: string;
}) {
  const data = mutationBaseSchema
    .extend({
      reviewItemId: idSchema,
      decision: z.enum(["accepted", "declined"]),
      disposition: z.string().trim().min(8).max(2_000),
    })
    .parse(input);
  const project = findMutableProject(data.projectRef);
  requireActor(project, data.actorId, ["operator", "genealogist"], { now: data.now });
  requireArchiveOnline(project);
  const item = project.reviewItems.find((candidate) => candidate.id === data.reviewItemId);

  if (!item) {
    throw new PilotDomainError("NOT_FOUND", "Review item not found.");
  }
  if (item.status !== "open") {
    throw new PilotDomainError("INVALID_STATE", "This review item already has a disposition.");
  }

  const version = project.reviewVersions.find(
    (candidate) => candidate.id === item.reviewVersionId,
  );
  if (!version?.frozenAt) {
    throw new PilotDomainError("INVALID_STATE", "Only frozen review requests can be resolved.");
  }

  const at = nowIso(data.now);
  item.status = data.decision;
  item.disposition = data.disposition;
  item.resolvedAt = at;
  item.resolvedByActorId = data.actorId;

  const versionItems = project.reviewItems.filter(
    (candidate) => candidate.reviewVersionId === version.id,
  );
  if (versionItems.length > 0 && versionItems.every((candidate) => candidate.status !== "open")) {
    version.status = "resolved";
  }

  appendAudit(project, {
    actorId: data.actorId,
    type: "review_item_dispositioned",
    occurredAt: at,
    summary: `A review request was ${data.decision}.`,
    metadata: {
      reviewItemId: item.id,
      reviewVersionId: version.id,
      decision: data.decision,
    },
  });
  return snapshot(item);
}

export function createNextPilotReviewVersion(input: {
  projectRef: string;
  actorId: string;
  previousReviewVersionId: string;
  contentFingerprint: string;
  now?: string;
}) {
  const data = mutationBaseSchema
    .extend({
      previousReviewVersionId: idSchema,
      contentFingerprint: z.string().regex(/^[a-f0-9]{64}$/i),
    })
    .parse(input);
  const project = findMutableProject(data.projectRef);
  requireActor(project, data.actorId, ["operator", "genealogist"], { now: data.now });
  requireArchiveOnline(project);
  const previous = project.reviewVersions.find(
    (candidate) => candidate.id === data.previousReviewVersionId,
  );

  if (!previous) {
    throw new PilotDomainError("NOT_FOUND", "Previous review version not found.");
  }
  if (previous.status !== "resolved") {
    throw new PilotDomainError(
      "INVALID_STATE",
      "Every request needs a disposition before the next review version is created.",
    );
  }
  if (previous.round >= project.scope.includedCorrectionRounds) {
    throw new PilotDomainError(
      "INVALID_STATE",
      "The two included correction rounds have been used; additional work must be quoted separately.",
    );
  }
  if (project.reviewVersions.some((candidate) => candidate.round === previous.round + 1)) {
    throw new PilotDomainError("INVALID_STATE", "The next review version already exists.");
  }

  const previousRevision = project.revisions.find(
    (candidate) => candidate.id === previous.revisionId,
  );
  if (!previousRevision) {
    throw new PilotDomainError("INVALID_STATE", "The previous revision is missing.");
  }

  const at = nowIso(data.now);
  const contentSnapshotHash = reviewSnapshotHash(project);
  previousRevision.status = "superseded";
  const revision = {
    id: randomUUID(),
    projectId: project.id,
    sequence: Math.max(...project.revisions.map((candidate) => candidate.sequence), 0) + 1,
    basedOnRevisionId: previousRevision.id,
    status: "draft" as const,
    createdAt: at,
    createdByActorId: data.actorId,
    contentSnapshotHash,
    contentSnapshotVersion: "pilot-review-v1" as const,
    approvedAt: null,
    publishedAt: null,
  };
  project.revisions.push(revision);

  const round = (previous.round + 1) as 2;
  const version = {
    id: randomUUID(),
    projectId: project.id,
    revisionId: revision.id,
    round,
    label: "Final client review",
    status: "open" as const,
    // The server-derived canonical hash is authoritative. The legacy caller
    // fingerprint remains accepted at the boundary for API compatibility.
    contentFingerprint: contentSnapshotHash,
    createdAt: at,
    openedAt: at,
    frozenAt: null,
    submittedAt: null,
    approvedAt: null,
    submittedByActorId: null,
  };
  project.reviewVersions.push(version);
  syncWorkflow(project, "revision_round_2", at);
  appendAudit(project, {
    actorId: data.actorId,
    type: "review_version_created",
    occurredAt: at,
    summary: "A new unpublished revision was opened for final client review.",
    metadata: { reviewVersionId: version.id, revisionId: revision.id, round },
  });
  return snapshot({ revision, version });
}

export function evaluatePilotPublishGate(project: PilotProject): PilotPublishGateResult {
  const blockers: PilotPublishGateResult["blockers"] = [];

  for (const item of project.checklist.filter((candidate) => candidate.requiredForPublish)) {
    if (item.status !== "complete" && item.status !== "waived") {
      blockers.push({ code: item.key, message: `${item.label} is incomplete.` });
    }
  }

  if (!project.legalReviewCompletedAt) {
    blockers.push({
      code: "legal_review",
      message: "The recorded legal-review gate is required before real-data publication.",
    });
  }

  if (
    project.counts.people > project.scope.maxPeople ||
    project.counts.mediaItems > project.scope.maxMediaItems ||
    project.counts.mediaBytes > project.scope.maxMediaBytes ||
    project.counts.featuredStories > project.scope.maxFeaturedStories
  ) {
    blockers.push({
      code: "project_cap",
      message: "The project exceeds one or more founding-pilot scope caps.",
    });
  }

  const referencedMediaIds = new Set(
    [
      project.welcome.heroMediaId,
      ...project.stories.filter((story) => story.featured).map((story) => story.coverMediaId),
    ].filter((id): id is string => Boolean(id)),
  );
  const unsafeReferencedMedia = project.media.filter(
    (media) =>
      referencedMediaIds.has(media.id) &&
      (media.quarantineStatus !== "passed" ||
        media.signatureStatus !== "passed" ||
        media.malwareScanStatus !== "passed"),
  );

  if (unsafeReferencedMedia.length > 0) {
    blockers.push({
      code: "quarantined_media",
      message: `${unsafeReferencedMedia.length} referenced media item${unsafeReferencedMedia.length === 1 ? " is" : "s are"} still quarantined.`,
    });
  }

  if (project.reviewItems.some((item) => item.status === "open")) {
    blockers.push({
      code: "unresolved_review_items",
      message: "Every frozen client request needs an auditable disposition.",
    });
  }

  if (!project.revisions.some((revision) => revision.status === "approved" || revision.status === "published")) {
    blockers.push({
      code: "approved_revision",
      message: "A frozen revision needs explicit client approval before publication.",
    });
  }

  const uniqueBlockers = blockers.filter(
    (blocker, index) =>
      blockers.findIndex(
        (candidate) => candidate.code === blocker.code && candidate.message === blocker.message,
      ) === index,
  );
  return { allowed: uniqueBlockers.length === 0, blockers: uniqueBlockers };
}

export function publishPilotProject(input: {
  projectRef: string;
  actorId: string;
  now?: string;
}) {
  const data = mutationBaseSchema.parse(input);
  const project = findMutableProject(data.projectRef);
  requireActor(project, data.actorId, ["operator", "genealogist"], { now: data.now });
  requireArchiveOnline(project);
  const gate = evaluatePilotPublishGate(project);

  if (!gate.allowed) {
    throw new PilotDomainError("PUBLISH_BLOCKED", "The project is not ready to publish.", {
      blockers: gate.blockers,
    });
  }

  const revision = [...project.revisions]
    .sort((left, right) => right.sequence - left.sequence)
    .find((candidate) => candidate.status === "approved" || candidate.status === "published");
  if (!revision) {
    throw new PilotDomainError("INVALID_STATE", "No approved revision is available.");
  }
  if (project.publication?.revisionId === revision.id) {
    return snapshot(project.publication);
  }

  const at = nowIso(data.now);
  revision.status = "published";
  revision.publishedAt = at;
  project.publication = {
    revisionId: revision.id,
    publishedAt: at,
    publishedByActorId: data.actorId,
    privatePath: `/s/${project.slug}`,
    noIndex: true,
  };
  syncWorkflow(project, "handoff", at);
  appendAudit(project, {
    actorId: data.actorId,
    type: "project_published",
    occurredAt: at,
    summary: "The approved revision was privately published with noindex protection.",
    metadata: { revisionId: revision.id, privatePath: project.publication.privatePath },
  });
  return snapshot(project.publication);
}

export function issuePilotInvite(input: {
  projectRef: string;
  actorId: string;
  recipientId?: string;
  recipientLabel: string;
  recipientEmail: string;
  purpose: PilotInvitePurpose;
  reviewVersionId?: string | null;
  reissuedFromInviteId?: string | null;
  now?: string;
}) {
  const data = mutationBaseSchema
    .extend({
      recipientId: idSchema.optional(),
      recipientLabel: z.string().trim().min(1).max(160),
      recipientEmail: z.email(),
      purpose: z.enum(["viewer", "client_review", "owner_handoff"]),
      reviewVersionId: idSchema.nullable().optional(),
      reissuedFromInviteId: idSchema.nullable().optional(),
    })
    .parse(input);
  const project = findMutableProject(data.projectRef);
  const actor = requireActor(
    project,
    data.actorId,
    ["operator", "genealogist", "archive_owner"],
    { now: data.now },
  );
  requireArchiveOnline(project);
  requireRoutineArchiveAuthority(project, actor);
  if (data.purpose === "owner_handoff" && actor.role === "archive_owner") {
    throw new PilotDomainError("INVALID_STATE", "The archive already has an owner.");
  }

  const at = nowIso(data.now);
  const previous = data.reissuedFromInviteId
    ? project.invites.find((candidate) => candidate.id === data.reissuedFromInviteId)
    : null;
  if (data.reissuedFromInviteId && !previous) {
    throw new PilotDomainError("NOT_FOUND", "The invitation to reissue was not found.");
  }
  if (
    previous &&
    ((data.recipientId && data.recipientId !== previous.recipientId) ||
      data.recipientLabel !== previous.recipientLabel ||
      data.recipientEmail !== previous.recipientEmail ||
      data.purpose !== previous.purpose ||
      (data.reviewVersionId && data.reviewVersionId !== previous.reviewVersionId))
  ) {
    throw new PilotDomainError(
      "VALIDATION",
      "A reissue must retain the same recipient, purpose, and frozen review version.",
    );
  }

  const recipientId = previous?.recipientId ?? data.recipientId ?? randomUUID();
  const recipientLabel = previous?.recipientLabel ?? data.recipientLabel;
  const recipientEmail = previous?.recipientEmail ?? data.recipientEmail;
  const purpose = previous?.purpose ?? data.purpose;
  let reviewVersionId: string | null = null;
  let reviewRound: 1 | 2 | null = null;
  if (purpose === "client_review") {
    const actionableVersions = project.reviewVersions.filter(
      (candidate) => candidate.status === "open" || candidate.status === "resolved",
    );
    reviewVersionId =
      previous?.reviewVersionId ??
      data.reviewVersionId ??
      (actionableVersions.length === 1 ? actionableVersions[0]!.id : null);
    if (!reviewVersionId) {
      throw new PilotDomainError(
        "VALIDATION",
        "A client-review invitation must name the exact review version when no single active version exists.",
      );
    }
    const reviewVersion = project.reviewVersions.find(
      (candidate) => candidate.id === reviewVersionId,
    );
    if (
      !reviewVersion ||
      !["open", "resolved", "approved"].includes(reviewVersion.status)
    ) {
      throw new PilotDomainError(
        "INVALID_STATE",
        "Client-review access can only target an active or approved frozen review version.",
      );
    }
    reviewRound = reviewVersion.round;
    if (previous?.reviewRound && previous.reviewRound !== reviewRound) {
      throw new PilotDomainError("INVALID_STATE", "The prior review capability is inconsistent.");
    }
  } else if (data.reviewVersionId) {
    throw new PilotDomainError(
      "VALIDATION",
      "Only a client-review invitation may carry a review version.",
    );
  }

  const rawToken = randomBytes(32).toString("base64url");
  const invite: PilotInviteRecord = {
    id: randomUUID(),
    projectId: project.id,
    recipientId,
    recipientLabel,
    recipientEmail,
    purpose,
    reviewVersionId,
    reviewRound,
    tokenHash: hashToken(rawToken),
    tokenHint: `…${rawToken.slice(-4)}`,
    status: "issued",
    issuedAt: at,
    expiresAt: addDuration(at, { days: 7 }),
    redeemedAt: null,
    revokedAt: null,
    reissuedFromInviteId: data.reissuedFromInviteId ?? null,
  };

  if (previous) {
    previous.status = "revoked";
    previous.revokedAt = at;
    for (const session of project.sessions.filter(
      (candidate) => candidate.inviteId === previous.id,
    )) {
      session.revokedAt ??= at;
    }
  }

  project.invites.push(invite);
  appendAudit(project, {
    actorId: data.actorId,
    type: "invite_issued",
    occurredAt: at,
    summary: `A single-use ${purpose.replaceAll("_", " ")} invitation was issued.`,
    metadata: {
      inviteId: invite.id,
      recipientId: invite.recipientId,
      purpose: invite.purpose,
      reviewVersionId,
      reviewRound,
      reissuedFromInviteId: previous?.id ?? null,
    },
  });

  // The raw bearer credential is returned exactly once and never added to state.
  return { invite: safeInvite(invite), rawToken };
}

export function getPilotInviteContext(rawToken: string, now?: string) {
  const token = z.string().min(8).max(500).parse(rawToken);
  const tokenHash = hashToken(token);
  const workspace = mutableWorkspace();
  const project = workspace.projects.find((candidate) =>
    candidate.invites.some((invite) => invite.tokenHash === tokenHash),
  );
  const invite = project?.invites.find((candidate) => candidate.tokenHash === tokenHash);

  if (!project || !invite) {
    throw new PilotDomainError("NOT_FOUND", "Invitation not found.");
  }

  const at = nowIso(now);
  const effectiveStatus = isArchiveOffline(project)
    ? "revoked"
    : invite.status === "issued" && new Date(invite.expiresAt) <= new Date(at)
      ? "expired"
      : invite.status;
  return {
    projectId: project.id,
    projectSlug: project.slug,
    projectTitle: project.title,
    recipientLabel: invite.recipientLabel,
    purpose: invite.purpose,
    reviewVersionId: invite.reviewVersionId ?? null,
    reviewRound: invite.reviewRound ?? null,
    status: effectiveStatus,
    expiresAt: invite.expiresAt,
  };
}

export function redeemPilotInvite(input: { rawToken: string; now?: string }) {
  const data = z
    .object({ rawToken: z.string().min(8).max(500), now: isoDateSchema.optional() })
    .parse(input);
  const tokenHash = hashToken(data.rawToken);
  const workspace = mutableWorkspace();
  const project = workspace.projects.find((candidate) =>
    candidate.invites.some((invite) => invite.tokenHash === tokenHash),
  );
  const invite = project?.invites.find((candidate) => candidate.tokenHash === tokenHash);

  if (!project || !invite) {
    throw new PilotDomainError("NOT_FOUND", "Invitation not found.");
  }

  const at = nowIso(data.now);
  if (isArchiveOffline(project)) {
    throw new PilotDomainError("INVITE_REVOKED", "This archive is offline.");
  }
  if (invite.status === "revoked") {
    throw new PilotDomainError("INVITE_REVOKED", "This invitation was revoked.");
  }
  if (invite.status === "redeemed") {
    throw new PilotDomainError("INVITE_USED", "This single-use invitation was already redeemed.");
  }
  if (invite.status === "expired" || new Date(invite.expiresAt) <= new Date(at)) {
    invite.status = "expired";
    throw new PilotDomainError("INVITE_EXPIRED", "This invitation expired; request a new link.");
  }
  if (invite.purpose === "client_review") {
    const version = project.reviewVersions.find(
      (candidate) => candidate.id === invite.reviewVersionId,
    );
    if (!version || version.round !== invite.reviewRound) {
      throw new PilotDomainError(
        "INVALID_STATE",
        "This review invitation has no valid frozen-version capability.",
      );
    }
  }

  invite.status = "redeemed";
  invite.redeemedAt = at;
  const rawSessionToken = randomBytes(32).toString("base64url");
  const session: PilotSessionRecord = {
    id: randomUUID(),
    projectId: project.id,
    recipientId: invite.recipientId,
    inviteId: invite.id,
    reviewVersionId: invite.reviewVersionId ?? null,
    reviewRound: invite.reviewRound ?? null,
    sessionTokenHash: hashToken(rawSessionToken),
    createdAt: at,
    lastSeenAt: at,
    idleExpiresAt: addDuration(at, { days: 7 }),
    absoluteExpiresAt: addDuration(at, { days: 30 }),
    revokedAt: null,
  };
  project.sessions.push(session);
  appendAudit(project, {
    actorId: "system",
    type: "invite_redeemed",
    occurredAt: at,
    summary: "A single-use invitation was exchanged for a secure viewer session.",
    metadata: { inviteId: invite.id, sessionId: session.id, purpose: invite.purpose },
  });
  return {
    projectId: project.id,
    projectSlug: project.slug,
    purpose: invite.purpose,
    reviewVersionId: session.reviewVersionId ?? null,
    reviewRound: session.reviewRound ?? null,
    session: snapshot(session),
    rawSessionToken,
  };
}

export function getPilotSessionContext(rawSessionToken: string, now?: string) {
  const rawToken = z.string().min(8).max(500).parse(rawSessionToken);
  const sessionTokenHash = hashToken(rawToken);
  const workspace = mutableWorkspace();
  const project = workspace.projects.find((candidate) =>
    candidate.sessions.some((session) => session.sessionTokenHash === sessionTokenHash),
  );
  const session = project?.sessions.find(
    (candidate) => candidate.sessionTokenHash === sessionTokenHash,
  );

  if (!project || !session) {
    throw new PilotDomainError("NOT_FOUND", "Viewer session not found.");
  }

  const invite = project.invites.find((candidate) => candidate.id === session.inviteId);
  if (!invite) {
    throw new PilotDomainError("INVALID_STATE", "The viewer session has no invitation record.");
  }

  const at = new Date(nowIso(now));
  const parentCapabilityRevoked =
    invite.status === "revoked" ||
    isArchiveOffline(project) ||
    session.reviewVersionId !== (invite.reviewVersionId ?? null) ||
    session.reviewRound !== (invite.reviewRound ?? null);
  const baseStatus = session.revokedAt || parentCapabilityRevoked
    ? "revoked"
    : at >= new Date(session.absoluteExpiresAt) || at >= new Date(session.idleExpiresAt)
      ? "expired"
      : "valid";
  const roleIsCurrent = (role: PilotProject["roles"][number]) =>
    (role.status === "active" ||
      (invite.purpose === "owner_handoff" && role.status === "pending")) &&
    (!role.expiresAt || new Date(role.expiresAt) > at);
  const actorId =
    invite.purpose === "client_review"
      ? project.roles.find((role) => role.role === "client_reviewer" && roleIsCurrent(role))
          ?.actorId ?? null
      : invite.purpose === "owner_handoff"
        ? project.roles.find(
            (role) => role.actorId === project.handoff?.ownerActorId && roleIsCurrent(role),
          )?.actorId ?? null
        : null;
  const status =
    baseStatus === "valid" && invite.purpose !== "viewer" && !actorId
      ? "expired"
      : baseStatus;

  return {
    projectId: project.id,
    projectSlug: project.slug,
    projectTitle: project.title,
    recipientId: session.recipientId,
    recipientLabel: invite.recipientLabel,
    purpose: invite.purpose,
    reviewVersionId: session.reviewVersionId ?? null,
    reviewRound: session.reviewRound ?? null,
    actorId,
    status,
    sessionId: session.id,
    idleExpiresAt: session.idleExpiresAt,
    absoluteExpiresAt: session.absoluteExpiresAt,
  } as const;
}

export function touchPilotSession(input: { rawSessionToken: string; now?: string }) {
  const context = getPilotSessionContext(input.rawSessionToken, input.now);
  if (context.status !== "valid") {
    throw new PilotDomainError(
      context.status === "revoked" ? "INVITE_REVOKED" : "INVITE_EXPIRED",
      context.status === "revoked" ? "This viewer session was revoked." : "This viewer session expired.",
    );
  }

  const project = findMutableProject(context.projectId);
  const session = project.sessions.find((candidate) => candidate.id === context.sessionId)!;
  const at = nowIso(input.now);
  session.lastSeenAt = at;
  const proposedIdleExpiry = addDuration(at, { days: 7 });
  session.idleExpiresAt =
    new Date(proposedIdleExpiry) < new Date(session.absoluteExpiresAt)
      ? proposedIdleExpiry
      : session.absoluteExpiresAt;
  return getPilotSessionContext(input.rawSessionToken, at);
}

export function revokePilotRecipientAccess(input: {
  projectRef: string;
  actorId: string;
  recipientId: string;
  reason: string;
  now?: string;
}) {
  const data = mutationBaseSchema
    .extend({
      recipientId: idSchema,
      reason: z.string().trim().min(8).max(500),
    })
    .parse(input);
  const project = findMutableProject(data.projectRef);
  const actor = requireActor(
    project,
    data.actorId,
    ["operator", "genealogist", "archive_owner"],
    { now: data.now },
  );
  requireArchiveOnline(project);
  requireRoutineArchiveAuthority(project, actor);

  const matchingInvites = project.invites.filter(
    (candidate) => candidate.recipientId === data.recipientId,
  );
  const matchingSessions = project.sessions.filter(
    (candidate) => candidate.recipientId === data.recipientId,
  );
  if (!matchingInvites.length && !matchingSessions.length) {
    throw new PilotDomainError("NOT_FOUND", "Recipient access record not found.");
  }

  const at = nowIso(data.now);
  for (const invite of matchingInvites) {
    if (invite.status === "issued") {
      invite.status = "revoked";
      invite.revokedAt = at;
    }
  }
  for (const session of matchingSessions) {
    if (!session.revokedAt) {
      session.revokedAt = at;
    }
  }
  appendAudit(project, {
    actorId: data.actorId,
    type: "recipient_access_revoked",
    occurredAt: at,
    summary: "Outstanding invitations and active sessions were revoked for one recipient.",
    metadata: {
      recipientId: data.recipientId,
      inviteCount: matchingInvites.length,
      sessionCount: matchingSessions.length,
      reason: data.reason,
    },
  });
  return {
    recipientId: data.recipientId,
    revokedInviteCount: matchingInvites.filter((invite) => invite.revokedAt === at).length,
    revokedSessionCount: matchingSessions.filter((session) => session.revokedAt === at).length,
  };
}

export function acceptPilotHandoff(input: {
  projectRef: string;
  actorId: string;
  now?: string;
}) {
  const data = mutationBaseSchema.parse(input);
  const project = findMutableProject(data.projectRef);
  const assignment = requireActor(project, data.actorId, ["owner_candidate"], {
    allowPending: true,
    now: data.now,
  });
  requireArchiveOnline(project);

  if (!project.publication) {
    throw new PilotDomainError("INVALID_STATE", "Only a published delivery can be handed off.");
  }
  if (!project.handoff || project.handoff.ownerActorId !== data.actorId) {
    throw new PilotDomainError("UNAUTHORIZED", "This identity is not the designated archive owner.");
  }
  if (!project.handoff.identityVerifiedAt) {
    throw new PilotDomainError("INVALID_STATE", "Owner identity verification is incomplete.");
  }
  if (project.handoff.status === "accepted") {
    return snapshot(project.handoff);
  }

  const at = nowIso(data.now);
  const supportExpiresAt = addDuration(at, { days: 30 });
  project.handoff.status = "accepted";
  project.handoff.acceptedAt = at;
  project.handoff.professionalSupportExpiresAt = supportExpiresAt;
  assignment.role = "archive_owner";
  assignment.status = "active";
  assignment.grantedAt = at;

  for (const role of project.roles) {
    if (role.role === "genealogist" && role.status === "active") {
      role.expiresAt = supportExpiresAt;
    }
  }

  syncWorkflow(project, "active_archive", at);
  appendAudit(project, {
    actorId: data.actorId,
    type: "handoff_accepted",
    occurredAt: at,
    summary: "The verified client accepted archive ownership.",
    metadata: { supportExpiresAt, ownerIdentityId: project.handoff.ownerIdentityId },
  });
  return snapshot(project.handoff);
}

export function extendPilotSupport(input: {
  projectRef: string;
  actorId: string;
  now?: string;
}) {
  const data = mutationBaseSchema.parse(input);
  const project = findMutableProject(data.projectRef);
  requireActor(project, data.actorId, ["archive_owner"], { now: data.now });
  requireArchiveOnline(project);

  if (!project.handoff || project.handoff.status !== "accepted") {
    throw new PilotDomainError("INVALID_STATE", "The archive has not completed handoff.");
  }

  const at = nowIso(data.now);
  const from =
    project.handoff.professionalSupportExpiresAt &&
    new Date(project.handoff.professionalSupportExpiresAt) > new Date(at)
      ? project.handoff.professionalSupportExpiresAt
      : at;
  const expiresAt = addDuration(from, { days: 30 });
  project.handoff.professionalSupportExpiresAt = expiresAt;
  project.handoff.supportExtensionCount += 1;
  for (const role of project.roles) {
    if (role.role === "genealogist" && role.status === "active") {
      role.expiresAt = expiresAt;
    }
  }
  appendAudit(project, {
    actorId: data.actorId,
    type: "support_extended",
    occurredAt: at,
    summary: "The archive owner approved a 30-day professional support extension.",
    metadata: { expiresAt, extensionCount: project.handoff.supportExtensionCount },
  });
  return snapshot(project.handoff);
}

export function requestPilotExport(input: {
  projectRef: string;
  actorId: string;
  now?: string;
}) {
  const data = mutationBaseSchema.parse(input);
  const project = findMutableProject(data.projectRef);
  const actor = requireActor(
    project,
    data.actorId,
    ["operator", "genealogist", "archive_owner"],
    { now: data.now },
  );
  requireArchiveOnline(project);
  requireRoutineArchiveAuthority(project, actor);

  const at = nowIso(data.now);
  const exportRequest = {
    id: randomUUID(),
    projectId: project.id,
    requestedByActorId: data.actorId,
    status: "queued" as const,
    requestedAt: at,
    readyAt: null,
    expiresAt: addDuration(at, { days: 1 }),
    downloadStoragePath: null,
    manifestVersion: "pilot-export-v1",
  };
  project.exports.push(exportRequest);
  appendAudit(project, {
    actorId: data.actorId,
    type: "export_requested",
    occurredAt: at,
    summary: "A private archive export was queued for authenticated, short-lived download.",
    metadata: { exportId: exportRequest.id, expiresAt: exportRequest.expiresAt },
  });
  return snapshot(exportRequest);
}

export function schedulePilotDeletion(input: {
  projectRef: string;
  actorId: string;
  confirmation: string;
  now?: string;
}) {
  const data = mutationBaseSchema
    .extend({ confirmation: z.string().max(500) })
    .parse(input);
  const project = findMutableProject(data.projectRef);
  requireActor(project, data.actorId, ["archive_owner"], { now: data.now });
  const expected = `DELETE ${project.title}`;

  if (data.confirmation !== expected) {
    throw new PilotDomainError(
      "VALIDATION",
      `Type “${expected}” exactly to schedule deletion.`,
    );
  }
  if (project.deletion?.status === "scheduled") {
    return snapshot(project.deletion);
  }
  if (isArchiveOffline(project)) {
    throw new PilotDomainError(
      "INVALID_STATE",
      "Deletion is already processing or complete for this offline archive.",
    );
  }

  const at = nowIso(data.now);
  const deletion = {
    id: randomUUID(),
    projectId: project.id,
    requestedByActorId: data.actorId,
    status: "scheduled" as const,
    requestedAt: at,
    cancelUntil: addDuration(at, { days: 7 }),
    primaryDeletionDueAt: addDuration(at, { days: 30 }),
    recoveryDeletionDueAt: addDuration(at, { days: 30 }),
    backupAgeOutTargetAt: addDuration(at, { days: 65 }),
    cancelledAt: null,
    completedAt: null,
  };
  project.deletion = deletion;

  // Owner-requested deletion disables bearer access immediately. A cancellation
  // restores the archive state, but recipients need newly issued links.
  for (const invite of project.invites) {
    if (invite.status === "issued" || invite.status === "redeemed") {
      invite.status = "revoked";
      invite.revokedAt = at;
    }
  }
  for (const session of project.sessions) {
    if (!session.revokedAt) {
      session.revokedAt = at;
    }
  }
  appendAudit(project, {
    actorId: data.actorId,
    type: "deletion_scheduled",
    occurredAt: at,
    summary: "Archive deletion was scheduled with a seven-day cancellation window.",
    metadata: {
      cancelUntil: deletion.cancelUntil,
      primaryDeletionDueAt: deletion.primaryDeletionDueAt,
      backupAgeOutTargetAt: deletion.backupAgeOutTargetAt,
    },
  });
  return snapshot(deletion);
}

export function cancelPilotDeletion(input: {
  projectRef: string;
  actorId: string;
  now?: string;
}) {
  const data = mutationBaseSchema.parse(input);
  const project = findMutableProject(data.projectRef);
  requireActor(project, data.actorId, ["archive_owner"], { now: data.now });

  if (!project.deletion || project.deletion.status !== "scheduled") {
    throw new PilotDomainError("INVALID_STATE", "No cancellable deletion request exists.");
  }

  const at = nowIso(data.now);
  if (new Date(at) > new Date(project.deletion.cancelUntil)) {
    throw new PilotDomainError("INVALID_STATE", "The seven-day cancellation window has closed.");
  }

  project.deletion.status = "cancelled";
  project.deletion.cancelledAt = at;
  appendAudit(project, {
    actorId: data.actorId,
    type: "deletion_cancelled",
    occurredAt: at,
    summary: "The archive owner cancelled scheduled deletion within the grace window.",
    metadata: { deletionId: project.deletion.id },
  });
  return snapshot(project.deletion);
}
