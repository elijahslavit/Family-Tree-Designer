# Privacy and legal-review working document

> **Not legal advice.** This is an implementation and attorney-review checklist. A qualified U.S. privacy/technology attorney must approve the real-data pilot documents and operating model. Product behavior must be updated to match counsel’s advice.

Status: real-client-data launch gate

Owner: founder

Attorney engagement target: day 21

Review completion target: day 35

Planning reserve: $2,500, not authorization to spend

## Decision calendar

| Deadline | Required evidence | Miss rule |
| --- | --- | --- |
| Day 14 | Counsel packet assembled: product/data map, scope, draft documents, vendor questions, and decision list | Continue synthetic work; do not solicit real materials |
| Day 17 | At least two fixed-fee scopes/quotes requested or a documented reason only one qualified option exists | Escalate immediately; do not assume the day-35 gate remains achievable |
| Day 19 | Quote comparison and recommended scope complete | If every quote exceeds $2,500, pause engagement and request a new founder decision |
| Day 21 | Founder selects counsel and separately approves scope/spend | No approval means synthetic interviews/demos only |
| Day 28 | Counsel midpoint issues and required product/operations changes recorded | Reforecast day 35 and freeze new real-data promises |
| Day 32 | Change freeze for launch-critical legal/security behavior; only blocker fixes continue | Any material new requirement moves the real-data date |
| Day 35 | Approved documents and required changes verified; founder records go/no-go | If incomplete, reschedule the real-data milestone; never compress or waive the gate |

The commercial day-45 milestone may still be met by collecting a clearly conditioned paid reservation only if counsel approves that structure. Otherwise payment/intake moves with the real-data date. Synthetic demos and interviews continue without accepting client content.

## Gate rule

Synthetic data may be built, tested, recorded, and demonstrated before legal review. No real client GEDCOM, media, story, source, consent record, or identifying family data may be accepted, uploaded, copied into support systems, or used in a pilot until:

1. fixed-fee scope and quotes have been obtained;
2. the founder has explicitly approved engagement and spend;
3. counsel has completed the checklist below;
4. required documents and product changes are approved;
5. the project’s legal-review gate ID/date is recorded as complete; and
6. the deployment/security gate is independently complete.

If review slips beyond day 35, continue synthetic demos and interviews only. Do not “temporarily” accept real data by email, local disk, cloud drive, screenshots, or another workaround.

## Founding-pilot scope for counsel

### Allowed

- U.S.-based genealogists and clients only.
- Commissioned family-history or legacy presentation for private clients.
- Projects primarily about deceased people.
- Living adults only when necessary, fields minimized, and documented consent status recorded.
- Invite-only, noindex, private presentations.

### Excluded

- Forensic or probate work.
- DNA-identification or unknown-parentage work.
- Disputed-adoption engagements.
- Citizenship/evidence engagements.
- Projects centered on current estrangement, disputed identity, exact addresses, or other high-risk sensitive facts.
- Living minors in the published presentation.
- Public sharing during the founding pilots.

The intake UI must require an eligibility attestation. A disallowed category cannot be overridden by the operator; counsel/founder must define any future expansion separately.

## Data and role map for counsel

| Data/actor | Pilot handling | Question to resolve |
| --- | --- | --- |
| Genealogist | Authenticated project controller through delivery; limited support after handoff | Controller/processor allocation and contractual authority |
| Private client/family | Supplies or authorizes content; authenticated archive owner at handoff | Ownership, license, individual rights, and authority to include relatives |
| Passive viewer/reviewer | Accountless invitation and session | Notice/consent and access logging requirements |
| Platform operator | Scoped service access; exceptional audited emergency access | Processor/service-provider obligations and support boundaries |
| GEDCOM/normalized graph | Original preserved; normalized for presentation/export | Retention, portability, special/sensitive data treatment |
| Photos/records/PDFs | Private originals plus safe derivatives/previews | Copyright, publicity, consent, provenance, malware handling |
| Stories and sources | Curated text/source references | Defamation, disputed facts, correction/removal, work-product rights |
| Living-person fields | Minimized and consent-status controlled | Applicable state/federal rights and verification process |
| Invite/session metadata | Hashed tokens, session and audit records | Retention, notice, security logging, lawful basis |
| Billing/contracts | Kept outside pilot product | Required accounting/contract retention separate from content |

