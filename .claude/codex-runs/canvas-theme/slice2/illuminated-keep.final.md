Work performed: Added Illuminated Keep manifest, scoped parchment/shield CSS with self-hosted fonts, registry entry, font license notice, and `?theme=` overrides on both tree routes.

Paths touched:
- `lib/themes/illuminated-keep.ts`
- `styles/themes/illuminated-keep.css`
- `public/fonts/README.md`
- `lib/themes/registry.ts`
- `app/globals.css`
- `app/(auth)/projects/[projectId]/preview/tree/page.tsx`
- `app/(client)/s/[slug]/tree/page.tsx`

Validation:
- `npm.cmd run lint` — pass
- `npm.cmd run typecheck` — pass
- `npm.cmd run test` — 7 files / 28 tests pass
- `npm.cmd run build` — pass (Next 16.2.1)
- `git diff --check` — no whitespace errors
- No external font URLs introduced; fonts reference `/fonts/*.woff2`.
- Did not touch anything under `tests/`.

CSS-only limitations: none identified; focus seal uses the approved ✠ glyph because initials are unavailable in markup.

Unresolved uncertainty: I did not run a browser visual check; production compilation passed, but final visual verification of the Keep route remains for the orchestrator.