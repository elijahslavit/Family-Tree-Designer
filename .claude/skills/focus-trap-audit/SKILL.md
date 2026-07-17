---
name: focus-trap-audit
description: Find modals, dialogs, drawers, and panels that capture user attention but lack proper focus trapping or restoration. Trigger when the user says "focus trap audit", "modal a11y check", or is reviewing dialog/popover code.
---

# focus-trap-audit

## Steps

1. **Enumerate overlay surfaces.** Grep `src/**/*.tsx` for: `role="dialog"`, `Dialog`, `Modal`, `Drawer`, `Popover`, `Sheet`, headless-UI primitives, and anything that uses a portal or `position: fixed` z-index stack.

2. **Per surface, check focus handling.**
   - **Initial focus** — when the surface opens, does focus move into it (or to a sensible element)?
   - **Trap** — pressing Tab cycles within the surface; Shift+Tab does the same in reverse.
   - **Restoration** — when the surface closes, focus returns to the element that opened it.
   - **Escape key** — closes the surface (or there's a documented reason it shouldn't).
   - **Backdrop click** — closes the surface (if interactive backdrop).

3. **Library-aware shortcut.** If the project uses headless-UI (Radix, Headless UI, React Aria), these guarantees often come from the primitive. Confirm the surface uses the primitive correctly rather than rolling its own.

4. **Report.** Table: surface → file:line → focus init → trap → restoration → escape. Mark each cell pass/fail/unknown. Flag the worst cases (no trap on modal forms) first.

## Stop conditions

- **All surfaces use a primitive that provides focus management** → spot-check 2–3 to confirm and report.
