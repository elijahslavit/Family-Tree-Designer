# Paid-pilot product specification

Status: implementation baseline for the first two founding pilots

Primary owner: founder

Target: synthetic flagship demo by day 14; first paid pilot by day 45

## Product definition

Family Tree Designer is the premium presentation and client-delivery layer for professional genealogists. It turns an existing GEDCOM, selected photographs, short stories, records, and sources into one private, branded, interactive family-history website. It complements research tools; it is not another research database.

The opening experience should feel like a beautifully curated family-history book: a family name, one strong photograph or restrained collage, a short line of editorial copy, subtle professional branding, and one primary action—**Explore your family**. The next view centers the selected family branch and offers three calm paths: explore the tree, meet featured ancestors, or follow a featured story.

## Primary customer and users

The first buyer is a solo or two-to-five-person U.S. professional genealogy practice that performs commissioned family-history or legacy projects for private clients. The practice already exports GEDCOM, delivers narrative reports/charts/source folders, completes several projects each year, and cares about presentation. Forensic, probate, DNA-identification, unknown-parentage, disputed-adoption, and citizenship-evidence engagements are outside founding-pilot scope.

| Role | Identity | Pilot capabilities |
| --- | --- | --- |
| Platform operator | Authenticated founder/support identity | Intake, scoped concierge work, audited emergency support only |
| Genealogist | Authenticated professional | Project setup, import review, curation, preview, review resolution, publication until handoff |
| Client reviewer | Accountless, role-scoped invitation/session | View one frozen pending version; submit one structured consolidated review per round; approve final version |
| Archive owner | Verified authenticated control-plane identity | Accept handoff; manage recipients, exports, deletion, support extensions, and professional access |
| Passive viewer | Accountless recipient-specific invitation/session | Read-only access to the authorized private presentation |

The genealogist controls the project through review and approval. Handoff transfers archive authority to the authenticated client owner. The family owns its submitted content and can export it. The genealogist’s curated work-product rights are governed by the service agreement.

The founding presentation is co-branded: the genealogist’s practice is primary and a restrained “Powered by Family Tree Designer” attribution remains visible. Custom domains and full white-label delivery are post-validation options, not founding-pilot promises.

## Founding-pilot contract

One project includes:

- up to 500 imported people;
- up to 25 media items and 500 MB total;
- up to five featured stories, with at least three expected for pilot qualification;
- one theme selected from the supported pilot themes;
- two frozen, consolidated correction rounds;
- one invite-only presentation;
- 12 months of hosting; and
- up to 4–6 hours of measured founder concierge work for the earliest pilots.

Overages or custom work require a separate written quote. The product UI does not show prices, collect payment, or automate billing during the founding pilots.

## Product principles

1. **Story first, database second.** GEDCOM supplies structure; portraits, 1–3 sentence memories, selected records, and sources create emotional value.
2. **Strong with sparse material.** The system highlights where a small amount of content adds the most value but never invents content.
3. **Complete graph, intentionally partial views.** Begin with one person or household and nearby generations; expand on demand.
4. **Respect every family form.** Biological, adoptive, step, foster/guardian, and partner relationships receive clear equal-status labels. Multiple unions remain distinct. Uncertainty is labeled with source context and never conveyed by color alone.
5. **Private by default.** `noindex` is defense in depth, not authorization. All content access is enforced server-side.
6. **Approved versions are immutable.** Changes after final approval create a new unpublished revision.
7. **Portable, never hostage.** Owners can export the archive and receive clear recovery/deletion dates.

## Information architecture

### Professional workspace

1. **Portfolio:** all projects, current workflow state, caps, blockers, next action, due date, and concierge time.
2. **Project overview:** scope, client, professional branding, focal branch, legal/readiness gates, and activity.
3. **Materials:** GEDCOM, branding, media, stories, sources, rights, consent, and validation status.
4. **Import review:** parsed counts, warnings, duplicate/unresolved references, living-person/privacy checks, and acknowledgments.
5. **Curation:** welcome composition, focal person/branch, featured ancestors/stories, media assignments, and theme.
6. **Preview:** authorization-faithful professional preview for desktop and mobile.
7. **Reviews:** immutable review versions, structured requests, dispositions, and approval.
8. **Publish and access:** readiness checklist, recipient invitations, reissue/revoke controls, and audit summary.
9. **Handoff:** owner identity, acceptance, professional support expiry, and explicit extensions.
10. **Archive operations:** renewal status, export, recovery date, deletion workflow, and access audit.

