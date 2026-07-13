# Family Tree Designer

Family Tree Designer turns a professional genealogist's completed GEDCOM, selected photographs, short stories, and source records into a private, branded, interactive client presentation. The current repository contains a complete synthetic founding-pilot experience; it is not approved for real client data or production deployment yet.

The pilot UI includes:

- a professional portfolio and ten-state delivery workspace;
- intake, import review, private media quarantine, curation, review, publication, access, handoff, export, and deletion states;
- a branded client welcome, focused tree, person profiles, stories, and source views;
- single-use invitation redemption, purpose-scoped viewer sessions, revocation, client review, and verified-owner handoff simulations; and
- responsive loading, empty, validation, error, expired, revoked, and authorization states.

All included people, practices, media, records, invitations, and events are synthetic.

## Pilot source of truth

Start with [`docs/pilot/README.md`](./docs/pilot/README.md). It links the implementation-ready product, commercial, operating, privacy-review, deployment, measurement, and execution artifacts. The earlier [`docs/Family Tree App Structure.md`](./docs/Family%20Tree%20App%20Structure.md) remains useful background but does not override the locked pilot scope.

## Getting Started

From the repository directory (not `C:\Windows\System32`), install dependencies:

```bash
npm install
```

Copy `.env.example` to `.env.local`. Keep `DEMO_MODE=true` for local synthetic work:

```powershell
Copy-Item .env.example .env.local
```

Start the app:

```bash
npm run dev
```

On Windows PowerShell, use `npm.cmd` if the PowerShell script policy blocks `npm.ps1`:

```powershell
npm.cmd install
npm.cmd run dev
```

Open `http://localhost:3000`. Demo mode uses only the built-in synthetic workspaces and requires no Supabase credentials.

## Useful synthetic routes

- `/` — professional marketing page
- `/projects` — creator portfolio
- `/projects/pilot-hart-001` — pilot workspace
- `/projects/pilot-hart-001/preview` — authorization-faithful professional preview
- `/invite/pilot-review-invite` — valid client-review invitation
- `/invite/pilot-owner-invite` — valid owner-handoff invitation
- `/invite/pilot-expired-invite` and `/invite/pilot-revoked-invite` — safe terminal states

Invitation fixtures are deliberately local and synthetic. Never reuse them in production.

## Scripts

- `npm run dev` starts the Next.js dev server.
- `npm run build` creates a production build.
- `npm run lint` runs ESLint.
- `npm run typecheck` runs TypeScript in no-emit mode.
- `npm run test` runs Vitest unit tests with coverage.
- `npm run test:e2e` runs Playwright tests.
- `npm run db:generate` generates Drizzle migrations.
- `npm run db:push` pushes the schema to PostgreSQL.
- `npm run db:seed` resets the demo seed script entrypoint.

Run the full local verification sequence with:

```powershell
npm.cmd run lint
npm.cmd run typecheck
npm.cmd run test
npm.cmd run build
npm.cmd run test:e2e
```

## Current Architecture

- `app/(auth)/projects/` contains the professional pilot workspace and preview.
- `app/(client)/` contains invitation, review, handoff, owner-control, and private showcase routes.
- `components/pilot/` contains reusable creator and client pilot UI.
- `lib/pilot/` contains the deterministic synthetic domain store and workflow rules.
- `lib/showcase/` creates privacy-filtered client presentation DTOs.
- `lib/auth/pilot-*` contains local invitation/session and authorization utilities.
- `components/foundation/` contains skin-aware primitives.
- `components/domain/` contains genealogy-specific UI.
- `components/layouts/` contains the three layout shells and shell selector.
- `db/` contains Drizzle schema and client setup.
- `public/demo/pilot/` contains clearly synthetic demonstration assets.

## Production gates

Do not ingest real client data until the attorney-review record is complete, the founder has approved the go/no-go gate, a consented dataset is available, dedicated Vercel/Supabase/domain/email infrastructure is provisioned, provider backup retention is verified, secrets are configured, migrations and storage policies are deployed, and the deployment/security checklist passes. Those accounts are intentionally unprovisioned; no code in this repository creates, purchases, deploys, or exposes credentials.

The local invitation, review, export, and deletion behavior is a deterministic implementation of pilot rules, not a claim that production authentication, malware scanning, durable jobs, backups, or generated ZIP delivery are already provisioned.
