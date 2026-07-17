---
name: new-task
description: Add a new task to the repo's task tracker, matching its existing format and placement. Trigger when the user says "new task", "add a task", "create a task for X", or describes work that needs tracking.
---

# new-task

Repos track tasks differently — a single list file, a folder of per-task files, or a section inside a docs page. **Find the repo's tracker first, then add one entry in its existing format.** Do not assume a structure exists.

## Steps

1. **Locate the task tracker.** Look, in order, for: a root `TASKS.md` / `TODO.md` / `ROADMAP.md`; a docs file whose name is about tasks/roadmap/overview; or a `tasks/` folder of per-task files. If none is obvious, ask the user where tasks live — don't invent a new structure without their OK.
2. **Confirm the task.** Restate the objective in one sentence and ask where it should sit (append, or a specific slot). Don't guess priority.
3. **Read the tracker** to learn its exact format — heading style, numbering/prefix scheme, per-entry fields (goal, status, links) — and match it. If it's a folder of per-task files, read a neighbor to mirror its sections and `NN-Kebab-Title.md` naming.
4. **Add the entry** in the chosen position, mirroring the existing format. If entries are numbered and you insert mid-list, renumber below only with the user's explicit OK (it churns the diff).
5. **Report.** Where it went, and any renumbering done.

## Stop conditions

- **No task tracker exists** → ask whether to create one, and where, rather than inventing a convention.
- **Title matches an existing task** → ask whether to update that entry instead.
- **Inserting requires renumbering many entries** → confirm scope first.