### Client presentation

1. Invitation exchange and explicit expired, used, revoked, malformed, and reissued-link states.
2. Branded welcome page.
3. Focused overview centered on the designated branch.
4. Interactive focused tree with collapse/expand, search, breadcrumbs, mini-map, and relationship path where supported.
5. Person profile with consent-safe facts, portrait, stories, relationship labels, and source references.
6. Featured-story journey linking people, media, records, and sources.
7. Authenticated PDF attachment download from an inert preview.
8. Clear private-content and session-expiry treatment without exposing authorization internals.

Purpose-specific family-group, ancestor/descendant, timeline, map, and story views are the long-term direction. The founding pilot must deliver the focused tree and story/profile experience; additional advanced views are deferred unless already sound in the repository.

## Ten-state delivery workflow

| # | State | Exit criteria |
| --- | --- | --- |
| 1 | Intake | Written scope, price, client, genealogist, caps, due dates, and legal status recorded |
| 2 | Materials | GEDCOM, branding, focal branch, media/stories/sources, rights attestations, and consent records received or explicitly missing |
| 3 | Import review | Counts and warnings reviewed; media matches and unresolved warnings resolved or acknowledged; time recorded |
| 4 | Curation | Welcome, focal branch, one theme, profiles, and featured-story sequence ready |
| 5 | Professional preview | Genealogist checks desktop/mobile content and presentation through real authorization logic |
| 6 | Client review round one | One role-scoped reviewer submits one structured, consolidated request against frozen version 1 |
| 7 | Revision and round two | Every round-one item has a disposition; version 2 is frozen; final consolidated request is submitted/resolved |
| 8 | Approval and publication | Client explicitly approves the frozen final version; private delivery version is published |
| 9 | Handoff | Verified owner accepts authority; role transfer and 30-day professional support expiry are audited |
| 10 | Active archive | Owner controls access, export, deletion, support extensions, and renewal |

### Publication blockers

Publication remains disabled until all applicable items pass:

- legal-review gate recorded complete for real data;
- project is within allowed case scope;
- media-rights attestations complete;
- living-person consent and minimization review complete;
- living minors hidden;
- focal branch and welcome page selected;
- at least three featured stories, or a named operator records the reason for a story-light override;
- all import warnings resolved or explicitly acknowledged;
- quarantined media passed signature validation and the named malware-scan procedure;
- professional preview complete; and
- no un-dispositioned review item remains.

## Invitation and session contract

- Recipient-specific, manually delivered invitations are the only founding-pilot presentation access method.
- Every invitation is a single-use bearer credential. Show the raw token once; persist only a cryptographic hash.
- An unused invitation expires after seven days.
- Successful exchange creates an HTTP-only, `Secure`, `SameSite` session with a **30-day absolute lifetime and seven-day idle timeout**. Activity may extend the idle deadline but never the absolute deadline.
- Revoking a recipient invalidates outstanding invitations and active sessions and records an audit event.
- Reissue creates a new invitation and invalidates the prior one. Lost, expired, used, revoked, and malformed links receive distinct, non-leaking screens.
- Professional preview uses a scoped preview authorization path; it does not bypass content authorization.
- `noindex` headers and metadata apply to all private presentation routes but never replace access checks.

## Privacy behavior

- The complete site is invite-only unless an archive owner deliberately publishes selected material after the pilot phase.
- Anonymous visitors see no family content; a future public landing page may show only explicitly public stories.
- Living adults expose only minimized, specifically consented fields. No exact addresses or full birth dates appear.
- Living minors are hidden by default and throughout the founding pilots.
- Adoption details, estrangements, sensitive stories, exact locations, and disputed relationships are item- or branch-restricted.
- Uncertain relationships are visibly labeled with accessible cues and source context.
- A living adult must be able to request viewing, correction, hiding, or removal of their profile through the owner-operated process.

