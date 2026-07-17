# Themed Canvas — Approved Design Plan

> **SUPERSEDED 2026-07-17.** Before any slice of this plan shipped, the owner redirected the
> canvas to a diffui-style immersive engine (full-screen React Flow stage, floating panels,
> pan/zoom, minimap) rolled out to all four canvas/tree routes — including the client tree
> routes this plan targeted. The scrollable no-pan/zoom engine described below is therefore
> not the current direction. The theme-as-data business model and the two theme identities
> (Midnight Archive, Illuminated Keep) remain live ideas, now expected to ride on the new
> engine as canvas skins (future task). See decisions.md for the record.

Approved: 2026-07-15. Source of truth for the canvas-theme-worlds initiative.
Shape/board artifact (directional authority): https://claude.ai/code/artifact/720a8dee-229f-47ba-8399-f5a1d95cb27f

## Direction

The client-facing tree canvas becomes a **scrollable, theme-first page**: a genealogist buys a theme
template; the client family's tree renders inside that visual world. One shared layout engine guarantees
legibility; the theme owns everything visible.

- **Engine owns:** top-down generation rows, couple pairing with union marks, enlarged focus person,
  generation depth, branch filter, search, privacy masking, URL-driven state.
- **Theme owns:** background world, node design, typography, ornament, connector marks, control styling,
  copy voice (generation labels, unknown-ancestor text, living-privacy text, story-link text).

Business model (locked): theme-as-data engine · we host · pilot ships two themes · curated catalog later ·
bespoke themes as concierge service · self-serve builder deferred. See decisions.md.

## Scope

**Primary target (pilot-critical routes):**
- `app/(client)/s/[slug]/tree/page.tsx`
- `app/(auth)/projects/[projectId]/preview/tree/page.tsx`

**Ships with:**
1. **Midnight Archive** (included default) — museum-at-night dark-gold: near-black ground with gold glow,
   gilt page border, serif names, gold union diamonds, glowing focus card, veiled living portraits with
   gilt lock ("Details shared with family only"), "Archive entry pending" unknown-ancestor ghosts.
2. **Illuminated Keep** (flagship paid) — parchment charter: blackletter title (UnifrakturMaguntia),
   IM Fell English text, heraldic shield nodes with portrait ovals, wax seal on focus, illuminated
   double-frame, "Record sought" dashed shields, "Recorded privately in the family book" living treatment,
   rubricated "❦ Read her charter story" link.

**Unchanged / out of scope:** legacy `(auth)/canvas` and `(public)/t/[slug]/canvas` routes keep the old
React Flow components; person profiles, stories, sources, welcome, auth flows. Migration of legacy routes
is an optional consistency update requiring separate approval.

## Architecture decisions

1. **No React Flow / no ELK in the themed canvas.** Scrollable page has no pan/zoom; generational layout
   is deterministic. Pure layout function + CSS/SVG join marks.
2. **Theme = data package**: manifest (id, name, tier, nodeVariant, cssScope, voice strings, font assets)
   + one scoped CSS file (`[data-canvas-theme="…"]`). New themes never touch engine code.
3. **Fonts self-hosted** in `public/fonts/` (UnifrakturMaguntia, IM Fell English — SIL OFL).

## New surfaces

- `lib/canvas/generational-layout.ts` — pure, unit-testable row builder from showcase DTOs.
- `lib/themes/` — manifest types + registry (midnight-archive, illuminated-keep).
- `components/canvas-themed/` — `themed-tree-canvas.tsx`, `themed-person-node.tsx` (variants: standard,
  focus, living-masked, record-sought, mini), `floating-controls.tsx` (search overlay, generation stepper,
  branch filter, fullscreen; URL params preserve share token).
- `styles/themes/midnight-archive.css`, `styles/themes/illuminated-keep.css`.

## Responsive & accessibility

390px: couples stay paired; focus-generation siblings/spouse become a swipe row; controls collapse to icon
pill. All nodes keyboard-reachable with visible focus. AA contrast per theme (gold-on-black small text
explicitly checked). `prefers-reduced-motion` honored on recenter crossfade.

## Work plan (Codex orchestration)

| # | Task | Owner | Sandbox | Depends |
|---|------|-------|---------|---------|
| 1 | Engine + Midnight Archive + wire 2 routes (first visible slice) | Codex sol · high, worktree | workspace-write | — |
| 2 | Illuminated Keep theme package against task-1 manifest contract | Codex terra · medium | workspace-write | 1 + slice approval |
| 3 | Playwright coverage: themes × viewports × living-mask × URL params | Codex terra · medium | workspace-write | 1 + slice approval |
| 4 | Verification & integration: diffs, npm run check, e2e, AA, screenshots | Claude orchestrator | — | 1–3 |

First-visible-slice checkpoint: after task 1, stop and let the owner choose review evidence before 2–3.

## Verification

Directional intent alignment against the round-4 board (hierarchy, states, theme language — not pixels);
unit tests on layout function; Playwright screenshots both themes/viewports; privacy assertion (client
viewer receives only masked living data); `npm run check` green.

## Known risks

Long names in shield clip-path (fallback: plaque shape past threshold); Midnight print/light export
variant deferred; story links render only when `story.personIds` matches; no pre-existing canvas tests.
