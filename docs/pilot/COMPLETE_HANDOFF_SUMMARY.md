# Family Tree Designer paid-pilot handoff summary

Status: complete synthetic pilot, implementation, and execution plan

Real-data status: blocked pending external legal and production-readiness gates

Last verified: July 12, 2026

## Executive summary

Family Tree Designer now contains a complete, polished synthetic paid-pilot product backed by a detailed commercial, financial, operational, privacy, security, measurement, and implementation plan.

The product is ready for local demonstrations and customer interviews. It is deliberately prevented from handling real client data until the external legal, infrastructure, security, and dataset-permission gates are satisfied.

## How the work was approached

The implementation was completed through an iterative interrogation, implementation, and independent-audit process:

1. Interrogate the business model and lock customer, scope, price, timing, privacy boundaries, and founder capacity.
2. Convert the decisions into implementation-ready specifications and runbooks.
3. Build the complete synthetic creator, reviewer, viewer, handoff, and owner experience.
4. Independently audit the result for misleading controls, privacy leaks, weak authorization, lifecycle defects, and incomplete financial assumptions.
5. Repair the findings and rerun the complete static, behavioral, E2E, and visual-verification stack.

The audit stage was material. The initial experience was visually strong, but some controls simulated success, living-person filtering was too broad, review sessions were not bound tightly enough to one frozen version, and ownership/deletion authority was not fully enforced. Those findings were corrected before completion.

## Business definition

### Initial customer

The beachhead customer is a solo or small U.S. professional genealogy practice that:

- performs commissioned family-history or legacy work;
- can export GEDCOM data;
- already delivers narratives, charts, sources, and scanned material;
- values a more memorable client reveal or handoff; and
- has a suitable client-approved project within the narrow pilot scope.

### Positioning

Family Tree Designer is not positioned as another research database or low-cost genealogy utility. It is a premium client-delivery experience: a private, branded, interactive presentation containing a focused tree, stories, photographs, people, and sources.

The professional continues using existing research tools. Family Tree Designer upgrades the presentation and handoff.

### Founding offer

- Exactly two pilots at **$249 each**, paid upfront.
- Test **$399 per project** immediately after both founding pilots sell.
- Provisional first-cohort renewal at **$79/year**, subject to measured storage, recovery, deletion, support, and egress costs.
- Maximum 500 people.
- Maximum 25 media items, 500 MB total, and 20 MB per file.
- Up to five featured stories.
- One visual theme.
- Two consolidated correction rounds.
- Twelve months of hosting.
- Initial concierge allowance of four to six founder hours.
- Target by pilot three: fewer than two founder hours and fewer than 30 minutes of professional setup.

### Excluded cases

The founding pilots exclude:

- forensic and probate work;
- DNA identification and unknown-parentage cases;
- disputed-adoption engagements;
- citizenship/evidence engagements;
- projects centered on current estrangement, disputed identity, exact addresses, or similarly sensitive facts;
- living minors in the presentation; and
- public sharing.

Living adults appear only when necessary, with minimized fields and documented consent.

## Sales and validation plan

The first commercial window is 45 days:

- Research 80 qualified practices.
- Complete 10 workflow interviews.
- Contact roughly four individually researched prospects per weekday.
- Stop after contact 30 if fewer than three interviews are booked, then revise the segment, message, or demo.
- Identify at least four suitable client-approved projects.
- Close the first paid pilot by day 45.
- Treat two paid and delivered founding pilots as the minimum for actual model validation.

No outreach has been sent. Every message requires founder review or explicit authorization.

Validation is based on behavior rather than compliments:

- payment;
- authorized data;
- scheduled intake;
- measured setup and delivery time;
- successful client delivery;
- authorized client use;
- repeat purchase behavior; and
- the immediate $399 price test.

## Financial and capacity model

The monetary model is reconciled in [FINANCIAL_MODEL.md](FINANCIAL_MODEL.md).

### Control limits

- Maximum gross pilot cash outlay through day 90: **$2,850**.
- Maximum founder-funded net cash gap through day 90: **$2,400**.
- Legal planning reserve: up to **$2,500**, contingent on a fixed-fee quote and separate approval.
- Founder shadow rate: **$40/hour** for the founding cohort.
- Work-in-progress limit: **one live real-data project at a time**.
- Founder capacity: **10–15 hours per week**.

These are stop controls, not permission to spend.

