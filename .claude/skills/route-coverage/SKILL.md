---
name: route-coverage
description: Audit Next.js route files under src/app/ for coverage — which have tests, which have been touched recently, which look orphaned. Trigger when the user says "route coverage", "audit routes", or is planning a routing/cleanup pass.
---

# route-coverage

## Steps

1. **Enumerate routes.** Glob `src/app/**/page.tsx`, `route.ts`, `layout.tsx`. For each: route path (derived from folder structure), file path, last-modified date (`git log -1 --format=%ai`).

2. **Check for tests.** For each route file, look for a colocated test (`page.test.tsx`, `route.test.ts`) or a test file in a parallel `__tests__/` folder.

3. **Check for inbound references.**
   - Hardcoded link `href="/<route>"` anywhere in code.
   - `<Link>` to the route.
   - Programmatic navigation (`router.push("/<route>")`).
   - Route appears in the nav config / sidebar / sitemap.

4. **Classify.**
   - **Live + tested** — has refs and tests.
   - **Live, untested** — has refs, no tests.
   - **Stale** — no inbound refs, not touched in months. Likely orphan.
   - **Hidden but intentional** — no inbound refs but explicitly designed (e.g. landing pages reached only externally) — confirm with user.

5. **Report.** Table by classification. Untested live routes are usually the highest-leverage cleanup target.

## Stop conditions

- **Routes use catch-all `[...slug]` or dynamic segments** → enumerate the patterns and note which are dynamic-only; reference-counting is fuzzy for those.
