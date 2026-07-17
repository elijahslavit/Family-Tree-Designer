---
name: branch-ship-check
description: Produce a punch list of what's left before the current branch can ship — uncommitted work, docs out of sync, scope creep, missing verification, failing checks. Trigger when the user says "ship check", "what's left", "ready to merge", or before opening a PR.
---

# branch-ship-check

## Steps

1. **Gather state in parallel.**
   - `git status` for uncommitted/untracked work.
   - `git log main..HEAD --oneline` to see commits ahead.
   - `git diff main...HEAD --stat` for the change surface.

2. **Check each ship gate.**
   - **Code clean** — no uncommitted hacks, no `console.log`, no commented-out blocks.
   - **Tests** — if tests exist for the changed areas, did they run? Are they passing?
   - **Type-check / lint** — run the project's check command if known; otherwise note it as un-run.
   - **Docs sync** — for each changed area, does the project's documentation reflect it? (Lightweight `/update-docs` style scan.)
   - **Task file updated** — if an active task matches this work, is its Status section current in the project's task index?
   - **Framework-specific verification** — if the project has a dedicated preview/sandbox workflow for this kind of change (e.g. a dev route or staging environment), confirm it was used.
   - **Scope** — light scope check; flag drive-by changes.
   - **PR text ready** — title, body, screenshots if UI.

3. **Report** as a checkbox list with `[x]` / `[ ]` / `[?]` (unknown). One line each.

4. **Recommend** the smallest next action that closes the most gates.

## Stop conditions

- **Branch is far behind main** → recommend rebase/merge before the rest of the check; many gates depend on a current base.
