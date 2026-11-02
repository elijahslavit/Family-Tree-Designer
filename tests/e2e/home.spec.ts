import { test, expect } from "@playwright/test";

test("marketing page presents the professional pilot", async ({ page }) => {
  await page.goto("/");

  await expect(
    page.getByRole("heading", { name: /Your research deserves a reveal/ }),
  ).toBeVisible();
  await expect(page.getByRole("link", { name: "See a finished reveal" }).first()).toBeVisible();
  await expect(page.getByRole("link", { name: "Open the pilot workspace" }).first()).toBeVisible();
  await expect(page.getByText("synthetic data only")).toBeVisible();
});

test("color mode can be changed and persists across reloads", async ({ page }) => {
  await page.goto("/projects");

  const toggle = page.getByRole("button", { name: "Toggle dark mode" });
  const initialMode = await page.locator("html").getAttribute("data-color-mode");

  await toggle.click();

  const expectedMode = initialMode === "dark" ? "light" : "dark";
  await expect(page.locator("html")).toHaveAttribute("data-color-mode", expectedMode);
  await page.reload();
  await expect(page.locator("html")).toHaveAttribute("data-color-mode", expectedMode);
});

test("the client showcase stays in its light composition when dark mode is chosen", async ({ page }) => {
  await page.emulateMedia({ colorScheme: "dark" });
  await page.goto("/projects/pilot-hart-001/preview");

  await expect(page.locator("html")).toHaveAttribute("data-color-mode", "dark");
  const heading = page.getByRole("heading", { name: "The Hart Family" });
  await expect(heading).toBeVisible();
  // Dark-mode token overrides must not apply inside light-only surfaces.
  await expect(heading).toHaveCSS("color", "rgb(36, 31, 24)");
});
