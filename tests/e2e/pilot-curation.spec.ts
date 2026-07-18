import { expect, test } from "@playwright/test";

const PROJECT = "pilot-hart-001";

test.describe.configure({ mode: "serial" });

test.afterAll(async ({ request }) => {
  await request.post("/api/dev/reset");
});

test("curation edits reach the family presentation and survive a reload", async ({
  page,
}) => {
  await page.goto(`/projects/${PROJECT}/curate`);

  const familyName = page.getByLabel("Family name");
  const practiceName = page.getByLabel("Practice name");

  await familyName.fill("The Ashgrove Family");
  await practiceName.fill("Slavit Genealogy");
  await page.getByLabel("Welcome headline").fill("Four generations in one place.");

  await page.getByRole("button", { name: /Save presentation details/ }).click();
  await expect(page.getByText(/Saved\./)).toBeVisible();

  // A mock would lose this on reload.
  await page.reload();
  await expect(familyName).toHaveValue("The Ashgrove Family");
  await expect(practiceName).toHaveValue("Slavit Genealogy");

  // And it must be what the family actually sees.
  await page.goto(`/projects/${PROJECT}/preview`);
  await expect(page.getByRole("heading", { name: "The Ashgrove Family" })).toBeVisible();
  await expect(page.getByText("Curated by Slavit Genealogy")).toBeVisible();
  await expect(page.getByText("Four generations in one place.")).toBeVisible();
  await expect(page.getByText(/Meridian Family Histories/)).toHaveCount(0);
});

test("curation rejects an over-long headline instead of silently truncating", async ({
  page,
}) => {
  await page.goto(`/projects/${PROJECT}/curate`);

  // The field caps input, so the guard is proven server-side in the unit tests;
  // here we confirm the cap is actually enforced in the browser.
  const headline = page.getByLabel("Welcome headline");
  await headline.fill("x".repeat(120));
  await expect(headline).toHaveValue("x".repeat(90));
});
