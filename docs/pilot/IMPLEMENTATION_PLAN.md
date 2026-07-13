# Implementation plan

Status: execution baseline

Technical baseline: Next.js 16.2.1, React 19, TypeScript, existing demo store, GEDCOM parser, profile/canvas/viewer foundations

Targets: complete synthetic paid-pilot demo by day 14; first paid pilot by day 45

## Delivery approach

Reuse the current viewer, person profile, family canvas, theme system, GEDCOM parser/review, and demo-mode architecture where they meet the pilot contract. Replace or wrap the hobbyist/public-share assumptions with a professional portfolio, ten-state workflow, media-rich curated showcase, recipient-specific private access, immutable reviews, handoff, export, and deletion states.

The day-14 result is a complete, credible local synthetic workflow—not a claim that production privacy, persistence, or legal readiness is complete. The day-45 real-data target additionally requires counsel, provisioned infrastructure, a permission-cleared dataset, and production security evidence.

## Required Next.js preparation

Before changing framework code, read the relevant bundled Next.js 16.2.1 guides in `node_modules/next/dist/docs/`, including App Router layouts/pages, server and client components, data fetching/caching, route handlers, forms/Server Actions, cookies, metadata/robots, loading/error/not-found behavior, and authentication/security guidance. Record any breaking or deprecated behavior that changes this plan. Training-memory assumptions are not sufficient for this repository.

## Scope and workstreams

### A. Pilot domain model and deterministic synthetic state

Add or extend typed pilot records sufficient to demonstrate and later persist:

| Record | Required fields/behavior |
| --- | --- |
| Project | professional/client IDs, display name, workflow state, caps/usage, focal person, theme, legal gate, readiness blockers, dates, next action |
| Professional brand | practice name, logo/initial mark, primary/accent colors, contact attribution |
| Person/relationship | living/minor status, consent status, minimized visibility, relationship type, uncertainty/source context |
| Story | title, short narrative, featured order, linked people/media/sources, visibility, approval version |
| Source | citation/record metadata, provenance, rights, linked people/stories, optional inert document preview |
| Media | type/bytes/hash, quarantine/validation/scan states, alt/decorative, rights/consent/provenance, derivative/preview status |
| Import review | frozen import version, counts, warnings, status, acknowledgment/disposition, time |
| Review version/item | immutable version number/snapshot, round, structured request, disposition, actor/timestamps |
| Invitation/session | role, token hash only, single-use/expiry/revocation, session absolute/idle expiry, recipient revocation |
| Role grant/handoff | professional/reviewer/viewer/owner scope, start/end, acceptance, 30-day support extension |
| Export/deletion | request/status, authenticated expiry, 24-hour artifact delete, cancellation/purge/recovery dates |
| Audit event | opaque actor/project/object, action, result, reason/reference, timestamp; no raw secret/content |

Use clearly labeled synthetic people, photos/records, rights, consent, invitations, and errors. No real family data enters fixtures, screenshots, tests, or commits.

### B. Professional portfolio and project shell

Build the creator navigation around projects rather than one hobbyist tree.

Required surfaces:

- portfolio overview with active/completed projects, status, blockers, due dates, usage caps, next action, and concierge-time summary;
- project header with client/practice, current state, readiness, preview, and workflow navigation;
- ten-state progress indicator that remains usable on mobile;
- blocker panel with exact resolution action; and
- synthetic demo reset/replay control separated from production affordances.

Acceptance: a user can enter any synthetic project state directly, understands the next action, and never lands in an unrelated consumer dashboard dead end.

### C. Setup, materials, and import review

Implement the complete setup/import UI:

- create/intake fields for practice/client, scope, focal branch, branding, caps, and legal gate;
- GEDCOM drop/select, file/type/size validation, upload/loading/progress, parse summary, and safe failure;
- people/family/source counts, unresolved references, duplicates, living-person flags, warning severity, filter, and resolve/acknowledge controls;
- media inventory with quarantine states, cap meter, unsupported HEIC/TIFF/media conversion guidance, validation/scan metadata, alt/decorative field, rights/consent/provenance, source/person matching, and failed-file isolation;
- stories/sources input with empty and story-light override behavior; and
- professional/founder time capture.

