import { expect, test } from "@playwright/test";
import path from "node:path";

const PROJECT = "pilot-hart-001";
const FIXTURE = path.join(process.cwd(), "tests/e2e/fixtures/whitfield.ged");

test.describe.configure({ mode: "serial" });

// Importing replaces the single shared working archive, so restore the
// synthetic data other specs assert against.
test.afterAll(async ({ request }) => {
  await request.post("/api/dev/reset");
});

/**
 * Captures the imported archive in both presentation worlds. Run with
 * `npx playwright test showcase-themes` to refresh the images used when
 * showing a client their options.
 */
test("captures both themes over real imported data", async ({ page }) => {
  await page.goto(`/projects/${PROJECT}/import`);
  await page.setInputFiles('input[type="file"][accept=".ged,.gedcom"]', FIXTURE);
  await expect(page.getByText(/Imported \d+ presentable people/)).toBeVisible({
    timeout: 20_000,
  });

  await page.setViewportSize({ width: 1440, height: 1000 });

  for (const theme of ["linen", "heirloom"] as const) {
    await page.goto(`/projects/${PROJECT}/theme`);
    await page.getByRole("button", { name: new RegExp(theme, "i") }).click();
    await expect(page.getByRole("button", { name: new RegExp(theme, "i") })).toHaveAttribute(
      "aria-pressed",
      "true",
    );

    await page.goto(`/projects/${PROJECT}/preview`);
    await expect(page.locator("[data-showcase-theme]")).toHaveAttribute(
      "data-showcase-theme",
      theme,
    );
    await page.waitForLoadState("networkidle");
    await page.screenshot({
      path: `test-results/showcase-${theme}-welcome.png`,
      fullPage: false,
    });

    await page.goto(`/projects/${PROJECT}/preview/people`);
    await page.waitForLoadState("networkidle");
    await page.screenshot({ path: `test-results/showcase-${theme}-people.png` });
  }

  // Leave the picker on the theme the demo should open with.
  await page.goto(`/projects/${PROJECT}/theme`);
});
