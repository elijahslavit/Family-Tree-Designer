# Task: Playwright e2e coverage for the themed tree canvas

## Workspace

Git worktree `C:/Dev/github/ftd-canvas-theme` (branch `feat/canvas-theme-worlds`), Next.js 16 +
TypeScript + Playwright. Do not commit.

Another worker is concurrently editing theme files (`lib/themes/*`, `styles/themes/*`, route pages).
You own EXACTLY ONE file: `tests/e2e/themed-canvas.spec.ts` (create it). Touch nothing else — no
`playwright.config.ts`, no app code, no other tests, no `package.json`.

## Verified facts

- Playwright config: `testDir: ./tests/e2e`, chromium desktop project only, `workers: 1`,
  `baseURL: http://127.0.0.1:3100`, `webServer` auto-runs `npm.cmd run dev -- --port 3100` with
  `reuseExistingServer: false` — ensure nothing is listening on 3100 before you run tests.
- `.env.local` with `DEMO_MODE=true` exists in the worktree; the preview route needs no login.
- Target route: `/projects/pilot-hart-001/preview/tree` — a scrollable themed family-tree canvas
  (synthetic Hart family). Root element: `section[data-canvas-theme="midnight-archive"]`.
- Style reference for the repo's e2e conventions: `tests/e2e/home.spec.ts`.
- Markup contract (from `components/canvas-themed/*`):
  - Person nodes: `article.themed-person-node`, each with a `button` whose accessible name is
    `Center tree on <full name>`. Focus node has `data-focus-person="true"`.
  - Living node (Margaret West Vale) shows text "Living" and the privacy line
    "Details shared with family only" (Midnight voice), and never a birth year.
  - Floating controls `nav[aria-label="Tree canvas controls"]`: search button
    (`aria-label="Search visible people"`), depth stepper buttons
    (`aria-label="Show one more generation"` / `"Show one fewer generation"`), branch `select`
    (`aria-label="Filter by family branch"`).
  - Search overlay is a `<dialog>` with an `input[aria-label="Filter visible people by name"]` and
    result buttons listing person names.
  - Generation rows are `section` elements with `h2` labels (Midnight voice: "Parents",
    "Family of record", "Children", …).
- Navigation is URL-driven: clicking a node updates the `person` query param (client-side navigation —
  wait for the URL change, then for the new focus node); depth stepper sets `depth`; unknown params
  (e.g. `share`) are preserved by the canvas navigation.

## Tests to write (one spec file)

Structure with a `const THEMES = ["midnight-archive"] as const;` loop and a TODO comment that
`"illuminated-keep"` will be appended when the second theme lands (it is being built in parallel —
do NOT test it now). Desktop viewport unless stated.

1. **Renders the themed canvas**: root `[data-canvas-theme]` visible; `h1` contains "The Hart Family";
   at least two generation `h2` headings visible.
2. **Living privacy**: Margaret West Vale's node shows "Living" and "Details shared with family only",
   and its text does NOT match `/\b19\d{2}\b/`.
3. **Recenter via node click**: starting at the route with `?share=probe123`, click the button named
   `Center tree on Samuel West` → URL gains `person=` and keeps `share=probe123`; the focus node's
   accessible content now includes "Samuel West".
4. **Depth stepper**: click "Show one more generation" → URL has `depth=2` and the number of generation
   `h2` headings does not decrease; click "Show one fewer generation" → `depth` param removed or `1`.
5. **Search overlay**: open search, type "Robert", choose the "Robert Hart" result → URL `person=`
   updates and the focus node includes "Robert Hart".
6. **Mobile 390×844** (use `test.describe` + `test.use({ viewport: { width: 390, height: 844 } })`):
   canvas renders, floating controls visible, and the parents' generation row contains both
   Walter Hart and June Mercer Hart (paired couple).
7. In each theme loop iteration, save non-golden screenshots via
   `page.screenshot({ path: `test-results/themed-canvas-${theme}-desktop.png`, fullPage: true })`
   (and a mobile one in the mobile describe). Do NOT use `toHaveScreenshot` golden baselines.

Prefer role/label/data-attribute selectors exactly as listed; avoid brittle CSS-class assertions.
Give generous but bounded waits (Next dev-mode first compile of the route can take ~15s; default
timeouts may need a per-test bump, not a global config change).

## Validation

Run: `npx.cmd playwright test tests/e2e/themed-canvas.spec.ts` (webServer starts automatically; first
ensure port 3100 is free). All tests must pass. If a test is flaky, fix the wait strategy rather than
retrying blindly. Do not leave any dev server running afterwards.

## Final report (required)

Work performed · the single path touched · full pass/fail output summary (counts + duration) ·
any markup-contract mismatch you discovered (report, don't fix) · unresolved uncertainty.
