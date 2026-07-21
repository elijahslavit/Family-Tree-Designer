---
name: view-changes
description: Close out every change-making task by telling the user exactly where to view what changed — app URLs with the server command and any auth steps, changed files plus the diff command, screenshots and generated artifacts, docs, and external state. Trigger automatically at the end of ANY task that created, modified, or deleted something (code, docs, DB, deploys, artifacts); the final message must end with a "Where to view" section. Also on demand: "where can I see this", "view changes", "how do I look at what you did".
---

# view-changes

Purpose: the user's standing rule — never make them hunt for what changed. Every task that changes anything ends with a **Where to view** section as the last section of the final message, assembled with real values (no placeholders).

## The "Where to view" section

Include each line that applies, in this order; omit lines with nothing to show. One bolded destination per line, then what to check there.

1. **In the app** — for each changed surface, the complete URL including port, path, query params, and tokens (e.g. `http://localhost:3000/canvas?person=p03&depth=2`), the command to start the server if it isn't running, and any auth steps needed to reach the page (sign-in, invite flow). Name what to look at or interact with once there.
2. **In the code** — the changed files (clickable repo-relative links) and the one command that shows the full diff:
   - uncommitted → `git diff` (plus `git status` for new files)
   - committed this session → `git show <short-hash>` with the actual hash
   - spanning several commits → `git diff <base>..HEAD` with the real base
3. **Screenshots / artifacts** — full paths to every screenshot, report, or generated file outside the repo (scratchpad included); Artifact URLs if published.
4. **Docs** — documentation files updated, as clickable links.
5. **Outside the repo** — DB migrations, deployments, published pages, settings changes: name the system and where to inspect it (dashboard URL, table, environment).

## Rules

- Last section of the final message, headed exactly **Where to view** — after it, nothing but an optional one-line offer of follow-ups.
- Real values only: assembled URLs, actual hashes, actual paths. If a value is unknown, get it (run `git log`, check the port) rather than writing a placeholder.
- Changes with no runtime surface (types, config, pure refactors): say so in one line and point at the diff — never omit the section on the grounds that there is nothing to see.
- Keep it scannable: one line per destination; detail the user doesn't need to FIND the change stays in the body of the report, not here.

## Stop conditions

- Nothing was changed (pure Q&A, analysis, read-only investigation) → no section; don't invent one.
