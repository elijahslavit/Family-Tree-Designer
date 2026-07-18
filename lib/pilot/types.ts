export const PILOT_WORKFLOW = [
  "intake",
  "materials",
  "import_review",
  "curation",
  "professional_preview",
  "client_review_round_1",
  "revision_round_2",
  "approval_publication",
  "handoff",
  "active_archive",
] as const;

export type PilotWorkflowStatus = (typeof PILOT_WORKFLOW)[number];

export const PILOT_WORKFLOW_LABELS: Record<PilotWorkflowStatus, string> = {
  intake: "Intake",
  materials: "Materials",
  import_review: "Import review",
  curation: "Curation",
  professional_preview: "Professional preview",
  client_review_round_1: "Client review · Round 1",
  revision_round_2: "Revision · Round 2",
  approval_publication: "Approval & publication",
  handoff: "Handoff",
  active_archive: "Active archive",
};

export const PILOT_PROJECT_LIMITS = {
  maxPeople: 500,
  maxMediaItems: 25,
  maxFeaturedStories: 5,
  minFeaturedStories: 3,
  maxMediaBytes: 500 * 1024 * 1024,
  maxFileBytes: 20 * 1024 * 1024,
  includedCorrectionRounds: 2,
  hostingMonths: 12,
} as const;

export type PilotActorRole =
  | "operator"
  | "genealogist"
  | "client_reviewer"
  | "owner_candidate"
  | "archive_owner"
  | "support"
  | "viewer"
  | "system";

export type PilotVisibility =
  | "private"
  | "invited_family"
  | "approved_branch"
  | "public_excerpt";

export interface PilotBranding {
  practiceName: string;
  logoPath?: string | null;
  mark: string;
  primaryColor: string;
  accentColor: string;
  backgroundColor: string;
  typography: "editorial" | "heritage";
  byline: string;
  supportEmail: string;
  themeId: "heirloom" | "linen";
}

export interface PilotPortfolio {
  id: string;
  ownerIdentityId: string;
  practiceName: string;
  practitionerName: string;
  descriptor: string;
  projectIds: string[];
  branding: PilotBranding;
}

export interface PilotScopeLimits {
  maxPeople: number;
  maxMediaItems: number;
  maxFeaturedStories: number;
  minFeaturedStories: number;
  maxMediaBytes: number;
  maxFileBytes: number;
  includedCorrectionRounds: number;
  hostingMonths: number;
}

export interface PilotProjectCounts {
  people: number;
  mediaItems: number;
  mediaBytes: number;
  featuredStories: number;
  unresolvedImportIssues: number;
}

export interface PilotWelcome {
  eyebrow: string;
  familyName: string;
  headline: string;
  introduction: string;
  heroMediaId?: string | null;
  primaryActionLabel: string;
}

export type PilotChecklistKey =
  | "legal_review"
  | "rights_attestation"
  | "living_person_consent"
  | "focal_branch"
  | "welcome_page"
  | "featured_stories"
  | "import_review_acknowledged"
  | "media_safety"
  | "professional_preview"
  | "client_approval";

export interface PilotChecklistItem {
  key: PilotChecklistKey;
  label: string;
  description: string;
  requiredForPublish: boolean;
  status: "pending" | "complete" | "waived";
  completedAt?: string | null;
  completedByActorId?: string | null;
  evidenceReference?: string | null;
  overrideReason?: string | null;
}

export interface PilotWorkflowStep {
  status: PilotWorkflowStatus;
  label: string;
  state: "complete" | "current" | "up_next" | "blocked";
  completedAt?: string | null;
}

export interface PilotImportIssue {
  id: string;
  subjectType: "person" | "family" | "event" | "source";
  subjectId: string;
  severity: "info" | "warning" | "blocking";
  title: string;
  description: string;
  status: "open" | "resolved" | "acknowledged";
  disposition?: string | null;
}

export interface PilotImportSummary {
  importJobId: string;
  fileName: string;
  importedAt: string;
  stagingExpiresAt: string;
  parserStatus: "pending" | "parsed" | "failed" | "confirmed";
  sourceSystem: "gedcom";
  peopleCount: number;
  familyCount: number;
  sourceCount: number;
  focalPersonId?: string | null;
  issues: PilotImportIssue[];
}

export type PilotMediaKind = "image" | "pdf";
export type PilotMediaQuarantineStatus = "pending" | "passed" | "failed";

