import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";

const projects = defineCollection({
  loader: glob({ base: "src/content/projects", pattern: "**/*.{md,mdx}" }),
  schema: ({ image }) =>
    z.object({
      title: z.string().min(3, "Title must be at least 3 chars"),
      tagline: z.string().max(255, "Keep tagline under 255 chars"),
      completedDate: z.coerce.date(),
      techStack: z.array(z.string()),
      thumbnail: image().optional(),
      liveUrl: z.url().optional(),
      gitHubUrl: z.url().optional(),
      featured: z.boolean().default(false),
      lang: z.enum(["en", "es"]).default("en"),
    }),
});

export const collections = { projects };
