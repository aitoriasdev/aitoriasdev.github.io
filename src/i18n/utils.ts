import { getCollection, type CollectionEntry } from "astro:content";
import { defaultLang, routes, showDefaultLang, ui } from "./ui";

export function getLangFromUrl(url: URL) {
  const [, lang] = url.pathname.split("/");

  if (lang in ui) return lang as keyof typeof ui;

  return defaultLang;
}

export async function getProjectStaticPaths() {
  const projects = await getCollection("projects");

  // Filter for English entries only (or entries without language prefix)
  const enProjects = projects.filter(
    (p) => p.data.lang === "en" || !p.data.lang,
  );

  return enProjects.map((project: CollectionEntry<"projects">) => {
    // Strip folder prefix if project.id contains 'en/slug' or 'es/slug'
    const slug = project.id.includes("/")
      ? project.id.split("/").pop()
      : project.id;

    return {
      params: { slug },
      props: { project },
    };
  });
}

export function getRouteFromUrl(url: URL): string {
  const pathname = new URL(url).pathname;
  const parts = pathname.split("/").filter(Boolean);

  // Strip language prefix if present (e.g., ['es', 'proyectos', 'aitorias-dev'] -> ['proyectos', 'aitorias-dev'])
  if (parts[0] in ui) {
    parts.shift();
  }

  const path = parts.join("/");
  if (!path) return "";

  const currentLang = getLangFromUrl(url);

  // Translate the base route segment back to the English key if localized
  const baseRoute = parts[0];
  const restPath = parts.slice(1).join("/");

  const langRoutes = routes[currentLang as keyof typeof routes] || {};
  const englishBaseKey =
    Object.keys(langRoutes).find(
      (key) => langRoutes[key as keyof typeof langRoutes] === baseRoute,
    ) || baseRoute;

  return restPath ? `${englishBaseKey}/${restPath}` : englishBaseKey;
}

export function useTranslations(lang: keyof typeof ui) {
  const localizedUI: Record<string, string> = ui[lang];

  return function t(key: keyof (typeof ui)[typeof defaultLang]) {
    return key in localizedUI ? localizedUI[key] : ui[defaultLang][key];
  };
}

export function useTranslatedPath(lang: keyof typeof ui) {
  return function translatePath(path: string, l: string = lang) {
    const parts = path.split("/").filter(Boolean);

    if (parts.length === 0) {
      return !showDefaultLang && l === defaultLang ? "/" : `/${l}`;
    }

    const baseRoute = parts[0];
    const restPath = parts.slice(1).join("/");

    const routeMap = routes[l as keyof typeof routes] as
      | Record<string, string>
      | undefined;
    const translatedBase = routeMap?.[baseRoute] || baseRoute;

    const fullPath = restPath
      ? `/${translatedBase}/${restPath}`
      : `/${translatedBase}`;

    return !showDefaultLang && l === defaultLang
      ? fullPath
      : `/${l}${fullPath}`;
  };
}
