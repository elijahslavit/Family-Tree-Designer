---
name: pr-summary
description: Generate a PR title and body from the commits and diff on the current branch, matching this repo's style. Trigger when the user says "pr summary", "draft pr description", "write the pr text", or is ready to open a PR.
---

# pr-summary

## Steps

1. **Gather context.**
   - `git log main..HEAD --oneline` and `git log main..HEAD` for commit history.
   - `git diff main...HEAD --stat` and `git diff main...HEAD` for the actual change.
   - Look at recent merged PRs (`gh pr list --state merged --limit 5`) for the repo's style.

2. **Identify the change shape.** Feature, bug fix, refactor, docs, content, infra? The title should lead with this implicitly (verb choice: add, fix, update, rework, document).

3. **Draft the title.** Short (<70 chars), specific, action-led. Avoid "various improvements" — name the thing.

4. **Draft the body** with the sections this repo's recent PRs use. Default structure if no clear style emerges:
   - **Summary** — 1–3 bullets on what changed and why.
   - **Notes** — anything reviewers should know (decisions, deferred work, screenshots).
   - **Test plan** — checkbox list of what to verify, calibrated to the actual change (don't include a generic checklist).

5. **For UI changes**, include a placeholder for before/after screenshots and remind the user to attach them (or call `/screenshot-evidence` if available).

6. **Reference the task.** If an active task in the project's task index or task directory matches, link it.

7. **Report.** Print the draft title and body. Do not run `gh pr create` without explicit user approval — PR creation is a remote-visible action.

## Stop conditions

- **Branch contains commits from multiple unrelated tasks** → recommend splitting before drafting one PR description that hand-waves the mix.
