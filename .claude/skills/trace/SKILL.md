---
name: trace
description: Map how any subsystem works end-to-end — its data and state flow from entry point through to render/output, and the files that own each step. Give it a target (a feature, route, module, or subsystem). Trigger when the user says "trace X", "how does X work", "map the X flow", "audit how X is wired", or names a subsystem to understand.
---

# trace

Purpose: one repeatable way to answer "how does *this subsystem* actually work?" The deliverable is a compact map — entry point → state → data → output, with `file:line` owners — not a pile of pasted source. Parameterized by the target subsystem.

## The move

1. **Pin the target.** Restate which subsystem, and what "understanding" means here: whole wiring, data flow, state ownership, or the path one specific bug travels. Map a loose name to a concrete surface before digging.
2. **Find the entry point by discovery, not memory.** Grep for the feature's route / component / handler / store — do **not** rely on a hardcoded file list (those rot). Start from the user-visible surface or the state/store that owns it.
3. **Follow the flow one hop at a time:** entry (UI/route/CLI) → state (local · shared · URL · persisted) → data source (loader · API · DB · on-disk) → transform → render/output. Record who owns each hop as `file:line`.
4. **Delegate the reading.** If mapping this means opening several files just to extract the flow, hand it to the **scout** agent (read-only) and work from its summary — keep raw file text out of the main thread.
5. **Report a map, not a dump:** a short ordered list or table of hops, each with its owning `file:line`, plus any surprises (dead branches, duplicated state, missing error handling). Name what you did **not** trace.

## Rules

- Discovery over recall: always grep to confirm current entry points; never assert a file path you didn't just see.
- Read-only — tracing never edits. If it reveals a bug, report it; fix only when asked.
- Compact output: a map someone can act on, not the source read back.
- For a bug-specific trace, follow only the path the bug travels — don't map the whole subsystem.
