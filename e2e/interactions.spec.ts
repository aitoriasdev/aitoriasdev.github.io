import { expect, test } from "./fixtures";

test.describe("with cookies decided", () => {
  test.use({ prefs: { consent: "denied" } });

  test("the theme choice applies immediately and survives a reload", async ({
    page,
  }) => {
    await page.goto("/");
    const dark = page
      .locator("header")
      .getByRole("button", { name: "Dark theme" });

    await dark.click();

    await expect(page.locator("html")).toHaveClass(/\bdark\b/);
    await expect(dark).toHaveAttribute("aria-pressed", "true");
    await page.reload();
    await expect(page.locator("html")).toHaveClass(/\bdark\b/);
  });

  test("accessibility preferences persist and apply before first paint", async ({
    page,
  }) => {
    await page.goto("/");
    await page
      .getByRole("button", { name: "Open accessibility options" })
      .click();
    await page.getByRole("checkbox", { name: "Use Larger Text" }).check();
    await expect(page.locator("html")).toHaveClass(/\blarge-text\b/);

    // Record the classes as soon as parsing ends, before any module script runs
    await page.addInitScript(() => {
      document.addEventListener("readystatechange", () => {
        if (document.readyState === "interactive")
          (window as Window & { classesAtParse?: string }).classesAtParse =
            document.documentElement.className;
      });
    });
    await page.reload();

    expect(
      await page.evaluate(
        () => (window as Window & { classesAtParse?: string }).classesAtParse,
      ),
    ).toMatch(/\blarge-text\b/);
    await page
      .getByRole("button", { name: "Open accessibility options" })
      .click();
    await expect(
      page.getByRole("checkbox", { name: "Use Larger Text" }),
    ).toBeChecked();
  });

  test("the accessibility panel closes with its button and by clicking outside", async ({
    page,
  }) => {
    await page.goto("/");
    const trigger = page.getByRole("button", {
      name: "Open accessibility options",
    });
    const panel = page.getByRole("region", { name: "Accessibility Controls" });

    await trigger.click();
    await expect(trigger).toHaveAttribute("aria-expanded", "true");
    await page
      .getByRole("button", { name: "Close accessibility options" })
      .click();
    await expect(panel).toBeHidden();

    await trigger.click();
    await page.locator("h1").click();
    await expect(panel).toBeHidden();
    await expect(trigger).toHaveAttribute("aria-expanded", "false");
  });

  test("project filters show only matching projects", async ({ page }) => {
    await page.goto("/projects/");
    const cards = page.locator("article.project-card");
    const filter = (name: string) =>
      page
        .getByRole("group", { name: "Filter projects by technology" })
        .getByRole("button", { name, exact: true });

    await filter("Electron").click();
    await expect(filter("Electron")).toHaveAttribute("aria-pressed", "true");
    await expect(cards.filter({ visible: true })).toHaveCount(1);
    await expect(cards.filter({ visible: true })).toContainText(
      "CDM Optimiser",
    );

    await filter("Astro").click();
    await expect(cards.filter({ visible: true })).toContainText(
      "Aitorias.is-a.dev Portfolio",
    );

    await filter("All").click();
    await expect(cards.filter({ visible: true })).toHaveCount(2);
  });

  test("the mobile menu traps focus and closes with Escape", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/");
    const toggle = page.getByRole("button", { name: "Toggle Navigation Menu" });
    const dialog = page.getByRole("dialog");

    await toggle.click();
    await expect(dialog).toBeVisible();
    await expect(toggle).toHaveAttribute("aria-expanded", "true");
    await expect(
      page.getByRole("button", { name: "Close navigation menu" }),
    ).toBeFocused();

    for (let i = 0; i < 12; i++) {
      await page.keyboard.press("Tab");
      expect(
        await dialog.evaluate((d) => d.contains(document.activeElement)),
      ).toBe(true);
    }

    await page.keyboard.press("Escape");
    await expect(dialog).toBeHidden();
    await expect(toggle).toBeFocused();
    await expect(toggle).toHaveAttribute("aria-expanded", "false");
  });
});

test("the cookie banner records consent and can be reopened", async ({
  page,
}) => {
  await page.goto("/");
  const banner = page.getByRole("region", { name: "Cookie Settings" });
  await expect(banner).toBeVisible();

  await banner.getByRole("button", { name: "Accept" }).click();

  await expect(banner).toBeHidden();
  expect(
    await page.evaluate(() => localStorage.getItem("analytics-consent")),
  ).toBe("granted");

  await page.getByRole("button", { name: "Manage cookie settings" }).click();
  await expect(banner).toBeVisible();
  await expect(banner.getByText("Accepted")).toBeVisible();
});
