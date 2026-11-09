// @ts-check
import { defineConfig, envField, fontProviders } from "astro/config";
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
            src: [
              "./src/assets/fonts/OpenDyslexic/OpenDyslexic-BoldItalic.otf",
            ],
            weight: "bold",
            style: "italic",
          },
        ],
      },
    },
  ],
  env: {
    schema: {
      PUBLIC_GA_MEASUREMENT_ID: envField.string({
        context: "client",
        access: "public",
        optional: true,
      }),
    },
  },
  i18n: {
    defaultLocale: "en",
    locales: ["en", "es"],
    routing: {
      prefixDefaultLocale: false,
    },
  },
  integrations: [
    partytown({
      config: {
        // `gtag` is defined inside the Partytown worker. Forwarding it exposes a
        // main-thread `window.gtag` stub so consent updates and custom events
        // (CookieBanner, trackEvent) actually reach Google Analytics.
        forward: ["dataLayer.push", "gtag"],
      },
    }),
    sitemap({
      // hreflang pairs for identical paths (/ <-> /es/). Translated routes such
      // as /projects <-> /es/proyectos get <link rel="alternate"> in Layout.
      i18n: {
        defaultLocale: "en",
        locales: { en: "en", es: "es" },
      },
    }),
  ],
  site: "https://aitorias.is-a.dev",
  vite: {
    plugins: [tailwindcss()],
  },
});
