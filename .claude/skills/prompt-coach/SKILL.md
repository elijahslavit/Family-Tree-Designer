---
name: prompt-coach
description: Coach the user toward effective Fable 5 / Claude prompting instead of silently reinterpreting a weak prompt. Trigger when the user says "improve this prompt", "how should I prompt this", OR automatically when their request exhibits a prompting anti-pattern that would materially change the result — vague goal with no success criteria, "can you suggest" when they appear to want implementation, missing intent/context on a large task, micro-managed steps for work the model can own end-to-end, or a request to expose internal reasoning. Also trigger when the user is writing prompts or system prompts for Claude-powered features. Do NOT trigger for casual phrasing on small tasks where any reading leads to the same work.
---

# prompt-coach

Purpose: when a prompt is under-specified or fights the model's strengths, don't guess and don't lecture — **ask the user whether they want the better-shaped prompt instead**, showing them exactly what it would be. Over time this teaches the patterns. Full distilled guidance lives in [reference.md](reference.md); load it when coaching on system prompts or API scaffolding.

## The core move

When an anti-pattern is detected and fixing it would change what you'd do:

1. Draft the rewritten prompt — concrete, with the missing piece filled in (success criteria, intent, action verb, scope).
2. Call AskUserQuestion with:
   - Option 1 *(Recommended)*: the rewritten prompt, shown in `preview` so the user sees the exact wording.
   - Option 2: "As written" — execute the literal request.
   - Optionally one alternative interpretation if the ambiguity is two-way.
3. Execute whichever they pick. Never re-ask about the same pattern twice in one session — if they picked "as written" once, respect that style.

**High bar:** interrupt only when the gap would materially change the outcome or waste significant work. In autonomous/non-interactive runs, don't block — proceed with the best interpretation and note the assumption in your report.

## Anti-pattern checklist (prompting this model interactively)

| You see | Offer instead |
|---|---|
| "Can you suggest / look at / review X?" but context implies they want the change made | "Change X to …" — explicit action language; suggestion-verbs get suggestions, not edits |
| "Fix it" / "make it better" / "clean this up" with no definition of done | A rewrite with acceptance criteria: "Fix X so that [verifiable check] passes" |
| A big task with no *why* | The intent frame: "I'm working on [larger goal] for [who]; they need [what the output enables]. With that in mind: [request]" — the model connects the task to relevant context instead of inferring intent |
| Step-by-step micro-instructions for a task the model can own | A goal-level prompt: state the outcome, constraints, and verification; let the model scope and execute. Over-prescriptive prompts degrade Fable 5 output |
| "Show your reasoning / explain your thinking as you go" | Ask for decisions-and-evidence summaries instead. Echo-your-reasoning instructions can trigger the reasoning_extraction refusal on Fable 5 |
| Long document pasted after the question | Document first, question last (up to ~30% quality gain on long inputs); for multiple docs, XML-tag them and ask for grounding quotes first |
| Only "don't do X" | The positive version: say what to do instead ("respond in flowing prose" beats "no markdown") |
| Constant "check in with me before each step" on work that could run autonomously | A checkpoint rule: "Pause only for destructive actions, real scope changes, or input only I can provide" — plus evidence-grounded progress reports |
| A trivially easy task framed with heavy ceremony | Note that Fable 5 is calibrated for the top of the difficulty range; simple asks can just be asked plainly |

## Coaching prompts written for Claude apps (system prompts, API, agents)

When the user is authoring a prompt/skill/system prompt for a Claude-powered feature, review it against [reference.md](reference.md) and propose concrete edits (via AskUserQuestion when the choice is theirs to make). Check especially: role definition, XML structure, 3–5 diverse tagged examples, docs-before-query ordering, no prefills (removed in Claude 4.6+ — use structured outputs), effort/adaptive-thinking instead of thinking budgets, no reasoning-echo instructions, a send-to-user tool for long async agents, and the standard steering blocks (act-when-ready, brevity, checkpoint, grounded-progress, boundaries) quoted in the reference.

## Stop conditions

- **User picked "as written"** → do it their way, no further coaching this session on that pattern.
- **Non-interactive context** → never block on a question; state the assumption and proceed.
- **The rewrite wouldn't change your actions** → skip the question entirely; coaching that changes nothing is noise.
