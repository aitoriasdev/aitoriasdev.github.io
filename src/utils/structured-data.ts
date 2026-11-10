import { SOCIAL_LINKS } from "../config/social";
import type { Lang } from "../i18n/ui";
import type { Project } from "./projects";

const PERSON_NAME = "Aitor";
const SITE_NAME = "aitorias.is-a.dev";

/**
 * Absolute URL of a page in the same form as its canonical link: GitHub Pages
 * serves every page as a directory, so it always ends with a slash.
 */
export function canonicalUrl(path: string, site: URL) {
  return new URL(path.endsWith("/") ? path : `${path}/`, site);
}

/** A titled page, used for breadcrumb trails and item lists. */
export interface LinkedPage {
  name: string;
  url: URL;
}

/**
 * Breadcrumb trail, mirroring the visible breadcrumbs. Google can show it in
 * place of the raw URL in search results.
 */
export function breadcrumbSchema(trail: LinkedPage[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: trail.map((page, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: page.name,
      item: page.url.href,
    })),
  };
}

interface ProjectsPageSchemaOptions {
  page: LinkedPage;
  description: string;
  lang: Lang;
  site: URL;
  /** Case studies in the order the page shows them. */
  projects: LinkedPage[];
}

/** Projects listing: a collection page whose main entity is the list of case studies. */
export function projectsPageSchema({
  page,
  description,
  lang,
  site,
  projects,
}: ProjectsPageSchemaOptions) {
  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "@id": page.url.href,
    url: page.url.href,
    name: page.name,
    description,
    inLanguage: lang,
    isPartOf: {
      "@type": "WebSite",
      "@id": new URL("/#website", site).href,
      name: SITE_NAME,
      url: site.href,
    },
    mainEntity: {
      "@type": "ItemList",
      numberOfItems: projects.length,
      itemListElement: projects.map((project, index) => ({
        "@type": "ListItem",
        position: index + 1,
        name: project.name,
        url: project.url.href,
      })),
    },
  };
}

/** schema.org Person describing the site owner. */
export function personSchema(site: URL, jobTitle: string, imageUrl?: string) {
  return {
    "@type": "Person",
    "@id": new URL("/#person", site).href,
    name: PERSON_NAME,
    jobTitle,
    url: site.href,
    ...(imageUrl && { image: imageUrl }),
    sameAs: Object.values(SOCIAL_LINKS).map((link) => link.href),
  };
}

/** Home page graph: the website and its author. */
export function homeSchema(
  site: URL,
  lang: Lang,
  jobTitle: string,
  imageUrl?: string,
) {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": new URL("/#website", site).href,
        name: SITE_NAME,
        url: site.href,
        inLanguage: lang,
        author: { "@id": new URL("/#person", site).href },
      },
      personSchema(site, jobTitle, imageUrl),
    ],
  };
}

/** Project case study: the source code, its live app and its author. */
export function projectSchema(
  project: Project,
  pageUrl: URL,
  site: URL,
  jobTitle: string,
) {
  const { data } = project;

  return {
    "@context": "https://schema.org",
    "@type": "SoftwareSourceCode",
    name: data.title,
    description: data.tagline,
    url: pageUrl.href,
    inLanguage: data.lang,
    keywords: data.techStack.join(", "),
    ...(data.gitHubUrl && { codeRepository: data.gitHubUrl }),
    ...(data.liveUrl && {
      targetProduct: {
        "@type": "WebApplication",
        name: data.title,
        url: data.liveUrl,
      },
    }),
    ...(data.startDate && {
      dateCreated: data.startDate.toISOString().slice(0, 10),
    }),
    ...(data.completedDate && {
      dateModified: data.completedDate.toISOString().slice(0, 10),
    }),
    author: personSchema(site, jobTitle),
  };
}
