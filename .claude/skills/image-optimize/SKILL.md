---
name: image-optimize
description: Find unoptimized images in public/ and src/ — wrong format, oversized, missing srcset, not using next/image. Trigger when the user says "image optimize" or "find unoptimized images".
---

# image-optimize

## Steps

1. **Enumerate image files** under `public/` and any `src/**/assets/`. Capture: path, format, file size, pixel dimensions (use a quick read or filesystem stat).

2. **Flag suboptimal files.**
   - **PNG used where JPG/WebP/AVIF would be smaller** — photos and complex images.
   - **JPG used where SVG would work** — flat icons, logos.
   - **Oversized originals** — file dimensions wildly larger than any rendered usage in the code.
   - **Unstripped metadata** — large files for their dimensions (EXIF/thumbnail bloat).

3. **Find render usage.** Grep for each image's filename in `src/**/*.{tsx,ts,css}` to see how it's loaded.

4. **Per usage, check.**
   - Is it loaded via `next/image` (gets automatic optimization)? Or a raw `<img>` / `background-image` (no optimization)?
   - Does the rendered display size match the source dimensions? If the source is 4000px wide and it renders at 300px, the user is downloading 13× too much data.
   - Is `priority` / lazy loading correctly applied? (`priority` should be for above-the-fold only.)

5. **Report.** Table: file → format → size → dimensions → usage path → recommendation (convert, resize, switch to next/image, mark priority/lazy).

## Stop conditions

- **Project hosts images on a CDN with transform params** → optimization happens at request time; focus on the request URL params rather than the source file.
