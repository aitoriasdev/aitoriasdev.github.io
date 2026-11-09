import { getCollection } from "astro:content";
import type { Lang } from "../i18n/ui";
import { compareProjects, getProjectSlug } from "./projects";

interface GetProjectsOptions {
  featuredOnly?: boolean;
}

/** Projects for one locale, sorted for display. */
export async function getProjects(
  lang: Lang,
  { featuredOnly = false }: GetProjectsOptions = {},
) {
  const projects = await getCollection(
    "projects",
    ({ data }) => data.lang === lang && (!featuredOnly || data.featured),
  );

  return projects.sort(compareProjects);
}

/** Shared `getStaticPaths` implementation for the localized `[slug]` routes. */
export async function getProjectStaticPaths(lang: Lang) {
  const projects = await getProjects(lang);

  return projects.map((project) => ({
    params: { slug: getProjectSlug(project) },
    props: { project },
  }));
}
