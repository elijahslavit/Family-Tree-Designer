---
name: tasks-index-rebuild
description: Tidy the repo's task tracker after adds/archives — fix numbering gaps/duplicates and confirm intended order, without altering task content or IDs. Trigger when the user says "renumber tasks", "tidy the task list", "the task list is out of order", or after a batch of task changes.
---

# tasks-index-rebuild

Adding and archiving tasks leaves a numbered tracker gapped or out of order. This tidies the numbering/order without rewriting task content. Works whether the tracker is a single list file or a folder of per-task files.

## Steps

1. **Locate the task tracker** (see `/new-task`) and read it. If it's a folder of per-task files, enumerate them by prefix; if a single file, list its entries in order.
2. **Spot problems:** numbering gaps, duplicates, or an order the user didn't intend.
3. **Resequence** to be contiguous in the intended order. **Never change a stable task ID** if the repo keeps one separate from list position, and don't touch task content/goals.
4. **Confirm reordering.** If the fix moves tasks (not just renumbers in place), show the proposed order before writing.
5. **Report** what changed and anything left to confirm.

## Stop conditions

- **Ambiguous intended order** → ask; don't guess a priority the user didn't state.
- **A draft/scratch entry** → ask before counting it as an active task.
