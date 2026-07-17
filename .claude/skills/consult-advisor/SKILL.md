---
name: consult-advisor
description: Escalate a hard decision to the Fable 5 advisor agent — guidance only, no implementation. Trigger when the user says "ask the advisor", "get a second opinion", "escalate this", OR automatically when it is obvious — two or more failed fix attempts at the same bug, an architectural choice with real tradeoffs, or a security/auth/data-loss-sensitive design decision. Do NOT trigger for routine implementation, questions the code already answers, or anything a quick read would resolve.
---

# consult-advisor

The advisor pattern: the executor (this session) does all implementation; the `advisor` agent (Fable 5, defined in `.claude/agents/advisor.md`) is called on-demand for judgment on the hard subset. Most tokens stay at the executor rate.

## When it is "obvious"

Auto-trigger only when one of these holds:

- **Stuck loop:** you have attempted the same fix twice and it still fails, or the debugging hypothesis keeps changing.
- **Architecture fork:** two or more viable designs with tradeoffs that will be expensive to reverse (state ownership, data model, subsystem boundaries).
- **High-risk change:** auth, persistence/migrations, security, or anything CLAUDE.md §9 flags for escalation — get the advisor's read *before* asking the user for approval, so the ask is well-formed.

Otherwise, do the work yourself. A consult that a quick file read would have answered is wasted cost.

## Steps

1. **Write a self-contained brief.** The advisor starts cold. Include: the goal, what has been tried and how it failed (exact errors), the decision to be made, constraints (CLAUDE.md rules, STATE.md known failures), and paths to the 2–5 most relevant files. Do not paste whole files — the advisor can read.

2. **Consult synchronously.**
   - Agent tool, `subagent_type: "advisor"`, `run_in_background: false`.
   - Ask for what you actually need: a diagnosis, a recommendation, or a review of a proposed plan.

3. **Follow up in-thread if needed.** Use SendMessage with the advisor's agent ID for clarifications — it retains the prior context; do not spawn a fresh advisor for a follow-up on the same problem.

4. **Apply the advice yourself.** The advisor never edits files. Weigh its recommendation; if you disagree, say so to the user with both positions rather than silently picking one.

5. **Tell the user.** Note in your response that the advisor was consulted and what it recommended — one or two sentences.

## Stop conditions

- **Advisor recommends something the user must approve** (destructive, scope change) → surface it, don't execute.
- **Advisor and executor disagree after one follow-up** → present both views to the user; don't loop.
