import AxeBuilder from "@axe-core/playwright";
import { test as base, expect, type Page } from "@playwright/test";

export { expect };

export const PAGES = [
  "/",
  "/projects/",
  "/projects/cdm-optimiser/",
  "/es/",
  "/es/proyectos/",
  "/es/proyectos/cdm-optimiser/",
] as const;

export type Theme = "light" | "dark";

export interface Preferences {
  theme?: Theme;
  highContrast?: boolean;
  /** Set to skip the first-visit cookie banner. */
  consent?: "granted" | "denied";
  largeText?: boolean;
}

/** Seeds the same localStorage keys the site reads before first paint. */
export async function setPreferences(page: Page, prefs: Preferences) {
  await page.addInitScript((p: Preferences) => {
    if (p.theme) localStorage.setItem("theme", p.theme);
    if (p.highContrast) localStorage.setItem("a11y-high-contrast", "true");
    if (p.largeText) localStorage.setItem("a11y-large-text", "true");
    if (p.consent) localStorage.setItem("analytics-consent", p.consent);
  }, prefs);
}

/** WCAG 2.0, 2.1 and 2.2 level A and AA rules. */
export async function scanForViolations(page: Page) {
  const { violations } = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"])
    .analyze();

  return violations.map((v) => ({
    rule: v.id,
    impact: v.impact,
    targets: v.nodes.map((n) => n.target.join(" ")),
  }));
}

/**
 * Contrast between the focused element's outline and what is behind it,
 * compositing translucent ancestor backgrounds (WCAG 1.4.11 needs 3:1).
 */
export function focusIndicator(page: Page) {
  return page.evaluate(() => {
    const el = document.activeElement as HTMLElement | null;
    if (!el || el === document.body) return null;

    const canvas = document.createElement("canvas");
    canvas.width = canvas.height = 1;
    const ctx = canvas.getContext("2d", { willReadFrequently: true })!;
    const rgba = (color: string) => {
      ctx.clearRect(0, 0, 1, 1);
      ctx.fillStyle = color;
      ctx.fillRect(0, 0, 1, 1);
      const [r, g, b, a] = ctx.getImageData(0, 0, 1, 1).data;
      return [r, g, b, a / 255];
    };
    const luminance = ([r, g, b]: number[]) =>
      [r, g, b]
        .map((v) =>
          v / 255 <= 0.03928
            ? v / 255 / 12.92
            : ((v / 255 + 0.055) / 1.055) ** 2.4,
        )
        .reduce((sum, v, i) => sum + v * [0.2126, 0.7152, 0.0722][i], 0);

    const layers: number[][] = [];
    for (let node = el.parentElement; node; node = node.parentElement) {
      const c = rgba(getComputedStyle(node).backgroundColor);
      if (c[3] > 0) layers.push(c);
      if (c[3] === 1) break;
    }
    let background =
      layers.at(-1)?.[3] === 1
        ? layers.pop()!.slice(0, 3)
        : rgba(
            getComputedStyle(document.documentElement).backgroundColor,
          ).slice(0, 3);
    for (const layer of layers.reverse())
      background = background.map(
        (v, i) => layer[i] * layer[3] + v * (1 - layer[3]),
      );

    const style = getComputedStyle(el);
    const [hi, lo] = [
      luminance(rgba(style.outlineColor)),
      luminance(background),
    ].sort((a, b) => b - a);

    return {
      name: (el.getAttribute("aria-label") || el.textContent || el.tagName)
        .trim()
        .replace(/\s+/g, " ")
        .slice(0, 50),
      visible:
        style.outlineStyle !== "none" && parseFloat(style.outlineWidth) >= 1,
      contrast: (hi + 0.05) / (lo + 0.05),
    };
  });
}

export const test = base.extend<{ prefs: Preferences }>({
  prefs: [{}, { option: true }],
  page: async ({ page, prefs }, use) => {
    await setPreferences(page, prefs);
    await use(page);
  },
});
