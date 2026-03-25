import { test, expect } from "@playwright/test";

test("marketing page renders archive links", async ({ page }) => {
  await page.goto("/");

  await expect(page.getByText("Family Tree Designer")).toBeVisible();
  await expect(page.getByText("Open creator mode")).toBeVisible();
  await expect(page.getByText("Browse the shared archive")).toBeVisible();
});
