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

- **Project case studies.** Personal, open-source and client work, such as an e-commerce store built for a Spanish sportswear brand. Each project page has a status, role, timeline, key highlights, a screenshot gallery, a Markdown write-up and a call to action. All of it is driven by type-safe frontmatter.
- **Image viewer.** Clicking a screenshot opens it enlarged over a dark backdrop instead of leaving the site. You can browse the gallery with the arrow buttons, the arrow keys or a swipe, and close it with Escape, the close button or a click outside the image. It's built on the native `<dialog>` element, and without JavaScript the images are still plain links to the full-size file.
- **Build-time GitHub data.** Project pages show the latest release and last update of their repository. The data is fetched once per build, and the page still renders if GitHub can't be reached.
- **Contact.** A "Let's work together" section with LinkedIn and GitHub links. The "Available for new opportunities" badge and the header both link to it.
- **Bilingual.** English and Spanish, with translated routes (`/projects` ↔ `/es/proyectos`) and a language picker that keeps you on the same page.
- **Project filters.** Generated from the headline technologies the projects actually use (rules in `src/config/tech-filters.ts`: add-ons such as Liquid or WooCommerce fold into Shopify or WordPress, and generic languages and tooling aren't offered). Filtering is animated with the View Transitions API: cards slide to their new place, fade out or grow in. The sticky header and the fixed overlays (cookie banner, accessibility button) have their own transition layers, lifted above the cards in `global.css`. The empty state is announced to screen readers.
- **Compact project cards.** Title, a three-line teaser and the same headline technologies as the filters. The full stack and description are on each case-study page.
- **SEO and social sharing:**
  - canonical URLs
  - `hreflang` alternates, including `x-default`
  - Open Graph and Twitter cards with per-page images
  - JSON-LD structured data on every page: `WebSite` and `Person` on the home page, a `CollectionPage` listing the case studies on the projects page, `SoftwareSourceCode` on project pages, and a `BreadcrumbList` matching the visible breadcrumbs
  - a sitemap and `robots.txt`
- **Bilingual 404 page.** A single `404.html` (GitHub Pages serves one for every unknown URL). It shows the Spanish copy first for `/es/` URLs.
- **Privacy-aware analytics.** Google Analytics 4 runs in a web worker through Partytown and uses Consent Mode behind a cookie banner. Custom click events come from `data-track-event` attributes, and are sent only after the visitor accepts.

---

## Tech Stack

| Area            | Choice                                                                                                                                                                        |
| :-------------- | :---------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Framework       | [Astro v7](https://astro.build): static output, Content Collections with the `glob` loader, `astro:assets`, `astro:env`, Fonts API                                            |
| Language        | TypeScript (strict), type-checked with `astro check`                                                                                                                          |
| Styling         | [Tailwind CSS v4](https://tailwindcss.com) with `@theme` design tokens and `@tailwindcss/typography` for Markdown content                                                     |
| Content         | Markdown with frontmatter validated by Zod schemas (`src/content.config.ts`)                                                                                                  |
| i18n            | Astro i18n routing, plus typed dictionaries and route helpers in `src/i18n/`                                                                                                  |
| Analytics       | GA4 through `@astrojs/partytown` (with `dataLayer.push` and `gtag` forwarded to the main thread) and Consent Mode                                                             |
| Testing         | [Vitest](https://vitest.dev) (unit and component tests with the Astro Container API), [Playwright](https://playwright.dev) with axe-core (end-to-end and accessibility tests) |
| Lint and format | [Oxlint and Oxfmt](https://oxc.rs), run on staged files by `lint-staged` and `simple-git-hooks`                                                                               |
| Package manager | [Yarn 4](https://yarnpkg.com): `node-modules` linker, with a 1-day minimum release age for packages                                                                           |
| Hosting         | GitHub Pages through GitHub Actions, with a custom [is-a.dev](https://is-a.dev) sub-domain (`CNAME`)                                                                          |

---

## Accessibility

The site targets WCAG 2.x AA and combines system-level settings with manual controls:

- **Accessibility menu.** Reduce motion, high contrast, larger text (the root font size becomes `112.5%`, so everything sized in `rem` scales) and the OpenDyslexic font, served locally through Astro's Fonts API.
- **No flash on load.** Theme and accessibility preferences are stored in `localStorage` and applied by an inline script in `<head>` before the first paint.
- **Reduced motion.** Respects `prefers-reduced-motion` as well as the manual toggle (`.reduce-motion`), which turns off transitions, hover zooms and animations, including the project-filter animation.
- **Keyboard and screen readers:**
  - a skip link
  - a mobile drawer that traps focus and closes with Escape
  - an image viewer (a modal `<dialog>`) that keeps focus inside, closes with Escape, returns focus to the image that opened it and announces "Image 2 of 4" as you browse
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
yarn test         # unit + component tests (yarn test:watch for watch mode)
yarn test:e2e     # Playwright end-to-end + accessibility tests (run yarn build first)
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
techStack: ["React", "TypeScript", "Vite"] # full stack, shown on the project page; cards and filters show headline techs only (see src/config/tech-filters.ts)
thumbnail: "../../assets/images/projects/my-project.webp" # also used as the social preview image
gitHubUrl: "https://github.com/user/repo" # optional, e.g. omit it for client work
liveUrl: "https://example.com"
liveLabel: "demo" # button text: "demo" (Live demo) or "site" (Visit site) for a real client website
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

- **`ci.yml`** runs two jobs on every pull request and every push to `main` (pushes that only change root Markdown files are skipped):
  - **verify:** `yarn install --immutable` → format check → Oxlint with warnings treated as errors → `astro check` → Vitest → production build
  - **e2e:** production build → Playwright tests in Chromium, with the browser cached between runs. The HTML report is uploaded when a test fails.
- **Branch protection.** A ruleset on `main` requires a pull request, signed commits, CodeQL results and both CI jobs to pass before merging. PRs therefore have no path filters: a skipped required check never reports, so it would block the PR.
- **`astro.yml`** builds and deploys to GitHub Pages on every push to `main`.
- **`codeql.yml`** and **`dependency-review.yml`** handle security analysis and review new dependencies on pull requests.
- **Dependabot** sends weekly updates for npm packages (which covers Yarn) and GitHub Actions, with a 7-day cooldown.

---

## Testing

| Layer      | Tool                                | Where                               | What it covers                                                                                                                                                                                                     |
| :--------- | :---------------------------------- | :---------------------------------- | :----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Unit       | Vitest                              | `src/**/*.test.ts` next to the code | i18n routing and dictionary key parity, date formatting, project sorting and slugs, JSON-LD builders, consent-gated analytics, the GitHub stats fetch (mocked: success, missing release, offline, per-build cache) |
| Component  | Vitest + Astro Container API        | `src/components/**/*.test.ts`       | Components rendered to HTML in English and Spanish: links (new-tab safety, screen-reader hints), breadcrumbs, language picker, navigation, toggle, badge, contact section, project card                            |
| End-to-end | Playwright + `@axe-core/playwright` | `e2e/*.spec.ts`                     | See below                                                                                                                                                                                                          |

The end-to-end tests run against the production build and cover:

- **Accessibility:**
  - axe WCAG 2.0, 2.1 and 2.2 A/AA rules on every page, in light, dark and both high-contrast modes, with the cookie banner, accessibility panel, mobile menu and image viewer open
  - a visible focus outline of at least 3:1 on every tab stop
  - reflow at 320px
  - the cookie banner never covering the accessibility button
- **Pages:** status codes, one `<h1>`, canonical, Open Graph, hreflang and JSON-LD; structured breadcrumbs that match the visible ones; a projects list whose structured data links to every case study; the bilingual 404 page
- **Interactions:**
  - the language switch keeps you on the same page
  - project cards, project filters and contact links work, and the card buttons never break their labels across lines (desktop, tablet and phone)
  - filters list only headline technologies, cards stay compact, and filtering animates with a view transition except when reduced motion is requested, passing underneath the header, cookie banner and accessibility button
  - theme and accessibility preferences persist and apply before the first paint
  - the mobile menu traps focus and closes with Escape
  - the image viewer opens in place, browses with buttons, keys and swipes, closes three ways and returns focus, while Ctrl/Cmd-click still opens a new tab
  - the cookie banner records consent and can be reopened

`src/test/render.ts` holds the shared render helper for component tests. `e2e/fixtures.ts` holds the shared Playwright helpers: stored preferences, axe scans and focus-contrast measurement.

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
│   │   ├── projects/            # Projects grid, filters, cards, ProjectsPage and ProjectDetail
│   │   └── shared/              # Accessibility menu, cookie banner, image viewer, header, footer, drawer, icons, links…
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
│   ├── test/                    # Component-test render helper (Astro Container API)
│   ├── utils/                   # Projects, GitHub stats, structured data, analytics (+ tests)
│   ├── content.config.ts        # Content collection schemas (Zod)
│   └── env.d.ts                 # Window typings (gtag, dataLayer)
├── e2e/                         # Playwright end-to-end + accessibility tests
├── .yarnrc.yml                  # Yarn settings
├── .oxfmtrc.json / .oxlintrc.json
├── astro.config.mjs             # Fonts, env schema, i18n, Partytown, sitemap, Tailwind
├── playwright.config.ts         # Runs e2e/ against `astro preview`
├── vitest.config.ts
├── AGENTS.md / CLAUDE.md        # Instructions for AI coding agents
└── package.json
```
