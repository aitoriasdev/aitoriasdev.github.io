// src/config/techStack.ts
export const TECH_STACK = [
  "Astro",
  "TypeScript",
  "Tailwind",
  "React",
  "Node.js",
] as const;

export type Tech = (typeof TECH_STACK)[number];
