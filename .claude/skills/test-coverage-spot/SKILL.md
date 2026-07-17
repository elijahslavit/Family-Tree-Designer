---
name: test-coverage-spot
description: Check test coverage for a specific file or feature folder — which branches are tested, which aren't, and where the highest-leverage missing tests would go. Trigger when the user names a file and asks "what's the coverage", "what tests are missing", or before approving a PR.
---

# test-coverage-spot

## Steps

1. **Confirm the scope.** A single file, a folder, or a feature.

2. **Run coverage** scoped to that path. Use the project's coverage command (often `npm test -- --coverage` with a path filter). Capture line, branch, and function coverage numbers.

3. **For uncovered lines / branches, classify.**
   - **Critical path** — main happy flow not covered → high priority test.
   - **Error branches** — catch blocks, validation failures → medium priority.
   - **Edge cases** — empty inputs, max sizes, race conditions → variable priority.
   - **Defensive** — unreachable in practice → low priority; may not be worth testing.

4. **Identify the highest-leverage missing tests.** Not "all the lines"; the ones whose absence makes a real regression likely.

5. **Report.** Coverage numbers + a ranked list of suggested tests (test name, what it would assert, why it matters). Don't write the tests in this skill — that's `/test-write`.

## Stop conditions

- **Coverage tooling isn't configured** → say so; recommend setting it up before coverage targets matter.
- **Coverage is high but quality is low** (lots of "render the component" tests with weak assertions) → flag this; coverage % is not the same as actually-tested behavior.
