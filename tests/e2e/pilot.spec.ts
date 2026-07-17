import { expect, test } from "@playwright/test";

test.describe.configure({ mode: "serial" });

test("creator portfolio and professional preview are complete", async ({ page }) => {
  await page.goto("/projects");

  await expect(page.getByRole("heading", { name: "Client delivery studio" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Pilot projects" })).toBeVisible();
  await expect(page.getByText("The Hart Family Legacy").first()).toBeVisible();

  await page.goto("/projects/pilot-hart-001/preview");
  await expect(page.getByRole("heading", { name: "The Hart Family" })).toBeVisible();
  await expect(page.getByRole("link", { name: /Discover an ancestor/ })).toBeVisible();
  await expect(page.getByRole("link", { name: /Browse a family branch/ })).toBeVisible();
  await expect(page.getByText(/Prepared for The Hart Family by Meridian Family Histories/)).toBeVisible();
  await expect(page.getByText("Synthetic demonstration media")).toBeVisible();
});

test("invitation errors disclose no family content", async ({ page }) => {
  await page.goto("/invite/pilot-expired-invite");
  await expect(page.getByRole("heading", { name: "This invitation has expired." })).toBeVisible();
  await expect(page.getByText("The Hart Family Legacy")).toHaveCount(0);

  await page.goto("/invite/pilot-revoked-invite");
  await expect(page.getByRole("heading", { name: "Access has been revoked." })).toBeVisible();
  await expect(page.getByText("The Hart Family Legacy")).toHaveCount(0);
});

test("review invitation creates an authorized private showcase session", async ({ page }) => {
  await page.goto("/invite/pilot-review-invite");
  await expect(page.getByRole("heading", { name: /Welcome, Designated client reviewer/ })).toBeVisible();
  await page.getByRole("button", { name: "Continue securely" }).click();

  await expect(page).toHaveURL(/\/review\/hart-family-legacy/);
  await expect(page.getByRole("heading", { name: "The Hart Family Legacy" })).toBeVisible();
  await expect(page.getByText("Final client review").first()).toBeVisible();

  await page.goto("/s/hart-family-legacy");
  await expect(page.getByRole("heading", { name: "The Hart Family" })).toBeVisible();
  await expect(page.getByRole("link", { name: /Discover an ancestor/ })).toBeVisible();
  await expect(page.getByText("Living minor")).toHaveCount(0);

  await page.setViewportSize({ width: 390, height: 844 });
  await page.locator('summary[aria-label="Open navigation"]').click();
  const mobileNav = page.getByRole("group");
  await expect(mobileNav.getByRole("link", { name: "Family tree", exact: true })).toBeVisible();
  await expect(mobileNav.getByRole("link", { name: "Stories", exact: true })).toBeVisible();
});

test("verified owner can accept handoff and reach archive controls", async ({ page }) => {
  await page.goto("/invite/pilot-owner-invite");
  await expect(page.getByRole("heading", { name: /Welcome, Leah Hart/ })).toBeVisible();
  await page.getByRole("button", { name: "Continue securely" }).click();

  await expect(page).toHaveURL(/\/handoff\/hart-family-legacy/);
  await expect(page.getByRole("heading", { name: "Accept stewardship of The Hart Family Legacy" })).toBeVisible();
  await page.getByRole("button", { name: /Accept archive ownership/ }).click();

  await expect(page).toHaveURL(/\/archive\/pilot-hart-001/);
  await expect(page.getByRole("heading", { name: "The Hart Family Legacy" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Family invitations" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Export the family archive" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Request archive deletion" })).toBeVisible();
});
