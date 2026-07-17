# Prompting reference — Fable 5 and general Claude best practices

Distilled from Anthropic's "Prompting Claude Fable 5" and "Prompting best practices" docs (2026). Use for coaching users and reviewing prompts written for Claude-powered apps.

## Part 1 — Claude Fable 5 specifics

Fable 5 (and Mythos 5) is built for problems previously too complex, long-running, or ambiguous: end-to-end work that takes a person hours to weeks. Teams get the best outcomes assigning it their hardest unsolved problems; testing only simple workloads undersells it. It also handles routine tasks reliably.

### Effort is the primary control

Effort trades intelligence vs latency vs cost. Default `high`; `xhigh` for capability-sensitive work; `medium`/`low` for routine tasks (still strong — often above prior models' `xhigh`). Reduce effort if tasks complete but take too long, or for a snappier interactive feel. Extended-thinking `budget_tokens` is gone on Fable 5 (400 error) — thinking is always adaptive; control depth via `effort` and cap spend with `max_tokens`.

### Expect longer turns

Hard tasks can run many minutes per request; autonomous runs for hours. Adjust client timeouts, streaming, and progress UX before migrating; prefer async check-ins (scheduled jobs) over blocking. Anti-overplanning steer:

> When you have enough information to act, act. Do not re-derive facts already established in the conversation, re-litigate a decision the user has already made, or narrate options you will not pursue in user-facing messages. If you are weighing a choice, give a recommendation, not an exhaustive survey. This does not apply to thinking blocks.

### Brief instructions beat enumerated rules

Instruction-following is strong enough that one short steer replaces a list of named behaviors.

Brevity / lead with outcome:

> Lead with the outcome. Your first sentence after finishing should answer "what happened" or "what did you find". Supporting detail and reasoning come after. Being readable and being concise are different things, and readability matters more. Keep output short by being selective about what you include, not by compressing into fragments, abbreviations, arrow chains, or jargon.

Checkpoints:

> Pause for the user only when the work genuinely requires them: a destructive or irreversible action, a real scope change, or input that only they can provide. If you hit one of these, ask and end the turn, rather than ending on a promise.

Scope discipline at higher effort (prevents unrequested tidying):

> Don't add features, refactor, or introduce abstractions beyond what the task requires. Don't design for hypothetical future requirements: do the simplest thing that works well. Don't add error handling, fallbacks, or validation for scenarios that cannot happen; only validate at system boundaries (user input, external APIs). Don't use feature flags or backwards-compatibility shims when you can just change the code.

### Ground progress claims (long runs)

Nearly eliminates fabricated status reports:

> Before reporting progress, audit each claim against a tool result from this session. Only report work you can point to evidence for; if something is not yet verified, say so explicitly. If tests fail, say so with the output; if a step was skipped, say that; when something is done and verified, state it plainly without hedging.

### State the boundaries

Fable 5 can occasionally take unrequested actions (drafting an email, defensive git backups). Constrain explicitly:

> When the user is describing a problem, asking a question, or thinking out loud rather than requesting a change, the deliverable is your assessment. Report your findings and stop. Don't apply a fix until they ask. Before running a command that changes system state, check that the evidence actually supports that specific action.

### Parallel subagents

Fable 5 dispatches parallel subagents dependably. Encourage delegation, prefer async communication over blocking on each return, and reuse long-lived subagents (context retention saves cache cost and avoids bottlenecking on the slowest agent):

> Delegate independent subtasks to subagents and keep working while they run. Intervene if a subagent goes off track or is missing relevant context.

### Memory system

Fable 5 excels when it can record lessons across runs. Even a Markdown directory works:

> Store one lesson per file with a one-line summary at the top. Record corrections and confirmed approaches alike, including why they mattered. Don't save what the repo or chat history already records; update an existing note rather than duplicating; delete notes that turn out wrong.

Bootstrap: "Reflect on our previous sessions. Use subagents to identify core themes and lessons, store them in [X], and reference [X] going forward."

### Rare failure modes and their fixes

- **Early stopping** deep in long sessions: ends turn with "I'll now run X" without the tool call, or asks permission it doesn't need. Reply "continue" / "go ahead end to end". For pipelines, add an autonomy reminder: *"You are operating autonomously; the user cannot answer mid-task. For reversible actions that follow from the request, proceed. Before ending your turn, check your last paragraph — if it is a plan, question, or promise about undone work, do that work now with tool calls."*
- **Context-budget anxiety**: suggests new sessions or trims work when shown a remaining-token countdown. Hide explicit counts where possible, or reassure: *"You have ample context remaining. Do not stop, summarize, or suggest a new session on account of context limits."*
- **Reasoning-echo refusals**: instructions to echo/transcribe/explain internal reasoning as response text can trigger the `reasoning_extraction` refusal (`stop_reason: "refusal"`), elevating fallbacks. Audit skills and system prompts for "show your thinking" language; read structured `thinking` blocks from adaptive thinking instead.
- **Safety classifiers**: offensive-cyber and bio/life-sciences content can refuse (benign work may occasionally trip these). Configure server- or client-side fallback to Claude Opus 4.8.

### Give the reason, not only the request

> I'm working on [the larger task] for [who it's for]. They need [what the output enables]. With that in mind: [request].