Counsel must determine the applicable federal/state privacy, consumer-protection, contract, copyright, publicity, accessibility, breach-notification, and record-retention obligations. Do not assume a statute is inapplicable based only on company size.

## Product privacy defaults

- Private and invite-only by default; no anonymous family-content access.
- `noindex`/robots controls on private routes as defense in depth only.
- Server-side authorization on every content, media, export, review, and owner operation.
- Living minors hidden from the presentation.
- Living adults show only necessary, specifically consented fields; no exact address or full birth date.
- Sensitive stories, adoption information, estrangements, exact locations, and disputed relationships use item/branch restrictions.
- Uncertain relationships are labeled as uncertain with source context and an accessible non-color cue.
- Living adults have a documented path to view, correct, hide, or remove their profile.
- The family can export its content; export does not include credentials, raw tokens, or internal security logs.
- Professional access is revocable and expires automatically 30 days after handoff unless the owner grants a recorded 30-day extension.
- Emergency platform access is least-privilege, time-limited, reason-recorded, owner-visible, and automatically expires.

## Documents counsel must review

| Document | Required decisions | Status/evidence |
| --- | --- | --- |
| Pilot service order | Scope/caps, fees, two rounds, overages, delivery, hosting term, renewal, refunds, support | Pending |
| Master/pilot terms | Allocation of risk, warranties, acceptable use, suspension, termination, limitations | Pending |
| Privacy notice | Categories, purposes, roles, recipients, retention, rights, contact methods | Pending |
| Data-processing terms | Controller/processor roles, instructions, confidentiality, security, subprocessors, deletion/export | Pending |
| Client authorization | Genealogist’s authority to submit data and act through review | Pending |
| Living-adult consent/notice | Consent fields, withdrawal, correction/hide/remove path | Pending |
| Media rights attestation | Ownership/license, family-held photos, public-domain records, attribution, disputes | Pending |
| Archive-owner handoff | Acceptance, family content ownership, curated work product, owner duties, support expiry | Pending |
| Reviewer/viewer notice | Invitation use, session logging, privacy contact, prohibited resharing | Pending |
| Retention/deletion policy | Staging, active term, grace, recovery, purge, backup age-out | Pending |
| Export terms/manifest | Recipient responsibility, provenance, security, portable/static output | Pending |
| Incident-response policy | Definition, triage, preservation, provider/client/authority notice | Pending |
| Subprocessor schedule | Vercel, Supabase, domain/email, monitoring and future service roles/regions | Pending |

Store attorney versions, review date, approver, and product/operations changes required. Do not mark the gate complete merely because drafts exist.

## Attorney-review checklist

### Authority, ownership, and license

- [ ] Confirm who is controller, processor, service provider, owner, and licensee before/after handoff.
- [ ] Define the genealogist’s authority to submit client and relative data.
- [ ] Define family ownership/export rights and the license needed to host/process/display content.
- [ ] Define the genealogist’s curated work-product rights without blocking family portability.
- [ ] Define authority conflicts when one family member requests correction/removal.
- [ ] Define treatment of publicly available archival records versus copyrighted media.

### Consent and living people

- [ ] Approve consent/notice standard for living adults and withdrawal procedure.
- [ ] Approve verification for a person requesting access, correction, hiding, or removal.
- [ ] Confirm living-minor exclusion and whether any structural placeholder is permissible.
- [ ] Approve data minimization and prohibited living-person fields.
- [ ] Approve treatment and labeling of uncertain/disputed relationships and sensitive stories.

### Access and handoff

- [ ] Approve accountless recipient invitations and session notice.
- [ ] Approve authenticated archive-owner identity and handoff acceptance.
- [ ] Approve professional 30-day support access and owner-granted 30-day extensions.
- [ ] Approve emergency-access notice, audit, scope, and auto-expiry.
- [ ] Define owner responsibilities for invitation recipients and exported copies.

