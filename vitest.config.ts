/// <reference types="vitest/config" />
import { getViteConfig } from "astro/config";

export default getViteConfig(
  {
    test: {
      globals: true,
      // Unit + component tests live next to the code; e2e/ is Playwright's
      include: ["src/**/*.test.ts"],
    },
  },
  {
    site: "https://aitorias.is-a.dev",
  },
);