export interface PilotMediaAsset {
  id: string;
  projectId: string;
  kind: PilotMediaKind;
  fileName: string;
  mimeType: "image/jpeg" | "image/png" | "image/webp" | "application/pdf";
  byteSize: number;
  sha256: string;
  originalStoragePath: string;
  derivativePath?: string | null;
  inertPreviewPath?: string | null;
  caption: string;
  altText?: string | null;
  decorative: boolean;
  provenance: string;
  rightsBasis: "family_owned" | "licensed" | "public_domain" | "permission";
  rightsEvidenceReference: string;
  consentStatus: "not_required" | "pending" | "granted";
  visibility: PilotVisibility;
  linkedPersonIds: string[];
  sourceIds: string[];
  featured: boolean;
  quarantineStatus: PilotMediaQuarantineStatus;
  signatureStatus: PilotMediaQuarantineStatus;
  malwareScanStatus: PilotMediaQuarantineStatus;
  malwareScanProcedure?: string | null;
  quarantineCheckedAt?: string | null;
  quarantineCheckedByActorId?: string | null;
  quarantineFailureReason?: string | null;
  uploadedAt: string;
}

export interface PilotStory {
  id: string;
  projectId: string;
  title: string;
  dek: string;
  bodyMd: string;
  coverMediaId?: string | null;
  personIds: string[];
  sourceIds: string[];
  visibility: PilotVisibility;
  featured: boolean;
  order: number;
  status: "draft" | "ready" | "published";
}

export interface PilotConsentRecord {
  id: string;
  projectId: string;
  personId: string;
  subjectLabel: string;
  subjectKind: "living_adult" | "living_minor" | "deceased";
  status: "not_required" | "required" | "granted" | "declined";
  allowedFields: Array<"display_name" | "relationship" | "portrait" | "story">;
  evidenceReference?: string | null;
  recordedAt?: string | null;
  recordedByActorId?: string | null;
  hiddenByDefault: boolean;
}

export interface PilotRoleAssignment {
  id: string;
  projectId: string;
  actorId: string;
  identityId?: string | null;
  displayName: string;
  role: PilotActorRole;
  status: "pending" | "active" | "expired" | "revoked";
  grantedAt: string;
  expiresAt?: string | null;
  revokedAt?: string | null;
}

export type PilotInvitePurpose = "viewer" | "client_review" | "owner_handoff";
export type PilotInviteStatus = "issued" | "redeemed" | "expired" | "revoked";

export interface PilotInviteRecord {
  id: string;
  projectId: string;
  recipientId: string;
  recipientLabel: string;
  recipientEmail: string;
  purpose: PilotInvitePurpose;
  /** Exact frozen review capability. Null for non-review invitations. */
  reviewVersionId?: string | null;
  reviewRound?: 1 | 2 | null;
  tokenHash: string;
  tokenHint: string;
  status: PilotInviteStatus;
  issuedAt: string;
  expiresAt: string;
  redeemedAt?: string | null;
  revokedAt?: string | null;
  reissuedFromInviteId?: string | null;
}

export interface PilotSessionRecord {
  id: string;
  projectId: string;
  recipientId: string;
  inviteId: string;
  /** Copied from the invitation so a session cannot drift to another review. */
  reviewVersionId?: string | null;
  reviewRound?: 1 | 2 | null;
  sessionTokenHash: string;
  createdAt: string;
  lastSeenAt: string;
  idleExpiresAt: string;
  absoluteExpiresAt: string;
  revokedAt?: string | null;
}

export interface PilotRevision {
  id: string;
  projectId: string;
  sequence: number;
  basedOnRevisionId?: string | null;
  status: "draft" | "in_review" | "approved" | "published" | "superseded";
  createdAt: string;
  createdByActorId: string;
  /** Server-derived hash of the presentation snapshot opened for review. */
  contentSnapshotHash?: string | null;
  contentSnapshotVersion?: "pilot-review-v1" | null;
  approvedAt?: string | null;
  publishedAt?: string | null;
}

export interface PilotReviewVersion {
  id: string;
  projectId: string;
  revisionId: string;
  round: 1 | 2;
  label: string;
  status: "open" | "submitted" | "resolved" | "approved";
  contentFingerprint: string;
  createdAt: string;
  openedAt: string;
  frozenAt?: string | null;
  submittedAt?: string | null;
  approvedAt?: string | null;
  submittedByActorId?: string | null;
}

