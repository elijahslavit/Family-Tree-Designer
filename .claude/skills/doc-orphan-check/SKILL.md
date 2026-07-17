---
name: doc-orphan-check
description: Find documentation files that nothing links to and documentation files whose subject has been removed from the code, so the user can decide whether to archive, merge, or delete them. Trigger when the user says "find orphan docs", "docs cleanup", or "what docs are stale".
---

# doc-orphan-check

A common project rule: *"Do not leave overlapping summary docs in the main documentation path when one canonical doc can replace them."* Orphans are how overlap creeps in.

## Steps

1. **Build the doc inventory.** Glob the project's markdown documentation tree (e.g. all `*.md` files under a top-level docs directory). Group by folder (root and any subfolders the project uses, such as `tasks/`, `task-briefs/`, `reports/`).

2. **Build the link graph.** Grep the documentation files for markdown links to other documentation files. For each doc, list inbound references.

3. **Flag orphans.**
   - Zero inbound references AND not in a task/brief/report-style folder (those are reachable by convention, not link).
   - Title or subject overlaps another doc that *is* well-linked.

4. **Check subject liveness.** For each orphan, do a quick check: does the code area it describes still exist? (Grep for the major terms from the doc's H1 and headings.)

5. **Categorize.**
   - **Archive** — historically interesting, no longer current.
   - **Merge** — overlaps another canonical doc; merge content and delete.
   - **Delete** — superseded and not worth keeping.
   - **Link in** — actually current, just missing from the index/cross-references.

6. **Report a table** with one recommendation per orphan. Do not delete or move anything without explicit user approval — this skill is read-only by default.

## Stop conditions

- **Doc is referenced from code or CI** (e.g. linked in a README, in build scripts) → not an orphan.
- **User has not approved deletions** → recommend only; never delete in this skill.
