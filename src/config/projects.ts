import type { ImageMetadata } from 'astro';
import portfolioImg from '../assets/images/projects/portfolio.webp';
import { ALL_TAGS } from './tags';

export interface Project {
    id: string;
    title: string;
    description: string;
    tags: string[];
    image: ImageMetadata;
    githubUrl: string;
    liveUrl?: string;
    featured?: boolean;
}

export type ProjectTag = (typeof ALL_TAGS)[number];

export const PROJECTS: Project[] = [
    {
        id: 'aitorias-dev',
        title: 'Aitorias.dev Portfolio',
        description: 'My personal space on the web. I built this from scratch to showcase my work, experiments, and thoughts using Astro v5 and Tailwind CSS v4.',
        tags: ['Astro', 'TypeScript', 'Tailwind'],
        image: portfolioImg,
        githubUrl: 'https://github.com/aitoriasdev/aitoriasdev.github.io',
        featured: true,
    },
];
