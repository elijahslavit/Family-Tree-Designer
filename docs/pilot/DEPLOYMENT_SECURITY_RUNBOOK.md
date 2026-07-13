# Deployment and security runbook

Status: local-first plan; external infrastructure unprovisioned

Owner: founder for accounts/credentials; implementation owner for code/verification

Legal status: **security working document, not legal advice or a certification**

## Current infrastructure status

At planning baseline, the workspace has no `.env` files, linked `.vercel/project.json`, `supabase/config.toml`, or hosting configuration. Treat all external assets as unprovisioned:

- Vercel Pro account/project;
- dedicated Supabase Pro project;
- product domain; and
- domain-based business/support email.

Codex must not create, purchase, link, deploy, send email, or expose credentials without separate explicit founder authorization. Local work uses clearly synthetic data and placeholder configuration.

## Environment and configuration contract

Keep `.env.example` limited to variable names and safe explanatory comments—never real values, tokens, project IDs, email addresses, or production URLs. Existing application variables include:

```text
DEMO_MODE
DATABASE_URL
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY
NEXT_PUBLIC_APP_URL
```

Production access/session/export implementation may require additional server-only secret names. Add them only with a documented consumer, rotation procedure, and separation from `NEXT_PUBLIC_*`. Never expose the service-role key, token-hashing secret, session signing/encryption key, storage signing key, or monitoring auth token to the browser.

Centralize replaceable product values—product name, app/marketing URL, support email, privacy email, and business identity—in one typed configuration module or a small documented set of variables. Placeholder addresses must be unmistakable and must not receive real requests.

## Owner provisioning actions

These steps require explicit authorization at the time of action.

| Action | Owner | Acceptance evidence |
| --- | --- | --- |
| Create/link Vercel Pro project | Founder | Project/region/team ownership recorded; production protection reviewed |
| Create dedicated Supabase Pro project | Founder | Organization, project, region, billing owner, MFA, and recovery contacts recorded |
| Acquire/configure domain | Founder | Registrar ownership, MFA, renewal, DNS owner, and recovery process recorded |
| Configure domain business/support/privacy email | Founder | Sender/recipient tests, MFA, retention/access policy, and monitored owner recorded |
| Select monitoring/error tools | Founder + implementation | Data-redaction review, region/subprocessor record, least-privilege token |

Do not reuse a personal or unrelated production database/storage bucket for pilot client data.

### Open production decision register

None of these rows authorizes an account, purchase, upload, or payment. Every cash commitment must fit `FINANCIAL_MODEL.md` and receive separate founder approval.

| Decision | Owner | Decision due | Cost treatment | Acceptance evidence | Safe fallback |
| --- | --- | --- | --- | --- | --- |
| Vercel project/plan/region | Founder | Day 24 | Replace shared-stack allowance with quote/invoice | Team ownership, MFA, production protection, region, recovery contacts, and preview-secret isolation recorded | Synthetic local demo only |
| Dedicated Supabase project/region | Founder | Day 24 | Replace shared-stack allowance with quote/invoice | Dedicated organization/project, MFA, RLS/storage policies, backups, deletion behavior, and recovery contacts tested | No real-data storage |
| Domain and business/support/privacy email | Founder | Day 28 | Must remain inside the approved stack/GTM cash envelope | Ownership, renewal, MFA, sender/recipient tests, retention, and monitored owners recorded | Use `.invalid` placeholders; do not solicit real requests |
| Secure real-data transfer channel | Founder + security implementation | Day 28 | Project-variable or stack cost must be recorded | Authenticated private upload, project scoping, size/type limits, quarantine destination, expiry, audit, and deletion rehearsal pass | Do not accept files by email, chat, personal drive, or local workaround |
| Malware engine and update source | Founder + security implementation | Day 28 | Quote and per-project use enter the variable-cost ledger | Engine/vendor, signature/update cadence, isolation boundary, fail/indeterminate behavior, audit fields, and synthetic malicious-file drill recorded | Keep every real file blocked in quarantine |
| Manual invoice and approved payment method | Founder + counsel/accounting | Before first invoice | Actual fees replace the 3.5% planning allowance | Invoice terms, refund path, payment owner, accounting record, chargeback handling, and no family data in processor metadata | Do not collect payment until method and terms are approved |
| Monitoring/error reporting | Founder + implementation | Day 32 | Shared-stack allowance until quoted | Private-route replay disabled, content/token redaction verified, region/subprocessor recorded, and test incident reaches monitored owner | Server logs minimized; no real-data launch |
| Production persistence/jobs | Implementation + founder | Day 32 change freeze | Engineering and vendor costs recorded separately | Database-backed invites/sessions/audit, storage quarantine, export expiry, retention/deletion jobs, cross-instance tests, rollback, and restore drill all pass with synthetic staging | Keep `DEMO_MODE=true` locally; real-data paths remain disabled |

