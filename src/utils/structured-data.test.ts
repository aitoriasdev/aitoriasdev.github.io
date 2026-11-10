import { describe, expect, it } from "vitest";
import { SOCIAL_LINKS } from "../config/social";
import type { Project } from "./projects";
import {
  breadcrumbSchema,
  canonicalUrl,
  homeSchema,
  personSchema,
  projectSchema,
  projectsPageSchema,
} from "./structured-data";

const site = new URL("https://aitorias.is-a.dev");

describe("personSchema", () => {
  it("describes the owner with a stable @id and social profiles", () => {
    const person = personSchema(
      site,
      "Front-End Developer",
      "https://aitorias.is-a.dev/me.jpg",
    );

    expect(person).toMatchObject({
      "@type": "Person",
      "@id": "https://aitorias.is-a.dev/#person",
      jobTitle: "Front-End Developer",
      image: "https://aitorias.is-a.dev/me.jpg",
    });
    expect(person.sameAs).toEqual([
      SOCIAL_LINKS.github.href,
      SOCIAL_LINKS.linkedin.href,
    ]);
  });

  it("omits the image when none is given", () => {
    expect(personSchema(site, "Dev")).not.toHaveProperty("image");
  });
});

describe("homeSchema", () => {
  it("links the WebSite to its author through @id", () => {
    const { "@graph": graph } = homeSchema(site, "es", "Desarrollador");
    const [website, person] = graph;

    expect(website).toMatchObject({
      "@type": "WebSite",
      inLanguage: "es",
      author: { "@id": person["@id"] },
    });
  });

  it("is valid JSON", () => {
    expect(() =>
      JSON.parse(JSON.stringify(homeSchema(site, "en", "Dev"))),
    ).not.toThrow();
  });
});

describe("projectSchema", () => {
  const project = (data: Partial<Project["data"]>) =>
    ({
      id: "cdm-optimiser",
      data: {
        title: "CDM Optimiser",
        tagline: "Tagline",
        lang: "en",
        techStack: ["React", "Supabase"],
        ...data,
      },
    }) as Project;
  const pageUrl = new URL("/projects/cdm-optimiser/", site);

  it("describes the source code, the live app and the dates", () => {
    const schema = projectSchema(
      project({
        gitHubUrl: "https://github.com/o/r",
        liveUrl: "https://app.example.com",
        startDate: new Date("2025-11-20"),
      }),
      pageUrl,
      site,
      "Dev",
    );

    expect(schema).toMatchObject({
      "@context": "https://schema.org",
      "@type": "SoftwareSourceCode",
      name: "CDM Optimiser",
      url: "https://aitorias.is-a.dev/projects/cdm-optimiser/",
      keywords: "React, Supabase",
      codeRepository: "https://github.com/o/r",
      targetProduct: {
        "@type": "WebApplication",
        url: "https://app.example.com",
      },
      dateCreated: "2025-11-20",
    });
    expect(schema.author["@type"]).toBe("Person");
  });

  it("leaves out optional fields that are missing", () => {
    const schema = projectSchema(project({}), pageUrl, site, "Dev");

    for (const key of [
      "codeRepository",
      "targetProduct",
      "dateCreated",
      "dateModified",
    ])
      expect(schema).not.toHaveProperty(key);
  });
});

describe("canonicalUrl", () => {
  it("always ends with a slash, like the canonical links", () => {
    expect(canonicalUrl("/es", site).href).toBe(
      "https://aitorias.is-a.dev/es/",
    );
    expect(canonicalUrl("/projects/", site).href).toBe(
      "https://aitorias.is-a.dev/projects/",
    );
    expect(canonicalUrl("/", site).href).toBe("https://aitorias.is-a.dev/");
  });
});

describe("breadcrumbSchema", () => {
  it("numbers the trail from 1 in the order given", () => {
    const schema = breadcrumbSchema([
      { name: "Home", url: canonicalUrl("/", site) },
      { name: "Projects", url: canonicalUrl("/projects", site) },
    ]);

    expect(schema).toEqual({
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: "Home",
          item: "https://aitorias.is-a.dev/",
        },
        {
          "@type": "ListItem",
          position: 2,
          name: "Projects",
          item: "https://aitorias.is-a.dev/projects/",
        },
      ],
    });
  });
});

describe("projectsPageSchema", () => {
  const schema = projectsPageSchema({
    page: { name: "Proyectos", url: canonicalUrl("/es/proyectos", site) },
    description: "Trabajo seleccionado",
    lang: "es",
    site,
    projects: [
      { name: "B", url: canonicalUrl("/es/proyectos/b", site) },
      { name: "A", url: canonicalUrl("/es/proyectos/a", site) },
    ],
  });

  it("describes the page and links it to the website node", () => {
    expect(schema).toMatchObject({
      "@type": "CollectionPage",
      "@id": "https://aitorias.is-a.dev/es/proyectos/",
      name: "Proyectos",
      inLanguage: "es",
      isPartOf: { "@id": "https://aitorias.is-a.dev/#website" },
    });
    expect(schema.isPartOf["@id"]).toBe(
      homeSchema(site, "es", "x")["@graph"][0]["@id"],
    );
  });

  it("lists the case studies in display order", () => {
    expect(schema.mainEntity.numberOfItems).toBe(2);
    expect(schema.mainEntity.itemListElement).toEqual([
      {
        "@type": "ListItem",
        position: 1,
        name: "B",
        url: "https://aitorias.is-a.dev/es/proyectos/b/",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "A",
        url: "https://aitorias.is-a.dev/es/proyectos/a/",
      },
    ]);
  });
});