export interface PilotReviewItem {
  id: string;
  projectId: string;
  reviewVersionId: string;
  subjectType: "welcome" | "person" | "story" | "media" | "source" | "tree";
  subjectId: string;
  fieldPath?: string | null;
  request: string;
  status: "open" | "accepted" | "declined" | "resolved";
  disposition?: string | null;
  resolvedAt?: string | null;
  resolvedByActorId?: string | null;
}

export interface PilotPublication {
  revisionId: string;
  publishedAt: string;
  publishedByActorId: string;
  privatePath: string;
  noIndex: true;
}

export interface PilotHandoff {
  id: string;
  projectId: string;
  ownerActorId: string;
  ownerIdentityId: string;
  status: "pending" | "accepted" | "revoked";
  identityVerifiedAt: string;
  invitedAt: string;
  acceptedAt?: string | null;
  professionalSupportExpiresAt?: string | null;
  supportExtensionCount: number;
}

export interface PilotExportRequest {
  id: string;
  projectId: string;
  requestedByActorId: string;
  status: "queued" | "processing" | "ready" | "expired" | "failed";
  requestedAt: string;
  readyAt?: string | null;
  expiresAt: string;
  downloadStoragePath?: string | null;
  manifestVersion: string;
}

export interface PilotDeletionRequest {
  id: string;
  projectId: string;
  requestedByActorId: string;
  status: "scheduled" | "cancelled" | "processing" | "complete";
  requestedAt: string;
  cancelUntil: string;
  primaryDeletionDueAt: string;
  recoveryDeletionDueAt: string;
  backupAgeOutTargetAt?: string | null;
  cancelledAt?: string | null;
  completedAt?: string | null;
}

export type PilotAuditEventType =
  | "project_status_changed"
  | "checklist_updated"
  | "gedcom_imported"
  | "theme_selected"
  | "curation_updated"
  | "media_quarantine_passed"
  | "media_quarantine_failed"
  | "review_submitted"
  | "review_item_dispositioned"
  | "review_version_created"
  | "client_approved"
  | "project_published"
  | "invite_issued"
  | "invite_redeemed"
  | "recipient_access_revoked"
  | "handoff_accepted"
  | "support_extended"
  | "export_requested"
  | "deletion_scheduled"
  | "deletion_cancelled";

export interface PilotAuditEvent {
  id: string;
  projectId: string;
  actorId: string;
  type: PilotAuditEventType;
  occurredAt: string;
  summary: string;
  metadata: Record<string, string | number | boolean | null>;
}

export interface PilotMetrics {
  conciergeMinutes: number;
  genealogistSetupMinutes: number;
  importSucceeded: boolean;
  importedPeople: number;
  importWarningCount: number;
  clientViewerCount: number;
  clientShareCount: number;
  repeatProject: boolean;
  acquisitionCostCents: number;
  grossSalesCents: number;
  cashCostCents: number;
  refundCents: number;
  privacyIncidentCount: number;
}

export interface PilotProject {
  id: string;
  slug: string;
  portfolioId: string;
  treeId: string;
  title: string;
  clientLabel: string;
  focalPersonId?: string | null;
  status: PilotWorkflowStatus;
  workflow: PilotWorkflowStep[];
  scope: PilotScopeLimits;
  counts: PilotProjectCounts;
  branding: PilotBranding;
  welcome: PilotWelcome;
  checklist: PilotChecklistItem[];
  importSummary: PilotImportSummary;
  media: PilotMediaAsset[];
  stories: PilotStory[];
  consents: PilotConsentRecord[];
  roles: PilotRoleAssignment[];
  invites: PilotInviteRecord[];
  sessions: PilotSessionRecord[];
  revisions: PilotRevision[];
  reviewVersions: PilotReviewVersion[];
  reviewItems: PilotReviewItem[];
  publication?: PilotPublication | null;
  handoff?: PilotHandoff | null;
  exports: PilotExportRequest[];
  deletion?: PilotDeletionRequest | null;
  audit: PilotAuditEvent[];
  metrics: PilotMetrics;
  legalReviewCompletedAt?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface PilotWorkspace {
  portfolio: PilotPortfolio;
  activeProjectId: string;
  projects: PilotProject[];
}

export interface PilotPublishGateResult {
  allowed: boolean;
  blockers: Array<{
    code:
      | PilotChecklistKey
      | "project_cap"
      | "quarantined_media"
      | "unresolved_review_items"
      | "approved_revision";
    message: string;
  }>;
}
