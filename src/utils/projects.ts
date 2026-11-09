import type { CollectionEntry } from "astro:content";

export type Project = CollectionEntry<"projects">;

/**
 * Content entry ids include the locale folder for translations
 * (`es/cdm-optimiser`), while URLs only use the last segment.
 */
export function getProjectSlug(project: Pick<Project, "id">): string {
  return project.id.split("/").pop() || project.id;
}

/** Most recently completed first. */
export function compareProjects(
  a: Pick<Project, "data">,
  b: Pick<Project, "data">,
): number {
  return b.data.completedDate.getTime() - a.data.completedDate.getTime();
}
