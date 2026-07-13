# Paid-pilot execution pack

This directory is the implementation and operating source of truth for the Family Tree Designer founding pilots. It supersedes conflicting pilot-scope assumptions in [`../Family Tree App Structure.md`](../Family%20Tree%20App%20Structure.md) without deleting that earlier exploration.

## Outcome

Within 14 days, demonstrate a complete synthetic-data journey from professional intake to a private, branded family presentation. Within 45 days, close the first paid pilot. Real client data remains blocked until the recorded legal-review and infrastructure gates are complete.

## Locked offer

- Exactly two private founding pilots at **$249 paid upfront** each.
- One project with up to 500 imported people, 25 media items, five featured stories, one theme, two consolidated correction rounds, a private presentation, and 12 months of hosting.
- Work beyond those caps is quoted separately before it begins.
- Test **$399 per project immediately after** the two founding pilots.
- Offer the first cohort a **$79 annual renewal**, subject to observed support, storage, and egress costs.
- Keep all pricing and invoicing outside the product during the pilot; do not hard-code a billing flow.

## Artifact map

| Artifact | Operational question answered |
| --- | --- |
| [Complete handoff summary](COMPLETE_HANDOFF_SUMMARY.md) | What was decided, built, verified, and left as an external launch gate? |
| [Product specification](PRODUCT_SPEC.md) | What must the paid-pilot product do, and what is excluded? |
| [Commercial plan](COMMERCIAL_PLAN.md) | Who buys, for how much, through what funnel, and under what economics? |
| [Financial and capacity model](FINANCIAL_MODEL.md) | How much cash and founder time may be committed, and what stops the experiment? |
| [Operations runbook](OPERATIONS_RUNBOOK.md) | How does one project move from intake through handoff and retention? |
| [Privacy and legal review](PRIVACY_LEGAL_REVIEW.md) | What scope is permitted, what is blocked, and what must counsel review? |
| [Deployment and security](DEPLOYMENT_SECURITY_RUNBOOK.md) | How is local work promoted safely after infrastructure is provisioned? |
| [Measurement plan](MEASUREMENT_PLAN.md) | Which events, costs, thresholds, and decisions are recorded? |
| [Implementation plan](IMPLEMENTATION_PLAN.md) | In what order is the product built and accepted? |

## Non-negotiable gates

| Gate | Owner | Due | Evidence required |
| --- | --- | --- | --- |
| Synthetic flagship demo | Founder + implementation | Day 14 | Desktop/mobile demo passes the end-to-end acceptance checklist |
| Qualified outreach | Founder | Days 1–45 | 80 researched prospects and 10 completed interviews, unless the funnel fills sooner |
| Message/segment checkpoint | Founder | After contact 30 | At least three booked interviews, or a documented segment/message/demo revision before contacts 31–80 |
| Counsel engaged | Founder | Day 21 target | Fixed-fee scope, quote, and explicit founder approval before spending |
| Legal review complete | Attorney + founder | Day 35 target | Review record marked complete for all items in `PRIVACY_LEGAL_REVIEW.md` |
| Cash/capacity control | Founder | Weekly through day 90 | Gross outlay at or below $2,850, net funding gap at or below $2,400, and no more than one live real-data project |
| Real-data readiness | Founder | Before any real upload | Legal gate, consented dataset, production security checklist, and provider-retention verification all complete |
| First paid pilot | Founder | Day 45 | Signed scope, payment received, authorized dataset, and intake record |

Missing the day-35 legal target does not stop synthetic demonstrations or interviews. It does block all real-client-data ingestion and paid delivery.

## Ownership and authorization

- The founder owns pricing, prospect selection, interviews, contracts, external accounts, credentials, outreach, and launch decisions.
- Codex may implement, verify, research candidates, and draft personalized outreach. It must not contact anyone, create or purchase external services, deploy, or expose credentials without separate explicit authorization.
- A U.S. privacy/technology attorney owns legal advice. The documents in this directory are operational working drafts, not legal advice.

## Weekly operating cadence

1. Monday: update the milestone board, funnel totals, risks, and next seven days of owner actions.
2. Each weekday until the funnel fills: founder sends or approves roughly four individually researched contacts.
3. After every interview or project work session: record evidence and time on the same day.
4. Friday: compare metrics to written thresholds; document continue, correct, pause, or pivot decisions.
5. Before any release: run the verification checklist in `IMPLEMENTATION_PLAN.md` and the security checklist in `DEPLOYMENT_SECURITY_RUNBOOK.md`.

## Decision discipline

- Compliments and survey enthusiasm are not validation.
- The first paid pilot by day 45 is a milestone. Validation requires both paid pilots, supplied client-approved data, actual delivery under approved controls, measured economics, and repeat intent.
- Do not invent missing stories, sources, consent, relationships, or facts. A documented operator override may permit a deliberately story-light project; it must never generate fictional content.
- Preserve the complete relationship graph. Control complexity through focused views and progressive disclosure, not through distorted or erased relationships.
