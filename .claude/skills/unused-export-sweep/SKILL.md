---
name: unused-export-sweep
description: Find exports across the project's source tree that nothing imports — likely dead code, candidate for deletion. Trigger when the user says "find unused exports", "dead code sweep", or is doing a codebase cleanup pass.
---

# unused-export-sweep

## Steps

1. **Build the export inventory.** For each file under `src/**/*.{ts,tsx,js,jsx}` (or the project's equivalent source root), capture named exports and default exports with their file path.

2. **Build the import inventory.** For each file, capture imports — including barrel re-exports (`export * from`), dynamic imports, and lazy imports.

3. **Cross-reference.** An export is "unused" if no other file imports it directly *and* no barrel re-exports it onward to a consumer.

4. **Filter false positives.**
   - Framework page/route files — exports like `default`, `metadata`, `generateMetadata`, `revalidate` are framework-consumed.
   - Test files — test functions, fixtures.
   - Public API surface — anything exported from a designated `index.ts` that's the package boundary.
   - Type-only exports used by external code.

5. **Report.** Table: file, export name, suspected reason it lingers (refactor leftover, never-finished feature, copy-paste). Sort by least-recently-touched (`git log -1 --format=%ar -- <file>`).

6. **Do not delete.** Recommend only. Deletion needs human judgment.

## Stop conditions

- **A tool already exists in the project for this** (ts-prune, knip, biome's unused-export rule, etc.) → run it instead of duplicating; report its findings.
