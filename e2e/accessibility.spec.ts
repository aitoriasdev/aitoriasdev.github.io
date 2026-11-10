import {
  expect,
  focusIndicator,
  PAGES,
  scanForViolations,
  test,
  type Theme,
} from "./fixtures";

test.use({ reducedMotion: "reduce" });

const MODES = [
  { theme: "light", highContrast: false },
  { theme: "dark", highContrast: false },
  { theme: "light", highContrast: true },
  { theme: "dark", highContrast: true },
] as const satisfies { theme: Theme; highContrast: boolean }[];

for (const { theme, highContrast } of MODES) {
  test.describe(`axe WCAG 2.2 AA · ${theme}${highContrast ? " + high contrast" : ""}`, () => {
    test.use({ prefs: { theme, highContrast } });

    for (const path of [...PAGES, "/missing-page"]) {
      test(`${path} (with the first-visit cookie banner)`, async ({ page }) => {
        await page.goto(path);

        expect(await scanForViolations(page)).toEqual([]);
      });
    }
  });
}

for (const theme of ["light", "dark"] as const) {
  test.describe(`overlays · ${theme}`, () => {
    test.use({ prefs: { theme, consent: "denied" } });

    test("accessibility panel open", async ({ page }) => {
      await page.goto("/");
      await page
        .getByRole("button", { name: "Open accessibility options" })
        .click();
      await expect(
        page.getByRole("region", { name: "Accessibility Controls" }),
      ).toBeVisible();

      expect(await scanForViolations(page)).toEqual([]);
    });

    test("mobile menu open", async ({ page }) => {
      await page.setViewportSize({ width: 390, height: 844 });
      await page.goto("/");
      await page
        .getByRole("button", { name: "Toggle Navigation Menu" })
        .click();
      await expect(page.getByRole("dialog")).toBeVisible();

      expect(await scanForViolations(page)).toEqual([]);
    });

    for (const path of [
      "/projects/cdm-optimiser/",
      "/es/proyectos/cdm-optimiser/",
    ]) {
      test(`image viewer open on ${path}`, async ({ page }) => {
        await page.setViewportSize({ width: 390, height: 844 });
        await page.goto(path);
        await page.locator("a[data-lightbox]").first().click();
        await expect(page.locator("#image-lightbox")).toBeVisible();

        expect(await scanForViolations(page)).toEqual([]);
      });
    }
  });
}

for (const theme of ["light", "dark"] as const) {
  test.describe(`focus indicator · ${theme}`, () => {
    test.use({ prefs: { theme } });

    for (const path of ["/", "/projects/cdm-optimiser/"]) {
      test(`every tab stop on ${path} has a visible 3:1 focus outline`, async ({
        page,
      }) => {
        await page.goto(path);
        const problems: string[] = [];
        let stops = 0;

        for (let i = 0; i < 60; i++) {
          await page.keyboard.press("Tab");
          const focus = await focusIndicator(page);
          if (!focus) continue;
          stops++;
          if (!focus.visible) problems.push(`no outline: ${focus.name}`);
          else if (focus.contrast < 3)
            problems.push(`${focus.contrast.toFixed(2)}:1 on ${focus.name}`);
        }

        expect(stops).toBeGreaterThan(20);
        expect(problems).toEqual([]);
      });
    }
  });
}

test.describe("layout", () => {
  test.use({ prefs: { consent: "denied" } });

  for (const path of PAGES) {
    test(`${path} reflows at 320px without horizontal scrolling (1.4.10)`, async ({
      page,
    }) => {
      await page.setViewportSize({ width: 320, height: 640 });
      await page.goto(path);

      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth - window.innerWidth,
        ),
      ).toBeLessThanOrEqual(0);
    });
  }
});

test("the first-visit cookie banner never covers the accessibility button (2.4.11)", async ({
  page,
}) => {
  await page.goto("/");
  await expect(
    page.getByRole("region", { name: "Cookie Settings" }),
  ).toBeVisible();

  // A real click fails if another element sits on top of the button
  await page
    .getByRole("button", { name: "Open accessibility options" })
    .click();

  await expect(
    page.getByRole("region", { name: "Accessibility Controls" }),
  ).toBeVisible();
});
