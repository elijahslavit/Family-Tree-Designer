---
name: screenshot-evidence
description: Capture before/after screenshots for a UI change, formatted for inclusion in a PR description or review thread. Trigger when the user says "screenshot evidence", "before/after for this change", or before opening a UI-touching PR.
---

# screenshot-evidence

## Steps

1. **Confirm the change.** Ask the user for the file(s) or feature this is evidence for, and which viewport(s) / theme(s) matter.

2. **Capture "before".**
   - If the change is not yet committed, ask whether to stash the working tree to capture the pre-change state, then restore.
   - If the change is already committed, checkout the parent commit, capture, then return to HEAD.
   - **Confirm with the user before checking out anything** — uncommitted work is at risk if mishandled.

3. **Capture "after".** With the working state at the post-change version, capture the same screens at the same viewport/theme.

4. **Save** with paired filenames: `<feature>-before-<viewport>.png` and `<feature>-after-<viewport>.png`. Use a temp folder unless the user wants them committed.

5. **Format a markdown block** for pasting into the PR body:

   ```
   ### Before
   ![before](path/to/before.png)

   ### After
   ![after](path/to/after.png)
   ```

6. **Report.** Files captured, markdown snippet, any caveats (theme differences, viewport differences).

## Stop conditions

- **Working tree has uncommitted work and the user hasn't approved a stash** → capture "after" only and note that "before" requires a clean tree.
- **Change is non-visual** → say so; screenshots add noise, not signal.
