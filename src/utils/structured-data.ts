import { SOCIAL_LINKS } from "../config/social";
import type { Lang } from "../i18n/ui";
import type { Project } from "./projects";

const PERSON_NAME = "Aitor";

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
        name: "aitorias.is-a.dev",
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
