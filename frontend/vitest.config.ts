// frontend/vitest.config.ts
import { defineConfig } from "vitest/config";
import tsconfigPaths from "vite-tsconfig-paths";
import { fileURLToPath } from "node:url";

export default defineConfig({
  plugins: [tsconfigPaths()],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
  test: {
    environment: "jsdom",
    setupFiles: [fileURLToPath(new URL("./src/test/setup.tsx", import.meta.url))], // ← .tsx
    css: true,
    globals: true,
    include: ["src/test/**/*.test.{ts,tsx}"],
    env: {
      NEXT_PUBLIC_API_URL: "http://localhost:5270",
    },
  },
});
