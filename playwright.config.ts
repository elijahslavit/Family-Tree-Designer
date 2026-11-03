import { defineConfig, devices } from "@playwright/test";

const isCI = Boolean(process.env.CI) && process.env.CI !== "false";
const npm = process.platform === "win32" ? "npm.cmd" : "npm";

export default defineConfig({
  testDir: "./tests/e2e",
  workers: 1,
  forbidOnly: isCI,
  // No retries: the synthetic pilot store lives in server memory, so a retry
  // would run against state the failed attempt already changed (for example a
  // consumed single-use invitation) and could not pass or fail honestly.
  retries: 0,
  reporter: isCI ? [["github"], ["html", { open: "never" }]] : "list",
  use: {
    baseURL: "http://127.0.0.1:3100",
    trace: "retain-on-failure",
  },
  webServer: {
    // CI tests the production build (built in an earlier step); locally the
    // dev server keeps iteration fast. The synthetic pilot store lives in
    // server memory, so each run needs a fresh server process.
    command: isCI ? `${npm} run start -- --port 3100` : `${npm} run dev -- --port 3100`,
    url: "http://127.0.0.1:3100",
    reuseExistingServer: false,
    timeout: 120_000,
    env: { DEMO_MODE: "true" },
  },
  projects: [
    {
      name: "chromium",
      use: {
        ...devices["Desktop Chrome"],
        launchOptions: process.env.PLAYWRIGHT_CHROMIUM_PATH
          ? { executablePath: process.env.PLAYWRIGHT_CHROMIUM_PATH }
          : undefined,
      },
    },
  ],
});
