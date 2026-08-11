// @ts-check
import { defineConfig, fontProviders } from "astro/config";
import partytown from "@astrojs/partytown";
import sitemap from "@astrojs/sitemap";
import tailwindcss from "@tailwindcss/vite";

// https://astro.build/config
export default defineConfig({
  fonts: [
    {
      provider: fontProviders.local(),
      name: "OpenDyslexic",
      cssVariable: "--font-open-dyslexic",
      options: {
        variants: [
          {
            src: ["./src/assets/fonts/OpenDyslexic/OpenDyslexic-Regular.otf"],
            weight: "normal",
            style: "normal",
          },
          {
            src: ["./src/assets/fonts/OpenDyslexic/OpenDyslexic-Bold.otf"],
            weight: "bold",
            style: "normal",
          },
          {
            src: ["./src/assets/fonts/OpenDyslexic/OpenDyslexic-Italic.otf"],
            weight: "normal",
            style: "italic",
          },
          {
            src: ["./src/assets/fonts/OpenDyslexic/OpenDyslexic-BoldItalic.otf"],
            weight: "bold",
            style: "italic",
          },
        ],
      },
    },
  ],
  integrations: [
    partytown({
      config: {
        forward: ["dataLayer.push"],
      },
    }),
    sitemap(),
  ],
  site: "https://aitoriasdev.github.io",
  vite: {
    plugins: [tailwindcss()],
  },
});
