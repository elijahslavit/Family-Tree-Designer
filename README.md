# Family Tree Designer

Family Tree Designer is a professional delivery studio for genealogists. It turns a genealogist's finished research (the GEDCOM, selected photographs, short stories, and source records) into a private, branded presentation that their client explores with their family.

The repository contains a complete synthetic founding-pilot experience. It is not yet approved for real client data or production deployment (see [Production gates](#production-gates)).

## What's in the product

**For the genealogist: the studio** (`/projects`)

- A portfolio of client projects, each moving through ten clear delivery steps from intake to the family's own archive.
- GEDCOM import that is checked in the browser before anything is uploaded: people, families, living people, and every issue the import found, with nothing dropped silently.
- Curation of the welcome page, stories, and starting point of the tree, with a live preview of the practice's brand colours.
- Review rounds locked to a single version, recorded responses to every client request, private single-use invitations, and a handoff to the family's archive owner.

**For the client: the presentation** (`/s/[slug]`, previewed at `/projects/[id]/preview`)

- An opening welcome in the practice's colours, shown once per visit.
- A generational family tree with search, generation labels, branch highlighting, and a text outline for screen readers and phones.
- People, stories, and source records, each linked to the others.
- Invitation-only access, with no public links. Living relatives show only consented details, and living children never appear.

**Public page** (`/`): what the product is, who it is for, and what the client receives.

All people, practices, media, records, invitations, and events in the demo are fictional.

## Getting started

Install dependencies and create a local environment file. Keep `DEMO_MODE=true` for local synthetic work; demo mode needs no database or Supabase credentials.

```bash
npm install
```

```bash
cp .env.example .env.local
```

```bash
npm run dev
```

Open `http://localhost:3000`. On Windows PowerShell, use `npm.cmd` if the script policy blocks `npm.ps1`, and `Copy-Item .env.example .env.local` to copy the environment file.

## Demo routes

| Route | What it shows |
| --- | --- |
| `/` | Public page |
| `/projects` | Studio portfolio |
| `/projects/pilot-hart-001` | A project overview, with every workflow step in the sidebar |
| `/projects/pilot-hart-001/import` | GEDCOM check (try any `.ged` file; it never leaves the browser) |
| `/projects/pilot-hart-001/preview` | The client presentation, exactly as an invited client sees it |
| `/invite/pilot-review-invite` | A valid client-review invitation |
| `/invite/pilot-owner-invite` | A valid archive-owner handoff invitation |
| `/invite/pilot-expired-invite`, `/invite/pilot-revoked-invite` | Safe error states that reveal nothing about the family |

Invitation fixtures are local and synthetic. Each can be redeemed once per server start. Never reuse them in production. Addresses from the earlier hobbyist editor (`/dashboard`, `/directory`, `/t/…`, and others) redirect to the studio or the home page.

## Scripts

| Command | Purpose |
| --- | --- |
| `npm run dev` | Development server |
| `npm run build` | Production build |
| `npm run lint` | ESLint |
| `npm run typecheck` | TypeScript, no emit |
| `npm run test` | Vitest unit tests with coverage |
| `npm run test:e2e` | Playwright end-to-end tests (starts its own server) |
| `npm run check` | Lint, typecheck, and unit tests together |
| `npm run db:generate` / `db:push` | Drizzle migrations and schema push |

Continuous integration (`.github/workflows/ci.yml`) runs lint, typecheck, unit tests, and a production build, plus the Playwright suite against the production build, on every pull request.

## Architecture

| Path | Contents |
| --- | --- |
| `app/page.tsx` | Public page |
| `app/(auth)/projects/` | Studio routes and the professional preview of the client presentation |
| `app/(client)/` | Invitation, review, handoff, owner archive, and invited presentation routes |
| `components/pilot/` | Studio and client UI, including the presentation (`showcase-*`), the welcome reveal, and shared tree and story views |
| `components/canvas/` | Family tree canvas, search, text outline, and sidebar |
| `components/foundation/` | Shared primitives (buttons, badges, inputs, toggles) |
| `lib/pilot/` | Synthetic pilot domain store, workflow rules, and demo data |
| `lib/showcase/` | Privacy-filtered presentation data, access checks, and the reveal's session state |
| `lib/data/canvas-layout.ts` | Generational family-tree layout |
| `lib/import/gedcom-parser.ts` | GEDCOM decoding and parsing, with review issues for anything not imported |
| `lib/utils/brand-palette.ts` | Accessible palette derived from a practice's brand colours |
| `lib/auth/` | Invitation and session credentials, and authorization |
| `db/` | Drizzle schema and client |
| `public/demo/pilot/` | Synthetic demonstration media |
| `docs/pilot/` | Product, commercial, operations, privacy, security, and implementation plans |

## Pilot source of truth

Start with [`docs/pilot/README.md`](./docs/pilot/README.md). It links the product, commercial, operating, privacy-review, deployment, measurement, and execution documents. The earlier [`docs/Family Tree App Structure.md`](./docs/Family%20Tree%20App%20Structure.md) is background only and does not override the pilot scope.

## Production gates

Do not ingest real client data until all of the following are true:

- the attorney-review record is complete and the founder has approved the go/no-go gate;
- a consented dataset is available;
- dedicated Vercel, Supabase, domain, and email infrastructure is provisioned, and provider backup retention is verified;
- secrets are configured. `INVITE_TOKEN_PEPPER` is required: outside demo mode, invitation and session handling refuses to run without it;
- the pilot workflow is persisted to the database. The `db/schema.ts` pilot tables exist, but the store in `lib/pilot/store.ts` is still in-memory and demo-only;
- migrations and storage policies are deployed, and the deployment/security checklist passes.

Those accounts are intentionally unprovisioned; no code in this repository creates, purchases, deploys, or exposes credentials. The local invitation, review, export, and deletion behaviour is a deterministic implementation of the pilot rules, not a claim that production authentication, malware scanning, durable jobs, backups, or generated ZIP delivery are already provisioned.
