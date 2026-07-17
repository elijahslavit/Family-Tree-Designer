---
name: update-docs
description: Update the canonical markdown documentation to match recent code changes. Trigger when the user says "update docs", "sync docs", "what docs need updating", or after finishing a code change in this repo. Maps changed files to the right documentation area, edits in place, and flags ambiguity instead of guessing.
---

# update-docs

Applies a common project rule: *"After every code change, update the appropriate markdown documentation in the same change. If the needed documentation file does not exist yet, create the canonical markdown file and update it as part of the code change."*

## Steps

1. **Inspect what changed.**
   - `git status` for unstaged/uncommitted work.
   - `git diff` (and `git diff main...HEAD` if branch-scoped) to see the actual edits, not just filenames.
   - List the changed files and group by area.

2. **Map files → canonical doc.** If the project already maintains a mapping from code areas to their canonical docs (in this skill file, a README, or elsewhere), use it as the first stop. Otherwise search the documentation tree for a doc whose title or headings match the changed area before creating a new one.
   - **If two docs overlap**, prefer the one with the most recent edits (`git log -1 -- <path>`) — that's the live one.
   - **If no doc fits**, ask before creating a new one. Don't invent a new top-level doc when an existing section would do.

3. **Read before editing.** Always Read the doc first so you don't clobber recent edits or duplicate sections.

4. **Edit in place.**
   - Update only the sections the code change actually affects.
   - Match the doc's existing tone and structure.
   - Don't add status timestamps, "as of" dates, or "recently changed" callouts unless the doc already uses them.
   - Historical or dated writeups go in an archive/reports area, not in the main documentation.

5. **Check task files.** If an active task corresponds to this work, update its status section too (and the task index if the task moved to/from active).

6. **Report.** End with a short list:
   - Files changed (code)
   - Docs updated (with one-line reason per doc)
   - Docs considered but skipped (with reason)
   - Anything that needed user judgment

## Stop conditions

- **>3 docs would need updates** → stop and confirm scope with the user. Likely the code change is bigger than one doc-sync should cover.
- **No clear canonical doc** → ask, don't invent.
- **Doc and code disagree on intent** (not just wording) → surface the conflict, don't silently rewrite the doc to match the code. The doc may encode a decision the code drifted from.

## Anti-patterns

- Don't create overlapping summary docs.
- Don't write "this was updated to reflect X" meta-commentary in the doc body — just update the content.
- Don't sprinkle the same note across multiple docs. Pick the canonical one.
