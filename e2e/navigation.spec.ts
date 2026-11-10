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

    // Structured data: one valid JSON-LD block on every page
    const jsonLd = await page
      .locator('script[type="application/ld+json"]')
      .allTextContents();
    expect(jsonLd).toHaveLength(1);
    expect(() => JSON.parse(jsonLd[0])).not.toThrow();
  });
}

/** The page's schema.org nodes, flattened from arrays and @graph. */
async function structuredData(page: import("@playwright/test").Page) {
  const json = JSON.parse(
    (await page.locator('script[type="application/ld+json"]').textContent()) ??
      "",
  );
  return [json].flat().flatMap((node) => node["@graph"] ?? [node]) as Record<
    string,
    any
  >[];
}

for (const path of ["/projects/", "/es/proyectos/cdm-optimiser/"]) {
  test(`${path} structured breadcrumbs match the visible ones`, async ({
    page,
  }) => {
    await page.goto(path);
    const breadcrumbs = (await structuredData(page)).find(
      (node) => node["@type"] === "BreadcrumbList",
    );
    const visible = page
      .getByRole("navigation", { name: /^(Breadcrumb|Ruta de navegación)$/ })
      .getByRole("listitem");

    const names = breadcrumbs?.itemListElement.map(
      (item: { name: string }) => item.name,
    );
    expect(names).toEqual(
      (await visible.allInnerTexts()).map((text) =>
        text.replace(/[/›>]/g, "").trim(),
      ),
    );
    // The last crumb is the page itself, at its canonical URL
    expect(breadcrumbs?.itemListElement.at(-1).item).toBe(
      await page.locator('link[rel="canonical"]').getAttribute("href"),
    );
  });
}

test("the projects page lists every case study in its structured data", async ({
  page,
}) => {
  await page.goto("/projects/");
  const collection = (await structuredData(page)).find(
    (node) => node["@type"] === "CollectionPage",
  );
  const cardLinks = await page
    .getByRole("link", { name: /^View details for / })
    .evaluateAll((links) => [
      ...new Set(links.map((a) => (a as HTMLAnchorElement).href)),
    ]);

  const listed = collection?.mainEntity.itemListElement.map(
    (item: { url: string }) => item.url,
  );
  expect(listed).toHaveLength(cardLinks.length);

  for (const url of listed) {
    // Listed URLs are canonical production URLs; check this build serves each path
    const { origin, pathname } = new URL(url);
    expect(origin).toBe("https://aitorias.is-a.dev");
    expect(
      cardLinks.map((href) => `${new URL(href).pathname}/`),
      "matches a project card",
    ).toContain(pathname);

    const response = await page.request.get(pathname);
    expect(response.status(), pathname).toBe(200);
  }
});

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

test("client sites get a full-width 'Visit site' button instead of 'Live demo'", async ({
  page,
}) => {
  await page.goto("/projects/awaken-brnd/");
  const actions = page.locator("article header");

  const visit = actions.getByRole("link", { name: /^Visit site/ });
  await expect(visit).toHaveAttribute("href", "https://awakenbrnd.store/en");
  await expect(
    actions.getByRole("link", { name: /Live demo|GitHub/ }),
  ).toHaveCount(0);
  // A lone button fills its row
  expect(
    await visit.evaluate(
      (el) =>
        el.getBoundingClientRect().width /
        el.parentElement!.getBoundingClientRect().width,
    ),
  ).toBeCloseTo(1, 2);

  await page.goto("/es/proyectos/awaken-brnd/");
  await expect(
    page.locator("article header").getByRole("link", { name: /^Ver la web/ }),
  ).toBeVisible();
});

for (const width of [1280, 1024, 390]) {
  test(`project card buttons keep their labels on one line at ${width}px`, async ({
    page,
  }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/es/proyectos/");
    const buttons = page.locator(
      'article.project-card a:is([data-track-event^="project_github_click"], [data-track-event^="project_demo_click"])',
    );

    expect(await buttons.count()).toBe(5); // GitHub + live on two cards, live only on one
    const lineCounts = await buttons.evaluateAll((links) =>
      links.map((link) => {
        const label = [...link.querySelectorAll("span")].find(
          (s) => !s.classList.contains("sr-only"),
        )!;
        const range = document.createRange();
        range.selectNodeContents(label);
        return {
          label: label.textContent,
          lines: range.getClientRects().length,
        };
      }),
    );
    for (const { label, lines } of lineCounts)
      expect(lines, label ?? "").toBe(1);
  });
}
