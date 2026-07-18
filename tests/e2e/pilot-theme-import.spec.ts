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

test("a genealogist picks a theme, imports a GEDCOM, and the family sees it", async ({
  page,
}) => {
  // 1. Choose the presentation world.
  await page.goto(`/projects/${PROJECT}/theme`);
  await expect(page.getByRole("heading", { name: /how this family's archive feels/i })).toBeVisible();

  const heirloom = page.getByRole("button", { name: /Heirloom/ });
  await heirloom.click();
  await expect(heirloom).toHaveAttribute("aria-pressed", "true");
  await expect(heirloom.getByText("Selected")).toBeVisible();

  // 2. Bring the family's own records in.
  await page.goto(`/projects/${PROJECT}/import`);
  await page.setInputFiles('input[type="file"][accept=".ged,.gedcom"]', FIXTURE);

  const notice = page.getByText(/Imported \d+ presentable people/);
  await expect(notice).toBeVisible({ timeout: 20_000 });
  // Living descendants must never reach the family presentation.
  await expect(notice).toContainText("3 living people are hidden");

  // 3. The presentation rebuilds around the imported family.
  await page.goto(`/projects/${PROJECT}/preview`);
  await expect(page.getByRole("heading", { name: "The Whitfield Family" })).toBeVisible();
  await expect(page.getByText("6 lives, 1836–1994.")).toBeVisible();

  // The chosen theme is what actually renders.
  await expect(page.locator("[data-showcase-theme]")).toHaveAttribute(
    "data-showcase-theme",
    "heirloom",
  );

  // Demo-era content from another family must be gone.
  await expect(page.getByText(/Hart Reunion Circular/i)).toHaveCount(0);
  await expect(page.getByText(/synthetic/i)).toHaveCount(0);

  // The deceased patriarch anchors the opening screen; living relatives do not.
  await expect(page.getByText("Thomas Alfred Whitfield").first()).toBeVisible();
  await expect(page.getByText("Michael Whitfield")).toHaveCount(0);
});
