---
name: usage-recap
description: End-of-task retrospective — show the per-model usage split (percent of each model), how the main model orchestrated the work, who it delegated to and why, plus tool/file/verification stats and cost-routing efficiency. Trigger when the user says "usage recap", "model breakdown", "who did what", "cost recap", "how was this orchestrated", or asks how the models split the work. Natural to offer after a multi-agent (orchestrate/advisor/subagent) task.
---

# usage-recap

Purpose: after a task — especially a multi-agent one — the user wants an honest account of **which model did how much, how the work was routed, and whether cheap-model-first cost routing actually held**.

## The move

Produce ONE compact report with the four blocks below. Get hard numbers first, then narrate from the actual session record — never invent a delegation that didn't happen.

### 1. Model usage split (lead with this)

Try for measured numbers, in order:

1. **`ccusage`** (reads local `~/.claude/**/*.jsonl`, so it sees subagent turns too). Run `npx ccusage@latest daily --breakdown --json` and parse the per-model tokens/cost. Scope to the block covering this task. If flags differ, fall back to `npx ccusage@latest session`.
2. **`/cost`** — if `ccusage` is unavailable, tell the user this is the authoritative built-in source (you can't invoke it as a tool; they run it), and meanwhile give an **estimated** split, clearly labeled, reconstructed from the delegation record in block 3.

Present a small table, most-used model first: `Model | Role this task | Tokens | % tokens | ~Cost share`. Report token % and cost % separately when you have both (they diverge — prices differ). Mark each number **measured** or **estimated**.

### 2. How the main model orchestrated it

3–6 sentences: the plan, the phases, the load-bearing decisions and forks, any re-planning after failures. The story of the run, not a restatement of the diff.

### 3. Delegation map

A row per delegate actually spawned: `Delegate | Model | Given | Returned`. Include agent type and whether it ran in a worktree. If nothing was delegated, say "single-model run, no delegation" and skip the table.

### 4. A couple other relevant stats

Pick the 3–5 that matter: tool calls + files touched; verification performed and its result; **cost-routing efficiency** (did the bulk sit on the cheaper model?); retries/dead ends; turn count if notable.

## Rules

- **Honesty over precision.** Every number labeled measured or estimated. Never present a guessed split as metered. If you have no basis, say so rather than fabricate.
- **Reconstruct only what happened** — the delegation map comes from real spawns this session.
- **Compact.** Four tight blocks; lead with the split.
- Nothing destructive to gather stats — `ccusage` / `/cost` are read-only.
