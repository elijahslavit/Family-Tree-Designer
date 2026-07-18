import { test, expect } from "@playwright/test";

test("landing page leads with the reveal and reaches a public proof", async ({ page }) => {
  await page.goto("/");

  await expect(
    page.getByRole("heading", { name: /Your research deserves a reveal/ }),
  ).toBeVisible();
  await expect(page.getByText("One archive. Two presentations.")).toBeVisible();

  // The primary call to action must land somewhere a stranger can actually
  // open — it previously pointed into the authenticated workspace.
  await page.getByRole("link", { name: "See a finished reveal" }).click();
  await expect(page).toHaveURL(/\/styles$/);
  await expect(
    page.getByRole("heading", { name: /Two distinct presentations/ }),
  ).toBeVisible();
});

test("marketing pages are reachable without signing in", async ({ page }) => {
  for (const path of ["/styles", "/how-it-works", "/for-families"]) {
    await page.goto(path);
    await expect(page).toHaveURL(new RegExp(`${path}$`));
    await expect(page.getByRole("link", { name: /Hearth & Heir/ }).first()).toBeVisible();
  }
});

test("pricing states the one-time fee and never a subscription", async ({ page }) => {
  await page.goto("/how-it-works");

  await expect(page.getByText("$249")).toBeVisible();
  await expect(page.getByText("$399")).toBeVisible();
  await expect(page.getByText(/A one-time fee per archive/)).toBeVisible();
  // Guards against the invented monthly tiers reappearing.
  await expect(page.getByText(/\/month/)).toHaveCount(0);
});

test("no placeholder support address is published", async ({ page }) => {
  await page.goto("/how-it-works");
  await expect(page.getByText(/example\.invalid/)).toHaveCount(0);
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
