import {
  defaultLang,
  routes,
  showDefaultLang,
  ui,
  type Lang,
  type UIKey,
} from "./ui";

export function getLangFromUrl(url: URL) {
  const [, lang] = url.pathname.split("/");

  if (lang in ui) return lang as Lang;

  return defaultLang;
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

export function isUIKey(key: string): key is UIKey {
  return key in ui[defaultLang];
}

export function useTranslations(lang: Lang) {
  const localizedUI: Partial<Record<UIKey, string>> = ui[lang];

  return function t(key: UIKey): string {
    return localizedUI[key] ?? ui[defaultLang][key];
  };
}

export function useTranslatedPath(lang: Lang) {
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

/** e.g. "Nov 2025" / "nov 2025" */
export function formatMonthYear(date: Date, lang: Lang): string {
  return new Intl.DateTimeFormat(lang, {
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  }).format(date);
}
