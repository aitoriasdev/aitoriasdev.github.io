import { readFile, readdir } from "node:fs/promises";
import { describe, expect, it } from "vitest";
import {
  FILTER_PARENT,
  NOT_A_FILTER,
  filterOptions,
  filterTechs,
} from "./tech-filters";

/** `techStack` of every published project (en and es), read from the real frontmatter. */
async function publishedStacks() {
  const dir = new URL("../content/projects/", import.meta.url);
  const files = (await readdir(dir, { recursive: true })).filter((file) =>
    file.endsWith(".md"),
  );

  return Promise.all(
    files.map(async (file) => {
      const source = await readFile(new URL(file, dir), "utf8");
      const stack = /^techStack:\s*(\[.*\])$/m.exec(source)?.[1];
      if (!stack)
        throw new Error(`${file}: expected a one-line techStack array`);
      return { file, techStack: JSON.parse(stack) as string[] };
    }),
  );
}

describe("filterTechs", () => {
  it("folds platform add-ons into their platform", () => {
    expect(
      filterTechs(["Shopify", "Liquid", "WordPress", "WooCommerce"]),
    ).toEqual(["Shopify", "WordPress"]);
  });

  it("keeps the platform even when only its add-on is listed", () => {
    expect(filterTechs(["Liquid"])).toEqual(["Shopify"]);
    expect(filterTechs(["TanStack Query", "React"])).toEqual(["React"]);
  });

  it("drops generic languages and tooling, keeping the original order", () => {
    expect(
      filterTechs([
        "React",
        "JavaScript",
        "Vite",
        "TypeScript",
        "CSS",
        "Vitest",
        "Playwright",
      ]),
    ).toEqual(["React", "TypeScript"]);
  });
});

describe("filterOptions", () => {
  it("puts shared technologies first, then sorts alphabetically", () => {
    expect(
      filterOptions([
        ["React", "TypeScript", "Tailwind"],
        ["Astro", "TypeScript", "Tailwind"],
        ["Shopify", "Liquid"],
      ]),
    ).toEqual(["Tailwind", "TypeScript", "Astro", "React", "Shopify"]);
  });
});

describe("the published projects", () => {
  it("never offer an add-on, generic language or tool as a filter", async () => {
    const projects = await publishedStacks();
    const options = filterOptions(projects.map((p) => p.techStack));

    expect(options.length).toBeGreaterThan(0);
    for (const tech of options) {
      expect(FILTER_PARENT).not.toHaveProperty(tech);
      expect(NOT_A_FILTER.has(tech), tech).toBe(false);
    }
  });

  it("show at most five badges on a card, so cards stay compact", async () => {
    const projects = await publishedStacks();

    expect(projects.length).toBeGreaterThan(0);
    for (const { file, techStack } of projects) {
      expect(filterTechs(techStack).length, file).toBeLessThanOrEqual(5);
    }
  });
});
