import { expect, test } from "@playwright/test";
import path from "node:path";

const HART = "pilot-hart-001";
const VALE = "pilot-vale-002";
const FIXTURE = path.join(process.cwd(), "tests/e2e/fixtures/whitfield.ged");

test.describe.configure({ mode: "serial" });

test.afterAll(async ({ request }) => {
  await request.post("/api/dev/reset");
});

test("importing for one client leaves another client's archive untouched", async ({
  page,
}) => {
  await page.goto(`/projects/${VALE}/import`);
  await page.setInputFiles('input[type="file"][accept=".ged,.gedcom"]', FIXTURE);
  await expect(page.getByText(/Imported \d+ presentable people/)).toBeVisible({
    timeout: 20_000,
  });

  await page.goto(`/projects/${VALE}/preview`);
  await expect(page.getByRole("heading", { name: "The Whitfield Family" })).toBeVisible();

  // The other project must still hold its own family.
  await page.goto(`/projects/${HART}/preview`);
  await expect(page.getByRole("heading", { name: "The Hart Family" })).toBeVisible();
  await expect(page.getByText(/Whitfield/)).toHaveCount(0);
});

test("a completed import survives later reads of the workspace", async ({ page }) => {
  // Demo archives are seeded on every workspace read. If that seeding were not
  // idempotent it would quietly restore demo records over a real import.
  await page.goto("/projects");
  await page.goto(`/projects/${HART}/preview`);

  await page.goto(`/projects/${VALE}/preview`);
  await expect(page.getByRole("heading", { name: "The Whitfield Family" })).toBeVisible();

  await page.goto(`/projects/${VALE}/preview/people`);
  await expect(page.getByText("Thomas Alfred Whitfield").first()).toBeVisible();
  await expect(page.getByText("Eleanor Hart West")).toHaveCount(0);
});
