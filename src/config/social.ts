import type { UIKey } from "../i18n/ui";

export interface SocialLink {
  id: "github" | "linkedin";
  href: string;
  labelKey: UIKey;
}

export const SOCIAL_LINKS = {
  github: {
    id: "github",
    href: "https://github.com/aitoriasdev",
    labelKey: "hero.github",
  },
  linkedin: {
    id: "linkedin",
    href: "https://linkedin.com/in/aitordediego",
    labelKey: "hero.linkedin",
  },
} as const satisfies Record<SocialLink["id"], SocialLink>;
