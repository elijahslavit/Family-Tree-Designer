---
name: confirm-intent
description: Before acting on the user's prompt, restate the interpretation in ONE paragraph max and get a yes/no confirmation. Fires by default on nearly every substantive prompt — skip only for trivial single-action asks, direct answers to a question just posed, or continuations like "continue"/"yes"/"go ahead". Trigger explicitly when the user says "confirm first" or "/confirm-intent".
---

# confirm-intent

Purpose: the user wants a cheap misunderstanding gate — hear the interpretation back before any work starts. Wrong interpretations are cheapest to catch at word zero.

## The move

1. Read the prompt (and glance at anything it references) — but do **no work** yet: no edits, no plans, no long exploration.
2. State your interpretation in **one paragraph maximum**. It must cover, in plain prose: what you think they want done, the scope (what's included / what you'd leave alone), and the deliverable (code change, report, file, answer). If the prompt is ambiguous, pick the most likely reading and name it — don't list every alternative.
3. Ask for confirmation via AskUserQuestion — "Yes, proceed" / "No" (the built-in Other option lets them correct you in place).
4. **Yes** → start immediately, no further preamble. **No / correction** → restate once incorporating the correction and reconfirm. Don't loop more than twice; if still misaligned, ask what you're missing.

## When to skip

- Trivial, single-action, unambiguous prompts ("run the tests", "commit this", "what's in STATE.md").
- The prompt is a direct answer to a question you just asked, or a continuation ("continue", "yes", "do it", "next batch").
- You're mid-task under an interpretation already confirmed this session — don't re-confirm each follow-up in the same thread of work.
- Non-interactive/autonomous runs: never block; state the interpretation as an assumption at the top of your report and proceed.

## Rules

- One paragraph means one paragraph — no headers, no bullet lists, no plan. The plan comes after the yes.
- Don't pad it with restated context the user just gave; only say what could plausibly be misread.
- This gate is about *what* they want. If the confirmed task is still big and under-specified, the `feature-interview` skill handles the deeper *how* questions next.
- If `prompt-coach` would also fire (the prompt has a shape problem worth fixing), fold that into this same confirmation — one question, not two.