Acceptance: the supplied synthetic GEDCOM and media fixtures can be accepted/rejected, reviewed, acknowledged, matched, and advanced without silent data loss or fabricated content. Quarantine prevents preview/export/publication until both validation and scan pass.

### D. Curation and professional preview

Build:

- welcome editor for family name, short line, hero/collage, focal branch, subtle professional branding;
- one-theme selector with theme preview;
- featured-story ordering and story/person/media/source linking;
- person profile curation with visible privacy/consent/uncertainty labels;
- readiness checklist with the three-story minimum and named story-light override; and
- authorization-faithful desktop/mobile professional preview.

Acceptance: a professional can turn the synthetic materials into one cohesive welcome, focused branch, five-or-fewer story journey, and privacy-safe preview without editing raw code.

### E. Private client presentation

Reuse and adapt the existing public viewer/profile/canvas foundation.

Required presentation states:

- invitation exchange, loading, malformed, expired, already used, revoked, and reissue guidance;
- branded full-screen welcome with one primary “Explore your family” action;
- overview with explore tree, featured ancestors, and featured story paths;
- focused, progressively disclosed family graph with accessible relationship/uncertainty labels, search, breadcrumbs, collapse/expand, and mini-map where the existing canvas supports them;
- person profile with minimized facts, portraits, short stories, linked source references, and private-detail treatment;
- featured story and source/record view;
- inert PDF preview and authenticated attachment interaction; and
- graceful sparse, empty, loading, error, session-expired, and permission-denied states.

Acceptance: desktop and phone users can complete the two-minute flagship journey—welcome → story → portrait/record/source → focused tree → another person/connection—without feeling like they entered a database.

### F. Reviews, approval, and revision integrity

Build:

- reviewer-role invitation and frozen pending-version label;
- structured review item types (text correction, media assignment/caption, relationship/fact, privacy, source, other);
- one consolidated submission per round and clear submit/freeze warning;
- operator/professional disposition for every item;
- creation of the next immutable review version;
- explicit final client approval tied to a version ID; and
- post-approval edits creating a new unpublished revision.

Acceptance: comments never drift across versions, every item has an auditable disposition, reviewers cannot edit/manage access, and publication selects exactly the approved snapshot.

### G. Publish, invitations, handoff, and archive controls

Build complete pilot-facing UI and local supporting behavior for:

- publication blocker summary and preview/publish confirmation;
- recipient-specific invite create/show-once/copy, seven-day expiry, exchange, revoke, and reissue;
- session status with 30-day absolute expiry and revocation behavior in the local model;
- verified owner-identity handoff acceptance;
- professional support expiry at 30 days and owner-approved 30-day extensions;
- invitation/role/audit summaries;
- export request/generation/ready/downloaded/expired/error states;
- renewal, grace, offline-recovery, and deletion dates;
- typed deletion request and unambiguous seven-day cancellation; and
- time-limited owner-visible emergency-access state.

Acceptance: the synthetic project can be published, accessed, approved, handed off, exported, scheduled for deletion, cancelled, and expired with visible dates and audit events. No UI implies local simulation alone is production security.

### H. Complete state, responsive, and accessibility pass

Every route/panel must cover:

- loading, empty, success, validation, warning, recoverable error, terminal error, permission denied, expired/revoked, offline mutation, and cap-exceeded states;
- 360–390px mobile, tablet, and 1280px+ desktop behavior;
- keyboard navigation and visible focus;
- semantic headings, field labels, error association, alt/decorative enforcement;
- non-color status/uncertainty cues, sufficient contrast, reduced motion, and touch target sizing; and
- no clipped dialogs, horizontal workflow overflow, hidden primary action, or inaccessible canvas-only information.