### Retention, deletion, and export

- [ ] Approve seven-day unconfirmed staging deletion.
- [ ] Approve nonrenewal: freeze at expiry, 30-day view grace, 12-month offline recovery, then deletion queue.
- [ ] Approve owner deletion: immediate disable, seven-day cancellation, primary purge within 30 days.
- [ ] Reconcile provider backup retention; approve precise public promise only after verification, targeting age-out within 35 days where possible.
- [ ] Define legally required residual business/security records and separate them from content.
- [ ] Approve export contents, manifest, 24-hour generated-file deletion, and recipient privacy obligations.

### Commercial and operational terms

- [ ] Approve two-project $249 founding scope, immediate $399 test language, $79 cohort renewal, overages, and refund rules.
- [ ] Clarify that renewal is a service term, not permanent hosting.
- [ ] Review manual notices/invitations/payment operations.
- [ ] Approve service suspension for malware, rights disputes, misuse, or nonpayment.
- [ ] Define support expectations and disclaimers for genealogical accuracy.

### Security, vendors, and incidents

- [ ] Review documented security controls and invite/session design.
- [ ] Approve vendor/subprocessor contract requirements and region choices.
- [ ] Approve malware quarantine and failed-file process.
- [ ] Define incident assessment, evidence preservation, notice triggers/timing, and communications owner.
- [ ] Define cyber/privacy insurance expectations for pilots and later scale.

## Consent and rights evidence

For every real project, record:

- who authorized the overall submission and their relationship/authority;
- the content item/person covered;
- consent or rights basis, version of notice/attestation, timestamp, and collector;
- permitted visibility and any branch/item restrictions;
- source/provenance and required attribution;
- withdrawal/dispute status and resolution; and
- the approved version in which the item appears.

Consent is not inferred from file possession. Public availability is not treated automatically as copyright permission. Do not scrape commercial family trees or reuse media casually.

## Individual request procedure

1. Route requests to the centralized privacy/support contact without placing family details in analytics.
2. Record request ID, received date, type, project, and response deadline defined by counsel.
3. Verify identity/authority using the approved process and minimum data.
4. Notify the archive owner and genealogist only as authorized.
5. Locate all applicable profile, story, media, source, derivative, approved-version, and export records.
6. Apply the approved correction, hide, removal, access, or denial process; preserve version history only as legally allowed.
7. Record disposition and notify requester. Do not expose another person’s restricted information.

## Rights dispute procedure

- Immediately hide/distribute-lock the disputed item without deleting evidence.
- Record claimant, item, asserted basis, and receipt date.
- Notify the owner/professional through approved channels.
- Follow counsel-approved counter-notice/evidence procedure.
- Never adjudicate family truth or copyright ownership casually in support chat.
- Republish only after documented resolution.

## Incident-response minimum

1. Contain: revoke affected invitations/sessions, isolate media, or disable access.
2. Preserve: audit events, relevant system logs, versions, timestamps, and vendor notices without copying content unnecessarily.
3. Assess: data types, people/projects, access path, duration, and ongoing risk.
4. Escalate: founder, security owner, counsel, vendors, insurer, and affected parties according to the approved matrix.
5. Communicate: use counsel-approved factual notices; do not speculate.
6. Remediate and verify before re-enabling real-data operations.

Any suspected unauthorized disclosure of real family content pauses new real-data ingestion until the founder and security/legal reviewers record a safe-resume decision.

## Legal-readiness record

Real-data readiness requires this signed record:

| Field | Required value |
| --- | --- |
| Attorney/firma and jurisdiction | Recorded |
| Fixed-fee scope and founder approval | Recorded before engagement/spend |
| Review completion date | On/before day 35 target or actual date |
| Approved document versions | Linked by immutable ID |
| Required product changes | All complete and verified |
| Required operations changes | All complete and rehearsed |
| Provider/subprocessor review | Complete |
| Backup retention verified | Actual policy and expected age-out recorded |
| Founder go/no-go | Explicit approval |

The provisional $2,500 reserve is a budget placeholder only. No engagement, purchase, or payment is authorized by this document.
