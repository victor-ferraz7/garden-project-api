import { defineConfig } from "@playwright/test";

const baseURL = process.env.PLAYWRIGHT_BASE_URL || "http://127.0.0.1:3999";

export default defineConfig({
  testDir: "tests/integration",
  /* Apenas E2E HTTP; testes Vitest de repositório ficam em tests/integration/repositories */
  testMatch: "**/api.integration.spec.ts",
  timeout: 60_000,
  expect: { timeout: 10_000 },
  fullyParallel: false,
  workers: 1,
  reporter: [["list"]],
  use: {
    baseURL,
    extraHTTPHeaders: { Accept: "application/json" },
  },
  webServer: {
    command: "npm run build && node scripts/integration-test-server.mjs",
    url: `${baseURL}/health`,
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
});
