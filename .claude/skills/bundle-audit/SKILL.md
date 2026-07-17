---
name: bundle-audit
description: Inspect Next.js bundle sizes per route and flag regressions or unexpectedly large chunks. Trigger when the user says "bundle audit", "bundle size check", "the app feels heavy", or before merging a dependency-bumping branch.
---

# bundle-audit

## Steps

1. **Run the production build.** `npm run build` (or whatever the project's build script is). Capture the per-route bundle size output Next.js prints.

2. **Compare against a baseline.** If a `bundle-baseline.json` (or similar) is tracked in the repo, diff against it. Otherwise, ask the user for the last-known-good numbers or capture this run as the baseline.

3. **Flag large entries.**
   - First Load JS > 200 KB for any route (rule of thumb — adjust to project norms).
   - A single route significantly larger than peers.
   - Per-route growth >10% vs. baseline.

4. **Identify the culprit.** For each flagged route, look at:
   - Heavy imports in the route file and its layout.
   - Client components doing work that could be server.
   - Whole-library imports that should be tree-shaken (`import _ from 'lodash'` style).
   - Large data bundled into the route instead of fetched.

5. **Report.** Table: route → first-load JS → delta vs baseline → top suspected culprit. Recommend code-split, dynamic import, or moving work server-side per case.

## Stop conditions

- **Build fails** → that's the finding; bundle analysis can't happen until it builds.
- **No baseline exists and the user is OK with current sizes** → capture this run as the new baseline (write `bundle-baseline.json` only with explicit user OK).
