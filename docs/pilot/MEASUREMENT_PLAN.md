# Measurement and decision plan

Status: founding-pilot scorecard

Owner: founder

Cadence: update continuously; review every Friday and at each gate

The goal is evidence, not activity. Compliments and demo enthusiasm do not count as validation unless they lead to payment, authorized data, a scheduled delivery, client use, or a repeat project.

## Measurement rules

1. Define metrics before reviewing results; do not move thresholds after seeing them.
2. Use opaque prospect/project IDs in analytics. Never send names, email addresses, GEDCOM content, story text, media filenames/URLs, or family relationships to product analytics.
3. Keep raw commercial/contact information in the founder-controlled prospect tracker, not product event payloads.
4. Record founder and professional time on the day it occurs.
5. Separate cash margin from labor-adjusted margin.
6. Annotate synthetic events so they never contaminate real-pilot metrics.
7. Record denominator and observation window with every percentage.

## North-star validation sequence

```text
qualified prospect
→ workflow interview
→ presentation pain confirmed
→ suitable authorized project
→ paid scope
→ materials accepted
→ private presentation delivered
→ client invites/viewing
→ handoff
→ repeat project or renewal
```

## Founder funnel scorecard

| Metric | Definition | Day-45 target/gate | Source |
| --- | --- | --- | --- |
| Researched prospects | Records meeting basic beachhead criteria | 80 unless funnel fills early | Prospect tracker |
| Individualized contacts | Founder-sent/approved messages with sourced personalization | Roughly four/weekday | Prospect tracker |
| Booking rate | Interviews booked ÷ qualified contacts | After 30 contacts, at least 3 bookings | Prospect tracker |
| Interviews completed | Held workflow interviews with notes | 10 | Interview record |
| Recurring-pain count | Interviewees describing repeated presentation pain | At least 5 of 10 | Rubric |
| Workflow-change count | Interviewees ranking pain high enough to change workflow | At least 3 of 10 | Rubric |
| Project-ready prospects | Suitable, consentable completed project and timing | At least 4 | Qualification record |
| Paid-pilot commitments | Paid scope plus scheduled intake | At least 2 for model validation; first by day 45 | Invoice/intake records |
| Contact-to-paid conversion | Paid pilots ÷ qualified contacts | Observe; no invented benchmark | Tracker |
| CAC, cash | Paid acquisition spend ÷ new paying practices | Record even if $0 | Cost ledger |
| CAC, labor adjusted | (Cash acquisition spend + founder GTM hours × shadow rate) ÷ new paying practices | Test against first-year gross contribution | Time/cost ledger |

If contact 30 produces fewer than three bookings, stop and change segment, message, and/or demo before contact 31. Record the version and compare the next cohort.

## Delivery scorecard

| Metric | Definition | Founding target | Decision use |
| --- | --- | --- | --- |
| Eligible GEDCOM parse success | Eligible files producing a reviewable graph without code changes ÷ eligible files attempted | Observe first two; hypothesis ≥80% by broader beta | Import reliability |
| Import integrity | People/family/source counts reconciled; no known silent loss | 100% or explicit warning/acknowledgment | Safety gate |
| Founder concierge hours | All intake, cleanup, matching, curation, review, publish, support time | 4–6 hours allowed initially; <2 hours by pilot three | Productization |
| Genealogist setup time | Active professional effort excluding interview/sales | <30 minutes target; investigate >45 | Workflow value |
| Time to first draft | Materials accepted to professional preview | Record median and blockers | Delivery promise |
| Media first-pass acceptance | Files passing type/signature/scan/metadata without resubmission | Observe by failure reason | Intake guidance |
| Review churn | Items and hours by round; changes after final approval | Two consolidated rounds; post-approval changes create revision | Scope/pricing |
| On-time delivery | Approved delivery on/before committed date | 100% for founding pilots or documented cause | Trust |
| Support hours | Hours after handoff through day 30 | Record by issue | Renewal/service design |

Import success never means “parser did not crash.” It requires preserved/reconciled structure and visible warnings for unsupported or uncertain data.

## Client-value scorecard

| Metric | Definition | Initial hypothesis |
| --- | --- | --- |
| Delivery opened | Client reviewer/owner successfully opens approved presentation | 100% |
| Invitations issued | Unique authorized passive-viewer invitations per project | At least 2 beyond owner is an encouraging signal |
| Invite acceptance | Used invitations ÷ valid delivered invitations | Observe by project and role |
| Unique authorized viewers | Distinct recipient sessions, deduplicated and privacy-safe | Record at 7/30/90 days |
| Story engagement | Authorized sessions opening a featured story | Directional only; no invasive tracking |
| Tree/profile engagement | Authorized sessions opening focused tree and at least one profile | Directional only |
| Sharing intent | Owner/professional states whom they will invite and follows through | Behavior beats survey intent |
| Professional value | “Saved time” and/or “made the project more valuable,” tied to actual delivery | Required qualitative debrief |
| Repeat signal | Paid/scheduled next project from the practice | At least one of first two within 90 days is an initial positive signal |
| Renewal | Cohort projects renewing at $79 after year one | Measure later; do not infer now |

Avoid analytics that reveal which ancestor, story, sensitive branch, or living person a viewer accessed unless strictly required for security and approved in the privacy review.

## Safety and trust scorecard

