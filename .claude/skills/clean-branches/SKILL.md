---
name: clean-branches
description: List local git branches and classify them as safe-to-delete, merged-but-keep, in-progress, or unknown. Trigger when the user says "clean branches", "what branches can I delete", or local branch list is cluttered.
---

# clean-branches

## Steps

1. **List local branches.** `git branch -vv` to get branch + tracking + last commit.

2. **Per branch, classify.**
   - **Merged to main** — `git branch --merged main` will list these. Safe-to-delete candidates.
   - **Has remote** but remote is gone (deleted upstream) — likely safe; double-check.
   - **No remote** — local-only; could be in-progress work or stale.
   - **Recent activity** (last commit < 7 days) — keep regardless.
   - **Currently checked out** — skip; never recommend deleting current branch.

3. **For each candidate, check for unique work.** `git log <branch>..main` — if the branch has commits not in main, it's not merged in. List those commits so the user can see what would be lost.

4. **Report.** Table: branch → last commit → tracked? → merged? → recommendation (delete / keep / review). Sort safe deletes first.

5. **Do not delete anything.** Recommend the exact `git branch -d` (safe) or `git branch -D` (forced) commands per branch for the user to run.

## Stop conditions

- **Many branches contain unique commits** → likely the user has parked work; don't recommend deletion — just surface so the user can triage.
- **`git status` is dirty** → skip checkout-needing checks; report only what's derivable from current state.
