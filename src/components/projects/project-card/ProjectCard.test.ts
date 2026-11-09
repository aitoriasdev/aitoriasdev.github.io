import { describe, expect, it } from "vitest";
import { find, findAll, render } from "../../../test/render";
import ProjectCard from "./ProjectCard.astro";

const project = (overrides: Record<string, unknown> = {}) => ({
  id: "es/demo-project",
  collection: "projects",
  data: {
    title: "Demo Project",
    tagline: "A short description.",
    author: "Aitor",
    status: "active",
    order: 1,
    techStack: ["React", "TypeScript"],
    featured: true,
    lang: "es",
    highlights: [],
    team: [],
    screenshots: [],
    gitHubUrl: "https://github.com/owner/demo",
    liveUrl: "https://demo.example.com",
    ...overrides,
  },
});

describe("ProjectCard", () => {
  it("links to the localized detail page using the slug, not the content id", async () => {
    const html = await render(ProjectCard, {
      props: { project: project() },
      path: "/es/",
    });
    const detailLinks = findAll(html, "a").filter(
      (a) => !a.attrs.href.startsWith("http"),
    );

    expect(detailLinks.length).toBeGreaterThan(0);
    for (const a of detailLinks)
      expect(a.attrs.href).toBe("/es/proyectos/demo-project");
  });

  it("exposes its tech stack for the filters and as a labelled list", async () => {
    const html = await render(ProjectCard, { props: { project: project() } });

    expect(JSON.parse(find(html, "article")!.attrs["data-tags"])).toEqual([
      "React",
      "TypeScript",
    ]);
    expect(find(html, "ul")!.attrs["aria-label"]).toBe("Technologies used");
    expect(findAll(html, "li").map((li) => li.text)).toEqual([
      "React",
      "TypeScript",
    ]);
  });

  it("renders GitHub and live demo actions with descriptive names and tracking", async () => {
    const links = findAll(
      await render(ProjectCard, { props: { project: project() } }),
      "a",
    );
    const github = links.find(
      (a) => a.attrs.href === "https://github.com/owner/demo",
    )!;
    const demo = links.find(
      (a) => a.attrs.href === "https://demo.example.com",
    )!;

    expect(github.text).toContain("repository for Demo Project");
    expect(github.attrs["data-track-event"]).toBe(
      "project_github_click_demo_project",
    );
    expect(demo.attrs["data-track-event"]).toBe(
      "project_demo_click_demo_project",
    );
  });

  it("omits actions without URLs and shows a placeholder without a thumbnail", async () => {
    const html = await render(ProjectCard, {
      props: { project: project({ gitHubUrl: undefined, liveUrl: undefined }) },
    });

    expect(
      findAll(html, "a").filter((a) => a.attrs.href.startsWith("http")),
    ).toHaveLength(0);
    expect(html).toContain("No preview available");
    expect(findAll(html, "img")).toHaveLength(0);
  });
});
