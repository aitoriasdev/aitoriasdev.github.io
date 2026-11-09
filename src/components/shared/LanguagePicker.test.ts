import { describe, expect, it } from "vitest";
import { find, findAll, openTags, render } from "../../test/render";
import LanguagePicker from "./LanguagePicker.astro";

const options = (html: string) =>
  Object.fromEntries(
    findAll(html, "a")
      .filter((a) => a.attrs.role === "menuitem")
      .map((a) => [a.text, a.attrs.href]),
  );

describe("LanguagePicker", () => {
  it("links to the same page in every language", async () => {
    const html = await render(LanguagePicker, {
      path: "/projects/cdm-optimiser/",
    });

    expect(options(html)).toEqual({
      English: "/projects/cdm-optimiser",
      Spanish: "/es/proyectos/cdm-optimiser",
    });
  });

  it("translates labels and routes back from Spanish pages", async () => {
    const html = await render(LanguagePicker, { path: "/es/proyectos/" });

    expect(find(html, "button")!.text).toBe("Español");
    expect(options(html)).toEqual({
      Inglés: "/projects",
      Español: "/es/proyectos",
    });
  });

  it("starts collapsed for assistive technology", async () => {
    const html = await render(LanguagePicker);

    expect(find(html, "button")!.attrs["aria-expanded"]).toBe("false");
    expect(openTags(html, "div").find((d) => d.role === "menu")?.class).toMatch(
      /\bhidden\b/,
    );
  });
});
