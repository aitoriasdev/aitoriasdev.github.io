// @ts-check
import { defineConfig } from "astro/config";
import partytown from "@astrojs/partytown";
import sitemap from "@astrojs/sitemap";
import tailwindcss from "@tailwindcss/vite";

// https://astro.build/config
export default defineConfig({
  integrations: [
    partytown({
      config: {
        forward: ['dataLayer.push'],
      },
    }),
    sitemap()
  ],
  site: "https://aitoriasdev.github.io",
  vite: {
    plugins: [tailwindcss()],
  },
});
