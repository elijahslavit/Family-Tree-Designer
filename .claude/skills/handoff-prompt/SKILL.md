---
name: handoff-prompt
description: Generate a paste-ready prompt so the current work can continue in a fresh session with no warm context. Trigger when the user says "make a prompt for another chat", "handoff prompt", "prompt to continue this", or is wrapping up a phase of multi-session work.
---

# handoff-prompt

Purpose: multi-session work here is continued by pasting a prompt into a fresh chat. A good handoff prompt lets the new session skip rediscovery entirely. Generate it from **verified state** (git, files), not from memory of the conversation.

## Build the prompt from these sources

- `git log --oneline -10` and `git status --short` — what's committed vs still uncommitted, and on which branch.
- The files actually touched this session.
- `STATE.md` — open failures and next steps already recorded.
- What the user said the next phase is.

## Output template

Produce one fenced block the user can copy verbatim:

```
Continue <project/feature> — <phase name>.

Context:
- <what is done and merged/committed, with branch + key commit refs>
- <key files: exact paths the work lives in>
- <load-bearing facts the new session can't cheaply rediscover — data sources, gotchas, decisions already made and why>

Task:
- <the next concrete steps, in order>

Constraints:
- <standing rules that apply: e.g. "report visual diffs before fixing", scope limits>

Verify by:
- <how the new session proves each step worked — command, route to screenshot, test to run>

Start by reading STATE.md, then begin with step 1.
```

## Rules

- **Paste-ready** means no placeholders left for the user to fill in, no references to "this conversation", "the artifact above", or anything only the current session can see. Every referenced file/URL must be a real path the fresh session can open.
- Keep it under ~250 words — the new session can read files itself; the prompt's job is pointing, not duplicating content.
- Include decisions and their *why* ("restart from mockup markup, wire data after — user chose visual-first"), since these are the facts a fresh session would otherwise relitigate.
- If uncommitted work matters to the handoff, say so explicitly in the prompt or offer to commit it first.
- Update `STATE.md` (Last Session / next steps) in the same pass, so the prompt and the state file agree.
