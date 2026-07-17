---
name: visual-regress
description: Capture screenshots of key application screens, intended for before/after comparison to catch visual regressions. Trigger when the user says "visual regression check", "screenshot the key screens", or before merging a UI-touching change.
---

# visual-regress

## Steps

1. **Define the screen set.** Default list (confirm with user, adjust to the app's actual key screens):
   - Primary content view with a small/simple dataset.
   - Primary content view with a large/complex dataset.
   - Primary content view with any major optional panel or overlay toggled on.
   - Primary content view with a secondary detail panel open.
   - Main landing page.
   - First step of onboarding/signup.
   - Any style/theme gallery or settings page, if applicable.

2. **Capture baseline first.** If this is a before/after run and the user hasn't captured "before" yet, ask whether to checkout main first to capture the baseline. Don't assume.

3. **Start the dev server.**

4. **For each screen:**
   - Navigate, wait for the page to settle.
   - Capture at a consistent viewport (default 1440×900; mobile 390×844 if mobile is in scope).
   - Save with a structured filename: `<scope>/<screen>-<theme>.png`.

5. **Compare** if both before and after exist:
   - Side-by-side gallery in a temporary markdown file.
   - Note pixel-level differences only where they look intentional or alarming.

6. **Report.** Saved screenshots, scope captured, anything that looked off.

## Stop conditions

- **A screen fails to render** → that's the finding; report it instead of skipping.
- **Theme switching is broken in the build** → flag and capture only the working themes.
