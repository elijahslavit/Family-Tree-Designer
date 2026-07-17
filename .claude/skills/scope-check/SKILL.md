---
name: scope-check
description: Audit an in-progress diff for scope creep — changes that go beyond what the task originally requested. Trigger when the user says "scope check", "did I creep", "is this still in scope", or before opening a PR for a long-running branch. Enforces the project rule to keep changes explainable and scoped to the task.
---

# scope-check

Applies a common project rule: *"Keep changes explainable and scoped to the task."* Also catches the common failure mode: bundling unrelated cleanups into a feature PR, which makes review harder and rollback riskier.

## Steps

1. **Get the original task statement.** Ask the user for the task identifier or restate the objective from the active task file (e.g. in a `tasks/` directory or the project's task index).

2. **Inventory the diff.**
   - `git status` and `git diff main...HEAD` (or against the branch base).
   - Group changed files by area (e.g. feature modules, config, tests, docs, build).

3. **Classify each group.**
   - **In scope:** directly implements the task objective.
   - **Necessary collateral:** had to change to make the in-scope work compile or pass tests.
   - **Drive-by:** unrelated cleanup, formatting, comment edits, "while I was here" refactors.
   - **Out of scope:** new features or behavior changes unrelated to the task.

4. **Report a table** with file → group → one-line reason.

5. **Recommend.** For drive-by and out-of-scope groups, suggest one of:
   - Revert and split into a separate PR.
   - Keep if trivial and the user explicitly OKs it.
   - Move to a new task file via `/new-task`.

## Stop conditions

- **Out-of-scope changes touch a different area entirely** → strongly recommend splitting; don't bundle.
- **The user can't recall the original objective** → re-read the task file before classifying anything.