### Day-45 maximum case

- Receipts: **$498**.
- Maximum modeled outflow: **$2,663**.
- Founder-funded gap: **$2,165**.

If only one $249 pilot closes, the comparable gap is $2,373. That meets the dated first-payment milestone but does not validate the model.

### Day-90 base case

- Receipts: **$1,296** from two $249 pilots and two $399 projects.
- Maximum modeled outflow: **$2,842**.
- Founder-funded gap: **$1,546**.

A downside net gap above $2,400 triggers a stop before further spending or commitments.

### Reconciled twelve-month base hypothesis

- 60 practices.
- 165 delivered projects.
- **$25,730** gross revenue.
- **$5,946** variable cash costs.
- **$19,784** cash contribution.
- **$13,145** after shared stack, legal reserve, and fixed GTM cash.
- **$5,465** after 192 founder hours valued at $40/hour.

This is a post-validation planning hypothesis, not a forecast. It assumes later self-service and Studio offerings that should not launch until import quality, setup time, support burden, repeat use, and willingness to pay are demonstrated.

## Operational workflow

Every project follows ten states:

1. Intake.
2. Materials.
3. Import review.
4. Curation.
5. Professional preview.
6. Client review round one.
7. Revision and client review round two.
8. Approval and private publication.
9. Archive-owner handoff.
10. Active archive.

Each state has entry requirements, checklists, exit evidence, ownership, and explicit blockers in [OPERATIONS_RUNBOOK.md](OPERATIONS_RUNBOOK.md).

### GEDCOM preflight

The founding default supports:

- one GEDCOM no larger than 25 MB;
- no more than 500 people;
- GEDCOM 5.5 or 5.5.1;
- UTF-8 or documented ANSEL encoding; and
- a preflight result of accept, accept with warnings, approved remediation/overage, or reject and refund.

The importer must report unsupported structures, unresolved references, suspected duplicates, living-person uncertainty, and media links without silently dropping or merging them.

### Media processing

Accepted formats are JPEG, PNG, WebP, and PDF.

Every real file must remain quarantined until:

- extension, MIME type, and file signature agree;
- an approved, updated malware engine passes it;
- the scan result and engine version are recorded;
- an image derivative has location/EXIF data removed;
- a PDF receives an inert preview; and
- rights, consent, provenance, visibility, caption, and alt-text information are recorded.

## Privacy, access, and ownership

### Invitations and sessions

Recipient invitations are:

- recipient-specific;
- single-use;
- represented in storage only by a cryptographic hash;
- shown raw only once;
- expired after seven unused days;
- exchanged for HTTP-only, Secure, SameSite sessions;
- limited to a 30-day absolute lifetime and seven-day idle lifetime; and
- individually revocable.

Reissuing an invitation preserves its recipient and capability while revoking sessions issued from the prior invitation.

### Frozen client review

Every client-review invitation and session is bound to:

- one project;
- one exact review version;
- one review round; and
- one canonical presentation snapshot hash.

Approval rechecks the snapshot hash. A content change invalidates approval and requires a new unpublished revision.

### Handoff

At handoff:

- the client accepts through a verified control-plane identity;
- the client becomes archive owner;
- invitation, revocation, export, deletion, and support-extension authority moves to the owner;
- professional access expires after 30 days; and
- extensions require explicit owner approval in 30-day increments.

The platform operator does not retain routine owner authority after handoff.

### Retention and deletion

- Seven-day staging cleanup.
- Renewal notices at 30, 14, and 3 days.
- Thirty-day view-only grace after expiration.
- Twelve months of offline recoverability.
- Immediate access disablement on owner deletion request.
- Seven-day cancellation window.
- Primary purge within 30 days after the cancellation window.
- Backup age-out based on verified provider behavior.

## Product and UI implementation

The synthetic product includes:

- a redesigned marketing homepage;
- a professional project portfolio;
- a ten-state project overview;
- intake, materials, import-review, curation, review, access, and handoff screens;
- a polished professional preview;
- private welcome, people, person, story, source, and tree views;
- expired, revoked, used, malformed, and valid invitation states;
- version-bound client review;
- verified owner handoff;
- owner invitation, support, export, and deletion controls;
- responsive desktop/mobile navigation; and
- synthetic family portraits, documents, branding, and story assets.

The primary entry point is `/projects`, with the flagship project at `/projects/pilot-hart-001`.

