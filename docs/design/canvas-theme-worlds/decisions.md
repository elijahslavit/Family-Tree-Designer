# Canvas Theme Worlds — Decision Record

2026-07-15. Human decisions made during the Shape/Plan phases (Claude design-orchestrator workflow).

## Superseded (2026-07-17)

Owner decision: replace the canvas on **all four** routes (creator `/canvas`, public
`/t/[slug]/canvas`, client `/s/[slug]/tree`, project preview tree) with a diffui-style
immersive engine — full-screen React Flow stage, cursor-centered zoom, scroll-pan, draggable
cards (not persisted), floating inspector/toolbar/minimap — styled with existing app tokens.
This supersedes the scrollable no-React-Flow engine planned below before any slice shipped.
Still live from this record: the theme-as-data packaging model and the Midnight Archive /
Illuminated Keep theme identities, expected to return as skins on the new engine (future task).

## Selected

- **Model:** scrollable full-page themed canvas; floating themed controls; shared layout engine.
  (Replaces boxed React Flow viewport + four-card sidebar.)
- **Themes:** Midnight Archive (included default, current dark-gold identity) + Illuminated Keep
  (flagship paid, castle/Old English charter).
- **Business model:** theme-as-data engine · we host · curated catalog later · bespoke themes as
  concierge SKU · genealogist-facing theme builder deferred; a bounded per-template customizer
  (name, motto, accent, crest) is the anticipated middle step, not in pilot scope.

## Rejected / superseded

- Round-1 structural directions (Generational Atlas / Book Plate / Guided Path as standalone
  directions) — absorbed into the engine + theme split, not implemented literally.
- Boxed canvas viewport with sidebar — superseded by the scrollable model.
- Selling templates for genealogist self-hosting — conflicts with invite/privacy architecture and
  renewal revenue.
- Genealogist self-serve theme builder — platform cost before validation; revisit only on demand.

## Shelved (future marketplace, not deleted)

- **Albion Standard** — structural national-heritage pattern, repeatable per country.
- **Conservatory** — Victorian botanical specimen folio, portrait-flattering.

## Reference authority

- Round-4 board (https://claude.ai/code/artifact/720a8dee-229f-47ba-8399-f5a1d95cb27f): **directional** —
  hierarchy, states, and theme language binding; pixels may evolve.
- Round-1 board (https://claude.ai/code/artifact/2a79946c-e424-47aa-9bdf-d4012bafc7ae): **superseded**,
  kept for history.

## Open questions deliberately deferred

- Midnight print/light export variant (design follow-up).
- Long-name fallback threshold for shield nodes (implementation detail, task 1).
- Whether legacy `(auth)/canvas` and `(public)/t/[slug]/canvas` routes migrate (needs separate approval).

## Tapestry imagery (added 2026-07-15)

- Architecture decided: Illuminated Keep uses **A Mural Spine**; Midnight Archive uses **B Vignettes on a Continuous Ground**.
- Slot maps and style bibles: `tapestry/keep-mural-spine.md`, `tapestry/midnight-vignettes.md`; wireframe kit lives in the Shape artifact record.
- Method is codified in the design-orchestrator skill (`references/tapestry-imagery.md`, `assets/tapestry-slot-map.md`).
- Rejected: butting independent generations together (seams never match); Woven Panels (C) shelved for textile-native themes.
