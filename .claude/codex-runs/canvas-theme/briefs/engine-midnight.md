# Task: Themed tree canvas engine + Midnight Archive theme (first visible slice)

## Workspace

You are working in the Git worktree `C:/Dev/github/ftd-canvas-theme` (branch `feat/canvas-theme-worlds`),
a Next.js 16 App Router + TypeScript app. IMPORTANT: this Next.js version has breaking changes — read the
relevant guides in `node_modules/next/dist/docs/` before writing route/component code (see AGENTS.md).
Do not commit; leave changes in the working tree.

## Product context

Family Tree Designer turns a professional genealogist's finished research into a private, branded,
interactive client presentation. The tree canvas is being redesigned from a boxed React Flow viewport +
sidebar into a **scrollable, theme-first page**: one legible layout engine + swappable "theme worlds"
(sellable templates). This task builds the engine and the first theme, **Midnight Archive** (the app's
existing dark-gold identity as a museum-at-night world). An approved design plan exists at
`docs/design/canvas-theme-worlds/plan.md` (in this worktree) — read it first; it is binding.

## Files you own

CREATE:
- `lib/canvas/generational-layout.ts` — pure layout builder (see Engine spec)
- `lib/themes/types.ts`, `lib/themes/registry.ts`, `lib/themes/midnight-archive.ts`
- `components/canvas-themed/themed-tree-canvas.tsx`
- `components/canvas-themed/themed-person-node.tsx`
- `components/canvas-themed/floating-controls.tsx`
- `components/canvas-themed/person-silhouette.tsx` (simple inline SVG bust: head circle + shoulders path)
- `styles/themes/midnight-archive.css`
- `tests/unit/generational-layout.test.ts` (Vitest, cover the layout function)

MODIFY:
- `app/(client)/s/[slug]/tree/page.tsx` and `app/(auth)/projects/[projectId]/preview/tree/page.tsx` —
  replace the CanvasRouteViewer + CanvasSidebar grid with the new full-page ThemedTreeCanvas
- `app/globals.css` — import the theme CSS
- `lib/showcase/pilot-showcase.ts` — only if you need a new selector (see Data spec)

DO NOT TOUCH: `components/canvas/*` (legacy React Flow canvas), `app/(auth)/canvas/`,
`app/(public)/t/`, `package.json` (no new dependencies), db schema, auth/session code.

## Data spec (verified facts)

- Pilot routes get data via `getShowcaseAccess` / `getSyntheticPilotProject` + `getShowcaseCanvas`
  (`lib/showcase/pilot-showcase.ts:160-227`). `getShowcaseCanvas` currently wraps
  `getCanvasNeighborhoodFromBundle(bundle, personId, viewer, depth, lineageId?)`
  (`lib/data/tree-selectors.ts:262-478`), which returns React Flow nodes/edges via ELK.
- For the scrollable canvas you need generation rows, not a node/edge graph. Add a new selector
  (e.g. `getShowcaseGenerations`) that reuses the same bundle + relative data (parents, siblings,
  spouses, children — see `PersonViewModel.relatives` usage in `components/canvas/canvas-sidebar.tsx`)
  and the SAME privacy path: all person data must pass through the existing masking
  (`maskPersonForViewer`, `lib/utils/privacy.ts`; see tree-selectors.ts:496-501). Never re-implement
  privacy logic.
- URL params must keep existing names and semantics: `person` (focus id), `depth` (1–3 generation
  steps), `lineage` (branch filter id), `share` (share token — must be preserved on every navigation).

## Engine spec — `generational-layout.ts`

Pure function, unit-testable, no React. Input: focus person + masked relatives graph + depth + optional
lineage filter. Output: ordered generation rows:

- Ancestors above, focus generation in the middle, descendants below; `depth` controls how many
  generation steps in each direction are included.
- Within the focus row: siblings and spouse(s) flank the focus person; couples are adjacent and marked
  as a union (union mark rendered between rows).
- Focus person flagged for enlargement.
- Unknown-ancestor placeholders: when an included ancestor generation has missing parents, emit
  `record-sought` placeholder slots (themed text supplied by the theme voice, see below).
- Each row carries a generation label key (e.g. grandparents/parents/focus/children/grandchildren)
  that themes translate via voice strings.

## Theme package spec — `lib/themes/`

```ts
type CanvasThemeManifest = {
  id: string;                       // "midnight-archive"
  name: string;                     // "Midnight Archive"
  tier: "included" | "premium";
  nodeVariant: "card" | "shield";   // engine renders via themed-person-node variants
  cssScope: string;                 // value for data-canvas-theme attribute
  voice: {
    generationLabel: (key: string) => string;
    unknownAncestor: string;        // "Archive entry pending"
    livingPrivacy: string;          // "Details shared with family only"
    storyLink: (firstName: string) => string; // "Read Eleanor's story →"
    scrollCue: string;              // "the archive continues"
  };
};
```

