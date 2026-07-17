---
name: orchestrate
description: Fan out independent subtasks to Sonnet worker agents and synthesize the results — the orchestrator plans, workers execute at the lower rate. Trigger when the user says "orchestrate", "fan out", "parallelize", "use workers", OR automatically when it is obvious — the task splits into 3+ independent, well-scoped subtasks (multi-subsystem audits, batch content generation, repo-wide sweeps with per-area reports). Do NOT trigger for sequential work, tasks needing shared context, or anything with fewer than 3 independent parts.
---

# orchestrate

The orchestrator pattern: this session (the capable model) plans and splits the work; `worker` agents (Sonnet, defined in `.claude/agents/worker.md`) execute the parts in parallel. Most tokens are billed at the worker rate. This is the Claude Code analog of the managed-agents coordinator/threads API — SendMessage to a worker's ID is the persistent-thread follow-up.

## When it is "obvious"

Auto-trigger only when ALL of these hold:

- The task decomposes into **3 or more subtasks** that don't depend on each other's output.
- Each subtask can be **fully specified in a cold-start brief** — a worker has no conversation context.
- Subtasks **don't edit the same files**. If edits might overlap, either serialize those parts or give workers `isolation: "worktree"`.

Good fits: audit every route for missing loading states; generate a batch of similar content files; sweep several subsystems for a pattern and report per-subsystem. Bad fits: a refactor where step 2 depends on step 1's shape; a bug hunt (shared evolving hypothesis); 2 small tasks (overhead exceeds savings).

## Steps

1. **Plan first (CLAUDE.md plan packet).** Split into subtasks; for each write a brief: exact scope, files/areas, acceptance criteria, and the verification command the worker must run. Under 200 words per brief.

2. **Fan out.** One Agent call per subtask in a single message: `subagent_type: "worker"`, `run_in_background: true` (the harness notifies on completion — don't poll). Add `isolation: "worktree"` for any worker that edits files when another worker might touch the same area.

3. **Synthesize.** When workers report back, read their final messages critically — verify claims against the actual files/diffs (maker/verifier separation). Merge results into one coherent report or change set.

4. **Follow up in-thread.** If a worker's result is incomplete, SendMessage to that worker's ID with the correction — it retains its context; don't respawn cold.

5. **Report.** Tell the user: how the work was split, what each worker did, what you verified, and any worker output you rejected or redid.

## Stop conditions

- **A subtask brief can't be written without "see conversation above"** → that subtask isn't delegable; do it yourself.
- **Two workers need to edit the same file** → serialize or worktree-isolate; never let them race in the same checkout.
- **More than ~6 workers contemplated** → confirm with the user first; that's a cost decision.
