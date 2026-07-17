---
name: test-write
description: Scaffold a test for a chosen component, hook, or utility, matching the testing patterns already used in the repo. Trigger when the user says "write a test for X", "scaffold a test", or names a file to test.
---

# test-write

## Steps

1. **Confirm the target.** Get the file path and the specific behaviors to cover.

2. **Find the testing setup.** Look at `package.json` and grep for test config (`jest.config`, `vitest.config`, `playwright.config`). Identify the test runner, the assertion library, and any test utility setup (testing-library/react, msw, etc.).

3. **Find a sibling test** to template from. If the target is a component, find the most recent component test in the same folder or feature. Match its structure exactly: imports, describe/it nesting, mock setup, query style.

4. **Pick the test type.**
   - **Component** — render + interact + assert visible behavior.
   - **Hook** — render with `renderHook`, exercise state changes, assert returned values.
   - **Utility / pure function** — input → expected output table.
   - **Integration** — multiple components together with realistic data.

5. **Write the test file.**
   - Use real data shapes from the project's domain — not made-up values.
   - Test the user-visible behavior, not implementation details (no asserting on internal state names).
   - Include at least one happy path and one edge case.

6. **Run the test** (`npm test -- <file>` or equivalent). It should pass; if it fails, the test is wrong or the code is wrong — diagnose before claiming completion.

7. **Report.** File created, behaviors covered, test runner output (pass/fail).

## Stop conditions

- **No testing setup exists** → recommend setting it up as a separate task; don't half-set-up a runner just to run one test.
- **The target has heavy side effects** (network, file I/O) that need mocking patterns the project hasn't established → ask the user how to handle.
