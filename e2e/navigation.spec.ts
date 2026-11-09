import { expect, PAGES, test } from "./fixtures";

test.use({ prefs: { consent: "denied" } });

for (const path of PAGES) {
  test(`${path} renders with SEO metadata`, async ({ page }) => {
    const response = await page.goto(path);

    expect(response?.status()).toBe(200);
    await expect(page.locator("h1")).toHaveCount(1);
    await expect(page).toHaveTitle(/Aitorias/);
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
      "href",
      /^https:\/\/aitorias\.is-a\.dev\//,
    );
    await expect(page.locator('meta[property="og:image"]')).toHaveAttribute(
      "content",
      /^https:\/\/.+\.png$/,
    );
    expect(
      await page
        .locator('link[rel="alternate"][hreflang]')
        .evaluateAll((links) => links.map((l) => l.getAttribute("hreflang"))),
    ).toEqual(["en", "es", "x-default"]);

    // Structured data: required on home and case studies, valid wherever present
    const jsonLd = await page
      .locator('script[type="application/ld+json"]')
      .allTextContents();
    if (/^\/(es\/)?$|\/(projects|proyectos)\/[^/]+\/$/.test(path)) {
      expect(jsonLd).toHaveLength(1);
    }
    for (const block of jsonLd) expect(() => JSON.parse(block)).not.toThrow();
  });
}

test("the language picker keeps the visitor on the same page", async ({
  page,
}) => {
  await page.goto("/projects/cdm-optimiser/");

  await page.locator("header").getByRole("button", { name: "English" }).click();
  await page
    .locator("header")
    .getByRole("menuitem", { name: "Spanish" })
    .click();

  await expect(page).toHaveURL(/\/es\/proyectos\/cdm-optimiser\/?$/);
  await expect(page.locator("html")).toHaveAttribute("lang", "es");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(
    "CDM Optimiser",
  );
});

test("project cards open their case study", async ({ page }) => {
  await page.goto("/");

  await page
    .getByRole("link", { name: "View details for CDM Optimiser" })
    .first()
    .click();

  await expect(page).toHaveURL(/\/projects\/cdm-optimiser\/?$/);
  await expect(
    page.getByRole("heading", { name: "Key highlights" }),
  ).toBeVisible();
});

test("the hero badge and nav link lead to the contact section", async ({
  page,
}) => {
  await page.goto("/");

  await page
    .getByRole("link", { name: "Available for new opportunities" })
    .click();

  await expect(page).toHaveURL(/#contact$/);
  await expect(
    page.getByRole("heading", { name: "Let's work together" }),
  ).toBeInViewport();
  await expect(
    page
      .getByRole("navigation", { name: "Main Navigation" })
      .getByRole("link", { name: "Contact" }),
  ).toHaveAttribute("href", "/#contact");
});

test("unknown URLs get the bilingual 404 page, Spanish first under /es/", async ({
  page,
}) => {
  const response = await page.goto("/es/no-existe");

  expect(response?.status()).toBe(404);
  await expect(page.locator("html")).toHaveAttribute("lang", "es");
  await expect(page.locator("#not-found-copy > div").first()).toHaveAttribute(
    "lang",
    "es",
  );
  await expect(
    page.getByRole("link", { name: "Ir a la página de inicio" }),
  ).toHaveAttribute("href", "/es");
});