### Long-run communication and send-to-user

For async agents, final messages should re-ground a reader who saw none of the work: outcome first, plain language, no working shorthand or invented labels. For content the user must see verbatim mid-run (deliverables, direct answers), define a client-side `send_to_user` tool (input = message; render it directly; return an ack) **and** pair it with elicitation language in the system prompt — the tool alone is rarely called. Don't route narration through it.

### Scaffolding checklist for migration

- Start at the top of your difficulty range; let the model scope and ask clarifying questions.
- Make self-verification explicit on long runs; fresh-context verifier subagents outperform self-critique.
- Re-evaluate old prompts/skills: instructions written for weaker models are often too prescriptive now and degrade output.
- Never instruct reasoning reproduction in responses (see refusals above).

## Part 2 — General Claude prompting (all current models)

### Clarity

Be explicit about desired output and constraints. Golden rule: if a colleague with minimal context would be confused by the prompt, Claude will be too. Want "above and beyond"? Ask for it ("Include as many relevant features as possible. Go beyond the basics.").

### Motivation

Explain *why* a rule exists — Claude generalizes from the reason ("read aloud by TTS, so never use ellipses" beats "NEVER use ellipses").

### Examples

3–5 relevant, diverse examples in `<example>`/`<examples>` tags are the most reliable format/tone steer.

### XML structure

Separate instructions, context, and input with consistent tags (`<instructions>`, `<context>`, `<input>`); nest documents as `<documents><document index="n"><source>…</source><document_content>…</document_content></document></documents>`.

### Role

One system-prompt sentence ("You are a helpful coding assistant specializing in Python") focuses behavior.

### Long context (20k+ tokens)

Longform data at the top, query at the end (up to ~30% better). Ask for grounding quotes in `<quotes>` tags before the answer on long-document tasks.

### Output formatting

Say what to do, not what to avoid; use XML format-indicator tags; match prompt style to desired output style; for prose-heavy output use an explicit anti-markdown block. For plain-text math, explicitly forbid LaTeX notation and name the substitutes.

### Action defaults

Suggestion verbs get suggestions. "Change this function…" gets edits. Steer globally with `<default_to_action>` (implement rather than suggest; infer intent and proceed) or `<do_not_act_before_instructions>` (research and recommend unless explicitly told to change files).

### Tool triggering and parallelism

Recent models respond strongly to system prompts — dial back "CRITICAL: you MUST use…" language or tools will overtrigger; plain "Use this tool when…" suffices. Parallel tool calling is near-default; boost to ~100% with a `<use_parallel_tool_calls>` block, or slow it with "execute sequentially with brief pauses."

### Thinking

Adaptive thinking (`thinking: {type: "adaptive"}`) plus `effort` replaces extended-thinking budgets on current models. Steer triggering ("thinking adds latency; when in doubt respond directly") or depth ("choose an approach and commit; don't revisit decisions absent new information").

### Prefills are gone (Claude 4.6+)

Last-turn assistant prefills return 400. Migrations: structured outputs or enum tools for format/classification; "respond directly without preamble" for preamble-skipping; move continuations into the user message ("your previous response ended with `[text]`; continue"); hydrate context via user-turn reminders or tools, not prefilled assistant turns.

### Model self-knowledge

Models don't reliably know their own identity or successors. If the app needs it: "The current model is [X]; when an LLM is needed, default to model string [Y]." Current IDs: `claude-fable-5`, `claude-opus-4-8`, `claude-sonnet-5`, `claude-haiku-4-5-20251001`.
