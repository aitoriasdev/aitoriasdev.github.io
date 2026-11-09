import { describe, expect, it } from "vitest";
import { find, render } from "../../test/render";
import Badge from "./Badge.astro";

describe("Badge", () => {
  it("renders its content with the surface variant by default", async () => {
    const badge = find(
      await render(Badge, { slots: { default: "React" } }),
      "span",
    )!;

    expect(badge.text).toBe("React");
    expect(badge.attrs.class).toContain("bg-surface-light");
  });

  it("applies the requested variant and extra classes", async () => {
    const badge = find(
      await render(Badge, {
        props: { variant: "status", class: "self-start" },
        slots: { default: "Active" },
      }),
      "span",
    )!;

    expect(badge.attrs.class).toContain("rounded-full");
    expect(badge.attrs.class).toContain("self-start");
  });
});
