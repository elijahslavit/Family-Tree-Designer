---
name: env-check
description: Verify required environment variables are documented, set in the current environment, and consistent across .env files and code references. Trigger when the user says "env check", "verify env vars", "is my env set up", or is onboarding to the repo.
---

# env-check

## Steps

1. **Read the docs.** Find the project's canonical environment-variable documentation (e.g. an ENVIRONMENT.md file, README section, or onboarding doc) for the canonical list.

2. **Find all env references in code.** Grep for `process.env.`, `import.meta.env.`, and `Deno.env.get(` to build the actual list of vars the code reads.

3. **Find env files.** Locate `.env`, `.env.example`, `.env.local`, `.env.development`, etc. (Don't read `.env` or `.env.local` aloud — they may contain secrets; just list keys.)

4. **Cross-check.**
   - **In code, not in docs** → undocumented dependency.
   - **In docs, not in code** → stale doc entry (or feature not built yet — confirm which).
   - **In `.env.example`, not in current `.env.local`** → user is missing a var.
   - **In `.env.local`, not in `.env.example`** → vars not propagated to the team.

5. **Per var, check sensibility.**
   - `NEXT_PUBLIC_` (or the framework's equivalent client-exposure prefix) only when the value is safe to expose client-side.
   - URLs are syntactically valid.
   - Secret-looking values (long random strings) flagged if they're in a client-exposed var.

6. **Report.** Keys table: present where? documented? safe prefix? Any specific keys missing → tell the user what to set and where to get the value.

## Stop conditions

- **Project uses a secrets manager (Doppler, 1Password, etc.) instead of local .env files** → audit the secrets manager schema, not the absent .env.
- **Do not print actual secret values** in the report even when found — keys only.
