# Founding-pilot operations runbook

Status: working operating procedure

Owner: founder/operator

Legal status: **operational draft, not legal advice**

Use this runbook for every synthetic rehearsal and paid project. Real-data steps remain disabled until the project’s legal-review gate and production-readiness gate are both recorded complete.

## Service levels and caps

- One project, maximum 500 people.
- Maximum 25 media items, 500 MB total, and 20 MB per item.
- Up to five featured stories; three is the pilot qualification minimum unless a named operator records a story-light override and reason.
- One theme and two consolidated review rounds.
- Twelve months of hosting.
- Initial founder concierge budget: 4–6 hours. Record every work block by category.
- Target by pilot three: less than two founder delivery hours and less than 30 minutes of genealogist effort.

Stop and quote an overage before exceeding scope. Never hide excess labor inside the pilot.

## Roles and separation of duties

| Role | Normal access | Prohibited without a new grant |
| --- | --- | --- |
| Operator | Intake metadata and scoped concierge access | Routine browsing after handoff; unrecorded emergency access |
| Genealogist | Full project access through delivery; 30-day support access after handoff | Owner powers; access after expiry without an owner-approved 30-day extension |
| Client reviewer | Frozen pending version and structured review only | Editing, invitation management, export, deletion |
| Archive owner | Authenticated control plane, access/export/deletion/support management | Platform administration |
| Passive viewer | Read-only presentation for authorized recipient/session | Editing, review, owner controls |

All role changes, support extensions, revocations, exports, deletion requests, and emergency access are audited.

## Project record

Before work, create a record containing:

- project ID and display name;
- genealogist/practice and primary client identifiers;
- focal person/branch and intended delivery date;
- signed scope, price, payment status, caps, and overage approvals;
- case-category eligibility and U.S. scope confirmation;
- legal-review completion ID and date;
- client authorization, living-person consent, and media-rights attestations;
- intake, import, curation, review, publish, handoff, renewal, recovery, and deletion dates;
- current workflow state, blocker, owner, and next action;
- founder and professional time by category;
- media count/bytes and story/person counts; and
- production environment and backup-retention verification record.

Use synthetic identifiers and fixtures during development. Do not copy real names or content into tickets, analytics, logs, screenshots, or test fixtures.

## Ten-state operating procedure

### 1. Intake

- [ ] Confirm project category is allowed.
- [ ] Record written scope, caps, price, payment, client, and genealogist.
- [ ] Confirm legal and infrastructure gates; reject real data if incomplete.
- [ ] Create project timeline and secure transfer instructions.
- [ ] Start the concierge timer.

Exit: intake checklist signed by the operator; project may request materials.

### 2. Materials

- [ ] Receive one GEDCOM through the approved private channel only after the preflight terms below are acknowledged.
- [ ] Receive one focal person or branch, brand logo/colors, up to 25 media items, up to five stories, and selected sources.
- [ ] Record client authorization, rights basis, provenance, consent, and visibility for every applicable item.
- [ ] Count people/media/bytes/stories against caps before processing.
- [ ] Place all new files in quarantine; never preview or parse quarantined media.

Exit: materials inventory complete; missing items are explicit, not inferred.

#### GEDCOM preflight and acceptance

Founding-pilot defaults, subject to the signed service order and counsel review:

- one file no larger than **25 MB**, representing no more than 500 people;
- GEDCOM **5.5 or 5.5.1** text; accept UTF-8 or documented ANSEL and reject unknown/binary encodings;
- no ZIP, executable content, cloud-database export, or renamed non-GEDCOM file;
- preserve the original and generate a preflight report before substantive curation;
- report malformed structures, unresolved references, unsupported tags, suspected duplicates, living-person uncertainty, and media links without silently dropping or merging them.

Within two business days after all real-data gates pass and the file is securely received, choose one outcome in writing:

1. **Accept:** within caps and repeatably importable; the paid delivery clock starts.
2. **Accept with acknowledged warnings:** the professional approves the listed non-material limitations.
3. **Remediation/overage:** provide an exact cleanup scope, price, and schedule; do nothing billable until approved.
4. **Reject and refund:** if the file cannot be supported within the signed scope and the customer declines remediation, return the founding-pilot fee in full and delete staged material under the approved procedure.

