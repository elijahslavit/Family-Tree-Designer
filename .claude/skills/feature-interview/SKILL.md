---
name: feature-interview
description: Run a short structured interview before starting large or under-specified feature work — scope, references, priorities, exclusions — then confirm the summary and plan. Trigger when the user says "ask me questions first/before beginning", "ask questions to narrow this down", OR automatically when a request is big enough to span multiple files/sessions but leaves major decisions open (no visual reference, no priority order, unclear boundaries). Do NOT trigger for small tasks or requests that are already fully specified.
---

# feature-interview

Purpose: the user's standing pattern for big features is "ask me questions before beginning to make sure we are on the same page." This skill makes that a procedure instead of an improvisation, and permits input: suggest options the user hasn't considered, don't just collect answers.

## Procedure

### 1. Read first, ask second

Before asking anything, spend a few minutes in the code/docs so questions are informed: what exists already, what the request would touch, what `STATE.md` and `DOCS/tasks/` already say. Never ask something the repo answers.

### 2. Interview via AskUserQuestion

Ask 3–5 questions max, batched (up to 4 per call), each with concrete options — not open-ended essays. Cover whichever of these the request leaves open:

- **Scope boundary** — which parts are in this pass, which are explicitly later ("future task").
- **Reference** — is there a mockup/prototype/example to match, or is the design mine to propose?
- **Priority order** — if the work is a list, which item matters most / which batch is first.
- **Audience/constraint** — e.g. beginner learners vs scholars; mobile vs desktop-first.
- **Definition of done** — what the user will look at to accept it.

Include your own recommendation as the first option when you have one, and add options the user may not have considered — they've explicitly asked for input, not just transcription.

### 3. Confirm the contract

Play back one short summary: in-scope, out-of-scope, order, and how each piece will be verified. Get a yes (or corrections) before writing code.

### 4. Then plan and execute

Produce the compact plan packet (per the Agent Operating Protocol) from the confirmed answers and start. Record deferred items as future tasks (`new-task` skill) rather than letting them creep into this pass.

## Stop conditions

- User says "just start" / picks "your call" → stop asking, state your assumptions in the plan, and go.
- Non-interactive run → don't block; make the best-informed assumptions, list them at the top of the plan, and proceed.
