import { describe, expect, it } from "vitest";
import { ui } from "./ui";
import {
  getLangFromUrl,
  getRouteFromUrl,
  isUIKey,
  useTranslatedPath,
  useTranslations,
} from "./utils";

const url = (path: string) => new URL(path, "https://aitorias.is-a.dev");

describe("getLangFromUrl", () => {
  it.each([
    ["/", "en"],
    ["/projects/cdm-optimiser", "en"],
    ["/es", "es"],
    ["/es/proyectos/cdm-optimiser", "es"],
    ["/fr/whatever", "en"],
  ])("%s -> %s", (path, lang) => {
    expect(getLangFromUrl(url(path))).toBe(lang);
  });
});

describe("getRouteFromUrl", () => {
  it.each([
    ["/", ""],
    ["/es", ""],
    ["/es/", ""],
    ["/projects", "projects"],
    ["/projects/", "projects"],
    ["/projects/cdm-optimiser", "projects/cdm-optimiser"],
    ["/es/proyectos", "projects"],
    ["/es/proyectos/cdm-optimiser", "projects/cdm-optimiser"],
    ["/es/unknown/page", "unknown/page"],
  ])("%s -> %s", (path, route) => {
    expect(getRouteFromUrl(url(path))).toBe(route);
  });
});

describe("useTranslatedPath", () => {
  const en = useTranslatedPath("en");
  const es = useTranslatedPath("es");

  it("keeps the default locale unprefixed", () => {
    expect(en("/")).toBe("/");
    expect(en("/projects")).toBe("/projects");
    expect(en("/projects/cdm-optimiser")).toBe("/projects/cdm-optimiser");
  });

  it("prefixes and translates the base route for other locales", () => {
    expect(es("/")).toBe("/es");
    expect(es("/projects")).toBe("/es/proyectos");
    expect(es("/projects/cdm-optimiser")).toBe("/es/proyectos/cdm-optimiser");
  });

  it("allows overriding the target locale (language picker)", () => {
    expect(es("projects/cdm-optimiser", "en")).toBe("/projects/cdm-optimiser");
    expect(en("projects", "es")).toBe("/es/proyectos");
  });

  it("round-trips with getRouteFromUrl", () => {
    for (const path of ["/es/proyectos", "/es/proyectos/cdm-optimiser"]) {
      expect(es(getRouteFromUrl(url(path)))).toBe(path);
    }
  });

  it("leaves unknown routes untranslated", () => {
    expect(es("/unknown")).toBe("/es/unknown");
  });
});

describe("useTranslations", () => {
  it("returns the localized string", () => {
    expect(useTranslations("es")("nav.projects")).toBe("Proyectos");
    expect(useTranslations("en")("nav.projects")).toBe("Projects");
  });
});

describe("isUIKey", () => {
  it("narrows known keys only", () => {
    expect(isUIKey("nav.projects")).toBe(true);
    expect(isUIKey("nav.cdm-optimiser")).toBe(false);
  });
});

describe("ui dictionary", () => {
  it("has the same keys in every locale", () => {
    const enKeys = Object.keys(ui.en).sort();

    for (const [lang, dict] of Object.entries(ui)) {
      expect(Object.keys(dict).sort(), `locale "${lang}"`).toEqual(enKeys);
    }
  });

  it("has no empty strings", () => {
    for (const dict of Object.values(ui)) {
      for (const value of Object.values(dict)) {
        expect(value.trim()).not.toBe("");
      }
    }
  });
});
