- What was built
  - Pure generation-row engine with couple adjacency, depth limiting, focus state, lineage filtering, and ancestor placeholders: [generational-layout.ts](C:/Dev/github/ftd-canvas-theme/lib/canvas/generational-layout.ts)
  - Midnight Archive manifest, registry, components, responsive controls/search/fullscreen, and scoped styling: [components/canvas-themed](C:/Dev/github/ftd-canvas-theme/components/canvas-themed), [lib/themes](C:/Dev/github/ftd-canvas-theme/lib/themes), [midnight-archive.css](C:/Dev/github/ftd-canvas-theme/styles/themes/midnight-archive.css)
  - Both preview/client tree routes now use the shared themed canvas and preserve `person`, `depth`, `lineage`, and `share`.
  - Added four layout tests covering partitioning, couples, depth, and placeholders.

- Data-selector approach
  - Added `getShowcaseGenerations` to [pilot-showcase.ts](C:/Dev/github/ftd-canvas-theme/lib/showcase/pilot-showcase.ts).
  - Reuses the demo bundle and existing project consent checks, applying `maskPersonForViewer` to living people before layout. Direct inspection confirmed Margaret retains her name/living state while birth and summary are removed.

- Story pill
  - Wired conditionally using privacy-cleared `PilotStory.personIds`; only the story ID crosses into the client component. Profile and story links preserve `share`.

- Validation
  - Lint: pass, 0 errors.
  - Typecheck: pass.
  - Tests: pass, 7 files / 28 tests.
  - Production build: pass; both target routes compiled.
  - `git diff --check`: pass.

- Deviations and uncertainty
  - Localhost visual inspection was blocked by the configured browser security policy. Desktop/390px screenshot verification remains for the parent orchestrator.
  - Small gold text uses brighter `#efc16d`; record-sought opacity is applied through subdued surface/borders rather than lowering text opacity, preserving contrast.
  - Pre-existing untracked `docs/design/` content was not modified. No commit created.