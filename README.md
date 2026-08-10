# aitorias.dev

> Personal developer portfolio and showcase built with Astro, Tailwind CSS v4, TypeScript, and Atomic Design principles.

[![Deploy to GitHub Pages](https://github.com/aitoriasdev/aitoriasdev.github.io/actions/workflows/astro.yml/badge.svg)](https://github.com/aitoriasdev/aitoriasdev.github.io/actions/workflows/astro.yml)
[![Built with Astro](https://img.shields.io/badge/Astro-v5-orange.svg)](https://astro.build)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-38bdf8.svg)](https://tailwindcss.com)
[![Code Quality](https://img.shields.io/badge/Linted_with-Oxlint-ff69b4.svg)](https://oxc.rs)

Live Website: [https://aitoriasdev.github.io](https://aitoriasdev.github.io)

---

## Tech Stack & Architecture

- **Framework:** [Astro v5](https://astro.build) (Static Site Generation with View Transitions)
- **Styling:** [Tailwind CSS v4](https://tailwindcss.com) using `@theme` design tokens
- **Architecture:** Atomic Design (`atoms` -> `molecules` -> `organisms`)
- **Tooling & Formatting:** High-performance linting and formatting via [`oxc`](https://oxc.rs) (`oxlint` & `oxfmt`)
- **Type Safety:** Strict TypeScript interfaces for configuration & components
- **Deployment:** GitHub Pages via automated GitHub Actions CI/CD pipeline

---

## Design Tokens & Palette

The site features a custom Japanese Pastel palette declared inside `src/styles/global.css`:

| Token | Light Mode | Dark Mode | Usage |
| :--- | :--- | :--- | :--- |
| `--color-bg-*` | `#FBF9F5` (Warm Cream) | `#16181D` (Ink Slate) | Page Backgrounds |
| `--color-surface-*` | `#F1ECE4` (Sand) | `#21252D` (Charcoal) | Cards, Modals & Drawers |
| `--color-border-*` | `#E2DAD0` (Muted Paper) | `#2E3440` (Muted Slate) | Submerged Card Highlights |
| `--color-accent-primary` | `#8A9A86` (Matcha) | `#8A9A86` (Matcha) | Primary Buttons & Active Filters |
| `--color-accent-secondary` | `#DDA7A5` (Sakura) | `#DDA7A5` (Sakura) | Subtext Accents & Badges |

---

## Project Structure

```text
.
├── public/                     # Favicons, manifest, robots.txt
├── src/
│   ├── assets/                 # Profile images & project screenshots
│   ├── config/                 # Type-safe configurations (tags, projects, nav)
│   ├── components/
│   │   ├── ui/                 # Atoms (Button, Badge, Icon, Link, Logo)
│   │   ├── header/             # NavMenu, ThemeToggle, MenuDrawer, ToggleButton
│   │   ├── hero/               # HeroSection, Avatar, StatusBadge
│   │   └── projects/           # Project management molecules & organisms
│   │       ├── project-card/   # Micro-molecules (Image, Header, Actions)
│   │       ├── ProjectFilters  # Responsive Tag Filter with Mobile Touch Scroll
│   │       └── ProjectsSection # Adaptive Auto-Grid Container
│   ├── layouts/
│   │   └── Layout.astro        # Anti-FOUC script & root HTML document
│   └── pages/
│       └── index.astro         # Portfolio homepage entrypoint
├── astro.config.mjs
└── package.json
