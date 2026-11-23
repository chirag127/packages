import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    include: ["test/**/*.test.{ts,mjs}"],
    coverage: {
      include: ["src/lib/data.ts", "scripts/discover.mjs"],
      reporter: ["text", "json-summary"],
    },
  },
});
