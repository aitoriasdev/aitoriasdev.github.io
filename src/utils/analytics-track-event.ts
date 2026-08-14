export function trackEvent(
  eventName: string,
  params: Record<string, any> = {},
) {
  if (typeof window !== "undefined" && typeof window.gtag === "function") {
    const consent = localStorage.getItem("analytics-consent");
    if (consent === "granted") {
      window.gtag("event", eventName, params);
    }
  }
}
