import { test, expect } from "@playwright/test";

test("marketing page presents the professional pilot", async ({ page }) => {
  await page.goto("/");

  await expect(
    page.getByRole("heading", { name: /Your research deserves a reveal/ }),
  ).toBeVisible();
  await expect(page.getByRole("link", { name: "Open synthetic studio" })).toBeVisible();
  await expect(page.getByRole("link", { name: "Preview the client experience" })).toBeVisible();
  await expect(page.getByText("synthetic data only")).toBeVisible();
});
