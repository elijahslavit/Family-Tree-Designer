---
name: archive-task
description: Close out a completed task — remove it from the repo's active task tracker and record the outcome wherever the repo keeps completed/historical notes. Trigger when the user says "archive task", "task N is done", "close out task X", or marks a task as shipped.
---

# archive-task

Completed tasks shouldn't linger in the active tracker. Find the repo's tracker and its "done/archive" destination first; both vary by repo.

## Steps

1. **Locate the active tracker and the archive destination.** The tracker is the active task list/folder (see `/new-task`). The archive is wherever the repo keeps completed work — a `reports/` or `archive/` doc, a "Done" section, a CHANGELOG, or per-task outcome files. If unclear, ask.
2. **Identify the task** and read its entry.
3. **Confirm it's actually done.** Shipped / merged / verified? If unclear, don't archive — flag what's missing.
4. **Record the outcome** in the repo's archive destination — a short summary, date completed (today's date from session context), and PR/commit links if known — matching that file's format. Keep it brief; it's a marker, not a retrospective.
5. **Remove the active entry** from the tracker. If entries are numbered, resequence so there's no gap (see `/tasks-index-rebuild`). If it's a per-task-file model, delete the file too.
6. **Fix orphans.** Other files referencing this task by number or title → update them.
7. **Report** what was archived, removed, and resequenced.

## Stop conditions

- **Can't confirm it shipped** → don't archive; ask what verification was done so the record is true.
- **Follow-up work remains that isn't its own task** → suggest `/new-task` first.