Never use the refund rule to bypass legal, rights, consent, or security gates. A disallowed case is rejected even if technically importable.

### 3. Import review

- [ ] Parse GEDCOM server-side with size/type validation.
- [ ] Record people, families, sources, media references, warnings, unresolved references, suspected duplicates, and living-person flags.
- [ ] Do not auto-merge suspected duplicates or silently discard unknown structures.
- [ ] Match media only after `PILOT-MEDIA-SCAN-01` passes.
- [ ] Resolve warnings or record a named acknowledgment and effect.
- [ ] Record founder and genealogist import/cleanup time separately.

Exit: import version frozen with an audit-safe summary and no unexplained data loss.

### 4. Curation

- [ ] Select family name, welcome line, hero media, focal branch, and one theme.
- [ ] Select up to five featured stories and associated people/media/sources.
- [ ] Verify profile text, relationship labels, uncertainty labels, and source links.
- [ ] Minimize living-adult fields and hide living minors.
- [ ] Confirm every visible image has meaningful alt text or is explicitly decorative.

Exit: a complete draft exists without invented content.

### 5. Professional preview

- [ ] Issue or use the scoped professional-preview authorization path.
- [ ] Inspect welcome, focused tree, profiles, story path, source/document previews, and navigation.
- [ ] Check desktop and mobile, keyboard access, reduced motion, and privacy behavior.
- [ ] Confirm preview uses the same authorization and privacy policies as delivery.
- [ ] Genealogist records approval to start client review.

Exit: review version 1 is frozen and labeled.

### 6. Client review round one

- [ ] Issue one role-scoped review invitation to the designated reviewer.
- [ ] Verify it exposes only frozen version 1 and cannot edit content or manage access.
- [ ] Reviewer submits one structured consolidated request.
- [ ] Lock the submitted request; record submission time and review-version ID.

Exit: round-one request is closed to additions and ready for disposition.

### 7. Revision and round two

- [ ] Give every round-one item a disposition: accepted, accepted with modification, declined with reason, or needs client clarification.
- [ ] Apply accepted corrections to a new unpublished revision.
- [ ] Freeze and label version 2; never move old comments onto new content.
- [ ] Run the second consolidated review using the same controls.
- [ ] Resolve and disposition every final item.

Exit: a frozen final candidate has no outstanding review items.

### 8. Approval and publication

- [ ] Run all publication blockers.
- [ ] Client explicitly approves the identified frozen version.
- [ ] Publish exactly that version as the private delivery.
- [ ] Create recipient invitations manually; show each raw token once and record only its hash.
- [ ] Record delivery date, hosting term, renewal date, and notice schedule.

Any content change after approval creates a new unpublished revision. Never silently change the approved delivery.

### 9. Handoff

- [ ] Verify the archive owner’s authenticated control-plane identity.
- [ ] Show owner powers and obligations; require explicit acceptance.
- [ ] Audit acceptance and role transfer.
- [ ] Set genealogist support expiry to 30 days after handoff.
- [ ] Explain that extensions require owner approval in explicit 30-day increments.
- [ ] Confirm owner can manage invitations, revoke the professional, export, and request deletion.
- [ ] Record the renewal payment contact; split payments and preservation-only service are not promised during the pilots.

Exit: archive owner controls the project and support-expiry date is visible.

### 10. Active archive

- [ ] Owner manages recipient invitations, revocation, export, and deletion.
- [ ] Operator records support work and emergency access.
- [ ] Record renewal status and send/acknowledge notices 30, 14, and 3 days before expiry.
- [ ] On renewal, confirm term and actual cost/support data.
- [ ] On nonrenewal or deletion, follow the lifecycle below.

## `PILOT-MEDIA-SCAN-01`

This named manual procedure is required before any real media leaves quarantine. The production-readiness gate must name the approved malware-scanning tool and update method before real uploads.

