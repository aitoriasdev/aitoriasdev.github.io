import { describe, expect, it } from "vitest";
import { SOCIAL_LINKS } from "../../config/social";
import { find, findAll, render } from "../../test/render";
import ContactSection from "./ContactSection.astro";

describe("ContactSection", () => {
  it("is the #contact landmark with LinkedIn and GitHub calls to action", async () => {
    const html = await render(ContactSection);

    expect(find(html, "section")!.attrs).toMatchObject({
      id: "contact",
      "aria-labelledby": "contact-heading",
    });
    expect(find(html, "h2")!.text).toBe("Let's work together");
    expect(findAll(html, "a").map((a) => a.attrs.href)).toEqual([
      SOCIAL_LINKS.linkedin.href,
      SOCIAL_LINKS.github.href,
    ]);
  });

  it("is translated on Spanish pages", async () => {
    expect(
      find(await render(ContactSection, { path: "/es/" }), "h2")!.text,
    ).toBe("Trabajemos juntos");
  });
});
