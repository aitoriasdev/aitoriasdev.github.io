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

    await filter("Shopify").click();
    await expect(cards.filter({ visible: true })).toHaveCount(1);
    await expect(cards.filter({ visible: true })).toContainText(
      "Awaken Brnd Store",
    );

    await filter("All").click();
    await expect(cards.filter({ visible: true })).toHaveCount(
      await cards.count(),
    );
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

  test.describe("image viewer", () => {
    test("opens screenshots in place with a backdrop and browses the gallery", async ({
      page,
    }) => {
      await page.goto("/projects/cdm-optimiser/");
      const viewer = page.getByRole("dialog", { name: "Image viewer" });
      const image = viewer.getByRole("img");
      const counter = viewer.locator("[data-lightbox-counter]");

      await page
        .getByRole("link", { name: /^Enlarge image: Patients list/ })
        .click();

      await expect(viewer).toBeVisible();
      await expect(page).toHaveURL(/\/projects\/cdm-optimiser\/$/);
      await expect(
        viewer.getByRole("button", { name: "Close image viewer" }),
      ).toBeFocused();
      await expect(image).toHaveAttribute("alt", /^Patients list/);
      await expect(viewer).toContainText(
        "Patients list: server-side pagination",
      );
      await expect(counter).toHaveText("Image 1 of 4");
      await expect
        .poll(() => image.evaluate((img: HTMLImageElement) => img.naturalWidth))
        .toBeGreaterThan(0);
      // The page behind can't scroll while the viewer is open
      await expect(page.locator("html")).toHaveCSS("overflow", "hidden");

      await viewer.getByRole("button", { name: "Next image" }).click();
      await expect(counter).toHaveText("Image 2 of 4");
      await expect(image).toHaveAttribute("alt", /^Patient information dialog/);

      await page.keyboard.press("ArrowLeft");
      await page.keyboard.press("ArrowLeft");
      await expect(counter).toHaveText("Image 4 of 4");

      await page.keyboard.press("ArrowRight");
      await expect(counter).toHaveText("Image 1 of 4");
    });

    test("closes with Escape, the close button or a backdrop click, returning focus", async ({
      page,
    }) => {
      await page.goto("/projects/cdm-optimiser/");
      const viewer = page.getByRole("dialog", { name: "Image viewer" });
      const trigger = page.getByRole("link", {
        name: /^Enlarge image: Pending patients/,
      });

      await trigger.click();
      await page.keyboard.press("Escape");
      await expect(viewer).toBeHidden();
      await expect(trigger).toBeFocused();

      await trigger.click();
      await viewer.getByRole("button", { name: "Close image viewer" }).click();
      await expect(viewer).toBeHidden();

      await trigger.click();
      await page.mouse.click(5, 400);
      await expect(viewer).toBeHidden();
      await expect(page.locator("html")).not.toHaveCSS("overflow", "hidden");
    });

    test("a single image has no gallery controls, and Ctrl/Cmd-click still opens a new tab", async ({
      page,
      context,
    }) => {
      await page.goto("/projects/aitorias-dev/");
      const viewer = page.getByRole("dialog", { name: "Image viewer" });
      const trigger = page.getByRole("link", { name: /^Enlarge image:/ });

      await expect(trigger).toHaveAttribute("aria-haspopup", "dialog");
      await trigger.click();
      await expect(viewer).toBeVisible();
      await expect(
        viewer.getByRole("button", { name: "Next image" }),
      ).toBeHidden();
      await expect(viewer.locator("[data-lightbox-counter]")).toBeHidden();
      await page.keyboard.press("Escape");

      const [newTab] = await Promise.all([
        context.waitForEvent("page"),
        trigger.click({ modifiers: ["ControlOrMeta"] }),
      ]);
      await expect(newTab).toHaveURL(/\.(webp|png|jpe?g)$/);
      await expect(viewer).toBeHidden();
    });

    test("swiping on a touch screen moves between screenshots", async ({
      page,
    }) => {
      await page.setViewportSize({ width: 390, height: 844 });
      await page.goto("/projects/cdm-optimiser/");
      await page
        .getByRole("link", { name: /^Enlarge image: Patients list/ })
        .click();
      const counter = page.locator("[data-lightbox-counter]");
      const stage = page.locator("[data-lightbox-stage]");

      const swipe = (from: number, to: number) =>
        stage.evaluate(
          (el, [a, b]) => {
            const touch = (x: number) =>
              new Touch({
                identifier: 1,
                target: el,
                clientX: x,
                clientY: 400,
              });
            el.dispatchEvent(
              new TouchEvent("touchstart", { touches: [touch(a)] }),
            );
            el.dispatchEvent(
              new TouchEvent("touchend", { changedTouches: [touch(b)] }),
            );
          },
          [from, to],
        );

      await swipe(300, 100);
      await expect(counter).toHaveText("Image 2 of 4");
      await swipe(100, 300);
      await expect(counter).toHaveText("Image 1 of 4");
    });
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