### Truthful creator controls

Real authenticated synthetic-domain actions include:

- review-item acceptance or rejection with required disposition notes;
- opening round one;
- creating the next immutable review version;
- invitation issue, reissue, and revocation;
- exact review-version binding for reviewer invitations;
- server-generated raw invitation tokens retained only in ephemeral client state; and
- pre-handoff export queuing.

Explicitly read-only professional states include:

- client approval, which belongs to the designated reviewer;
- owner handoff acceptance and support extensions, which belong to the verified owner;
- deletion, which belongs to the accepted archive owner;
- the seeded import-issue ledger; and
- post-handoff owner-managed invitation/export controls.

Intake, browser file inspection, and curation remain clearly labeled synthetic rehearsals where durable production persistence is not yet present.

## Security hardening completed

The independent implementation audit found and corrected the following:

- Creator project reads now require an active, unexpired operator or genealogist role.
- Every nested professional-preview route independently authorizes access.
- Living-person data transfer objects reveal only specifically consented fields.
- Living minors remain hidden, including direct-ID requests.
- Stories, sources, media, and derivatives respect visibility, consent, reachability, and quarantine state.
- Review invitations and sessions are bound to an exact review version and round.
- Approval verifies canonical presentation content to detect drift.
- Expired roles fail authorization.
- Reissue revokes prior sessions.
- Post-handoff routine authority is owner-only.
- Scheduled deletion prevents new invitations and showcase access.
- Process-global synthetic state fails closed with `NOT_READY` when `DEMO_MODE=false`.
- Private routes receive no-store and noindex protections.
- Private-route analytics are suppressed.
- Security headers and robots exclusions were added.
- Dark, cream, and danger-button contrast defects were corrected.

## Verification results

The final shared worktree passed:

- ESLint.
- TypeScript type checking.
- **24/24 unit tests** across six files.
- **77.9% statement coverage** in the pilot-domain code.
- Next.js production build.
- **16/16 Playwright E2E tests**, with zero skips.

The E2E suite covers the existing application plus:

- project portfolio and professional preview;
- non-leaking expired and revoked invitation states;
- review invitation redemption;
- authorized private showcase access;
- living-minor exclusion;
- mobile private navigation;
- owner invitation redemption;
- verified handoff; and
- archive-owner controls.

Visual QA was performed at 1440×900 and 390×844 for:

- the homepage;
- creator portfolio and project workspace;
- professional review, access, and handoff;
- professional preview;
- invitation redemption;
- reviewer flow;
- private showcase;
- minimized living-adult profile;
- hidden-minor denial; and
- archive-owner controls.

There is no document-level horizontal overflow. The access ledger uses an intentional internal horizontal scroller at mobile width.

## Real-data launch blockers

This is a complete synthetic pilot and UI, not a production real-data system.

Real-data launch remains blocked on:

- attorney review and approved contracts/notices;
- a permission-cleared real project;
- provisioned Vercel, Supabase, domain, and business email;
- a dedicated production database and private storage;
- durable cross-instance invitation, session, review, and audit persistence;
- an approved secure file-transfer workflow;
- an approved malware engine and update procedure;
- real export ZIP generation and 24-hour cleanup jobs;
- retention, nonrenewal, purge, and backup-age-out jobs;
- provider backup and restore verification;
- production rate limiting and incident monitoring; and
- founder approval for every purchase, deployment, invoice, and outreach action.

No services were purchased, no deployment was made, no outreach was sent, and no real family data was used.

## Repository status

All work remains in the local working tree. Nothing was staged, committed, pushed, or opened as a pull request.

The pre-existing `package-lock.json` modification was preserved. Temporary browser/debug artifacts and QA servers were cleaned up.

## Document map

- [Paid-pilot execution pack](README.md)
- [Product specification](PRODUCT_SPEC.md)
- [Commercial plan](COMMERCIAL_PLAN.md)
- [Financial and capacity model](FINANCIAL_MODEL.md)
- [Operations runbook](OPERATIONS_RUNBOOK.md)
- [Privacy and legal review](PRIVACY_LEGAL_REVIEW.md)
- [Deployment and security runbook](DEPLOYMENT_SECURITY_RUNBOOK.md)
- [Measurement plan](MEASUREMENT_PLAN.md)
- [Implementation plan](IMPLEMENTATION_PLAN.md)