## Recommended route/IA mapping

Physical routes may reuse the current route groups, but these destinations must be stable and deep-linkable:

| Destination | Suggested mapping |
| --- | --- |
| Professional portfolio | existing `/dashboard` evolved into project portfolio |
| Project overview/workflow | `/projects/[projectId]` or equivalent project-scoped shell |
| Materials/import review | project-scoped setup/import destination; reuse `/import` components |
| Curation/theme | project-scoped curation; reuse theme/profile components |
| Reviews | project-scoped frozen review/version destination |
| Publish/access/handoff | project-scoped delivery settings |
| Private presentation | retain `/t/[slug]` shape only behind recipient authorization; no public token model |
| Person/story/source/tree | presentation-scoped routes preserving authorization |
| Owner archive controls | authenticated project owner destination |

Avoid duplicating core profile/canvas renderers between professional preview and client presentation; pass an explicit authorized view model.

## Fourteen-day synthetic-demo schedule

| Day | Implementation outcome | Founder-owned input |
| --- | --- | --- |
| 1 | Read bundled guides; map existing components/data/actions/tests; lock domain/state model | Confirm centralized placeholder product name/contact copy |
| 2 | Synthetic pilot fixture and ten-state state machine; product shell/navigation | Review family/story tone; no real data |
| 3–4 | Portfolio, intake, materials inventory, caps, validation/empty/error states | Review scope language |
| 5 | GEDCOM import-review UI and warning dispositions | Validate concierge workflow |
| 6 | Media quarantine/metadata/matching states and source/story input | Approve conversion/help copy |
| 7–8 | Welcome/curation, profiles, featured stories, focused presentation adaptation | Choose flagship synthetic journey |
| 9 | Reviewer invitation, frozen version 1, consolidated request | Review correction categories |
| 10 | Dispositions, version 2, final approval, post-approval revision | Approve client-facing wording |
| 11 | Publish, invite states, access/reissue/revoke, handoff/support expiry | Review handoff responsibilities |
| 12 | Export, renewal/recovery/deletion UI, audit timeline; complete state sweep | Verify dates and destructive language |
| 13 | Unit/integration/E2E updates; lint/type/build; fix regressions | Continue outreach, not test data creation |
| 14 | Desktop/mobile browser inspection and demo rehearsal; capture evidence | Approve demo or record blockers |

The founder has 10–15 hours/week and should prioritize dataset permissions, outreach, legal/infrastructure owner actions, demo copy, and acceptance—not manual implementation already delegated to Codex. The binding week-by-week allocation and one-live-project WIP rule are in `FINANCIAL_MODEL.md`.

## Day 15–45 production-readiness schedule

### Days 15–21

- Founder assembles the counsel packet by day 14, requests quotes by day 17, compares them by day 19, and explicitly approves any engagement by day 21.
- Founder starts authorized provisioning decisions for Vercel Pro, dedicated Supabase Pro, domain, and business/support email.
- Implementation hardens persistent schema, project scoping, owner/professional authentication, audit records, and private storage using synthetic staging.
- Complete first 30 contacts and enforce message/segment checkpoint.

### Days 22–35

- Attorney midpoint is recorded by day 28, launch-critical behavior freezes by day 32, and approved documents/required changes complete by the day-35 target. A missed gate moves real-data intake rather than weakening the control.
- Implement and test production invitation hashing/exchange, sessions/revocation, storage quarantine, export expiry, retention jobs, and owner deletion with synthetic data.
- Verify provider backups/deletion behavior and document actual promise.
- Run negative authorization, cross-project, media, log-redaction, rollback, and restore tests.
- Obtain a permission-cleared founder-family or partner-genealogist dataset, but do not ingest it before all gates pass.

### Days 36–45