1. Record file ID, original filename, byte size, received timestamp, and SHA-256.
2. Validate allowed extension, detected MIME type, and magic/file signature. A mismatch fails immediately.
3. Scan the isolated original with the approved, updated malware engine; record engine, version/signature date, scan timestamp, operator, and result.
4. If failed or indeterminate: keep isolated, never parse, derive, export, or display it; notify the professional with safe next steps.
5. If passed: mark validation and scan separately, then permit derivative generation.
6. Strip EXIF/location metadata from image derivatives; preserve the private original unchanged.
7. For PDFs, create an inert preview using the approved isolated process and serve the original only as an authenticated attachment.
8. Record caption, alt text/decorative flag, provenance, rights basis, consent, visibility, and linked people before publication.

HEIC, TIFF, video, audio, ZIP, and office files receive specific conversion guidance. They are not renamed or parsed as accepted formats.

## Invitation operations

### Issue

- Confirm recipient and role.
- Generate a cryptographically random single-use token.
- Store only its cryptographic hash and metadata.
- Display the raw invitation once for manual delivery.
- Set unused expiry to seven days and audit creation.

### Exchange

- Validate the hash, role, expiry, revocation, and unused status atomically.
- Mark invite used and create an HTTP-only, `Secure`, `SameSite` session.
- Apply a 30-day absolute expiry and seven-day idle timeout; activity cannot extend the absolute deadline.
- Do not place tokens in logs, analytics, referrers, or error reports.

### Lost, expired, or revoked

- Show the correct safe state without exposing project content.
- Reissue only after authorized-role verification.
- Reissue invalidates the old invite and records a new event.
- Recipient revocation invalidates all outstanding invites and active sessions for that recipient.

## Export procedure

1. Owner authenticates and requests export; record requester, project, purpose, and timestamp.
2. Generate in isolated private storage: original GEDCOM, normalized portable data, eligible original media, stories, sources, audit-safe metadata, durable static presentation, and manifest.
3. Manifest explains structure, provenance, privacy responsibilities, and how to open the static presentation.
4. Exclude credentials, secrets, raw tokens, active session data, and internal security logs.
5. Create short-lived authenticated download authorization and audit creation/download.
6. Display expiration clearly; delete generated artifact automatically within 24 hours.
7. Record completion/failure without logging archive contents.

## Nonrenewal lifecycle

| Time | System/owner action |
| --- | --- |
| 30, 14, 3 days before expiry | Send manual pilot notices; record delivery and acknowledgment |
| Expiry | Freeze edits and new invitations; show exact dates |
| 30-day grace | Existing authorized viewers retain access; owner may renew/export |
| Grace end | Take presentation offline; archive remains recoverable |
| 12 months after grace | Queue primary data for permanent deletion |
| Provider backup age-out | Show only after actual provider policy is verified; target no more than 35 days where permitted |

## Owner-requested deletion

1. Owner authenticates, reviews effects/dates, and types the exact project name.
2. Disable presentation access immediately and audit request.
3. Show the unambiguous seven-day cancellation deadline.
4. Allow authenticated cancellation during the window and restore state safely.
5. After the window, purge primary data within 30 days; expire generated exports within 24 hours.
6. Notify the owner of primary purge and the verified expected backup age-out.
7. Preserve only records counsel approves for legal/accounting/security obligations, separated from family content.

## Support and emergency access

- Professional support access expires automatically 30 days after handoff.
- The owner may approve an extension only in an explicit 30-day increment; record grantor, reason, start/end, and revocation.
- Platform emergency access is time-limited, least-privilege, reason-recorded, visible to the owner, and automatically expires.
- Access only the minimum records required. Never use emergency access for routine browsing.

## Time and cost logging

Record start/end, person, project, and one category: sales, intake, GEDCOM cleanup, media validation/matching, curation, review, publishing, support, export/deletion, incident, or engineering workaround. Separate professional minutes from founder minutes. Flag any code change required by one customer and classify it as reusable product work or customer-specific consulting.

## Project closeout

- [ ] Client delivery and owner handoff complete
- [ ] Approved version ID and publication date recorded
- [ ] Support, renewal, grace, recovery, and deletion dates visible
- [ ] All invitations/sessions/roles reconcile to audit log
- [ ] Concierge and professional time complete
- [ ] Cash and labor-adjusted contribution calculated
- [ ] Import defects and reusable improvements added to backlog
- [ ] Client usage and professional repeat signal scheduled for follow-up
- [ ] No content retained in unauthorized local/test locations