| Metric | Target | Escalation |
| --- | --- | --- |
| Unauthorized content disclosures | Zero | Immediately disable affected access and pause new real-data intake |
| High/critical privacy or security incidents | Zero | Stop real-data operation pending legal/security go/no-go |
| Cross-project authorization failures | Zero | Release blocker |
| Quarantine bypasses | Zero | Release/operation blocker |
| Unresolved rights/consent blockers at publish | Zero | Publication blocker |
| Living minors exposed | Zero | Immediate takedown and incident review |
| Raw invite/session tokens in persistent logs | Zero | Revoke/rotate, investigate, and remediate |
| Export artifacts surviving >24 hours | Zero | Disable export job and correct lifecycle |
| Missed deletion/recovery deadline | Zero | Escalate to founder/counsel; stop promises until corrected |
| Refunds | Record reason and amount; one of first two triggers model review | Founder review |

## Event and audit dictionary

Product analytics events are minimal and pseudonymous. Security/operational audit events are a separate, access-controlled record.

### Product events

| Event | Required properties |
| --- | --- |
| `project_state_viewed` | opaque project ID, workflow state, synthetic flag |
| `import_started` / `import_reviewed` | opaque project ID, size/count bands, warning-count band, synthetic flag |
| `media_validation_completed` | opaque project ID, allowed type, pass/fail category; no filename/hash in analytics |
| `preview_opened` | opaque project ID, role, viewport class |
| `review_submitted` | project ID, review version number, item-count band |
| `review_resolved` | project ID, disposition counts |
| `delivery_approved` / `published` | project ID, version number |
| `invite_exchanged` | project ID, coarse role; no token/recipient |
| `presentation_section_opened` | project ID, section type only |
| `handoff_accepted` | project ID |
| `export_requested` / `downloaded` / `expired` | project ID, status only |
| `deletion_requested` / `cancelled` / `primary_purged` | project ID, status and calculated interval |

### Audit events

Audit role grants/revocations, invite create/use/reissue/revoke, session revocation, review-version freeze, item dispositions, approval/publication, handoff, support extension, professional expiry, emergency access, export, deletion, and retention transitions. Store actor ID/role, project ID, action, object/version ID, timestamp, result, and reason/reference. Exclude raw credentials and unnecessary content.

## Time and cost ledger

### Time categories

Sales research, outreach, interview, intake, GEDCOM cleanup, media validation/matching, curation, review, publishing, support, export/deletion, incident response, reusable engineering, and customer-specific workaround.

### Cash categories

Collected fees, refunds, payment fees, project-variable storage/egress/compute, project-variable vendor/service cost, shared platform stack, domain/email, legal, and other GTM.

Use the founding-cohort shadow rate of **$40/hour** and retain it for cohort comparison. Any alternative rate is a separately labeled sensitivity, not a rewrite of the baseline.

```text
gross sales = cash collected before refunds
cash contribution = cash collected - refunds - payment fees - project-variable cash costs
labor-adjusted contribution = cash contribution - (delivery/support/GTM hours × shadow rate)
fully loaded result = labor-adjusted contribution - allocated shared stack - legal - fixed GTM
```

Report shared platform cost separately; the approximately $639/year entry stack is a planning allowance across projects, not a per-project charge.

Reconcile the ledger weekly to `FINANCIAL_MODEL.md`. Pause new commitments when forecast gross outlay exceeds $2,850, the founder-funded day-90 gap exceeds $2,400, or accepting work would create two concurrent live real-data projects.

## Kill, pause, and pivot thresholds

### Demand

- **Message/segment correction:** fewer than three booked interviews after 30 qualified contacts.
- **Model unvalidated:** after 10 matched interviews, fewer than five recurring-pain signals, fewer than three workflow-change signals, or fewer than two paid project commitments.
- **Positioning pivot:** qualified professionals consistently prefer existing PDFs/tree links and see no premium delivery value.
- **Repeat-risk investigation:** neither founding practice schedules/pays for a follow-on project within 90 days despite successful delivery.

### Delivery and economics

- **Workflow pause:** professional setup repeatedly exceeds 45 minutes.
- **Productization pivot:** founder work exceeds six hours on either founding project or cannot credibly fall below two hours by pilot three.
- **Import strategy pivot:** eligible files repeatedly require project-specific code/manual reconstruction rather than a repeatable review workflow.
- **Pricing/scope pivot:** acceptable price is at or below variable cash cost, or the $399 test cannot produce a plausible positive labor-adjusted contribution.
- **Consulting warning:** every interested practice requires materially different workflow or deliverable terms.
- **Refund review:** any founding-pilot refund; pause the same offer if one of the two projects refunds for product/value failure.

### Privacy and reliability

- **Immediate stop:** any high/critical privacy incident, unauthorized disclosure, living-minor exposure, cross-project access, or quarantined-file publication.
- **Publication stop:** any unresolved rights, consent, malware, import-integrity, or final-review item.
- **Promise stop:** provider backup/deletion behavior cannot support the stated schedule or is not verified.

A pause is not automatically a permanent shutdown. Record the evidence, owner, correction experiment, deadline, and explicit resume/kill decision.

## Friday decision report

Publish one short internal report:

1. Funnel totals and cohort/message version.
2. Product milestone and verification status.
3. Delivery/setup/support hours by project.
4. Cash and labor-adjusted economics.
5. Client use and repeat signals.
6. Privacy/security/rights incidents or near misses.
7. Thresholds crossed.
8. One decision for the next week: continue, correct, pause, or pivot.

## Founding-pilot validation decision

Do not call the model validated until both paid pilots have been delivered to real clients under approved legal/security operations. The decision record must include interview thresholds, actual setup/delivery time, import integrity, client use, repeat intent, refunds, incidents, actual costs, and results of the immediate $399 test or its scheduled test date.
