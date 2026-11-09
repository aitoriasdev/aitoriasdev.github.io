---
title: "Aitorias.is-a.dev Portfolio"
tagline: "My personal space on the web: a fast, accessible and bilingual static site built with Astro v7 and Tailwind CSS v4."
status: "active"
startDate: "2026-02-01"
order: 2
role: "Design & development"
techStack: ["Astro", "TypeScript", "Tailwind"]
thumbnail: "../../assets/images/projects/aitoriasdev-portfolio.webp"
gitHubUrl: "https://github.com/aitoriasdev/aitoriasdev.github.io"
liveUrl: "https://aitorias.is-a.dev"
featured: true
highlights:
  - "Accessibility first: a built-in accessibility menu (reduced motion, high contrast, larger text, dyslexia-friendly font), applied before the first paint so the page never flashes."
  - "Fully bilingual, with translated routes (/projects ↔ /es/proyectos) and a typed translation dictionary that a test keeps in sync across languages."
  - "Performance-minded: a static build, responsive images and Google Analytics moved off the main thread with Partytown, behind a consent banner."
  - "Production-grade tooling: type-checked content collections, Oxlint and Oxfmt, Vitest, astro check, CodeQL and Dependabot, deployed through GitHub Actions."
---

## Overview

This site is where I show my work. I built it from scratch, without a template, as a playground for the practices I care about most as a front-end developer: accessibility, performance, clean architecture and good tooling.

## Accessibility

- An **accessibility menu** lets visitors reduce motion, increase contrast, enlarge text or switch to the OpenDyslexic font. Their preferences are stored locally and applied by a tiny inline script before the first paint.
- The site also respects the operating system's `prefers-reduced-motion` and `prefers-color-scheme` settings, alongside a manual light, dark or system theme toggle.
- It has a skip link, a focus-trapped mobile menu that closes with Escape, visible focus styles, and screen-reader text for links that open in a new tab.

## Internationalisation

All content is available in English and Spanish, and the routes are translated too. A few small, tested helpers translate any path between languages, so the language picker always keeps you on the same page. The translation dictionary is typed, and a unit test fails if a key is missing in either language.

## Content & architecture

Projects are Markdown files in an Astro **content collection** validated by a Zod schema, which covers status, dates, role, highlights and screenshots. A single `ProjectDetail` component renders every case study in both languages. The filters on the projects grid are generated from the technologies the projects actually use.

## Performance & privacy

The site is fully static. Images are converted to WebP at several sizes and served responsively. Google Analytics 4 runs inside a web worker via Partytown, and uses Consent Mode: no analytics cookies are set, and no custom events are sent, until the visitor accepts.

## Tooling & CI

- Oxlint and Oxfmt for linting and formatting.
- `astro check` for type-checking `.astro` files.
- Vitest for unit tests.
- A pre-commit hook through lint-staged.
- On GitHub, every pull request runs the full pipeline, alongside CodeQL, dependency review and Dependabot. Merges to `main` deploy automatically to GitHub Pages.
