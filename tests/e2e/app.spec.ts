import { expect, test } from "@playwright/test";

// The earlier hobbyist editor and public share links were retired in favour
// of the professional studio and invitation-only client presentations. Old
// bookmarks must land somewhere sensible rather than on a 404.

for (const path of ["/dashboard", "/directory", "/canvas?person=p03", "/theme", "/settings", "/person/p03"]) {
  test(`retired studio route ${path} redirects to the project portfolio`, async ({ page }) => {
    await page.goto(path);
    await expect(page).toHaveURL(/\/projects$/);
    await expect(page.getByRole("heading", { name: "Client delivery studio" })).toBeVisible();
  });
}

test("retired public share links never expose a family and return home", async ({ page }) => {
  await page.goto("/t/hart-family-archive?share=share-hart-2026-demo");
  await expect(page).toHaveURL(/\/$/);
  expect(page.url()).not.toContain("share=");
  await expect(page.getByRole("heading", { name: /Your research deserves a reveal/ })).toBeVisible();
});
