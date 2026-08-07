# aitorias.dev

> Personal developer portfolio and showcase built with Astro, Tailwind CSS v4, and TypeScript.

[![Deploy to GitHub Pages](https://github.com/aitoriasdev/aitoriasdev.github.io/actions/workflows/astro.yml/badge.svg)](https://github.com/aitoriasdev/aitoriasdev.github.io/actions/workflows/astro.yml)
[![Built with Astro](https://img.shields.io/badge/Astro-v5-orange.svg)](https://astro.build)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-38bdf8.svg)](https://tailwindcss.com)

Live Website: [https://aitoriasdev.github.io](https://aitoriasdev.github.io)

---

## Tech Stack & Highlights

- **Framework:** [Astro v5](https://astro.build) (Static Site Generation)
- **Styling:** [Tailwind CSS v4](https://tailwindcss.com) with `@theme` variables
- **Color Palette:** Custom Japanese Pastel Palette (Light / Dark mode ready)
- **Image Optimization:** Astro Assets Engine (`sharp`)
- **Type Safety:** TypeScript & Astro Content Collections
- **Deployment:** GitHub Pages via GitHub Actions CI/CD

---

## Design Tokens & Palette

The site uses a custom Japanese Pastel palette mapped inside `src/styles/global.css`:

| Token | Light Mode | Dark Mode | Usage |
| :--- | :--- | :--- | :--- |
| `--color-bg-*` | `#FBF9F5` (Warm Cream) | `#16181D` (Ink Slate) | Page Backgrounds |
| `--color-surface-*` | `#F1ECE4` (Sand) | `#21252D` (Charcoal) | Cards & Dropdowns |
| `--color-border-*` | `#E2DAD0` (Muted Paper) | `#2E3440` (Muted Slate) | Dividers & Borders |
| `--color-accent-primary` | `#8A9A86` (Matcha) | `#8A9A86` (Matcha) | Primary CTAs & Focus |
| `--color-accent-secondary` | `#DDA7A5` (Sakura) | `#DDA7A5` (Sakura) | Gradient Accents |

---

## Project Structure

```text
.
├── public/                 # Static assets (favicons, robots.txt)
├── src/
│   ├── assets/             # Optimized images (profile photos, project assets)
│   ├── components/         # Reusable Astro UI Components
│   │   ├── header/         # Navigation, Logo, ThemeToggle
│   │   ├── Hero.astro      # Intro section with dynamic CTAs
│   │   └── Footer.astro    # Site footer
│   ├── layouts/
│   │   └── Layout.astro# HTML Shell & Anti-FOUC Theme Script
│   ├── styles/
│   │   └── global.css      # Tailwind v4 directives & @theme palette
│   └── pages/
│       └── index.html      # Homepage entrypoint
├── astro.config.mjs        # Astro configuration
└── package.json