If a quote would push gross day-90 outlay above $2,850 or the net founder-funded gap above $2,400, pause and return to an explicit budget/scope decision. Missing a due date moves real-data intake; it never authorizes an improvised channel.

## Production architecture boundaries

- Vercel serves the Next.js application and server-side authorization paths.
- Supabase provides dedicated PostgreSQL, authenticated control-plane identities, and private storage after approval/configuration.
- Private originals, quarantine files, derivatives, generated exports, and public assets use separate policies/buckets or prefixes with deny-by-default access.
- The database is the source of truth for project state, role grants, review versions, invitation hashes, session revocation, retention dates, consent/rights metadata, and audit events.
- Browser code receives only authorized, minimized presentation data and short-lived signed resource access where required.
- No genealogy content is placed in source control, static public assets, build output, logs, analytics properties, URLs, or email bodies.

## Security acceptance before real data

### Identity and authorization

- [ ] MFA enabled for founder, Vercel, Supabase, registrar, email, and other privileged accounts where supported.
- [ ] Authenticated genealogist and archive-owner control-plane roles tested.
- [ ] Passive viewer and reviewer roles remain accountless and least-privilege.
- [ ] Every project query/mutation is tenant/project scoped server-side.
- [ ] Genealogist preview exercises authorization rather than bypassing it.
- [ ] Role transfer, expiry, extension, revocation, and emergency access are enforced and audited.
- [ ] Negative cross-project access tests pass.

### Invitations and sessions

- [ ] Tokens are cryptographically random, single-use, and shown once.
- [ ] Only cryptographic hashes are stored; raw tokens are redacted from logs/errors/analytics.
- [ ] Exchange is atomic and unused invitations expire after seven days.
- [ ] Viewer sessions use HTTP-only, `Secure`, `SameSite` cookies with 30-day absolute expiry and configured idle timeout.
- [ ] Recipient revocation invalidates all outstanding invitations and active sessions.
- [ ] Lost/reissued/expired/revoked/malformed states neither leak content nor confirm unnecessary private metadata.
- [ ] Rate limiting protects invitation exchange, sign-in, export, upload, and deletion confirmation.

### Storage and media

- [ ] Original, quarantine, derivative, PDF preview, and generated-export storage policies are private by default.
- [ ] `PILOT-MEDIA-SCAN-01` names the approved engine, update method, operator, and evidence store.
- [ ] Extension/MIME/signature validation, 20 MB item cap, 25-item/500 MB project caps, and hash duplicate detection are enforced server-side.
- [ ] Quarantined/failed files cannot be parsed, derived, previewed, exported, or published.
- [ ] Image derivatives strip EXIF/location metadata.
- [ ] PDFs use inert previews and authenticated attachment delivery.
- [ ] Generated exports use authenticated short-lived authorization and automatic deletion within 24 hours.

### Application and data

- [ ] Input schemas validate all mutations server-side.
- [ ] Rendered rich text is sanitized and raw HTML is not trusted.
- [ ] Approved content versions are immutable; later edits create unpublished revisions.
- [ ] Living-person minimization is enforced in query/serialization policy, not only visual components.
- [ ] Living minors are absent from presentation payloads.
- [ ] Sensitive fields/items are deny-by-default.
- [ ] Destructive operations use reauthentication or equivalent strong owner verification and typed confirmation.
- [ ] `noindex` metadata/headers and restrictive caching prevent private pages from being indexed or publicly cached, while authorization remains authoritative.
- [ ] Security headers, CSP/frame policy, HTTPS-only behavior, and referrer policy are reviewed in the deployed environment.

### Secrets, logging, and audit

