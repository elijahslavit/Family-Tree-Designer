---
name: image-alt-sweep
description: Audit images, SVGs, and icons across the codebase for missing or unhelpful alt text. Trigger when the user says "alt text audit", "image a11y check", or before shipping content-heavy screens.
---

# image-alt-sweep

## Steps

1. **Enumerate image surfaces.**
   - `<img>` tags in JSX/HTML.
   - `<Image>` (next/image) usages.
   - `<svg>` with `role="img"` or used as content (not decoration).
   - Background images applied via CSS where the image carries meaning.

2. **Per image, classify intent.**
   - **Content image** — conveys information the surrounding text doesn't (a chart, a diagram, a person/scene illustration). Needs descriptive alt.
   - **Functional image** — is the visual of an interactive element (button icon). Needs alt that names the action.
   - **Decorative image** — purely aesthetic. Needs `alt=""` (empty, not omitted) or `aria-hidden="true"`.

3. **Flag each.**
   - Missing `alt` attribute entirely.
   - Generic alts: "image", "photo", "icon".
   - Redundant alts ("image of a chart" — the "image of" prefix is noise to screen readers).
   - Decorative images with descriptive alt (annoying for screen reader users).

4. **Text rendered as image.** Flag any place where meaningful text is baked into an image instead of rendered as real text — it can't be read by screen readers, translated, or resized. Prefer real text with the correct `lang` attribute.

5. **Report.** Table: file:line → element → current alt → classification → suggested alt or change.

## Stop conditions

- **Hundreds of icons across UI components** → check the icon primitive once and report from there; don't enumerate every call site.
