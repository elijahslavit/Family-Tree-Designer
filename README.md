# Family Tree Designer

A presentation-first family archive built with Next.js App Router. The current implementation includes:

- Creator mode routes for dashboard, directory, profile editing, canvas, import, theme, and settings
- Public viewer routes gated by `slug + share token`
- Skin-aware layout system with `classic`, `editorial`, and `explorer` shells
- Demo-mode data store with a seeded 20-person archive so the app runs without external services
- Supabase/Drizzle scaffolding for production auth, storage, and PostgreSQL
- GEDCOM upload staging and review in demo mode

## Product Spec

The source specification lives in [`docs/Family Tree App Structure.md`](./docs/Family%20Tree%20App%20Structure.md).

## Getting Started

1. Install dependencies:

```bash
npm install
```

2. Copy the environment template:

```bash
cp .env.example .env.local
```

3. Start the app:

```bash
npm run dev
```

With `DEMO_MODE=true`, the app uses the built-in demo tree and does not require Supabase credentials.

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

## Current Architecture

- `app/` contains creator routes, public routes, and route handlers.
- `components/foundation/` contains skin-aware primitives.
- `components/domain/` contains genealogy-specific UI.
- `components/layouts/` contains the three layout shells and shell selector.
- `db/` contains Drizzle schema and client setup.
- `lib/queries.ts` and `lib/actions.ts` are the main data access contracts.
- `lib/data/demo-tree.ts` provides the deterministic demo dataset.

## Notes

- Public viewer links are shaped like `/t/[slug]?share=[token]`.
- Living-person suppression is enforced in the query layer.
- The current read/write path is functional in demo mode; the Supabase/Drizzle production backend is scaffolded but not fully wired end-to-end yet.
