---
name: component-extract
description: Pull a duplicated JSX pattern into a shared component. Trigger when the user says "extract component for X", "this is duplicated, share it", or has identified a repeated block.
---

# component-extract

## Steps

1. **Identify the duplication.** Ask the user for: the duplicated JSX pattern, and the files where it currently lives. Read each occurrence.

2. **Confirm the duplication is real.** Visual similarity isn't enough — the blocks should also share semantic meaning. Two components that *look* like a button but do unrelated things shouldn't share an extraction.

3. **Find the right home.** Ask the user where the new component should live. Common options:
   - Feature folder if used only within one feature.
   - `src/components/ui/` (or wherever shared primitives live) if used across features.

4. **Design the props.** Identify what varies between occurrences — those become props. Resist adding props for "future flexibility" — don't add features beyond what the task requires.

5. **Create the component** with a focused interface. Match neighboring components' style: import order, prop typing, default exports vs. named.

6. **Replace each occurrence** with the new component. Run the type-checker to catch missed cases.

7. **Verify in the running app.** Each call site should render identically to before. Capture a screenshot of one if visual.

8. **Update docs** if the new component belongs in a documented component inventory (e.g. a design-system doc, if the project keeps one).

## Stop conditions

- **The "duplicated" blocks actually differ in subtle ways** (different event handlers, different state) → the extraction will need an awkward prop or branching logic; reconsider whether extraction is worth it.
- **Only two occurrences exist** → three similar lines can be better than a premature abstraction. Confirm with the user that extraction is justified.
