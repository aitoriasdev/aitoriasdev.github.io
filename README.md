# aitorias.dev

> Personal developer portfolio and showcase built with Astro v7, Tailwind CSS v4, TypeScript, and Content Collections.

[![Deploy to GitHub Pages](https://github.com/aitoriasdev/aitoriasdev.github.io/actions/workflows/astro.yml/badge.svg)](https://github.com/aitoriasdev/aitoriasdev.github.io/actions/workflows/astro.yml)
[![Built with Astro](https://img.shields.io/badge/Astro-v5-orange.svg)](https://astro.build)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-38bdf8.svg)](https://tailwindcss.com)
[![Code Quality](https://img.shields.io/badge/Linted_with-Oxlint-ff69b4.svg)](https://oxc.rs)

Live Website: [https://aitoriasdev.github.io](https://aitoriasdev.github.io)

---

## Tech Stack & Architecture

- **Framework:** [Astro v7](https://astro.build) (SSG with Content Collections v2 & Content Loader API)
- **Styling:** [Tailwind CSS v4](https://tailwindcss.com) using `@theme` design tokens
- **Typography:** Self-hosted OpenDyslexic font support integrated via Astro Font Provider API
- **Accessibility:** Interactive Accessibility Menu (`reduce-motion`, `high-contrast`, `large-text`, `dyslexic-font`)
- **Data Management:** Type-safe Markdown frontmatter validation with Zod schemas
- **Architecture:** Encapsulated Layout shell (`Layout.astro`) & shared modular layout components (`Header`, `Footer`, `Drawer`)
- **Tooling & Formatting:** High-performance linting and formatting via [`oxc`](https://oxc.rs) (`oxlint` & `oxfmt`)
- **Deployment:** GitHub Pages via automated GitHub Actions CI/CD pipeline

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
├── public/                    # Favicons, manifest, robots.txt
├── src/
│   ├── assets/                # Optimized static assets
│   │   ├── fonts/             # OpenDyslexic font family files (.otf)
│   │   └── images/            # Hero profile image & project thumbnails
│   ├── config/                # Navigation, tags & global site configuration
│   ├── content/               # Content Collections
│   │   └── projects/          # Markdown project entries (*.md, *.mdx)
│   ├── components/
│   │   ├── hero/              # Hero banner & status indicators
│   │   ├── projects/          # Dynamic project section, cards & tag filters
│   │   └── shared/            # Shared UI components & layout shell elements
│   │       ├── drawer/        # Navigation mobile drawer
│   │       ├── footer/        # Shared site footer
│   │       ├── header/        # Header, NavMenu, ThemeToggle
│   ├── layouts/
│   │   └── Layout.astro       # Encapsulated site shell (Header, Main, Footer, Drawer, AccessibilityMenu)
│   ├── pages/
│   │   ├── index.astro        # Homepage entrypoint
│   │   └── projects/
│   │       ├── index.astro    # Dedicated projects gallery page
│   │       └── [slug].astro   # Dynamic project detail page generator
│   ├── styles/
│   │   └── global.css         # Tailwind v4 theme variables, dyslexic font rules & typography scaling
│   └── content.config.ts      # Zod schema definitions for Content Collections
├── astro.config.mjs            # Astro configuration & local font provider setups
└── package.json
```
