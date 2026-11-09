---
title: "CDM Optimiser"
tagline: "Web dashboard and Windows desktop app that helps Irish GP practices find patients who are eligible for the Chronic Disease Management programme but not yet enrolled."
status: "active"
startDate: "2025-11-20"
order: 1
role: "Front-end lead"
techStack: ["React", "TypeScript", "Tailwind", "Supabase", "TanStack Query", "Electron", "Vite", "Vitest", "Playwright"]
thumbnail: "../../assets/images/projects/cdm-optimiser.webp"
gitHubUrl: "https://github.com/CDM-Optimiser/cdm-optimiser"
liveUrl: "https://cdm-optimiser.netlify.app"
featured: true
highlights:
  - "One React codebase shipped to two targets: a web app on Netlify and a hardened, self-updating Electron app for clinics."
  - "Security and privacy by design for health data: strict CSP with Trusted Types, Row-Level Security, TOTP two-step sign-in and a build that fails if a secret could be bundled."
  - "Around 200 automated tests: unit tests, component tests in a real browser, Playwright end-to-end tests against a fake backend, and WCAG 2.2 AA accessibility checks in light and dark mode."
  - "Hands-off releases: one version bump builds the Windows installer, publishes a GitHub Release and updates the apps installed in clinics."
screenshots:
  - src: "../../assets/images/projects/cdm-optimiser-patients-list.webp"
    alt: "Patients list with a search box, status filters, live counts of accepted, refused and pending patients, and a paginated table of synthetic patients."
    caption: "Patients list: server-side pagination, search, status filters and live counts."
  - src: "../../assets/images/projects/cdm-optimiser-patient-card.webp"
    alt: "Patient information dialog showing contact details, conditions and switches to mark the patient as accepted or refused."
    caption: "Patient card: contact details, conditions and the accept/refuse workflow."
  - src: "../../assets/images/projects/cdm-optimiser-pending-patients.webp"
    alt: "Pending patients page showing one patient at a time with previous and next buttons."
    caption: "Pending patients: a focused, one-at-a-time view for working through the queue."
  - src: "../../assets/images/projects/cdm-optimiser-patients-list-dark.webp"
    alt: "The patients list in dark mode."
    caption: "Dark mode follows the operating system or the desktop app's theme menu."
---

## The problem

Ireland's **Chronic Disease Management (CDM) programme** funds GP practices to provide structured care for patients with asthma, diabetes, cardiovascular disease (CVD) and COPD. Many patients who qualify are never enrolled, because finding them means checking records by hand. That means missed care for patients and missed programme revenue for the practice.

## What it does

CDM Optimiser gives a practice's admin team a data-driven audit of the patients who are clinically eligible but not yet enrolled. It also gives them a simple workflow to contact those patients and record the outcome.

- **Patients list.** Server-side pagination; search by name, date of birth or GMS number; status filters; and live counts of accepted, refused and pending patients.
- **Pending patients.** A focused view that shows one patient at a time for working through the queue.
- **Patient card.** Contact details and conditions at a glance. The user marks the patient as accepted or refused, and the lists and counters refresh automatically.
- **Secure sign-in.** Email and password plus a code from an authenticator app (TOTP). Each user can register several authenticator apps.
- **Desktop app.** A Windows installer for clinics. The app updates itself from GitHub Releases and verifies every download.

> **Try it:** sign in to the [live demo](https://cdm-optimiser.netlify.app) with the demo account listed in the [repository README](https://github.com/CDM-Optimiser/cdm-optimiser#try-the-demo). Every patient in the demo is synthetic.

## My role

CDM Optimiser is a two-person project that I'm building with a friend. As **front-end lead** I own the client side end to end:

- the React architecture, the UI and accessibility
- the Electron desktop shell
- the test suites
- the CI/CD and release pipeline

## Architecture

The code lives in a **Yarn workspaces monorepo**:

- `apps/web`: a React 19 single-page app (Vite, React Router, TanStack Query, Tailwind CSS 4). It is organised by feature: `auth`, `patients`, `two-step`, `updates`, and so on.
- `apps/desktop`: an Electron app that ships the same web build.
- `packages/ui`: a shared React component library.
- `packages/desktop-bridge`: a typed contract for messages between the desktop shell and the web app.

The backend is **Supabase**. Patient data can only be reached through Postgres functions scoped to the user's practice, and **Row-Level Security** is the security boundary. On the client, TanStack Query owns server state. Query keys come from a single factory, so one invalidation after a status change refreshes both the lists and the counters.

## Engineering highlights

### One codebase, two targets

The desktop app doesn't load the web build from `file://`. Instead, it serves it over a custom privileged `app://` protocol. That way client-side routing works exactly as it does on the web, and the sign-in session has a stable origin. The code that resolves files for that protocol has tests against path-traversal attacks.

### Security and privacy for health data

- A custom Vite plugin injects a strict **Content Security Policy with Trusted Types**. The web host and the desktop app use the same policy.
- The **build fails** if the Supabase URL isn't HTTPS or if a secret key could end up in the bundle.
- **Electron is hardened:**
  - sandboxing and context isolation
  - no Node.js in the renderer
  - validated messages between processes
  - Electron fuses, including ASAR integrity checks
- **Searches never go in a URL.** A search can contain a patient's name, so it is sent in the request body, where it can't end up in server logs. The app clears its cache on sign-out and has no analytics or third-party scripts.

### Testing

- Unit tests with **Vitest**, plus component tests that run in a real Chromium browser (Vitest browser mode).
- **Playwright** end-to-end tests against a fake Supabase backend. Each test also checks that no request went to any other origin.
- **Automated accessibility checks** (axe, WCAG 2.2 AA) on every page in light and dark mode.
- Layout tests that make sure no page scrolls sideways, at sizes from phone to desktop.

### CI/CD and releases

Every pull request runs:

1. a formatting check
2. a version-sync check
3. ESLint with zero warnings allowed
4. a TypeScript build
5. the unit and component tests
6. the production build
7. the end-to-end suite

Releasing takes a single version bump. CI builds the Windows installer and publishes a GitHub Release. The installed apps then update themselves after checking the SHA-512 hash.

## What I learned

The first prototype (late 2025) had a Python **FastAPI + SQLite** backend with encrypted columns, packaged with PyInstaller inside Electron. It worked, but every installation had to ship and maintain its own local server and database.

Moving to **Supabase** removed the local server entirely, and Row-Level Security now enforces data isolation. The desktop app became a thin, secure shell around the same web build. I then rebuilt the app as a typed monorepo through a series of small, focused pull requests. That showed me how much a strong test and release pipeline speeds up a small team.

## Status

Version **1.3.1** is live on the web and as a Windows desktop app. The next step is code-signing the Windows installer.