- Record legal, infrastructure, backup, dataset-consent, and founder go/no-go gates.
- Close and collect payment for the first paid pilot; both pilots remain the operating target.
- Treat the first payment as the day-45 milestone only; two paid and delivered founding pilots are required for model validation.
- Accept only the approved project through the documented intake path.
- Keep no more than one real-data project live; schedule the second without accepting its materials until capacity opens.
- Measure all founder/professional time and stop at caps/overage gates.

If an external gate remains incomplete, continue synthetic demonstrations and sales validation; do not weaken the gate.

## Test plan

### Unit tests

- workflow transition guards and publication blockers;
- caps and file type/size/signature state decisions;
- living-person/minor visibility view models;
- relationship uncertainty/labels;
- review-version immutability and disposition completeness;
- invitation hash/use/expiry/revoke/reissue logic;
- support-access expiry/extension;
- retention, grace, recovery, deletion, and export-expiry date calculations; and
- contribution/time calculations where implemented.

### Integration/route tests

- unauthorized/cross-project reads and mutations fail closed;
- import warnings persist and block/acknowledge correctly;
- quarantine excludes media from previews/export/presentation;
- final approval publishes the exact frozen version;
- owner handoff changes authority and starts support expiry;
- export/deletion require authenticated owner authority; and
- private routes set noindex/no-store as appropriate without relying on them for access.

### End-to-end critical path

1. Open portfolio and create/select synthetic paid-pilot project.
2. Complete materials/import review, including one validation failure and one acknowledged warning.
3. Curate welcome, story, person/source, and theme.
4. Preview desktop/mobile.
5. Submit round-one review; disposition; freeze version 2; approve final.
6. Publish; issue/exchange one invitation; demonstrate expired/revoked/reissued state.
7. Explore welcome, story, record, focused tree, and profile.
8. Accept owner handoff; extend/revoke professional access.
9. Generate/expire export; request/cancel deletion; show calculated dates.

### Visual inspection

Inspect at minimum 1440×900 and 390×844, plus a tablet width. Capture welcome, portfolio, import review, media quarantine, curation, review, presentation tree/profile/story/source, publish, handoff, export, and deletion. Check long names, sparse content, 500-person count summary, cap overflow, no photo, no story override, document-only media, reduced motion, and keyboard focus.

## Verification commands and evidence

Run from the repository root:

```text
npm run lint
npm run typecheck
npm run test
npm run build
npm run test:e2e
```

Record command, commit/worktree state, date, result, failures/fixes, browser/viewport, and screenshot locations. Preserve the pre-existing unrelated `package-lock.json` modification and every unrelated user change. Do not regenerate the lockfile unless a deliberate dependency change requires it and the owner has scoped that work.

## Day-14 acceptance

- [ ] All ten workflow states work with synthetic data
- [ ] Professional portfolio and project navigation are coherent
- [ ] GEDCOM/media/story/source setup and import-review states are complete
- [ ] Quarantine, rights, consent, caps, and accessibility metadata are visible/enforced locally
- [ ] Branded welcome, focused tree, profiles, stories, and sources form a convincing two-minute journey
- [ ] Two immutable consolidated reviews and explicit version approval work
- [ ] Publish, invitation, access error, handoff, export, retention, and deletion states work
- [ ] Loading, empty, validation, error, and responsive states are inspected
- [ ] Lint, types, unit tests, build, and relevant E2E tests pass or an external tooling blocker is precisely documented
- [ ] Synthetic-demo limitation and real-data gates are explicit

## Real paid-pilot acceptance

- [ ] Attorney review and required product/operations changes complete
- [ ] Dedicated infrastructure, domain/email, secrets, monitoring, backup policy, rollback/restore, and security tests complete
- [ ] Client authorization, living-person consent status, media rights, and allowed case category verified
- [ ] Signed scope and payment received
- [ ] No cap exceeded without a written overage
- [ ] Approved delivery version, handoff, support expiry, export, and retention dates recorded
- [ ] Founder/professional time, import integrity, client use, economics, refunds, incidents, and repeat signal measured
