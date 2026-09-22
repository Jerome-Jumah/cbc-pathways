import { defineConfig, devices } from "@playwright/test";

const baseURL = process.env.PLAYWRIGHT_BASE_URL ?? "http://127.0.0.1:3000";

export default defineConfig({
  testDir: "./e2e",
  timeout: 30_000,
  use: {
    baseURL,
    trace: "on-first-retry",
  },
  webServer: [
    {
      command: "npx tsx e2e/mock-api-server.ts",
      url: "http://127.0.0.1:8080/api/track-profiles",
      reuseExistingServer: !process.env.CI,
      timeout: 30_000,
    },
    {
      command: process.env.PLAYWRIGHT_WEB_SERVER_COMMAND ?? "npm run dev",
      url: baseURL,
      reuseExistingServer: !process.env.CI,
      timeout: 120_000,
    },
  ],
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],
});
