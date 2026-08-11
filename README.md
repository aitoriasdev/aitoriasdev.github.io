# aitorias.dev

> Personal developer portfolio and showcase built with Astro, Tailwind CSS v4, TypeScript, and Content Collections.

[![Deploy to GitHub Pages](https://github.com/aitoriasdev/aitoriasdev.github.io/actions/workflows/astro.yml/badge.svg)](https://github.com/aitoriasdev/aitoriasdev.github.io/actions/workflows/astro.yml)
[![Built with Astro](https://img.shields.io/badge/Astro-v5-orange.svg)](https://astro.build)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-38bdf8.svg)](https://tailwindcss.com)
[![Code Quality](https://img.shields.io/badge/Linted_with-Oxlint-ff69b4.svg)](https://oxc.rs)

Live Website: [https://aitoriasdev.github.io](https://aitoriasdev.github.io)

---

## Tech Stack & Architecture

- **Framework:** [Astro v5](https://astro.build) (SSG with Content Collections v2 & Content Loader API)
- **Styling:** [Tailwind CSS v4](https://tailwindcss.com) using `@theme` design tokens
- **Data Management:** Type-safe Markdown frontmatter validation with Zod schemas
- **Architecture:** Encapsulated Layout shell (`Layout.astro`) & component breakdown
- **Tooling & Formatting:** High-performance linting and formatting via [`oxc`](https://oxc.rs) (`oxlint` & `oxfmt`)
- **Deployment:** GitHub Pages via automated GitHub Actions CI/CD pipeline

---

## Design Tokens & Palette

The site features a custom Japanese Pastel palette declared inside `src/styles/global.css`:

| Token                      | Light Mode              | Dark Mode               | Usage                            |
| :------------------------- | :---------------------- | :---------------------- | :------------------------------- |
| `--color-bg-*`             | `#FBF9F5` (Warm Cream)  | `#16181D` (Ink Slate)   | Page Backgrounds                 |
| `--color-surface-*`        | `#F1ECE4` (Sand)        | `#21252D` (Charcoal)    | Cards, Modals & Drawers          |
| `--color-border-*`         | `#E2DAD0` (Muted Paper) | `#2E3440` (Muted Slate) | Submerged Card Highlights        |
| `--color-accent-primary`   | `#8A9A86` (Matcha)      | `#8A9A86` (Matcha)      | Primary Buttons & Active Filters |
| `--color-accent-secondary` | `#DDA7A5` (Sakura)      | `#DDA7A5` (Sakura)      | Subtext Accents & Badges         |

---

## Project Structure

```text
.
├── public/                    # Favicons, manifest, robots.txt
├── src/
│   ├── assets/                # Optimized static assets & project thumbnails
│   ├── config/                # Navigation & global site configuration
│   ├── content/               # Content Collections
│   │   └── projects/          # Markdown project entries (*.md, *.mdx)
│   ├── components/
│   │   ├── drawer/            # Navigation mobile drawer
│   │   ├── header/            # Header, NavMenu, ThemeToggle
│   │   ├── projects/          # Dynamic project section & filter cards
│   │   └── shared/            # Base atomic UI shared elements (Button, Badge, Icon, Link)
│   ├── layouts/
│   │   └── Layout.astro       # Encapsulated site shell (Header, Main, Footer, Drawer)
│   ├── pages/
│   │   ├── index.astro        # Homepage entrypoint
│   │   └── projects/
│   │       ├── index.astro    # Dedicated projects gallery page
│   │       └── [slug].astro   # Dynamic project detail page generator
│   └── content.config.ts      # Zod schema definitions for Content Collections
├── astro.config.mjs
└── package.json
```
