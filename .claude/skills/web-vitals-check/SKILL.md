---
name: web-vitals-check
description: Measure Core Web Vitals (LCP, INP, CLS) for key pages of a Next.js app, and report whether they fall in the "good" range. Trigger when the user says "web vitals", "core web vitals check", "measure LCP", or before a production deploy.
---

# web-vitals-check

## Steps

1. **Pick the URLs.** Default set (confirm with user, adjust to the app's actual key screens):
   - Primary content/detail view (whichever route does the heaviest rendering).
   - That same view on first-load (cold).
   - Main landing page.
   - First step of any onboarding/signup flow.
   - Marketing landing (if any).

2. **Start a production build.** Web Vitals on the dev build are misleading.

3. **For each URL, measure** (use Chrome DevTools Performance/Lighthouse, or `web-vitals` programmatically, or whichever the project already has wired):
   - **LCP** (Largest Contentful Paint) — target < 2.5s.
   - **INP** (Interaction to Next Paint) — target < 200ms.
   - **CLS** (Cumulative Layout Shift) — target < 0.1.
   - Also capture TTFB and FCP for context.

4. **Run each measurement at least twice** (one cold, one warm cache).

5. **For any metric in the "needs improvement" or "poor" range**, identify the likely cause:
   - LCP regression → above-the-fold image not optimized, font swap, render-blocking JS.
   - INP regression → long task on interaction (a heavy click/hover handler is a common culprit).
   - CLS regression → late-loading content shifting the layout, web fonts swapping.

6. **Report.** Table: URL → LCP → INP → CLS → suspected culprits.

## Stop conditions

- **Numbers can't be trusted on local hardware** (e.g. dev machine is much faster than user devices) → recommend using throttling presets and report with that caveat noted.
