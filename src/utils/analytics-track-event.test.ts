import { afterEach, describe, expect, it, vi } from "vitest";
import { trackEvent } from "./analytics-track-event";

function setup(consent: string | null, gtag?: (...args: unknown[]) => void) {
  const store = new Map(
    consent === null ? [] : [["analytics-consent", consent]],
  );
  vi.stubGlobal("localStorage", {
    getItem: (k: string) => store.get(k) ?? null,
  });
  vi.stubGlobal("window", { gtag });
}

describe("trackEvent", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("sends the event once the visitor has granted consent", () => {
    const gtag = vi.fn();
    setup("granted", gtag);

    trackEvent("hero_social_github", { element_text: "GitHub" });

    expect(gtag).toHaveBeenCalledWith("event", "hero_social_github", {
      element_text: "GitHub",
    });
  });

  it.each([["denied"], [null]])(
    "sends nothing when consent is %s",
    (consent) => {
      const gtag = vi.fn();
      setup(consent, gtag);

      trackEvent("hero_social_github");

      expect(gtag).not.toHaveBeenCalled();
    },
  );

  it("does nothing (and does not throw) when analytics is not loaded", () => {
    setup("granted", undefined);

    expect(() => trackEvent("x")).not.toThrow();
  });
});
