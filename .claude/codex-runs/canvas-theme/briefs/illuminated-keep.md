# Task: Illuminated Keep theme package (flagship paid theme)

## Workspace

Git worktree `C:/Dev/github/ftd-canvas-theme` (branch `feat/canvas-theme-worlds`), Next.js 16 App Router +
TypeScript. Read `node_modules/next/dist/docs/` guides before writing route code (see AGENTS.md). Do not
commit. The approved design plan is at `docs/design/canvas-theme-worlds/plan.md` — binding.

Another worker is concurrently writing ONLY `tests/e2e/themed-canvas.spec.ts`. Never touch that file or
anything under `tests/`.

## Context

The themed-canvas engine and the first theme (Midnight Archive) are already implemented and working:
- Engine: `lib/canvas/generational-layout.ts`, `components/canvas-themed/*`
- Reference theme: `styles/themes/midnight-archive.css` + `lib/themes/midnight-archive.ts`
- Theme manifests are **pure data** (no functions — they cross the RSC boundary). See `lib/themes/types.ts`.
- Node markup exposes `data-node-variant` (from manifest `nodeVariant`) and `data-canvas-theme` scope.
- Preview route works: `/projects/pilot-hart-001/preview/tree`.

Your job: the second theme, **Illuminated Keep** — a parchment castle/Old English charter world. It must
require ZERO engine changes: manifest + scoped CSS + fonts only, plus a small `?theme=` override.

## Files you own

CREATE:
- `lib/themes/illuminated-keep.ts`
- `styles/themes/illuminated-keep.css`
- `public/fonts/README.md` — note: UnifrakturMaguntia and IM Fell English, SIL Open Font License,
  self-hosted woff2 subsets (files already staged in `public/fonts/` — do not re-download)

MODIFY:
- `lib/themes/registry.ts` — register the theme (id `illuminated-keep`, tier `premium`)
- `app/globals.css` — add the CSS import next to the midnight import
- `app/(auth)/projects/[projectId]/preview/tree/page.tsx` and `app/(client)/s/[slug]/tree/page.tsx` —
  ONLY add: read a `theme` search param; when present, it overrides the project's configured theme via
  `getCanvasTheme`. (The client component already preserves unknown params on navigation.) Unknown ids
  must fall back to the default theme — the registry already behaves that way; keep it.

DO NOT TOUCH: engine components (`components/canvas-themed/*`), `lib/canvas/*`, midnight theme files,
`tests/`, `playwright.config.ts`, `package.json`. If a styling goal seems to need markup changes, solve
it in CSS (attribute selectors, pseudo-elements) or report it as a limitation — do not edit components.

## Manifest (exact voice strings)

```ts
{
  id: "illuminated-keep",
  name: "The Illuminated Keep",
  tier: "premium",
  nodeVariant: "shield",
  cssScope: "illuminated-keep",
  voice: {
    generationLabels: {
      greatGrandparents: "Great-forebears",
      grandparents: "The forebears",
      parents: "The elder generation",
      focus: "The family of record",
      children: "The line continues",
      grandchildren: "The line continues further",
      greatGrandchildren: "The youngest line",
    },
    unknownAncestor: "Record sought",
    livingPrivacy: "Recorded privately in the family book",
    storyLinkTemplate: "❦ Read {firstName}'s charter story",
    scrollCue: "the charter continues",
  },
}
```

## Visual spec (directional: hierarchy/states binding, pixels may evolve)

All scoped under `[data-canvas-theme="illuminated-keep"]`. Mirror the selector inventory of
`midnight-archive.css` (same class names — the engine renders identical markup) with this world:

- **Fonts** (`@font-face` inside the theme CSS, `font-display: swap`):
  - `"UnifrakturMaguntia"` ← `/fonts/unifraktur-maguntia.woff2` — DISPLAY ONLY (the h1 family title).
  - `"IM Fell English"` normal ← `/fonts/im-fell-english.woff2`; italic ← `/fonts/im-fell-english-italic.woff2`
    — person names, captions, generation labels, privacy/record text.
- **Page**: aged parchment `#e9dcbe` with subtle radial vignettes (gold `rgba(163,119,28,…)` top,
  brown `rgba(74,46,24,…)` bottom); ink `#2a1e12`; heraldic red `#7c2418`; gold `#a3771c`.
  Illuminated page frame via `.themed-canvas-frame`: double rule — outer red-ish, inner gold (reuse the
  existing frame element + ::after pattern).
- **Title band**: h1 in UnifrakturMaguntia (~3rem, first letter red via ::first-letter); relationship
  caption in IM Fell italic; practice line small-caps red, wide tracking; a `border-top: 3px double`
  red rule under the band (adapt the existing ::after).
- **Generation labels (h2)**: IM Fell, letterspaced small caps, red, flanked feel (e.g. ::before/::after "✠").
- **Shield node** (`data-node-variant="shield"`): parchment gradient surface
  (`linear-gradient(160deg,#f2e8cf,#e6d8b4)`), 1.5px red border, inset gold rim (box-shadow inset),
  `clip-path: polygon(0 0, 100% 0, 100% 74%, 50% 100%, 0 74%)`, extra bottom padding so the point clears
  content. Clamp `.themed-person-name` to 2 lines (the clip-path cannot grow gracefully with long names).
- **Portrait frame**: arch shape (existing element), gold rim, silhouette tinted `#6b533a` on `#ddceab`.
- **Focus shield**: wider, stronger inset gold rim + drop shadow, and a wax-seal mark: `::after` on
  `.themed-person-node--focus` — a ~34px radial-gradient circle (`#9a3020` → `#6d1f12`) top-right with a
  pale `✠` glyph via `content`. (Initials aren't available to CSS; the glyph seal is the accepted variant.)
- **Living mask**: silhouette ~35% opacity; restyle the existing `.themed-lock` badge in wax red;
  privacy line in IM Fell italic.
- **Record sought**: dashed red border shield, transparent parchment, IM Fell italic name.
- **Joins & couple ties**: reuse the existing join/union structure — lines in red
  (`rgba(124,36,24,…)`), diamonds gold with parchment/page background so lines don't cut through.
- **Floating controls**: parchment pill `#f2e8cf`, 1px gold border, red icons/text; keep all behavior.
- **Search dialog**: parchment surface, red/gold accents, IM Fell headers ("Charter index" voice is set
  by the component's static copy — leave component text alone, style only).
- **Scroll cue**: red, small caps.
- **Contrast**: body-size text must hold WCAG AA on parchment (ink `#2a1e12` and red `#7c2418` both pass;
  gold `#a3771c` is decorative only — never body text). Blackletter never below the h1.
- Include the same `@media (max-width: 640px)` adaptations as midnight (swipe rails, compact shields
  ~140px, icon controls) and the `prefers-reduced-motion` block.

## Acceptance criteria

1. `npm.cmd run lint`, `npm.cmd run typecheck`, `npm.cmd run test` pass; `npm.cmd run build` succeeds.
2. `/projects/pilot-hart-001/preview/tree?theme=illuminated-keep` renders the Keep world;
   without the param the route still renders Midnight Archive (default unchanged).
3. No engine/component/test files modified.
4. Fonts load from `/fonts/` (no external requests introduced).

Do not start a dev server on port 3100 (reserved for Playwright). If you need a runtime check, use
`npx next dev -p 3210` and stop it afterwards; if the sandbox blocks browsing, rely on build + the
orchestrator's visual verification and say so.

## Final report (required)

Work performed · paths touched · validation output summary · any spec point you could not satisfy
CSS-only and why · unresolved uncertainty.
