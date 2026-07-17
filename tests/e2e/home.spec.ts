import { test, expect } from "@playwright/test";

test("marketing page presents the professional pilot", async ({ page }) => {
  await page.goto("/");

  await expect(
    page.getByRole("heading", { name: /Your research deserves a reveal/ }),
  ).toBeVisible();
  await expect(page.getByRole("link", { name: "See a finished reveal" })).toBeVisible();
  await expect(page.getByRole("link", { name: "Open the pilot workspace" })).toBeVisible();
  await expect(page.getByText("synthetic data only")).toBeVisible();
});

test("color mode can be changed and persists across reloads", async ({ page }) => {
  await page.goto("/");

  const toggle = page.getByRole("button", { name: "Toggle color mode" });
  const initialMode = await page.locator("html").getAttribute("data-color-mode");

  await toggle.click();

  const expectedMode = initialMode === "dark" ? "light" : "dark";
  await expect(page.locator("html")).toHaveAttribute("data-color-mode", expectedMode);
  await page.reload();
  await expect(page.locator("html")).toHaveAttribute("data-color-mode", expectedMode);
});
