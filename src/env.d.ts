interface Window {
  dataLayer?: unknown[];
  /** Main-thread stub forwarded to the Partytown worker (see astro.config.mjs). */
  gtag?: (...args: unknown[]) => void;
}
