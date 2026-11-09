import type { UIKey } from "../i18n/ui";

export interface NavItem {
  /** Canonical (English) path, localized at render time with `useTranslatedPath`. */
  href: string;
  /** i18n key for the visible label. */
  labelKey: UIKey;
}

export const NAV_ITEMS: NavItem[] = [
  { href: "/projects", labelKey: "nav.projects" },
  { href: "/#contact", labelKey: "nav.contact" },
];
