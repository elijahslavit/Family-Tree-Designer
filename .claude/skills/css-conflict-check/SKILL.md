---
name: css-conflict-check
description: Find duplicate or conflicting CSS rules across the project's stylesheets — same selector defined twice, properties overridden silently by load order. Trigger when the user says "css conflict check", "find duplicate styles", or is debugging a styling bug that resists fixes.
---

# css-conflict-check

## Steps

1. **Enumerate CSS files** under the project's styles directory (e.g. `src/styles/**`) and any module/component CSS.

2. **Build the selector index.** For each rule, capture: selector, properties set, file:line.

3. **Detect conflicts.**
   - **Duplicate selectors** — same selector in multiple files with overlapping properties (whichever loads later wins; surprising at debug time).
   - **Cascade overrides** — a more specific selector reverses a property set by a base rule. Usually intended, but flag pairs where the override seems accidental (different files, different concerns).
   - **!important wars** — rules using `!important` to fight other rules.

4. **Detect dead overrides** — rules that set a property that's then re-set by a more specific selector in every consumer. The base rule does nothing useful.

5. **Report.** Conflicts table sorted by likely impact (broader selectors first), then `!important` usage, then dead overrides. Do not edit — recommend only.

## Stop conditions

- **Conflicts span the design system base layer and a component layer** by design (cascade is the point) → don't flag those as conflicts.
- **CSS-in-JS or Tailwind dominates** → adapt the analysis to the actual styling system; the file-grep approach may miss most rules.
