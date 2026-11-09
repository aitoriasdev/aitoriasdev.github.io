import { experimental_AstroContainer as AstroContainer } from "astro/container";
import type { AstroComponentFactory } from "astro/runtime/server/index.js";

export const SITE = "https://aitorias.is-a.dev";

interface RenderOptions {
  props?: Record<string, unknown>;
  slots?: Record<string, string>;
  /** Page the component renders on; drives the language (`/es/...`) and active links. */
  path?: string;
}

/** Renders an Astro component to an HTML string with the Container API. */
export async function render(
  Component: AstroComponentFactory,
  { props = {}, slots = {}, path = "/" }: RenderOptions = {},
): Promise<string> {
  const container = await AstroContainer.create();

  return container.renderToString(Component, {
    props,
    slots,
    request: new Request(new URL(path, SITE)),
  });
}

export interface HtmlElement {
  attrs: Record<string, string>;
  /** Text content with tags stripped, entities decoded and whitespace collapsed. */
  text: string;
  /** Raw inner HTML (empty for void elements). */
  inner: string;
}

const VOID = new Set(["input", "img", "meta", "link", "br", "hr", "source"]);
const ENTITIES: Record<string, string> = {
  amp: "&",
  lt: "<",
  gt: ">",
  quot: '"',
  "#39": "'",
  "#x27": "'",
  nbsp: " ",
};

const decode = (s: string) =>
  s.replace(/&(#?\w+);/g, (m, e: string) => ENTITIES[e] ?? m);

function parseAttrs(raw: string): Record<string, string> {
  const attrs: Record<string, string> = {};
  for (const [, name, value] of raw.matchAll(/([^\s=/>]+)(?:="([^"]*)")?/g))
    attrs[name] = decode(value ?? "");
  return attrs;
}

/**
 * Minimal element finder for asserting on component markup. It is enough for
 * these components, which never nest an element inside one of the same tag.
 */
export function findAll(html: string, tag: string): HtmlElement[] {
  const pattern = VOID.has(tag)
    ? new RegExp(`<${tag}\\b([^>]*)>`, "g")
    : new RegExp(`<${tag}\\b([^>]*)>([\\s\\S]*?)</${tag}>`, "g");

  return [...html.matchAll(pattern)].map(([, attrs, inner = ""]) => ({
    attrs: parseAttrs(attrs),
    inner,
    text: decode(inner.replace(/<[^>]+>/g, ""))
      .replace(/\s+/g, " ")
      .trim(),
  }));
}

export function find(
  html: string,
  tag: string,
  predicate: (el: HtmlElement) => boolean = () => true,
) {
  return findAll(html, tag).find(predicate);
}

/** Attributes of every opening tag, safe for nested elements (no content). */
export function openTags(html: string, tag: string): Record<string, string>[] {
  return [...html.matchAll(new RegExp(`<${tag}\\b([^>]*)>`, "g"))].map(
    ([, attrs]) => parseAttrs(attrs),
  );
}
