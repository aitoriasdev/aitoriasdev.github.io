import type { CollectionEntry } from "astro:content";

export type Project = CollectionEntry<"projects">;

type SortableProject = {
  data: Pick<Project["data"], "order" | "startDate" | "completedDate">;
};

/**
 * Content entry ids include the locale folder for translations
 * (`es/cdm-optimiser`), while URLs only use the last segment.
 */
export function getProjectSlug(project: Pick<Project, "id">): string {
  return project.id.split("/").pop() || project.id;
}

function getSortDate({ data }: SortableProject): number {
  return (data.completedDate ?? data.startDate)?.getTime() ?? 0;
}

/** Explicit `order` first, then most recent (completed or started) first. */
export function compareProjects(
  a: SortableProject,
  b: SortableProject,
): number {
  return a.data.order - b.data.order || getSortDate(b) - getSortDate(a);
}
