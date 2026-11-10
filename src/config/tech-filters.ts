/**
 * Which technologies become project filters (and card badges).
 *
 * A project's `techStack` lists everything it uses, and its case-study page
 * shows all of it. The projects grid only shows the headline technologies a
 * visitor would filter by, so these rules trim the list:
 */

/**
 * Add-ons that only exist within a platform fold into that platform: nobody
 * filters by Liquid without meaning Shopify.
 */
export const FILTER_PARENT: Readonly<Record<string, string>> = {
  Liquid: "Shopify",
  WooCommerce: "WordPress",
  "TanStack Query": "React",
};

/**
 * Not useful as filters: languages every web project uses, and build or test
 * tooling rather than what a project is built with.
 */
export const NOT_A_FILTER: ReadonlySet<string> = new Set([
  "JavaScript",
  "CSS",
  "HTML",
  "Vite",
  "Vitest",
  "Playwright",
]);

/** The headline technologies of a stack, in their original order and without duplicates. */
export function filterTechs(techStack: readonly string[]): string[] {
  const techs = techStack
    .map((tech) => FILTER_PARENT[tech] ?? tech)
    .filter((tech) => !NOT_A_FILTER.has(tech));

  return [...new Set(techs)];
}

/**
 * Filters for a set of projects: technologies shared by more projects first,
 * then alphabetical, so the most useful filters lead.
 */
export function filterOptions(
  stacks: readonly (readonly string[])[],
): string[] {
  const counts = new Map<string, number>();

  for (const stack of stacks) {
    for (const tech of filterTechs(stack))
      counts.set(tech, (counts.get(tech) ?? 0) + 1);
  }

  return [...counts]
    .sort(
      ([techA, countA], [techB, countB]) =>
        countB - countA || techA.localeCompare(techB),
    )
    .map(([tech]) => tech);
}
