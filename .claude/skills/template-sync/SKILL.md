---
name: template-sync
description: Propagate the shared template at C:\dev\templates (CLAUDE.md, AGENTS.md, .claude/agents, .claude/skills) into every git repo under c:\Dev\github so they stay updated. Trigger when the user says "sync templates", "propagate skills", "update all repos", after any session that edited files under C:\dev\templates, or when setting up a new repo in the github folder. Never git-commits; leaves changes in each repo's working tree for review.
---

# template-sync

`C:\dev\templates` is the source of truth for generic agent config: `CLAUDE.md`, `AGENTS.md`, `.claude/agents/*`, `.claude/skills/*`. This skill pushes template changes out to every repo under `c:\Dev\github` without clobbering per-repo customizations.

## Sync rules

The core tension: repos are allowed to customize their copies (project-specific examples, extra rules). Template updates must flow; customizations must survive.

| Situation | Action |
|---|---|
| File exists in template, missing in repo | Copy it |
| Identical in both | Nothing |
| Differs, and the repo copy contains project-specific adaptations (repo name, project paths, domain terms, extra project rules) | Keep the repo copy; report it as customized. If the template gained something the customization lacks, merge the new generic content into the repo copy, preserving the customization |
| Differs, and the repo copy is just a stale generic version | Overwrite with the template |
| Skill/agent exists in repo but not in template | Leave it alone — it's project-specific |

`CLAUDE.md` / `AGENTS.md` are special: never wholesale-overwrite an existing one. Diff section-by-section; update generic sections that drifted, keep project-specific sections and facts untouched. If missing entirely, copy the template. If the repo's file is entirely hand-written with no shared ancestry with the template (its own workflow rules), leave it untouched and sync only skills/agents — decided by the user 2026-07-07 for To-Do-App.

## Steps

1. **Enumerate targets.** Directories directly under `c:\Dev\github` containing `.git`. Skip anything that isn't a git repo (working-tree writes stay reversible).

2. **Snapshot state.** For each repo, note `git status --porcelain` first. Proceed even if dirty, but keep template-sync writes distinguishable in your report from pre-existing modifications.

3. **Sync `.claude/agents/` and `.claude/skills/`** per the rules above. Copy whole skill folders (some have `reference.md` or other support files, not just `SKILL.md`). Use file comparison (hash or diff), not timestamps.

4. **Sync `CLAUDE.md` and `AGENTS.md`** per the special rule. When merging generic-section updates into a customized file, show judgment — the goal is that a repo reading its own CLAUDE.md gets both the latest generic rules and its own project facts.

5. **Reverse-flow check.** If a repo copy of a *generic* skill is newer/better than the template (an improvement worth sharing, not a project-specific tweak), propose updating the template from it rather than downgrading the repo.

6. **Report per repo:** files added, files updated, customized files left alone (with one-line reason), conflicts needing the user's call. Do not commit or push anywhere — leave changes in working trees.

## Stop conditions

- **A repo copy has customizations AND the template changed the same passage** → don't auto-merge silently; show both versions and ask.
- **A target repo is mid-rebase/merge (`.git/MERGE_HEAD`, `rebase-merge/` present)** → skip it and report; don't write into a conflicted tree.
- **More than ~10 repos** → confirm with the user before fanning out (consider `orchestrate` workers, one per repo batch).
