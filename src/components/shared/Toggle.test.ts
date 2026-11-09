import { describe, expect, it } from "vitest";
import { find, render } from "../../test/render";
import Toggle from "./Toggle.astro";

describe("Toggle", () => {
  it("is a labelled checkbox with a visible focus style", async () => {
    const html = await render(Toggle, {
      props: { id: "toggle-motion", label: "Reduce Motion" },
    });
    const input = find(html, "input")!;

    expect(input.attrs.type).toBe("checkbox");
    expect(find(html, "label")!.attrs.for).toBe("toggle-motion");
    expect(input.attrs["aria-label"]).toBe("Use Reduce Motion");
    expect(input.attrs.class).toContain("focus-visible:outline-accent-primary");
    expect(input.attrs).not.toHaveProperty("checked");
  });

  it("localizes the accessible name and can start checked", async () => {
    const html = await render(Toggle, {
      props: { id: "t", label: "Texto más grande", checked: true },
      path: "/es/",
    });
    const input = find(html, "input")!;

    expect(input.attrs["aria-label"]).toBe("Utilizar Texto más grande");
    expect(input.attrs).toHaveProperty("checked");
  });
});
