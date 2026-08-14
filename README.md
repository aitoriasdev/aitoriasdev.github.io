# aitorias.is-a.dev

> Personal developer portfolio and showcase built with Astro v7, React, Tailwind CSS v4, TypeScript, Content Collections, i18n, and custom GA4 analytics.

[![Deploy to GitHub Pages](https://github.com/aitoriasdev/aitoriasdev.github.io/actions/workflows/astro.yml/badge.svg)](https://github.com/aitoriasdev/aitoriasdev.github.io/actions/workflows/astro.yml)
[![Built with Astro](https://img.shields.io/badge/Astro-v5-orange.svg)](https://astro.build)
[![React](https://img.shields.io/badge/React-v19-61dafb.svg)](https://react.dev)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-38bdf8.svg)](https://tailwindcss.com)
[![Code Quality](https://img.shields.io/badge/Linted_with-Oxlint-ff69b4.svg)](https://oxc.rs)

Live Website: [https://aitorias.is-a.dev](https://aitorias.is-a.dev)

---

## Tech Stack & Architecture

- **Framework:** [Astro v7](https://astro.build) (SSG with Content Collections v2 & Content Loader API) + [React Integration](https://docs.astro.build/en/guides/integrations-guide/react/) via Islands Architecture
- **Custom Domain:** Custom sub-domain registration via [is-a.dev](https://is-a.dev) (`aitorias.is-a.dev`)
- **Internationalization (i18n):** Multi-language support (English & Spanish) with route localization utilities (`translatePath`, `getLangFromUrl`)
- **Analytics & Tracking:** Google Analytics 4 (GA4) integrated via Partytown web workers, with custom event attribute tracking (`data-track-event`) for link and card interactions
- **Styling:** [Tailwind CSS v4](https://tailwindcss.com) using `@theme` design tokens
- **Typography:** Self-hosted OpenDyslexic font support integrated via Astro Font Provider API
- **Accessibility:** Interactive Accessibility Menu (`reduce-motion`, `high-contrast`, `large-text`, `dyslexic-font`)
- **Data Management:** Type-safe Markdown frontmatter validation with Zod schemas
- **Architecture:** Encapsulated Layout shell (`Layout.astro`) & shared modular layout components (`Header`, `Footer`, `Drawer`)
- **Tooling & Formatting:** High-performance linting and formatting via [`oxc`](https://oxc.rs) (`oxlint` & `oxfmt`)
- **Deployment:** GitHub Pages via automated GitHub Actions CI/CD pipeline with custom domain verification (`CNAME`)

---

## Key Features & Custom Behaviors

- **React Islands Hydration:** Interactive project tag filtering built with React (`ProjectFilters.tsx`) and selectively hydrated on view (`client:visible`).
- **SEO & Canonical URLs:** Dynamic canonical URL generation (`Astro.site` context) for localized routes and project detail pages.
- **Linked Project Cards:** Entire project cards (including image containers and fallback image placeholders) are fully linked to localized project detail pages with custom event tracking attached.
- **Offloaded Analytics:** Google Analytics script loading is offloaded from the main thread using `@astrojs/partytown` for improved Core Web Vitals performance.
- **Granular Interaction Tracking:** Custom click tracking for hero social links, footer technology links, project links (live demo, GitHub, card preview), and navigation elements.

---

## Design Tokens & Palette

The site features a custom Japanese Pastel palette declared inside `src/styles/global.css`:

| Token                      | Light Mode              | Dark Mode               | Usage                                    |
| :------------------------- | :---------------------- | :---------------------- | :--------------------------------------- |
| `--color-bg-*`             | `#FBF9F5` (Warm Cream)  | `#16181D` (Ink Slate)   | Page Backgrounds                         |
| `--color-surface-*`        | `#F1ECE4` (Sand)        | `#21252D` (Charcoal)    | Cards, Modals & Drawers                  |
| `--color-border-*`         | `#E2DAD0` (Muted Paper) | `#2E3440` (Muted Slate) | Submerged Card Highlights                |
| `--color-accent-primary`   | `#3D603A` (Matcha)      | `#9EB199` (Matcha Dark) | Primary Buttons & Active Filters         |
| `--color-accent-secondary` | `#C87A78` (Sakura)      | `#C87A78` (Sakura)      | Subtext Accents & Badges                 |
| `--color-rose-*` / Status  | `rose-500` / `#F43F5E`  | `rose-400` / `#FB7185`  | Inactive Status Indicators & Off Toggles |

---

## Accessibility & Motion Support

The application fully adheres to modern Web Content Accessibility Guidelines (WCAG) with both system-level and manual user controls:

- **Reduced Motion Engine:** Disables transitions, hover translations (`hover:-translate-y-1`), image scale zooms (`hover:scale-105`), and pulsing animations (`animate-ping`). Supports both OS preferences (`@media (prefers-reduced-motion)`) and manual UI toggles (`.reduce-motion`).
- **OpenDyslexic Font:** Configured through Astro's local font provider (`astro.config.mjs`) and CSS variables (`--font-open-dyslexic`) to allow full site font swaps.
- **Dynamic Base Text Scaling:** Toggling **Larger Text** sets `font-size: 112.5%` on `<html>`, cleanly scaling standard 16px base typography up to 18px across all `rem`-based layout elements.
- **High Contrast & Dark Mode:** Unified color tokens ensure accessible contrast ratios across light and dark themes.

---

## Project Structure

```text
.
├── public/                    # Favicons, CNAME, manifest, robots.txt
├── src/
│   ├── assets/                # Optimized static assets
│   │   ├── fonts/             # OpenDyslexic font family files (.otf)
│   │   └── images/            # Hero profile image & project thumbnails
│   ├── config/                # Navigation, tags & global site configuration
│   ├── content/               # Content Collections
│   │   └── projects/          # Markdown project entries (*.md, *.mdx)
│   ├── i18n/                  # Localization dictionaries and helper utilities (translatePath, etc.)
│   ├── components/
│   │   ├── hero/              # Hero banner & status indicators
│   │   ├── projects/          # Dynamic project section, cards & React tag filters (ProjectFilters.tsx)
│   │   └── shared/            # Shared UI components & layout shell elements
│   │       ├── drawer/        # Navigation mobile drawer
│   │       ├── footer/        # Shared site footer
│   │       ├── header/        # Header, NavMenu, ThemeToggle, LanguagePicker
│   ├── layouts/
│   │   └── Layout.astro       # Encapsulated site shell (Header, Main, Footer, Drawer, AccessibilityMenu)
│   ├── pages/
│   │   ├── index.astro        # Homepage entrypoint
│   │   └── projects/
│   │       ├── index.astro    # Dedicated projects gallery page
│   │       └── [slug].astro   # Dynamic project detail page generator with localized slugs
│   ├── styles/
│   │   └── global.css         # Tailwind v4 theme variables, dyslexic font rules & typography scaling
│   └── content.config.ts      # Zod schema definitions for Content Collections
├── astro.config.mjs            # Astro configuration, React integration, Partytown setup, local font provider
└── package.json
```

---

## Version History

| Readme Version | Description                                                                                                                                               | Author         | Date       |
| :------------- | :-------------------------------------------------------------------------------------------------------------------------------------------------------- | :------------- | :--------- |
| `v1.0.0`       | Initial release with Astro v7, Tailwind CSS v4, Accessibility controls, and Content Collections.                                                          | Aitor de Diego | 2026-08-10 |
| `v1.1.0`       | Updated setup for `aitorias.is-a.dev` custom domain, Partytown GA4 integration, i18n routing, and complete image/fallback link tracking.                  | Aitor de Diego | 2026-08-14 |
| `v1.2.0`       | Integrated `@astrojs/react` for interactive state components, added dynamic canonical URL headers, localized breadcrumb home links, and updated metadata. | Aitor de Diego | 2026-08-14 |
