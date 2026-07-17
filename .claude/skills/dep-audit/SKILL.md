---
name: dep-audit
description: Check npm dependencies for outdated versions, known vulnerabilities, unused packages, and duplicated dependencies. Trigger when the user says "dep audit", "check dependencies", "any vulnerabilities", or before a release.
---

# dep-audit

## Steps

1. **Capture the current state.**
   - `npm outdated` — current vs. latest by package.
   - `npm audit` — known vulnerabilities (use `--production` to ignore dev-only noise if the user prefers).
   - `npx depcheck` (if available) — unused dependencies and missing dependencies.

2. **Categorize outdated packages.**
   - **Patch-only** behind — safe to bump.
   - **Minor** behind — usually safe; skim changelog.
   - **Major** behind — needs a migration look; flag and don't recommend bumping in this skill.

3. **Categorize vulnerabilities.**
   - **High/critical in a production dep** — flag urgently.
   - **In a dev-only dep** — note but lower priority.
   - **Fixed by a major-version bump** that's risky → flag the tradeoff.

4. **Flag duplicated transitive deps** (same package at multiple versions in the lockfile) — wastes bundle size.

5. **Cross-reference with the project's documentation.** If the docs pin specific framework versions (e.g. a major framework version), confirm the lockfile matches.

6. **Report.** Sections: outdated (by category), vulnerabilities (by severity), unused, duplicated. Recommend the smallest-scope updates first. Don't auto-update — dependency bumps need testing.

## Stop conditions

- **`npm audit` reports 100+ findings** → most are noise from transitive devDependencies; surface only the production-impacting ones.
- **A vulnerability has no upstream fix** → recommend mitigation (pinning a transitive resolution, removing the dep) rather than waiting.
