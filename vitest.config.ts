import path from "path";
import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    globals: true,
    environment: "node",
    setupFiles: [path.resolve(__dirname, "tests/setup/vitest.setup.ts")],
    include: ["tests/unit/**/*.test.ts", "tests/integration/repositories/**/*.test.ts"],
    coverage: {
      provider: "v8",
      reporter: ["text", "html"],
      exclude: [
        "dist/**",
        "tests/**",
        "**/*.config.ts",
        "src/seed/**",
        "scripts/**",
        "playwright.config.ts",
      ],
    },
    pool: "forks",
    testTimeout: 30_000,
    hookTimeout: 30_000,
  },
  resolve: {
    extensions: [".ts", ".tsx", ".js", ".jsx", ".json"],
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },
});
