import { expect, test } from "@playwright/test";

test("creator can add a person and continue in the workbench", async ({ page }) => {
  await page.goto("/directory");
  await page.getByRole("link", { name: "Add person" }).click();

  await page.getByLabel("Given name").fill("Iris");
  await page.getByLabel("Surname").fill("North");
  await page.getByLabel("Summary").fill("Newly added for Playwright coverage.");
  await page.getByRole("button", { name: "Create person" }).click();

  await expect(page.getByText("Person created. Continue with relationships and events next.")).toBeVisible();
  await expect(page.getByRole("heading", { name: "Edit person" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Parents" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Timeline events" })).toBeVisible();
});

test("public directory filtering preserves the share token", async ({ page }) => {
  await page.goto("/t/hart-family-archive?share=share-hart-2026-demo");

  await page.getByLabel("Search").fill("Walter");
  await page.getByRole("button", { name: "Apply filters" }).click();

  await expect(page).toHaveURL(/share=share-hart-2026-demo/);
  await expect(page.getByText("Walter Hart")).toBeVisible();
});

test("living people stay masked in the public profile and can still open canvas", async ({ page }) => {
  await page.goto("/t/hart-family-archive/person/p14?share=share-hart-2026-demo");

  await expect(page.getByRole("heading", { name: "Helen Hart Brooks" })).toBeVisible();
  await expect(page.getByText("This person is marked as living")).toBeVisible();
  await expect(page.getByText("Helen believes the archive should feel like an heirloom book")).toHaveCount(0);

  await page.getByRole("link", { name: "Explore in canvas" }).click();
  await expect(page).toHaveURL(/\/t\/hart-family-archive\/canvas\?share=share-hart-2026-demo&person=p14/);
});

test("canvas explorer can expand outward and preserve lineage highlighting in the URL", async ({ page }) => {
  await page.goto("/canvas?person=p03");

  await expect(page.getByText("George Vale")).toHaveCount(0);

  await page.getByRole("button", { name: "2 hop" }).click();
  await expect(page).toHaveURL(/\/canvas\?person=p03&depth=2/);
  await expect(page.getByText("George Vale")).toBeVisible();

  await page.getByRole("button", { name: "West-Vale Branch" }).click();
  await expect(page).toHaveURL(/lineage=l02/);
});

test("viewer can open the lineage view from the shared archive", async ({ page }) => {
  await page.goto("/t/hart-family-archive?share=share-hart-2026-demo");

  await page.getByRole("link", { name: "Browse lineages" }).click();

  await expect(page).toHaveURL(/\/t\/hart-family-archive\/lineages\?share=share-hart-2026-demo/);
  await expect(page.getByRole("heading", { name: "Follow named descent paths" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Direct Hart Line" })).toBeVisible();
  await expect(page.getByRole("link", { name: /Jonah Brooks/ })).toBeVisible();
});

test("settings page is organized around tree, account, and danger-zone controls", async ({ page }) => {
  await page.goto("/settings");

  await expect(page.getByRole("heading", { name: "Public archive link" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Identity and sign-in" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Destructive controls" })).toBeVisible();
});

test("creator can parse and confirm a GEDCOM upload", async ({ page }) => {
  await page.goto("/import");

  await page.locator('input[type="file"]').setInputFiles({
    name: "playwright.ged",
    mimeType: "text/plain",
    buffer: Buffer.from(`0 HEAD
1 SOUR PLAYWRIGHT
0 @I1@ INDI
1 NAME Ada /Walker/
1 SEX F
1 BIRT
2 DATE 12 JAN 1901
2 PLAC Dayton, Ohio
0 TRLR`),
  });

  await page.getByRole("button", { name: "Parse file" }).click();
  await expect(page.getByRole("button", { name: "Confirm import" })).toBeVisible();
  await expect(page.getByText("People")).toBeVisible();

  await page.getByRole("button", { name: "Confirm import" }).click();
  await expect(page.getByRole("button", { name: "Import confirmed" })).toBeVisible();
});

test("shared archive navigation collapses into a mobile drawer", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/t/hart-family-archive?share=share-hart-2026-demo");

  await page.getByRole("button", { name: "Open navigation" }).click();
  const drawer = page.getByRole("dialog", { name: "The Hart Family Archive navigation" });
  await expect(drawer.getByRole("link", { name: "Canvas", exact: true })).toBeVisible();
  await expect(drawer.getByRole("link", { name: "Lineages", exact: true })).toBeVisible();
});
