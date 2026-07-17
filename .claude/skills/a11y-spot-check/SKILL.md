---
name: a11y-spot-check
description: Quick accessibility review of a specific UI component — focus order, keyboard reachability, labels, contrast, ARIA correctness. Trigger when the user says "a11y check", "accessibility review", or names a component to audit.
---

# a11y-spot-check

## Steps

1. **Identify the component.** Ask the user for the path and the URL/route where it renders.

2. **Static review.** Read the component code:
   - Are interactive elements actually `<button>` / `<a>` / `<input>`, or styled `<div>`s that need ARIA?
   - Are images, icons, and SVGs labeled (alt text, `aria-label`, or `aria-hidden` if decorative)?
   - Are form controls associated with labels?
   - Are ARIA roles used correctly (no `role="button"` on an actual `<button>`, no invalid combinations)?

3. **Live review.** Start the dev server, navigate to the component:
   - Tab through it. Does focus move in a sensible order? Does focus ever escape into nothing?
   - Activate every control with Enter / Space.
   - Inspect contrast for text in both light and dark themes. Note any obvious failures.
   - Resize the viewport. Is anything cut off or impossible to reach at narrow widths?

4. **Non-English or mixed-language content.** If the component renders text in a language other than the app's default UI language, confirm it carries the correct `lang` attribute so screen readers pronounce it correctly, and that any translation/gloss is readable independently of the source text.

5. **Report.** Findings grouped by severity (blocker / serious / minor) with file:line and a one-line fix suggestion each.

## Stop conditions

- **Component is a thin wrapper around a primitive** → the audit belongs on the primitive, not the wrapper; redirect.
- **An automated a11y tool is already configured in the project** → run it instead of duplicating its work; supplement with the live keyboard walk.