- [ ] Production secrets are stored in approved platform secret stores and scoped per environment.
- [ ] Preview and development never receive production client data/secrets by default.
- [ ] Rotation and emergency revocation procedures exist for every privileged secret.
- [ ] Structured logs exclude names, stories, GEDCOM content, media URLs, raw tokens, cookie values, and export contents.
- [ ] Analytics use opaque project/role IDs and consent-reviewed events only.
- [ ] Security audit records are append-oriented and separated from family-facing exports.
- [ ] Clock/time-zone handling is consistent for expiry and deletion deadlines.

## Provider backup verification

Before contracts or UI promise a backup-deletion date:

1. Record database and storage backup products, schedules, retention, point-in-time recovery windows, replicas, logs, and support snapshots.
2. Ask the provider how customer deletion propagates to each copy.
3. Record contractual/documentation URL, verification date, reviewer, and any exception.
4. Target deleted family content aging out of backups within no more than 35 days where the provider permits.
5. If the provider cannot meet the target, escalate to founder/counsel and change the promise before accepting real data.
6. Test primary deletion and restore behavior with synthetic data.

Do not say “deleted everywhere” when only primary data has been removed.

## Local verification

Use synthetic data only.

1. Install the lockfile-defined dependencies without rewriting unrelated changes.
2. Configure demo mode using placeholders.
3. Run lint, type checking, unit tests, and production build.
4. Run the critical end-to-end workflow in a browser.
5. Visually inspect at desktop and mobile widths, including loading, empty, validation, error, invite expiry/revocation, review, export, and deletion states.
6. Confirm the application fails closed when production variables are absent or inconsistent.
7. Confirm no test artifact contains real personal data or secrets.

Required commands:

```text
npm run lint
npm run typecheck
npm run test
npm run build
npm run test:e2e
```

Document failures, the exact environment, and whether a failure is code, fixture, configuration, or external browser/runtime setup.

## Pre-deployment checklist

- [ ] All local verification passes at the selected commit.
- [ ] Working-tree scope reviewed; unrelated user changes preserved.
- [ ] Database migrations reviewed, backed up, and tested on synthetic staging.
- [ ] Environment variables are complete and correctly scoped.
- [ ] Preview/staging uses synthetic data; production protection enabled.
- [ ] Custom domain and HTTPS verified.
- [ ] Business/support/privacy contacts receive and can respond.
- [ ] Health endpoint, structured logs, alerts, and audit events verified without sensitive payloads.
- [ ] Legal gate and production security record complete before enabling real upload.
- [ ] Rollback owner and previous known-good deployment identified.

## Deployment sequence

1. Founder explicitly authorizes account/project creation or linking.
2. Provision isolated staging with synthetic data.
3. Apply schema/storage policies and seed only synthetic fixtures.
4. Deploy the selected commit to staging; run smoke, authorization, media, export, and expiry tests.
5. Review logs/analytics for leakage.
6. Complete legal/security gates and obtain founder production go/no-go.
7. Deploy production with upload disabled.
8. Re-run smoke/negative authorization tests.
9. Enable real-data intake only for the specifically approved paid project.
10. Record commit, migration, environment, operator, timestamp, and verification evidence.

## Rollback and recovery

- Roll application back to the last known-good immutable deployment.
- Do not reverse a data migration blindly. Use a reviewed forward fix or tested restore plan.
- Revoke compromised invitations, sessions, and secrets before restoring traffic.
- Keep uploads disabled when integrity, authorization, or privacy is uncertain.
- Run a synthetic restore drill and record recovery time/result before real data.
- Notify owner/professional/client according to the counsel-approved incident matrix.

## Release smoke tests

- Portfolio and project state load for the correct professional only.
- Synthetic GEDCOM stages, reviews, and applies with warnings preserved.
- Quarantined media is invisible until validation/scan pass.
- Welcome, story, person/source, and focused tree render at desktop/mobile.
- Review invitation sees one frozen version and can submit only one consolidated request.
- Client approval publishes exactly the approved version.
- Recipient invitation is single-use; expiry/revoke/reissue behave safely.
- Handoff requires authenticated owner acceptance and starts 30-day support expiry.
- Export is authenticated/audited/expiring; deletion dates and cancellation are exact.
- Private routes are noindex and reject unauthorized access without cache leakage.

## External readiness blockers

The following are expected external owner actions, not coding failures:

- provision and pay for Vercel Pro and dedicated Supabase Pro;
- acquire/configure the domain and domain email;
- approve credentials and deployment;
- approve the fixed-fee legal engagement and completed advice;
- obtain a permission-cleared founder-family or partner-genealogist dataset; and
- approve the first real-data project.
