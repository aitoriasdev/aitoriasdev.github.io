# aitorias.is-a.dev

> My personal developer portfolio: a fast, accessible and bilingual (English/Spanish) static site built with Astro v7, Tailwind CSS v4 and TypeScript.

[![CI](https://github.com/aitoriasdev/aitoriasdev.github.io/actions/workflows/ci.yml/badge.svg)](https://github.com/aitoriasdev/aitoriasdev.github.io/actions/workflows/ci.yml)
[![Deploy to GitHub Pages](https://github.com/aitoriasdev/aitoriasdev.github.io/actions/workflows/astro.yml/badge.svg)](https://github.com/aitoriasdev/aitoriasdev.github.io/actions/workflows/astro.yml)
[![Built with Astro](https://img.shields.io/badge/Astro-v7-orange.svg)](https://astro.build)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-38bdf8.svg)](https://tailwindcss.com)
[![Code Quality](https://img.shields.io/badge/Linted_with-Oxlint-ff69b4.svg)](https://oxc.rs)

**Live website:** [https://aitorias.is-a.dev](https://aitorias.is-a.dev)

---

## Features

- **Project case studies.** Each project page has a status, role, timeline, key highlights, a screenshot gallery, a Markdown write-up and a call to action. All of it is driven by type-safe frontmatter.
- **Build-time GitHub data.** Project pages show the latest release and last update of their repository. The data is fetched once per build, and the page still renders if GitHub can't be reached.
- **Contact.** A "Let's work together" section with LinkedIn and GitHub links. The "Available for new opportunities" badge and the header both link to it.
- **Bilingual.** English and Spanish, with translated routes (`/projects` ↔ `/es/proyectos`) and a language picker that keeps you on the same page.
- **Project filters.** Generated from the technologies the projects actually use, with an empty state announced to screen readers.
- **SEO and social sharing:**
  - canonical URLs
  - `hreflang` alternates, including `x-default`
  - Open Graph and Twitter cards with per-page images
  - JSON-LD structured data (`WebSite` and `Person` on the home page, `SoftwareSourceCode` on project pages)
  - a sitemap and `robots.txt`
- **Bilingual 404 page.** A single `404.html` (GitHub Pages serves one for every unknown URL). It shows the Spanish copy first for `/es/` URLs.
- **Privacy-aware analytics.** Google Analytics 4 runs in a web worker through Partytown and uses Consent Mode behind a cookie banner. Custom click events come from `data-track-event` attributes, and are sent only after the visitor accepts.

---

## Tech Stack

| Area            | Choice                                                                                                                             |
| :-------------- | :--------------------------------------------------------------------------------------------------------------------------------- |
| Framework       | [Astro v7](https://astro.build): static output, Content Collections with the `glob` loader, `astro:assets`, `astro:env`, Fonts API |
| Language        | TypeScript (strict), type-checked with `astro check`                                                                               |
| Styling         | [Tailwind CSS v4](https://tailwindcss.com) with `@theme` design tokens and `@tailwindcss/typography` for Markdown content          |
| Content         | Markdown with frontmatter validated by Zod schemas (`src/content.config.ts`)                                                       |
| i18n            | Astro i18n routing, plus typed dictionaries and route helpers in `src/i18n/`                                                       |
| Analytics       | GA4 through `@astrojs/partytown` (with `dataLayer.push` and `gtag` forwarded to the main thread) and Consent Mode                  |
| Testing         | [Vitest](https://vitest.dev)                                                                                                       |
| Lint and format | [Oxlint and Oxfmt](https://oxc.rs), run on staged files by `lint-staged` and `simple-git-hooks`                                    |
| Package manager | [Yarn 4](https://yarnpkg.com): `node-modules` linker, with a 1-day minimum release age for packages                                |
| Hosting         | GitHub Pages through GitHub Actions, with a custom [is-a.dev](https://is-a.dev) sub-domain (`CNAME`)                               |

---

## Accessibility

The site targets WCAG 2.x AA and combines system-level settings with manual controls:

- **Accessibility menu.** Reduce motion, high contrast, larger text (the root font size becomes `112.5%`, so everything sized in `rem` scales) and the OpenDyslexic font, served locally through Astro's Fonts API.
- **No flash on load.** Theme and accessibility preferences are stored in `localStorage` and applied by an inline script in `<head>` before the first paint.
- **Reduced motion.** Respects `prefers-reduced-motion` as well as the manual toggle (`.reduce-motion`), which turns off transitions, hover zooms and animations.
- **Keyboard and screen readers:**
  - a skip link
  - a mobile drawer that traps focus and closes with Escape
  - one global `:focus-visible` outline in the accent colour (at least 6.8:1 in light mode and 9.1:1 in dark), so every focusable element, including links inside Markdown, has a visible focus ring
  - `aria-pressed` on toggle buttons, `aria-current` on the active navigation link
  - translated screen-reader text, such as "(opens in a new tab)"

---

## Development

Requires **Node.js 24+** and **Yarn 4**. The Yarn version is pinned in `package.json#packageManager`; run `corepack enable` once.

```sh
yarn install      # install dependencies (also installs the pre-commit hook)
yarn dev          # dev server at http://localhost:4321 (or `astro dev --background`)
yarn build        # production build into dist/
yarn preview      # preview the production build
yarn check        # type-check .astro and .ts files
yarn test         # unit tests (yarn test:watch for watch mode)
yarn lint         # oxlint
yarn fmt          # oxfmt (yarn fmt:check verifies formatting)
```

### Environment variables

Both are optional. Copy `.env.example` to `.env` to set them locally.

| Variable                   | Purpose                                                               |
| :------------------------- | :-------------------------------------------------------------------- |
| `PUBLIC_GA_MEASUREMENT_ID` | Enables Google Analytics 4 (production builds only).                  |
| `GITHUB_TOKEN`             | Raises the GitHub API rate limit for the build-time repository stats. |

Both are declared with `astro:env` in `astro.config.mjs`. In the deploy workflow they come from the repository variable and the built-in `GITHUB_TOKEN`.

---

## Adding a Project

Create `src/content/projects/<slug>.md` and its translation at `src/content/projects/es/<slug>.md` (with `lang: "es"`). The same `<slug>` is used for both URLs.

```yaml
---
title: "My Project"
tagline: "One sentence shown on the card and in meta descriptions (max 255 chars)."
status: "active" # "active" | "completed" (completed requires completedDate)
startDate: "2026-01-01"
completedDate: "2026-06-01" # optional while active
order: 1 # lower numbers are listed first; ties are sorted by date
role: "Front-end lead"
techStack: ["React", "TypeScript"] # also generates the project filters
thumbnail: "../../assets/images/projects/my-project.webp" # also used as the social preview image
gitHubUrl: "https://github.com/user/repo"
liveUrl: "https://example.com"
featured: true # shown on the home page
highlights:
  - "A key achievement."
screenshots:
  - src: "../../assets/images/projects/my-project-1.webp"
    alt: "Required alternative text."
    caption: "Optional caption."
team:
  - name: "Collaborator"
    url: "https://github.com/collaborator"
---
The Markdown case study goes here (styled with the typography plugin).
```

---

## Quality & CI

- **`ci.yml`** runs on every pull request and every push to `main`:
  1. `yarn install --immutable`
  2. format check
  3. Oxlint with warnings treated as errors
  4. `astro check`
  5. Vitest
  6. a production build
- **`astro.yml`** builds and deploys to GitHub Pages on every push to `main`.
- **`codeql.yml`** and **`dependency-review.yml`** handle security analysis and review new dependencies on pull requests.
- **Dependabot** sends weekly updates for npm packages (which covers Yarn) and GitHub Actions, with a 7-day cooldown.
- **Unit tests** cover:
  - the i18n route helpers: language detection, translated paths, round trips
  - that both dictionaries have the same keys
  - project sorting and slugs
  - GitHub URL parsing

---

## Design Tokens & Palette

A custom Japanese pastel palette, declared with `@theme` in `src/styles/global.css`. The high-contrast mode overrides the background, surface, border and text tokens.

`--color-accent-primary` is **theme-aware**: it switches to the light matcha under `.dark`, so `bg-accent-primary`, `text-accent-primary`, `outline-accent-primary` and so on need no `dark:` counterpart. All text and accent pairs meet WCAG AA (4.5:1 for text, 3:1 for focus rings and control boundaries).

| Token                      | Light                  | Dark                                | Usage                                               |
| :------------------------- | :--------------------- | :---------------------------------- | :-------------------------------------------------- |
| `--color-bg-*`             | `#FBF9F5` (warm cream) | `#121418` (ink slate)               | Page backgrounds                                    |
| `--color-surface-*`        | `#F1ECE4` (sand)       | `#1E222A` (charcoal)                | Cards, panels, drawers                              |
| `--color-border-*`         | `#E2DAD0` (paper)      | `#2E3440` (slate)                   | Borders and dividers                                |
| `--color-text-main-*`      | `#1F2228`              | `#F3F5F8`                           | Headings and body text                              |
| `--color-text-muted-*`     | `#4C535E`              | `#CBD5E1`                           | Secondary text                                      |
| `--color-accent-primary`   | `#2D5A27` (matcha)     | `#A4D09C` (light matcha), automatic | Primary buttons, links, focus rings, active filters |
| `--color-accent-secondary` | `#C87A78` (sakura)     | `#C87A78` (sakura)                  | Decorative accents, list markers                    |

---

## Project Structure

```text
.
├── .github/
│   ├── workflows/               # ci.yml, astro.yml (deploy), codeql.yml, dependency-review.yml
│   ├── dependabot.yml
│   └── pull_request_template.md
├── public/                      # CNAME, favicons
├── src/
│   ├── assets/
│   │   ├── fonts/               # OpenDyslexic (.otf)
│   │   └── images/              # Profile photo, default social card, project images
│   ├── components/
│   │   ├── contact/             # Contact section
│   │   ├── hero/                # Hero banner, photo and social links
│   │   ├── home/                # HomePage composition shared by / and /es
│   │   ├── projects/            # Projects grid, filters, cards and ProjectDetail
│   │   └── shared/              # Accessibility menu, cookie banner, header, footer, drawer, icons, links…
│   ├── config/                  # navigation.ts, social.ts
│   ├── content/projects/        # English case studies (*.md); translations in es/
│   ├── i18n/                    # ui.ts (dictionaries and types), utils.ts (+ tests)
│   ├── layouts/Layout.astro     # HTML shell: meta and SEO tags, pre-paint script, analytics
│   ├── pages/
│   │   ├── index.astro, projects/          # English routes
│   │   ├── es/index.astro, es/proyectos/   # Spanish routes
│   │   ├── 404.astro                       # Bilingual not-found page
│   │   └── robots.txt.ts
│   ├── styles/global.css        # Theme tokens, accessibility modes, prose theme
│   ├── utils/                   # Projects, GitHub stats, structured data, analytics (+ tests)
│   ├── content.config.ts        # Content collection schemas (Zod)
│   └── env.d.ts                 # Window typings (gtag, dataLayer)
├── .yarnrc.yml                  # Yarn settings
├── .oxfmtrc.json / .oxlintrc.json
├── astro.config.mjs             # Fonts, env schema, i18n, Partytown, sitemap, Tailwind
├── vitest.config.ts
├── AGENTS.md / CLAUDE.md        # Instructions for AI coding agents
└── package.json
```
