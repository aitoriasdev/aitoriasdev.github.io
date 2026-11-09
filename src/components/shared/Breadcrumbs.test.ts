import { describe, expect, it } from "vitest";
import { find, findAll, render } from "../../test/render";
import Breadcrumbs from "./Breadcrumbs.astro";

describe("Breadcrumbs", () => {
  it("renders nothing on the home page", async () => {
    const html = await render(Breadcrumbs, { path: "/" });

    expect(find(html, "nav")).toBeUndefined();
  });

  it("builds a localized trail from the URL and marks the current page", async () => {
    const html = await render(Breadcrumbs, { path: "/es/proyectos/" });
    const links = findAll(html, "a");

    expect(find(html, "nav")!.attrs["aria-label"]).toBe("Ruta de navegación");
    expect(
      findAll(html, "li").map((li) => li.text.replace("/", "").trim()),
    ).toEqual(["Inicio", "Proyectos"]);
    expect(links[0].attrs.href).toBe("/es");
    expect(links.find((a) => a.attrs["aria-current"] === "page")?.text).toBe(
      "Proyectos",
    );
  });

  it("uses custom crumbs when given", async () => {
    const html = await render(Breadcrumbs, {
      path: "/projects/cdm-optimiser/",
      props: {
        customCrumbs: [
          { label: "Projects", href: "/projects" },
          { label: "CDM Optimiser" },
        ],
      },
    });
    const links = findAll(html, "a");

    expect([links[0].text, links[0].attrs.href]).toEqual(["Home", "/"]);
    expect([links[1].text, links[1].attrs.href]).toEqual([
      "Projects",
      "/projects",
    ]);
    expect(links.find((a) => a.attrs["aria-current"] === "page")?.text).toBe(
      "CDM Optimiser",
    );
  });
});
