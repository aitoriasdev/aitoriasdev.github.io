import type { ImageMetadata } from "astro";
import portfolioImg from "../assets/images/projects/portfolio.webp";
import { ALL_TAGS } from "./tags";

export interface Project {
  id: string;
  title: string;
  description: string;
  tags: string[];
  image?: ImageMetadata;
  githubUrl: string;
  liveUrl?: string;
  featured?: boolean;
}

export type ProjectTag = (typeof ALL_TAGS)[number];

export const PROJECTS: Project[] = [
  {
    id: "cdm-optimiser",
    title: "CDM Optimiser",
    description:
      "CDM Optimiser provides clinics with a data-driven CDM audit, identifying patients who are clinically eligible but not yet enrolled in the CDM programme.",
    tags: ["React", "TypeScript", "Tailwind"],
    githubUrl: "https://github.com/CDM-Optimiser/cdm-optimiser",
    liveUrl: "https://cdm-optimiser.netlify.app",
    featured: true,
  },
  {
    id: "aitorias-dev",
    title: "Aitorias.is-a.dev Portfolio",
    description:
      "My personal space on the web. I built this from scratch to showcase my work, experiments, and thoughts using Astro v5 and Tailwind CSS v4.",
    tags: ["Astro", "TypeScript", "Tailwind"],
    image: portfolioImg,
    githubUrl: "https://github.com/aitoriasdev/aitoriasdev.github.io",
    featured: true,
  },
];
