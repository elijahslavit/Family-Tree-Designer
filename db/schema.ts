import {
  boolean,
  date,
  index,
  integer,
  jsonb,
  pgTable,
  primaryKey,
  text,
  timestamp,
  uniqueIndex,
  uuid,
} from "drizzle-orm/pg-core";

export const accounts = pgTable("accounts", {
  id: uuid("id").primaryKey(),
  email: text("email").notNull(),
  displayName: text("display_name").notNull(),
  avatarUrl: text("avatar_url"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  plan: text("plan").notNull().default("free"),
});

export const trees = pgTable("trees", {
  id: uuid("id").primaryKey().defaultRandom(),
  accountId: uuid("account_id")
    .notNull()
    .references(() => accounts.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  description: text("description"),
  themeLayout: text("theme_layout").notNull().default("editorial"),
  themeSkin: text("theme_skin").notNull().default("dark-gold"),
  isPublic: boolean("is_public").notNull().default(false),
  shareToken: text("share_token").notNull().unique(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

export const people = pgTable("people", {
  id: uuid("id").primaryKey().defaultRandom(),
  treeId: uuid("tree_id")
    .notNull()
    .references(() => trees.id, { onDelete: "cascade" }),
  givenName: text("given_name").notNull(),
  surname: text("surname").notNull(),
  fullName: text("full_name").notNull(),
  suffix: text("suffix"),
  gender: text("gender").notNull().default("unknown"),
  birthDateText: text("birth_date_text"),
  birthDateNormalized: date("birth_date_normalized"),
  birthPlace: text("birth_place"),
  deathDateText: text("death_date_text"),
  deathDateNormalized: date("death_date_normalized"),
  deathPlace: text("death_place"),
  summary: text("summary"),
  biographyMd: text("biography_md"),
  isLiving: boolean("is_living").notNull().default(false),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

export const families = pgTable("families", {
  id: uuid("id").primaryKey().defaultRandom(),
  treeId: uuid("tree_id")
    .notNull()
    .references(() => trees.id, { onDelete: "cascade" }),
  spouse1Id: uuid("spouse_1_id")
    .notNull()
    .references(() => people.id, { onDelete: "cascade" }),
  spouse2Id: uuid("spouse_2_id").references(() => people.id, { onDelete: "cascade" }),
  marriageDateText: text("marriage_date_text"),
  marriageDateNormalized: date("marriage_date_normalized"),
  marriagePlace: text("marriage_place"),
});

export const familyChildren = pgTable(
  "family_children",
  {
    familyId: uuid("family_id")
      .notNull()
      .references(() => families.id, { onDelete: "cascade" }),
    childId: uuid("child_id")
      .notNull()
      .references(() => people.id, { onDelete: "cascade" }),
    order: integer("order"),
    relationshipType: text("relationship_type").notNull().default("biological"),
  },
  (table) => [primaryKey({ columns: [table.familyId, table.childId] })],
);

export const events = pgTable("events", {
  id: uuid("id").primaryKey().defaultRandom(),
  treeId: uuid("tree_id")
    .notNull()
    .references(() => trees.id, { onDelete: "cascade" }),
  personId: uuid("person_id")
    .notNull()
    .references(() => people.id, { onDelete: "cascade" }),
  type: text("type").notNull(),
  dateText: text("date_text"),
  dateNormalized: date("date_normalized"),
  place: text("place"),
  description: text("description"),
});

export const lineages = pgTable("lineages", {
  id: uuid("id").primaryKey().defaultRandom(),
  treeId: uuid("tree_id")
    .notNull()
    .references(() => trees.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  description: text("description"),
});

export const lineageMembers = pgTable(
  "lineage_members",
  {
    lineageId: uuid("lineage_id")
      .notNull()
      .references(() => lineages.id, { onDelete: "cascade" }),
    personId: uuid("person_id")
      .notNull()
      .references(() => people.id, { onDelete: "cascade" }),
    order: integer("order").notNull(),
  },
  (table) => [primaryKey({ columns: [table.lineageId, table.personId] })],
);

export const sources = pgTable("sources", {
  id: uuid("id").primaryKey().defaultRandom(),
  treeId: uuid("tree_id")
    .notNull()
    .references(() => trees.id, { onDelete: "cascade" }),
  title: text("title").notNull(),
  author: text("author"),
  url: text("url"),
  notes: text("notes"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const claims = pgTable("claims", {
  id: uuid("id").primaryKey().defaultRandom(),
  treeId: uuid("tree_id")
    .notNull()
    .references(() => trees.id, { onDelete: "cascade" }),
  subjectType: text("subject_type").notNull(),
  subjectId: uuid("subject_id").notNull(),
  predicate: text("predicate").notNull(),
  valueText: text("value_text").notNull(),
  confidence: text("confidence").notNull().default("accepted"),
  notes: text("notes"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const citations = pgTable("citations", {
  id: uuid("id").primaryKey().defaultRandom(),
  claimId: uuid("claim_id")
    .notNull()
    .references(() => claims.id, { onDelete: "cascade" }),
  sourceId: uuid("source_id")
    .notNull()
    .references(() => sources.id, { onDelete: "cascade" }),
  page: text("page"),
  notes: text("notes"),
});

export const reviewIssues = pgTable("review_issues", {
  id: uuid("id").primaryKey().defaultRandom(),
  treeId: uuid("tree_id")
    .notNull()
    .references(() => trees.id, { onDelete: "cascade" }),
  type: text("type").notNull(),
  subjectType: text("subject_type").notNull(),
  subjectId: uuid("subject_id").notNull(),
  description: text("description").notNull(),
  status: text("status").notNull().default("open"),
  resolutionNote: text("resolution_note"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  resolvedAt: timestamp("resolved_at", { withTimezone: true }),
});

export const externalIds = pgTable("external_ids", {
  id: uuid("id").primaryKey().defaultRandom(),
  treeId: uuid("tree_id")
    .notNull()
    .references(() => trees.id, { onDelete: "cascade" }),
  subjectType: text("subject_type").notNull(),
  subjectId: uuid("subject_id").notNull(),
  system: text("system").notNull(),
  externalId: text("external_id").notNull(),
});

export const importJobs = pgTable("import_jobs", {
  id: uuid("id").primaryKey().defaultRandom(),
  treeId: uuid("tree_id")
    .notNull()
    .references(() => trees.id, { onDelete: "cascade" }),
  accountId: uuid("account_id")
    .notNull()
    .references(() => accounts.id, { onDelete: "cascade" }),
  status: text("status").notNull().default("pending"),
  fileName: text("file_name").notNull(),
  storagePath: text("storage_path"),
  payloadJson: jsonb("payload_json"),
  counts: jsonb("counts").notNull(),
  issues: jsonb("issues").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
});

// Paid-pilot presentation workflow. These tables intentionally complement the
// genealogy graph above instead of replacing it. Bearer credentials are always
// stored as hashes; raw invitation/session tokens have no database column.
export const professionalPortfolios = pgTable("professional_portfolios", {
  id: uuid("id").primaryKey().defaultRandom(),
  ownerAccountId: uuid("owner_account_id")
    .notNull()
    .references(() => accounts.id, { onDelete: "cascade" }),
  practiceName: text("practice_name").notNull(),
  practitionerName: text("practitioner_name").notNull(),
  descriptor: text("descriptor"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

export const projects = pgTable(
  "projects",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    portfolioId: uuid("portfolio_id")
      .notNull()
      .references(() => professionalPortfolios.id, { onDelete: "cascade" }),
    treeId: uuid("tree_id")
      .notNull()
      .references(() => trees.id, { onDelete: "cascade" }),
    slug: text("slug").notNull(),
    title: text("title").notNull(),
    clientLabel: text("client_label").notNull(),
    focalPersonId: uuid("focal_person_id").references(() => people.id, {
      onDelete: "set null",
    }),
    workflowStatus: text("workflow_status").notNull().default("intake"),
    maxPeople: integer("max_people").notNull().default(500),
    maxMediaItems: integer("max_media_items").notNull().default(25),
    maxFeaturedStories: integer("max_featured_stories").notNull().default(5),
    minFeaturedStories: integer("min_featured_stories").notNull().default(3),
    maxMediaBytes: integer("max_media_bytes").notNull().default(524288000),
    maxFileBytes: integer("max_file_bytes").notNull().default(20971520),
    includedCorrectionRounds: integer("included_correction_rounds").notNull().default(2),
    hostingMonths: integer("hosting_months").notNull().default(12),
    legalReviewCompletedAt: timestamp("legal_review_completed_at", { withTimezone: true }),
    publishedRevisionId: uuid("published_revision_id"),
    publishedAt: timestamp("published_at", { withTimezone: true }),
    noIndex: boolean("no_index").notNull().default(true),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    uniqueIndex("projects_slug_unique").on(table.slug),
    index("projects_portfolio_status_idx").on(table.portfolioId, table.workflowStatus),
    index("projects_tree_idx").on(table.treeId),
  ],
);

export const projectBranding = pgTable("project_branding", {
  projectId: uuid("project_id")
    .primaryKey()
    .references(() => projects.id, { onDelete: "cascade" }),
  practiceName: text("practice_name").notNull(),
  logoStoragePath: text("logo_storage_path"),
  mark: text("mark").notNull(),
  primaryColor: text("primary_color").notNull(),
  accentColor: text("accent_color").notNull(),
  backgroundColor: text("background_color").notNull(),
  typography: text("typography").notNull().default("editorial"),
  byline: text("byline").notNull(),
  supportEmail: text("support_email").notNull(),
  themeId: text("theme_id").notNull().default("heirloom"),
  welcomeJson: jsonb("welcome_json").notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

export const projectChecklistItems = pgTable(
  "project_checklist_items",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    projectId: uuid("project_id")
      .notNull()
      .references(() => projects.id, { onDelete: "cascade" }),
    key: text("key").notNull(),
    label: text("label").notNull(),
    requiredForPublish: boolean("required_for_publish").notNull().default(true),
    status: text("status").notNull().default("pending"),
    evidenceReference: text("evidence_reference"),
    overrideReason: text("override_reason"),
    completedByActorId: text("completed_by_actor_id"),
    completedAt: timestamp("completed_at", { withTimezone: true }),
  },
  (table) => [
    uniqueIndex("project_checklist_key_unique").on(table.projectId, table.key),
  ],
);

export const projectMedia = pgTable(
  "project_media",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    projectId: uuid("project_id")
      .notNull()
      .references(() => projects.id, { onDelete: "cascade" }),
    kind: text("kind").notNull(),
    fileName: text("file_name").notNull(),
    mimeType: text("mime_type").notNull(),
    byteSize: integer("byte_size").notNull(),
    sha256: text("sha256").notNull(),
    originalStoragePath: text("original_storage_path").notNull(),
    derivativeStoragePath: text("derivative_storage_path"),
    inertPreviewStoragePath: text("inert_preview_storage_path"),
    caption: text("caption").notNull(),
    altText: text("alt_text"),
    decorative: boolean("decorative").notNull().default(false),
    provenance: text("provenance").notNull(),
    rightsBasis: text("rights_basis").notNull(),
    rightsEvidenceReference: text("rights_evidence_reference").notNull(),
    consentStatus: text("consent_status").notNull().default("not_required"),
    visibility: text("visibility").notNull().default("private"),
    featured: boolean("featured").notNull().default(false),
    quarantineStatus: text("quarantine_status").notNull().default("pending"),
    signatureStatus: text("signature_status").notNull().default("pending"),
    malwareScanStatus: text("malware_scan_status").notNull().default("pending"),
    malwareScanProcedure: text("malware_scan_procedure"),
    quarantineFailureReason: text("quarantine_failure_reason"),
    quarantineCheckedByActorId: text("quarantine_checked_by_actor_id"),
    quarantineCheckedAt: timestamp("quarantine_checked_at", { withTimezone: true }),
    uploadedAt: timestamp("uploaded_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    uniqueIndex("project_media_sha_unique").on(table.projectId, table.sha256),
    index("project_media_quarantine_idx").on(table.projectId, table.quarantineStatus),
  ],
);

export const projectMediaPeople = pgTable(
  "project_media_people",
  {
    mediaId: uuid("media_id")
      .notNull()
      .references(() => projectMedia.id, { onDelete: "cascade" }),
    personId: uuid("person_id")
      .notNull()
      .references(() => people.id, { onDelete: "cascade" }),
  },
  (table) => [primaryKey({ columns: [table.mediaId, table.personId] })],
);

export const projectMediaSources = pgTable(
  "project_media_sources",
  {
    mediaId: uuid("media_id")
      .notNull()
      .references(() => projectMedia.id, { onDelete: "cascade" }),
    sourceId: uuid("source_id")
      .notNull()
      .references(() => sources.id, { onDelete: "cascade" }),
  },
  (table) => [primaryKey({ columns: [table.mediaId, table.sourceId] })],
);

export const stories = pgTable(
  "stories",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    projectId: uuid("project_id")
      .notNull()
      .references(() => projects.id, { onDelete: "cascade" }),
    title: text("title").notNull(),
    dek: text("dek").notNull(),
    bodyMd: text("body_md").notNull(),
    coverMediaId: uuid("cover_media_id").references(() => projectMedia.id, {
      onDelete: "set null",
    }),
    visibility: text("visibility").notNull().default("private"),
    featured: boolean("featured").notNull().default(false),
    order: integer("order").notNull().default(0),
    status: text("status").notNull().default("draft"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [index("stories_project_featured_idx").on(table.projectId, table.featured)],
);

export const storyPeople = pgTable(
  "story_people",
  {
    storyId: uuid("story_id")
      .notNull()
      .references(() => stories.id, { onDelete: "cascade" }),
    personId: uuid("person_id")
      .notNull()
      .references(() => people.id, { onDelete: "cascade" }),
  },
  (table) => [primaryKey({ columns: [table.storyId, table.personId] })],
);

export const storySources = pgTable(
  "story_sources",
  {
    storyId: uuid("story_id")
      .notNull()
      .references(() => stories.id, { onDelete: "cascade" }),
    sourceId: uuid("source_id")
      .notNull()
      .references(() => sources.id, { onDelete: "cascade" }),
    note: text("note"),
  },
  (table) => [primaryKey({ columns: [table.storyId, table.sourceId] })],
);

export const personConsents = pgTable(
  "person_consents",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    projectId: uuid("project_id")
      .notNull()
      .references(() => projects.id, { onDelete: "cascade" }),
    personId: uuid("person_id")
      .notNull()
      .references(() => people.id, { onDelete: "cascade" }),
    subjectKind: text("subject_kind").notNull(),
    status: text("status").notNull(),
    allowedFields: jsonb("allowed_fields").notNull(),
    evidenceReference: text("evidence_reference"),
    hiddenByDefault: boolean("hidden_by_default").notNull().default(true),
    recordedByActorId: text("recorded_by_actor_id"),
    recordedAt: timestamp("recorded_at", { withTimezone: true }),
  },
  (table) => [uniqueIndex("person_consent_project_unique").on(table.projectId, table.personId)],
);

export const projectRoles = pgTable(
  "project_roles",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    projectId: uuid("project_id")
      .notNull()
      .references(() => projects.id, { onDelete: "cascade" }),
    actorId: text("actor_id").notNull(),
    identityAccountId: uuid("identity_account_id").references(() => accounts.id, {
      onDelete: "set null",
    }),
    displayName: text("display_name").notNull(),
    role: text("role").notNull(),
    status: text("status").notNull().default("pending"),
    grantedAt: timestamp("granted_at", { withTimezone: true }).notNull().defaultNow(),
    expiresAt: timestamp("expires_at", { withTimezone: true }),
    revokedAt: timestamp("revoked_at", { withTimezone: true }),
  },
  (table) => [
    uniqueIndex("project_role_actor_unique").on(table.projectId, table.actorId),
    index("project_role_identity_idx").on(table.projectId, table.identityAccountId),
  ],
);

export const projectInvites = pgTable(
  "project_invites",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    projectId: uuid("project_id")
      .notNull()
      .references(() => projects.id, { onDelete: "cascade" }),
    recipientId: uuid("recipient_id").notNull(),
    recipientLabel: text("recipient_label").notNull(),
    recipientEmail: text("recipient_email").notNull(),
    purpose: text("purpose").notNull(),
    tokenHash: text("token_hash").notNull(),
    tokenHint: text("token_hint").notNull(),
    status: text("status").notNull().default("issued"),
    issuedAt: timestamp("issued_at", { withTimezone: true }).notNull().defaultNow(),
    expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
    redeemedAt: timestamp("redeemed_at", { withTimezone: true }),
    revokedAt: timestamp("revoked_at", { withTimezone: true }),
    reissuedFromInviteId: uuid("reissued_from_invite_id"),
  },
  (table) => [
    uniqueIndex("project_invites_token_hash_unique").on(table.tokenHash),
    index("project_invites_recipient_idx").on(table.projectId, table.recipientId),
  ],
);

export const projectViewerSessions = pgTable(
  "project_viewer_sessions",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    projectId: uuid("project_id")
      .notNull()
      .references(() => projects.id, { onDelete: "cascade" }),
    inviteId: uuid("invite_id")
      .notNull()
      .references(() => projectInvites.id, { onDelete: "cascade" }),
    recipientId: uuid("recipient_id").notNull(),
    sessionTokenHash: text("session_token_hash").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    lastSeenAt: timestamp("last_seen_at", { withTimezone: true }).notNull().defaultNow(),
    idleExpiresAt: timestamp("idle_expires_at", { withTimezone: true }).notNull(),
    absoluteExpiresAt: timestamp("absolute_expires_at", { withTimezone: true }).notNull(),
    revokedAt: timestamp("revoked_at", { withTimezone: true }),
  },
  (table) => [
    uniqueIndex("project_sessions_token_hash_unique").on(table.sessionTokenHash),
    index("project_sessions_recipient_idx").on(table.projectId, table.recipientId),
  ],
);

export const projectRevisions = pgTable(
  "project_revisions",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    projectId: uuid("project_id")
      .notNull()
      .references(() => projects.id, { onDelete: "cascade" }),
    sequence: integer("sequence").notNull(),
    basedOnRevisionId: uuid("based_on_revision_id"),
    status: text("status").notNull().default("draft"),
    contentSnapshot: jsonb("content_snapshot").notNull(),
    createdByActorId: text("created_by_actor_id").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    approvedAt: timestamp("approved_at", { withTimezone: true }),
    publishedAt: timestamp("published_at", { withTimezone: true }),
  },
  (table) => [
    uniqueIndex("project_revision_sequence_unique").on(table.projectId, table.sequence),
  ],
);

export const clientReviewVersions = pgTable(
  "client_review_versions",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    projectId: uuid("project_id")
      .notNull()
      .references(() => projects.id, { onDelete: "cascade" }),
    revisionId: uuid("revision_id")
      .notNull()
      .references(() => projectRevisions.id, { onDelete: "cascade" }),
    round: integer("round").notNull(),
    label: text("label").notNull(),
    status: text("status").notNull().default("open"),
    contentFingerprint: text("content_fingerprint").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    openedAt: timestamp("opened_at", { withTimezone: true }).notNull().defaultNow(),
    frozenAt: timestamp("frozen_at", { withTimezone: true }),
    submittedAt: timestamp("submitted_at", { withTimezone: true }),
    submittedByActorId: text("submitted_by_actor_id"),
    approvedAt: timestamp("approved_at", { withTimezone: true }),
  },
  (table) => [uniqueIndex("client_review_round_unique").on(table.projectId, table.round)],
);

export const clientReviewItems = pgTable(
  "client_review_items",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    reviewVersionId: uuid("review_version_id")
      .notNull()
      .references(() => clientReviewVersions.id, { onDelete: "cascade" }),
    subjectType: text("subject_type").notNull(),
    subjectId: text("subject_id").notNull(),
    fieldPath: text("field_path"),
    request: text("request").notNull(),
    status: text("status").notNull().default("open"),
    disposition: text("disposition"),
    resolvedByActorId: text("resolved_by_actor_id"),
    resolvedAt: timestamp("resolved_at", { withTimezone: true }),
  },
  (table) => [index("client_review_items_version_status_idx").on(table.reviewVersionId, table.status)],
);

export const projectHandoffs = pgTable("project_handoffs", {
  id: uuid("id").primaryKey().defaultRandom(),
  projectId: uuid("project_id")
    .notNull()
    .unique()
    .references(() => projects.id, { onDelete: "cascade" }),
  ownerActorId: text("owner_actor_id").notNull(),
  ownerIdentityAccountId: uuid("owner_identity_account_id")
    .notNull()
    .references(() => accounts.id, { onDelete: "restrict" }),
  status: text("status").notNull().default("pending"),
  identityVerifiedAt: timestamp("identity_verified_at", { withTimezone: true }).notNull(),
  invitedAt: timestamp("invited_at", { withTimezone: true }).notNull(),
  acceptedAt: timestamp("accepted_at", { withTimezone: true }),
  professionalSupportExpiresAt: timestamp("professional_support_expires_at", {
    withTimezone: true,
  }),
  supportExtensionCount: integer("support_extension_count").notNull().default(0),
});

export const projectExportJobs = pgTable(
  "project_export_jobs",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    projectId: uuid("project_id")
      .notNull()
      .references(() => projects.id, { onDelete: "cascade" }),
    requestedByActorId: text("requested_by_actor_id").notNull(),
    status: text("status").notNull().default("queued"),
    manifestVersion: text("manifest_version").notNull(),
    downloadStoragePath: text("download_storage_path"),
    requestedAt: timestamp("requested_at", { withTimezone: true }).notNull().defaultNow(),
    readyAt: timestamp("ready_at", { withTimezone: true }),
    expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
    deletedAt: timestamp("deleted_at", { withTimezone: true }),
  },
  (table) => [index("project_export_expiry_idx").on(table.status, table.expiresAt)],
);

export const projectDeletionRequests = pgTable("project_deletion_requests", {
  id: uuid("id").primaryKey().defaultRandom(),
  projectId: uuid("project_id")
    .notNull()
    .references(() => projects.id, { onDelete: "cascade" }),
  requestedByActorId: text("requested_by_actor_id").notNull(),
  status: text("status").notNull().default("scheduled"),
  requestedAt: timestamp("requested_at", { withTimezone: true }).notNull().defaultNow(),
  cancelUntil: timestamp("cancel_until", { withTimezone: true }).notNull(),
  primaryDeletionDueAt: timestamp("primary_deletion_due_at", { withTimezone: true }).notNull(),
  recoveryDeletionDueAt: timestamp("recovery_deletion_due_at", { withTimezone: true }).notNull(),
  backupAgeOutTargetAt: timestamp("backup_age_out_target_at", { withTimezone: true }),
  cancelledAt: timestamp("cancelled_at", { withTimezone: true }),
  completedAt: timestamp("completed_at", { withTimezone: true }),
});

export const projectAuditEvents = pgTable(
  "project_audit_events",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    projectId: uuid("project_id")
      .notNull()
      .references(() => projects.id, { onDelete: "cascade" }),
    actorId: text("actor_id").notNull(),
    type: text("type").notNull(),
    summary: text("summary").notNull(),
    metadata: jsonb("metadata").notNull().default({}),
    occurredAt: timestamp("occurred_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [index("project_audit_timeline_idx").on(table.projectId, table.occurredAt)],
);

export const projectMetrics = pgTable("project_metrics", {
  projectId: uuid("project_id")
    .primaryKey()
    .references(() => projects.id, { onDelete: "cascade" }),
  conciergeMinutes: integer("concierge_minutes").notNull().default(0),
  genealogistSetupMinutes: integer("genealogist_setup_minutes").notNull().default(0),
  importSucceeded: boolean("import_succeeded").notNull().default(false),
  importedPeople: integer("imported_people").notNull().default(0),
  importWarningCount: integer("import_warning_count").notNull().default(0),
  clientViewerCount: integer("client_viewer_count").notNull().default(0),
  clientShareCount: integer("client_share_count").notNull().default(0),
  repeatProject: boolean("repeat_project").notNull().default(false),
  acquisitionCostCents: integer("acquisition_cost_cents").notNull().default(0),
  grossSalesCents: integer("gross_sales_cents").notNull().default(0),
  cashCostCents: integer("cash_cost_cents").notNull().default(0),
  refundCents: integer("refund_cents").notNull().default(0),
  privacyIncidentCount: integer("privacy_incident_count").notNull().default(0),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});
