CREATE TABLE "accounts" (
	"id" uuid PRIMARY KEY NOT NULL,
	"email" text NOT NULL,
	"display_name" text NOT NULL,
	"avatar_url" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"plan" text DEFAULT 'free' NOT NULL
);
--> statement-breakpoint
CREATE TABLE "citations" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"claim_id" uuid NOT NULL,
	"source_id" uuid NOT NULL,
	"page" text,
	"notes" text
);
--> statement-breakpoint
CREATE TABLE "claims" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tree_id" uuid NOT NULL,
	"subject_type" text NOT NULL,
	"subject_id" uuid NOT NULL,
	"predicate" text NOT NULL,
	"value_text" text NOT NULL,
	"confidence" text DEFAULT 'accepted' NOT NULL,
	"notes" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "client_review_items" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"review_version_id" uuid NOT NULL,
	"subject_type" text NOT NULL,
	"subject_id" text NOT NULL,
	"field_path" text,
	"request" text NOT NULL,
	"status" text DEFAULT 'open' NOT NULL,
	"disposition" text,
	"resolved_by_actor_id" text,
	"resolved_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE "client_review_versions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"project_id" uuid NOT NULL,
	"revision_id" uuid NOT NULL,
	"round" integer NOT NULL,
	"label" text NOT NULL,
	"status" text DEFAULT 'open' NOT NULL,
	"content_fingerprint" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"opened_at" timestamp with time zone DEFAULT now() NOT NULL,
	"frozen_at" timestamp with time zone,
	"submitted_at" timestamp with time zone,
	"submitted_by_actor_id" text,
	"approved_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE "events" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tree_id" uuid NOT NULL,
	"person_id" uuid NOT NULL,
	"type" text NOT NULL,
	"date_text" text,
	"date_normalized" date,
	"place" text,
	"description" text
);
--> statement-breakpoint
CREATE TABLE "external_ids" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tree_id" uuid NOT NULL,
	"subject_type" text NOT NULL,
	"subject_id" uuid NOT NULL,
	"system" text NOT NULL,
	"external_id" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "families" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tree_id" uuid NOT NULL,
	"spouse_1_id" uuid NOT NULL,
	"spouse_2_id" uuid,
	"marriage_date_text" text,
	"marriage_date_normalized" date,
	"marriage_place" text
);
--> statement-breakpoint
CREATE TABLE "family_children" (
	"family_id" uuid NOT NULL,
	"child_id" uuid NOT NULL,
	"order" integer,
	"relationship_type" text DEFAULT 'biological' NOT NULL,
	CONSTRAINT "family_children_family_id_child_id_pk" PRIMARY KEY("family_id","child_id")
);
--> statement-breakpoint
CREATE TABLE "import_jobs" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tree_id" uuid NOT NULL,
	"account_id" uuid NOT NULL,
	"status" text DEFAULT 'pending' NOT NULL,
	"file_name" text NOT NULL,
	"storage_path" text,
	"payload_json" jsonb,
	"counts" jsonb NOT NULL,
	"issues" jsonb NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"expires_at" timestamp with time zone NOT NULL
);
--> statement-breakpoint
CREATE TABLE "lineage_members" (
	"lineage_id" uuid NOT NULL,
	"person_id" uuid NOT NULL,
	"order" integer NOT NULL,
	CONSTRAINT "lineage_members_lineage_id_person_id_pk" PRIMARY KEY("lineage_id","person_id")
);
--> statement-breakpoint
CREATE TABLE "lineages" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tree_id" uuid NOT NULL,
	"name" text NOT NULL,
	"description" text
);
--> statement-breakpoint
CREATE TABLE "people" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tree_id" uuid NOT NULL,
	"given_name" text NOT NULL,
	"surname" text NOT NULL,
	"full_name" text NOT NULL,
	"suffix" text,
	"gender" text DEFAULT 'unknown' NOT NULL,
	"birth_date_text" text,
	"birth_date_normalized" date,
	"birth_place" text,
	"death_date_text" text,
	"death_date_normalized" date,
	"death_place" text,
	"summary" text,
	"biography_md" text,
	"is_living" boolean DEFAULT false NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "person_consents" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"project_id" uuid NOT NULL,
	"person_id" uuid NOT NULL,
	"subject_kind" text NOT NULL,
	"status" text NOT NULL,
	"allowed_fields" jsonb NOT NULL,
	"evidence_reference" text,
	"hidden_by_default" boolean DEFAULT true NOT NULL,
	"recorded_by_actor_id" text,
	"recorded_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE "professional_portfolios" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"owner_account_id" uuid NOT NULL,
	"practice_name" text NOT NULL,
	"practitioner_name" text NOT NULL,
	"descriptor" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "project_audit_events" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"project_id" uuid NOT NULL,
	"actor_id" text NOT NULL,
	"type" text NOT NULL,
	"summary" text NOT NULL,
	"metadata" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"occurred_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "project_branding" (
	"project_id" uuid PRIMARY KEY NOT NULL,
	"practice_name" text NOT NULL,
	"logo_storage_path" text,
	"mark" text NOT NULL,
	"primary_color" text NOT NULL,
	"accent_color" text NOT NULL,
	"background_color" text NOT NULL,
	"typography" text DEFAULT 'editorial' NOT NULL,
	"byline" text NOT NULL,
	"support_email" text NOT NULL,
	"theme_id" text DEFAULT 'heirloom' NOT NULL,
	"welcome_json" jsonb NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "project_checklist_items" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"project_id" uuid NOT NULL,
	"key" text NOT NULL,
	"label" text NOT NULL,
	"required_for_publish" boolean DEFAULT true NOT NULL,
	"status" text DEFAULT 'pending' NOT NULL,
	"evidence_reference" text,
	"override_reason" text,
	"completed_by_actor_id" text,
	"completed_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE "project_deletion_requests" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"project_id" uuid NOT NULL,
	"requested_by_actor_id" text NOT NULL,
	"status" text DEFAULT 'scheduled' NOT NULL,
	"requested_at" timestamp with time zone DEFAULT now() NOT NULL,
	"cancel_until" timestamp with time zone NOT NULL,
	"primary_deletion_due_at" timestamp with time zone NOT NULL,
	"recovery_deletion_due_at" timestamp with time zone NOT NULL,
	"backup_age_out_target_at" timestamp with time zone,
	"cancelled_at" timestamp with time zone,
	"completed_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE "project_export_jobs" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"project_id" uuid NOT NULL,
	"requested_by_actor_id" text NOT NULL,
	"status" text DEFAULT 'queued' NOT NULL,
	"manifest_version" text NOT NULL,
	"download_storage_path" text,
	"requested_at" timestamp with time zone DEFAULT now() NOT NULL,
	"ready_at" timestamp with time zone,
	"expires_at" timestamp with time zone NOT NULL,
	"deleted_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE "project_handoffs" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"project_id" uuid NOT NULL,
	"owner_actor_id" text NOT NULL,
	"owner_identity_account_id" uuid NOT NULL,
	"status" text DEFAULT 'pending' NOT NULL,
	"identity_verified_at" timestamp with time zone NOT NULL,
	"invited_at" timestamp with time zone NOT NULL,
	"accepted_at" timestamp with time zone,
	"professional_support_expires_at" timestamp with time zone,
	"support_extension_count" integer DEFAULT 0 NOT NULL,
	CONSTRAINT "project_handoffs_project_id_unique" UNIQUE("project_id")
);
--> statement-breakpoint
CREATE TABLE "project_invites" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"project_id" uuid NOT NULL,
	"recipient_id" uuid NOT NULL,
	"recipient_label" text NOT NULL,
	"recipient_email" text NOT NULL,
	"purpose" text NOT NULL,
	"token_hash" text NOT NULL,
	"token_hint" text NOT NULL,
	"status" text DEFAULT 'issued' NOT NULL,
	"issued_at" timestamp with time zone DEFAULT now() NOT NULL,
	"expires_at" timestamp with time zone NOT NULL,
	"redeemed_at" timestamp with time zone,
	"revoked_at" timestamp with time zone,
	"reissued_from_invite_id" uuid
);
--> statement-breakpoint
CREATE TABLE "project_media" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"project_id" uuid NOT NULL,
	"kind" text NOT NULL,
	"file_name" text NOT NULL,
	"mime_type" text NOT NULL,
	"byte_size" integer NOT NULL,
	"sha256" text NOT NULL,
	"original_storage_path" text NOT NULL,
	"derivative_storage_path" text,
	"inert_preview_storage_path" text,
	"caption" text NOT NULL,
	"alt_text" text,
	"decorative" boolean DEFAULT false NOT NULL,
	"provenance" text NOT NULL,
	"rights_basis" text NOT NULL,
	"rights_evidence_reference" text NOT NULL,
	"consent_status" text DEFAULT 'not_required' NOT NULL,
	"visibility" text DEFAULT 'private' NOT NULL,
	"featured" boolean DEFAULT false NOT NULL,
	"quarantine_status" text DEFAULT 'pending' NOT NULL,
	"signature_status" text DEFAULT 'pending' NOT NULL,
	"malware_scan_status" text DEFAULT 'pending' NOT NULL,
	"malware_scan_procedure" text,
	"quarantine_failure_reason" text,
	"quarantine_checked_by_actor_id" text,
	"quarantine_checked_at" timestamp with time zone,
	"uploaded_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "project_media_people" (
	"media_id" uuid NOT NULL,
	"person_id" uuid NOT NULL,
	CONSTRAINT "project_media_people_media_id_person_id_pk" PRIMARY KEY("media_id","person_id")
);
--> statement-breakpoint
CREATE TABLE "project_media_sources" (
	"media_id" uuid NOT NULL,
	"source_id" uuid NOT NULL,
	CONSTRAINT "project_media_sources_media_id_source_id_pk" PRIMARY KEY("media_id","source_id")
);
--> statement-breakpoint
CREATE TABLE "project_metrics" (
	"project_id" uuid PRIMARY KEY NOT NULL,
	"concierge_minutes" integer DEFAULT 0 NOT NULL,
	"genealogist_setup_minutes" integer DEFAULT 0 NOT NULL,
	"import_succeeded" boolean DEFAULT false NOT NULL,
	"imported_people" integer DEFAULT 0 NOT NULL,
	"import_warning_count" integer DEFAULT 0 NOT NULL,
	"client_viewer_count" integer DEFAULT 0 NOT NULL,
	"client_share_count" integer DEFAULT 0 NOT NULL,
	"repeat_project" boolean DEFAULT false NOT NULL,
	"acquisition_cost_cents" integer DEFAULT 0 NOT NULL,
	"gross_sales_cents" integer DEFAULT 0 NOT NULL,
	"cash_cost_cents" integer DEFAULT 0 NOT NULL,
	"refund_cents" integer DEFAULT 0 NOT NULL,
	"privacy_incident_count" integer DEFAULT 0 NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "project_revisions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"project_id" uuid NOT NULL,
	"sequence" integer NOT NULL,
	"based_on_revision_id" uuid,
	"status" text DEFAULT 'draft' NOT NULL,
	"content_snapshot" jsonb NOT NULL,
	"created_by_actor_id" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"approved_at" timestamp with time zone,
	"published_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE "project_roles" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"project_id" uuid NOT NULL,
	"actor_id" text NOT NULL,
	"identity_account_id" uuid,
	"display_name" text NOT NULL,
	"role" text NOT NULL,
	"status" text DEFAULT 'pending' NOT NULL,
	"granted_at" timestamp with time zone DEFAULT now() NOT NULL,
	"expires_at" timestamp with time zone,
	"revoked_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE "project_viewer_sessions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"project_id" uuid NOT NULL,
	"invite_id" uuid NOT NULL,
	"recipient_id" uuid NOT NULL,
	"session_token_hash" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"last_seen_at" timestamp with time zone DEFAULT now() NOT NULL,
	"idle_expires_at" timestamp with time zone NOT NULL,
	"absolute_expires_at" timestamp with time zone NOT NULL,
	"revoked_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE "projects" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"portfolio_id" uuid NOT NULL,
	"tree_id" uuid NOT NULL,
	"slug" text NOT NULL,
	"title" text NOT NULL,
	"client_label" text NOT NULL,
	"focal_person_id" uuid,
	"workflow_status" text DEFAULT 'intake' NOT NULL,
	"max_people" integer DEFAULT 500 NOT NULL,
	"max_media_items" integer DEFAULT 25 NOT NULL,
	"max_featured_stories" integer DEFAULT 5 NOT NULL,
	"min_featured_stories" integer DEFAULT 3 NOT NULL,
	"max_media_bytes" integer DEFAULT 524288000 NOT NULL,
	"max_file_bytes" integer DEFAULT 20971520 NOT NULL,
	"included_correction_rounds" integer DEFAULT 2 NOT NULL,
	"hosting_months" integer DEFAULT 12 NOT NULL,
	"legal_review_completed_at" timestamp with time zone,
	"published_revision_id" uuid,
	"published_at" timestamp with time zone,
	"no_index" boolean DEFAULT true NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "review_issues" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tree_id" uuid NOT NULL,
	"type" text NOT NULL,
	"subject_type" text NOT NULL,
	"subject_id" uuid NOT NULL,
	"description" text NOT NULL,
	"status" text DEFAULT 'open' NOT NULL,
	"resolution_note" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"resolved_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE "sources" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tree_id" uuid NOT NULL,
	"title" text NOT NULL,
	"author" text,
	"url" text,
	"notes" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "stories" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"project_id" uuid NOT NULL,
	"title" text NOT NULL,
	"dek" text NOT NULL,
	"body_md" text NOT NULL,
	"cover_media_id" uuid,
	"visibility" text DEFAULT 'private' NOT NULL,
	"featured" boolean DEFAULT false NOT NULL,
	"order" integer DEFAULT 0 NOT NULL,
	"status" text DEFAULT 'draft' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "story_people" (
	"story_id" uuid NOT NULL,
	"person_id" uuid NOT NULL,
	CONSTRAINT "story_people_story_id_person_id_pk" PRIMARY KEY("story_id","person_id")
);
--> statement-breakpoint
CREATE TABLE "story_sources" (
	"story_id" uuid NOT NULL,
	"source_id" uuid NOT NULL,
	"note" text,
	CONSTRAINT "story_sources_story_id_source_id_pk" PRIMARY KEY("story_id","source_id")
);
--> statement-breakpoint
CREATE TABLE "trees" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"account_id" uuid NOT NULL,
	"name" text NOT NULL,
	"slug" text NOT NULL,
	"description" text,
	"theme_layout" text DEFAULT 'editorial' NOT NULL,
	"theme_skin" text DEFAULT 'dark-gold' NOT NULL,
	"is_public" boolean DEFAULT false NOT NULL,
	"share_token" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "trees_slug_unique" UNIQUE("slug"),
	CONSTRAINT "trees_share_token_unique" UNIQUE("share_token")
);
--> statement-breakpoint
ALTER TABLE "citations" ADD CONSTRAINT "citations_claim_id_claims_id_fk" FOREIGN KEY ("claim_id") REFERENCES "public"."claims"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "citations" ADD CONSTRAINT "citations_source_id_sources_id_fk" FOREIGN KEY ("source_id") REFERENCES "public"."sources"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "claims" ADD CONSTRAINT "claims_tree_id_trees_id_fk" FOREIGN KEY ("tree_id") REFERENCES "public"."trees"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "client_review_items" ADD CONSTRAINT "client_review_items_review_version_id_client_review_versions_id_fk" FOREIGN KEY ("review_version_id") REFERENCES "public"."client_review_versions"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "client_review_versions" ADD CONSTRAINT "client_review_versions_project_id_projects_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "client_review_versions" ADD CONSTRAINT "client_review_versions_revision_id_project_revisions_id_fk" FOREIGN KEY ("revision_id") REFERENCES "public"."project_revisions"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "events" ADD CONSTRAINT "events_tree_id_trees_id_fk" FOREIGN KEY ("tree_id") REFERENCES "public"."trees"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "events" ADD CONSTRAINT "events_person_id_people_id_fk" FOREIGN KEY ("person_id") REFERENCES "public"."people"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "external_ids" ADD CONSTRAINT "external_ids_tree_id_trees_id_fk" FOREIGN KEY ("tree_id") REFERENCES "public"."trees"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "families" ADD CONSTRAINT "families_tree_id_trees_id_fk" FOREIGN KEY ("tree_id") REFERENCES "public"."trees"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "families" ADD CONSTRAINT "families_spouse_1_id_people_id_fk" FOREIGN KEY ("spouse_1_id") REFERENCES "public"."people"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "families" ADD CONSTRAINT "families_spouse_2_id_people_id_fk" FOREIGN KEY ("spouse_2_id") REFERENCES "public"."people"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "family_children" ADD CONSTRAINT "family_children_family_id_families_id_fk" FOREIGN KEY ("family_id") REFERENCES "public"."families"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "family_children" ADD CONSTRAINT "family_children_child_id_people_id_fk" FOREIGN KEY ("child_id") REFERENCES "public"."people"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "import_jobs" ADD CONSTRAINT "import_jobs_tree_id_trees_id_fk" FOREIGN KEY ("tree_id") REFERENCES "public"."trees"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "import_jobs" ADD CONSTRAINT "import_jobs_account_id_accounts_id_fk" FOREIGN KEY ("account_id") REFERENCES "public"."accounts"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "lineage_members" ADD CONSTRAINT "lineage_members_lineage_id_lineages_id_fk" FOREIGN KEY ("lineage_id") REFERENCES "public"."lineages"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "lineage_members" ADD CONSTRAINT "lineage_members_person_id_people_id_fk" FOREIGN KEY ("person_id") REFERENCES "public"."people"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "lineages" ADD CONSTRAINT "lineages_tree_id_trees_id_fk" FOREIGN KEY ("tree_id") REFERENCES "public"."trees"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "people" ADD CONSTRAINT "people_tree_id_trees_id_fk" FOREIGN KEY ("tree_id") REFERENCES "public"."trees"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "person_consents" ADD CONSTRAINT "person_consents_project_id_projects_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "person_consents" ADD CONSTRAINT "person_consents_person_id_people_id_fk" FOREIGN KEY ("person_id") REFERENCES "public"."people"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "professional_portfolios" ADD CONSTRAINT "professional_portfolios_owner_account_id_accounts_id_fk" FOREIGN KEY ("owner_account_id") REFERENCES "public"."accounts"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "project_audit_events" ADD CONSTRAINT "project_audit_events_project_id_projects_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "project_branding" ADD CONSTRAINT "project_branding_project_id_projects_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "project_checklist_items" ADD CONSTRAINT "project_checklist_items_project_id_projects_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "project_deletion_requests" ADD CONSTRAINT "project_deletion_requests_project_id_projects_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "project_export_jobs" ADD CONSTRAINT "project_export_jobs_project_id_projects_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "project_handoffs" ADD CONSTRAINT "project_handoffs_project_id_projects_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "project_handoffs" ADD CONSTRAINT "project_handoffs_owner_identity_account_id_accounts_id_fk" FOREIGN KEY ("owner_identity_account_id") REFERENCES "public"."accounts"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "project_invites" ADD CONSTRAINT "project_invites_project_id_projects_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "project_media" ADD CONSTRAINT "project_media_project_id_projects_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "project_media_people" ADD CONSTRAINT "project_media_people_media_id_project_media_id_fk" FOREIGN KEY ("media_id") REFERENCES "public"."project_media"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "project_media_people" ADD CONSTRAINT "project_media_people_person_id_people_id_fk" FOREIGN KEY ("person_id") REFERENCES "public"."people"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "project_media_sources" ADD CONSTRAINT "project_media_sources_media_id_project_media_id_fk" FOREIGN KEY ("media_id") REFERENCES "public"."project_media"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "project_media_sources" ADD CONSTRAINT "project_media_sources_source_id_sources_id_fk" FOREIGN KEY ("source_id") REFERENCES "public"."sources"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "project_metrics" ADD CONSTRAINT "project_metrics_project_id_projects_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "project_revisions" ADD CONSTRAINT "project_revisions_project_id_projects_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "project_roles" ADD CONSTRAINT "project_roles_project_id_projects_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "project_roles" ADD CONSTRAINT "project_roles_identity_account_id_accounts_id_fk" FOREIGN KEY ("identity_account_id") REFERENCES "public"."accounts"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "project_viewer_sessions" ADD CONSTRAINT "project_viewer_sessions_project_id_projects_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "project_viewer_sessions" ADD CONSTRAINT "project_viewer_sessions_invite_id_project_invites_id_fk" FOREIGN KEY ("invite_id") REFERENCES "public"."project_invites"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "projects" ADD CONSTRAINT "projects_portfolio_id_professional_portfolios_id_fk" FOREIGN KEY ("portfolio_id") REFERENCES "public"."professional_portfolios"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "projects" ADD CONSTRAINT "projects_tree_id_trees_id_fk" FOREIGN KEY ("tree_id") REFERENCES "public"."trees"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "projects" ADD CONSTRAINT "projects_focal_person_id_people_id_fk" FOREIGN KEY ("focal_person_id") REFERENCES "public"."people"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "review_issues" ADD CONSTRAINT "review_issues_tree_id_trees_id_fk" FOREIGN KEY ("tree_id") REFERENCES "public"."trees"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sources" ADD CONSTRAINT "sources_tree_id_trees_id_fk" FOREIGN KEY ("tree_id") REFERENCES "public"."trees"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "stories" ADD CONSTRAINT "stories_project_id_projects_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "stories" ADD CONSTRAINT "stories_cover_media_id_project_media_id_fk" FOREIGN KEY ("cover_media_id") REFERENCES "public"."project_media"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "story_people" ADD CONSTRAINT "story_people_story_id_stories_id_fk" FOREIGN KEY ("story_id") REFERENCES "public"."stories"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "story_people" ADD CONSTRAINT "story_people_person_id_people_id_fk" FOREIGN KEY ("person_id") REFERENCES "public"."people"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "story_sources" ADD CONSTRAINT "story_sources_story_id_stories_id_fk" FOREIGN KEY ("story_id") REFERENCES "public"."stories"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "story_sources" ADD CONSTRAINT "story_sources_source_id_sources_id_fk" FOREIGN KEY ("source_id") REFERENCES "public"."sources"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "trees" ADD CONSTRAINT "trees_account_id_accounts_id_fk" FOREIGN KEY ("account_id") REFERENCES "public"."accounts"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "client_review_items_version_status_idx" ON "client_review_items" USING btree ("review_version_id","status");--> statement-breakpoint
CREATE UNIQUE INDEX "client_review_round_unique" ON "client_review_versions" USING btree ("project_id","round");--> statement-breakpoint
CREATE UNIQUE INDEX "person_consent_project_unique" ON "person_consents" USING btree ("project_id","person_id");--> statement-breakpoint
CREATE INDEX "project_audit_timeline_idx" ON "project_audit_events" USING btree ("project_id","occurred_at");--> statement-breakpoint
CREATE UNIQUE INDEX "project_checklist_key_unique" ON "project_checklist_items" USING btree ("project_id","key");--> statement-breakpoint
CREATE INDEX "project_export_expiry_idx" ON "project_export_jobs" USING btree ("status","expires_at");--> statement-breakpoint
CREATE UNIQUE INDEX "project_invites_token_hash_unique" ON "project_invites" USING btree ("token_hash");--> statement-breakpoint
CREATE INDEX "project_invites_recipient_idx" ON "project_invites" USING btree ("project_id","recipient_id");--> statement-breakpoint
CREATE UNIQUE INDEX "project_media_sha_unique" ON "project_media" USING btree ("project_id","sha256");--> statement-breakpoint
CREATE INDEX "project_media_quarantine_idx" ON "project_media" USING btree ("project_id","quarantine_status");--> statement-breakpoint
CREATE UNIQUE INDEX "project_revision_sequence_unique" ON "project_revisions" USING btree ("project_id","sequence");--> statement-breakpoint
CREATE UNIQUE INDEX "project_role_actor_unique" ON "project_roles" USING btree ("project_id","actor_id");--> statement-breakpoint
CREATE INDEX "project_role_identity_idx" ON "project_roles" USING btree ("project_id","identity_account_id");--> statement-breakpoint
CREATE UNIQUE INDEX "project_sessions_token_hash_unique" ON "project_viewer_sessions" USING btree ("session_token_hash");--> statement-breakpoint
CREATE INDEX "project_sessions_recipient_idx" ON "project_viewer_sessions" USING btree ("project_id","recipient_id");--> statement-breakpoint
CREATE UNIQUE INDEX "projects_slug_unique" ON "projects" USING btree ("slug");--> statement-breakpoint
CREATE INDEX "projects_portfolio_status_idx" ON "projects" USING btree ("portfolio_id","workflow_status");--> statement-breakpoint
CREATE INDEX "projects_tree_idx" ON "projects" USING btree ("tree_id");--> statement-breakpoint
CREATE INDEX "stories_project_featured_idx" ON "stories" USING btree ("project_id","featured");