## Media contract

| Rule | Pilot requirement |
| --- | --- |
| Accepted types | JPEG, PNG, WebP, and PDF only |
| Excluded | HEIC, TIFF, video, audio, ZIP, office documents, OCR, restoration, facial recognition, and AI-generated stories |
| Limits | 20 MB per file; 25 items and 500 MB total per project |
| Ingest | Private quarantine; validate extension, MIME, and signature before parsing |
| Malware | Named scan procedure and operator result required; failed files remain isolated and are never parsed |
| Derivatives | Generate browser-safe images separately; remove EXIF/location metadata |
| PDFs | Use separately generated inert previews; serve originals only as authenticated attachment downloads |
| Metadata | SHA-256, caption, meaningful alt text or explicit decorative flag, provenance, rights basis, consent, visibility, and linked people |
| Duplicates | Detect by content hash |
| Originals | Preserve unchanged, private originals for provenance and eligible export |

Quarantined files cannot appear in derivatives, previews, exports, or client presentations. Unsupported formats receive format-specific safe-conversion guidance instead of a generic error.

## Required interface states

Every pilot-facing route or panel must support, as applicable:

- loading skeletons that preserve layout;
- first-use and no-result empty states with one next action;
- inline field validation and cap feedback before submission;
- recoverable system errors with retry and a support reference;
- authorization denied without confirming private content exists;
- offline/connection-loss feedback for mutations;
- successful save, publish, invite, export, and handoff confirmation;
- destructive confirmations with explicit effect and dates;
- responsive desktop, tablet, and mobile layouts;
- keyboard focus, semantic headings, labeled controls, non-color status cues, and reduced-motion support; and
- exact workflow blocker explanations rather than disabled controls with no reason.

## Retention, export, and deletion UI

- Unconfirmed import staging expires after seven days.
- At nonrenewal, editing and new invitations stop; existing viewing continues for a 30-day grace period.
- After grace, the presentation is offline but recoverable for 12 months, then queued for permanent deletion.
- Owner-requested deletion disables access immediately, supports an explicit seven-day cancellation window, and targets primary-data purge within 30 days.
- Show expiration, grace-end, recovery-end, deletion-cancellation, primary-purge, and expected backup-age-out dates in the owner UI.
- Require typed project-name confirmation for deletion.
- Generated exports require authentication, are audit-logged, use short-lived download authorization, and are automatically deleted within 24 hours.
- Export ZIP includes original GEDCOM, normalized portable data, eligible original media, stories, sources, audit-safe metadata, a durable static presentation, and a manifest explaining provenance, privacy responsibilities, and opening instructions.
- Exclude secrets, raw invite/session tokens, credentials, and internal security logs.

Provider backup retention must be verified before making client promises. The target is for deleted data to age out of backups within no more than 35 days where the selected provider permits.

## Explicitly deferred

- Research databases, record search, DNA matching, claim adjudication, or evidence authoring
- Ancestry/FamilySearch direct integrations
- Public family sites during the founding pilots
- Family contribution and moderation workflow
- Custom domains, complete white-labeling, and automated billing
- Split family renewal payments and a preservation-only tier; both remain commercial hypotheses
- Automated outreach or transactional email delivery
- Audio/video, HEIC/TIFF ingest, OCR, restoration, face recognition, or generated stories
- Unlimited layouts, media, correction rounds, or collaborative editing
- Automated malware scanning, unless it can be added without risking the demo schedule

## Definition of complete paid-pilot UI

The UI is complete when a synthetic project can traverse all ten workflow states and every professional/client surface listed above without a dead end; all required loading, empty, validation, error, authorization, expiry, revocation, review-version, export, deletion, responsive, and handoff states are demonstrable; and lint, type checking, unit tests, production build, and desktop/mobile visual inspection pass. Production handling of real data remains separately gated by legal review, provisioned infrastructure, security verification, and a consented dataset.
