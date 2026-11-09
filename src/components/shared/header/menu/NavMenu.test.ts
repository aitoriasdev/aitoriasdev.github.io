import { describe, expect, it } from "vitest";
import { find, findAll, render } from "../../../../test/render";
import NavMenu from "./NavMenu.astro";

describe("NavMenu", () => {
  it("renders every navigation item with localized links", async () => {
    const html = await render(NavMenu, { path: "/es/" });

    expect(find(html, "nav")!.attrs["aria-label"]).toBe("Navegación principal");
    expect(findAll(html, "a").map((a) => [a.text, a.attrs.href])).toEqual([
      ["Proyectos", "/es/proyectos"],
      ["Contacto", "/es/#contact"],
    ]);
  });

  it("marks the current section, including its sub-pages", async () => {
    const html = await render(NavMenu, { path: "/projects/cdm-optimiser/" });
    const current = findAll(html, "a").filter(
      (a) => a.attrs["aria-current"] === "page",
    );

    expect(current.map((a) => a.text)).toEqual(["Projects"]);
  });
});