Registry resolves theme id → manifest with `midnight-archive` as default. Wire theme selection
minimally: the showcase/preview pages resolve a `canvasTheme` value if present on the project/tree data,
else default. Do not build selection UI.

## Midnight Archive visual spec (directional — hierarchy and states binding, pixels may evolve)

Scoped under `[data-canvas-theme="midnight-archive"]` in `styles/themes/midnight-archive.css`. Reuse the
dark-gold identity (`styles/tokens/dark-gold.css` is the seed; the theme CSS must be self-contained with
its own custom properties, not dependent on the active skin):

- Page: near-black `#0f0d0a` with a top radial gold glow `rgba(229,170,69,0.1)`; thin double gilt page
  border (1px `rgba(229,170,69,0.25)` outer + 1px `rgba(229,170,69,0.14)` inset ~8px).
- Title band: family name in serif stack (Iowan Old Style / Palatino / Georgia) ~40px; small-caps gold
  letterspaced subtitle (practice attribution); italic muted relationship caption line
  ("Eleanor, daughter of Walter & June · wife of Samuel · mother of Margaret") generated from the focus
  person's relatives, omitting missing parts gracefully.
- Person card: `#1c1610`, 1px gold border `rgba(229,170,69,0.3)`, centered; arched portrait frame
  (border-radius 50% 50% 46% 46%) holding the silhouette SVG (photos later); serif name ~15.5px; small
  letterspaced tabular years; tiny uppercase gold role.
- Focus card: wider, `#e5aa45` border with soft gold glow shadow, italic one-line summary, and an
  outlined gold story pill (see Stories).
- Living person: silhouette at ~35% opacity behind the frame + small gold lock glyph; years replaced by
  "Living"; italic voice line `livingPrivacy`. Client viewers must see only already-masked data.
- Record-sought ghost: dashed border, ~50% opacity, `unknownAncestor` voice text + line note
  ("Hart line · c. 1885" style, from available data or generic).
- Joins between rows: short vertical gold hairline with a 45°-rotated gold square as the union mark.
- Floating controls: pill fixed bottom-center of the canvas, `#1c1610` with gold border: search (⌕),
  generation stepper (depth 1–3), branch filter, fullscreen. On mobile it collapses to icons.
- Scroll cue between last row and bottom: gold small-caps `scrollCue` text.

## Interactions

- Click a node → recenter: `router.push` with updated `person` param (preserve depth/lineage/share),
  then smooth-scroll the new focus into view; wrap in a brief crossfade that is disabled under
  `prefers-reduced-motion`.
- Focus card links to the person's full profile (same profile path base used by the current routes).
- Search: client overlay listing visible people, type-to-filter by name, select → recenter. Esc closes.
- Generation stepper adjusts `depth` (1–3). Branch filter sets/clears `lineage`.
- Fullscreen button uses the Fullscreen API on the canvas container; hide the button if unsupported.

## Stories

If the showcase DTOs already expose stories with `personIds` (see `PilotStory` in
`lib/pilot/types.ts:198-211`), render the story pill on the focus card linking to the existing story
route when a story matches the focus person. If the data is not reachable without expanding scope,
omit the pill and report this explicitly.

## Responsive & accessibility (required)

- 390px: couples remain side-by-side as compact cards; focus-generation siblings/spouses become a
  horizontally scrollable row; controls become an icon pill.
- Every node keyboard-focusable with a visible focus ring; search overlay focus-trapped; controls
  labeled (aria-label).
- Contrast: gold-on-black small text must meet WCAG AA — adjust the gold's lightness for small text
  if needed and note the adjustment.
- `prefers-reduced-motion`: no crossfade/smooth-scroll animations.

## Acceptance criteria

1. `npm.cmd run lint`, `npm.cmd run typecheck`, `npm.cmd run test` all pass (run all three).
2. `/projects/pilot-hart-001/preview/tree` renders the scrollable Midnight Archive canvas with the
   synthetic Hart family: generations top-down, Eleanor enlarged when focused, June+Walter paired,
   living Margaret masked with the privacy voice line, floating controls working.
3. The client route `(client)/s/[slug]/tree` uses the same component (verify it compiles and the data
   path resolves; the preview route is the primary visual check).
4. URL params round-trip: changing person/depth/lineage via the UI preserves `share`.
5. Unit tests cover: generation partitioning, couple adjacency, depth limits, placeholder emission.
6. No changes outside the files you own.

## Final report (required format)

- What was built (bullet list, paths)
- Data-selector approach chosen and why
- Story pill: wired or omitted (why)
- Validation output summary (lint/typecheck/test — pass/fail with counts)
- Deviations from this brief and unresolved uncertainty
