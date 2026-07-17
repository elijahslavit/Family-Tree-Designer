---
name: component-snapshot
description: Capture screenshots of a specific component in multiple theme variants (light, dark, and any named themes) for visual review. Trigger when the user says "snapshot this component", "screenshot in all themes", or is reviewing visual variants.
---

# component-snapshot

## Steps

1. **Identify the component.** Ask the user for the file path or component name, plus the smallest URL or route that renders it on its own (or a Storybook-equivalent page if the project has one).

2. **Confirm the theme set.** Read the project's theme/design-system documentation, if one exists, to find the variants worth capturing. Ask the user if they want only a subset.

3. **Start the dev server.**

4. **For each theme:**
   - Switch to the theme (via the in-app toggle, URL param, or theme provider override — match how the app actually changes themes).
   - Wait for the swap to settle.
   - Capture a screenshot of the component in isolation (a tight bounding box, not the whole page) at a consistent viewport size.
   - Save with a predictable filename (`<component>-<theme>.png`).

5. **Report.** A small markdown gallery: each screenshot with its theme label. Recommend a folder if the user wants to keep these (e.g. `reports/snapshots/<date>/`).

## Stop conditions

- **Component can't render in isolation** (requires a parent context that's expensive to fake) → capture in its natural page context and crop, rather than building a synthetic harness.
- **Themes cause layout shift or content reflow** → flag this as a finding; that may be a bug, not just a snapshot subject.
