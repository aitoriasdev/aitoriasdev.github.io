import { describe, expect, it } from "vitest";
import { find, render } from "../../test/render";
import Link from "./Link.astro";

describe("Link", () => {
  it("opens external links in a new tab safely and tells screen readers", async () => {
    const html = await render(Link, {
      props: { href: "https://github.com/aitoriasdev" },
      slots: { default: "GitHub" },
    });
    const a = find(html, "a")!;

    expect(a.attrs.target).toBe("_blank");
    expect(a.attrs.rel).toBe("noopener noreferrer");
    expect(a.attrs["data-track-link"]).toBe("outbound");
    expect(find(html, "span", (s) => s.attrs.class === "sr-only")?.text).toBe(
      "(opens in a new tab)",
    );
  });

  it("translates the new-tab hint on Spanish pages", async () => {
    const html = await render(Link, {
      props: { href: "https://example.com" },
      slots: { default: "x" },
      path: "/es/",
    });

    expect(find(html, "span", (s) => s.attrs.class === "sr-only")?.text).toBe(
      "(se abre en una pestaña nueva)",
    );
  });

  it("keeps internal links in the same tab", async () => {
    const html = await render(Link, {
      props: { href: "/projects" },
      slots: { default: "Projects" },
    });
    const a = find(html, "a")!;

    expect(a.attrs.target).toBeUndefined();
    expect(a.attrs.rel).toBeUndefined();
    expect(a.attrs["data-track-link"]).toBe("internal");
    expect(html).not.toContain("sr-only");
  });

  it("forwards extra attributes such as analytics events", async () => {
    const html = await render(Link, {
      props: {
        href: "/",
        "data-track-event": "hero_cta",
        "aria-label": "Home",
      },
      slots: { default: "x" },
    });
    const a = find(html, "a")!;

    expect(a.attrs["data-track-event"]).toBe("hero_cta");
    expect(a.attrs["aria-label"]).toBe("Home");
  });

  it("does not force a font size on inline variants, so links inherit it", async () => {
    const rendered = await Promise.all(
      ["default", "subtle"].map((variant) =>
        render(Link, {
          props: { href: "/", variant },
          slots: { default: "x" },
        }),
      ),
    );

    for (const html of rendered) {
      expect(find(html, "a")!.attrs.class).not.toMatch(
        /\btext-(xs|sm|base|lg|md)\b/,
      );
    }
  });
});
