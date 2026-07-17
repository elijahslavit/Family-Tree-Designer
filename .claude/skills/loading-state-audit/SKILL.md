---
name: loading-state-audit
description: Find data-fetching call sites in components that are missing loading, error, or empty states. Trigger when the user says "loading state audit", "find missing loading states", or is reviewing async UI.
---

# loading-state-audit

## Steps

1. **Find fetch sites.** Grep for: `useQuery`, `useSWR`, `useEffect(.*fetch`, `await fetch(`, database client calls, the project's data hooks.

2. **Per site, check the rendered branch.**
   - **Loading** — is there a skeleton, spinner, or placeholder while data is in flight?
   - **Error** — is there a visible error state? Does it give the user a recovery action (retry, reload, contact)?
   - **Empty** — when the call returns successfully but with no data, is there a meaningful empty state (or only a blank component)?
   - **Stale / refetching** — does the UI distinguish "first load" from "refresh while showing old data"?

3. **Flag patterns:**
   - Components that render `data.map(...)` directly with no guard.
   - `if (!data) return null` (silent emptiness — usually a bug masking).
   - Errors swallowed in `.catch()` with no UI surface.

4. **Report.** Table: component → fetch source → loading → error → empty → stale. One-line fix suggestion per missing state.

## Stop conditions

- **Fetches use a shared query wrapper that handles these states centrally** → audit the wrapper instead of every call site.
