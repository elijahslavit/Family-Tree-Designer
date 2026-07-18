import { test } from "@playwright/test";

const PROJECT = "pilot-hart-001";
const OUT = "public/marketing";

/**
 * Captures the seeded demonstration archive in both presentation styles for use
 * on the marketing pages. Run with `npx playwright test capture-marketing`.
 * These are real screenshots of the running app, not mockups — so the marketing
 * site cannot drift from what the product actually looks like.
 */
test("captures both presentation styles for the marketing pages", async ({ page }) => {
  await page.setViewportSize({ width: 1400, height: 940 });

  for (const theme of ["linen", "heirloom"] as const) {
    await page.goto(`/projects/${PROJECT}/theme`);
    await page.getByRole("button", { name: new RegExp(theme, "i") }).click();
    await page.waitForTimeout(400);

    // The preview banner and the floating colour-mode toggle are workspace
    // chrome, not part of what a family sees, so keep them out of the imagery.
    const hideBanner = {
      content: `[data-preview-banner],
                [aria-label='Toggle color mode'],
                nextjs-portal,
                [data-nextjs-dev-tools-button],
                #__next-build-watcher { display: none !important }`,
    };

    const shots: Array<[string, string]> = [
      ["welcome", `/projects/${PROJECT}/preview`],
      ["people", `/projects/${PROJECT}/preview/people`],
      ["tree", `/projects/${PROJECT}/preview/tree`],
    ];

    for (const [name, path] of shots) {
      await page.goto(path);
      await page.addStyleTag(hideBanner);
      await page.waitForLoadState("networkidle");
      await page.waitForTimeout(600);
      await page.screenshot({ path: `${OUT}/${theme}-${name}.png` });
    }

    // A person page, reached the way a family member would reach it.
    await page.goto(`/projects/${PROJECT}/preview/people`);
    await page.addStyleTag(hideBanner);
    await page.locator("a[href*='/preview/people/']").first().click();
    await page.waitForLoadState("networkidle");
    await page.addStyleTag(hideBanner);
    await page.waitForTimeout(600);
    await page.screenshot({ path: `${OUT}/${theme}-person.png` });
  }

  // Leave the demonstration project on the lighter style.
  await page.goto(`/projects/${PROJECT}/theme`);
  await page.getByRole("button", { name: /linen/i }).click();
});
