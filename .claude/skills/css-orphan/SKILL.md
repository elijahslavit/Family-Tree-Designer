---
name: css-orphan
description: Find CSS class rules with no matching usage in any JSX/TSX file — likely leftover styles from removed components. Trigger when the user says "find orphan css", "css cleanup", or is reducing the CSS surface.
---

# css-orphan

## Steps

1. **Enumerate class selectors** from the project's stylesheets (e.g. `src/styles/**/*.css`) and any CSS Modules. Capture: class name, file:line.

2. **Search for usage** of each class in JSX/TSX:
   - `className="foo"` (literal).
   - `className={...}` containing the class name as a string.
   - `clsx(...)` / `cn(...)` / `classNames(...)` arguments.
   - For CSS Modules, look for `styles.foo` references.

3. **Classify.**
   - **Confirmed orphan** — class defined, zero usages found.
   - **Maybe orphan** — class used only inside other CSS (`@apply`, parent–child selectors) and the parent itself is unused.
   - **Dynamic** — composed at runtime (string concat, template literals); can't statically verify. List separately so the user knows the limit of the analysis.

4. **Filter false positives.**
   - Utility classes used by content/markdown rendering (prose-style classes).
   - Library / vendor classes (animations, third-party widgets).
   - Pseudo-state classes referenced only in CSS (`:hover`, `:focus-visible`) — that's CSS-internal, not orphan.

5. **Report.** Orphans sorted by file, with the rule snippet. Recommend only; do not delete.

## Stop conditions

- **Project uses Tailwind exclusively** → most class names are generated, not authored; this skill doesn't apply — say so and stop.
