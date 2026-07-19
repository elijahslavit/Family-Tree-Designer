import { defineConfig, devices } from "@playwright/test";

// Next refuses to start a second dev server for the same directory, so allow
// pointing the suite at one that is already running: PW_PORT=3000 npx playwright test
const port = process.env.PW_PORT ?? "3100";
const baseURL = `http://127.0.0.1:${port}`;

export default defineConfig({
  testDir: "./tests/e2e",
  workers: 1,
  use: {
    baseURL,
    trace: "on-first-retry",
  },
  webServer: {
    command: `npm.cmd run dev -- --port ${port}`,
    url: baseURL,
    // Reuse the dev server that is already running locally; CI always starts clean.
    reuseExistingServer: !process.env.CI,
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],
});
