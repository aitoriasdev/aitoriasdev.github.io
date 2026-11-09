import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";

const projects = defineCollection({
  loader: glob({ base: "src/content/projects", pattern: "**/*.{md,mdx}" }),
  schema: ({ image }) =>
    z
      .object({
        title: z.string().min(3, "Title must be at least 3 chars"),
        tagline: z.string().max(255, "Keep tagline under 255 chars"),
        author: z.string().default("Aitor"),
        /** `active` = still being developed; `completed` requires `completedDate`. */
        status: z.enum(["active", "completed"]).default("completed"),
        startDate: z.coerce.date().optional(),
        completedDate: z.coerce.date().optional(),
        /** Lower numbers are listed first; ties are sorted by date. */
        order: z.number().int().default(100),
        role: z.string().optional(),
        techStack: z.array(z.string()),
        thumbnail: image().optional(),
        liveUrl: z.url().optional(),
        gitHubUrl: z.url().optional(),
        featured: z.boolean().default(false),
        lang: z.enum(["en", "es"]).default("en"),
        highlights: z.array(z.string()).default([]),
        team: z
          .array(z.object({ name: z.string(), url: z.url().optional() }))
          .default([]),
        screenshots: z
          .array(
            z.object({
              src: image(),
              alt: z.string().min(1, "Screenshots need alt text"),
              caption: z.string().optional(),
            }),
          )
          .default([]),
      })
      .refine((data) => data.status !== "completed" || data.completedDate, {
        message: "Completed projects need a completedDate",
        path: ["completedDate"],
      }),
});

export const collections = { projects };
