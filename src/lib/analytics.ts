type AnalyticsValue = string | number | boolean | null | undefined;

export type AnalyticsProps = Record<string, AnalyticsValue>;

declare global {
  interface Window {
    dataLayer?: Array<Record<string, unknown>>;
  }
}

export function track(name: string, props: AnalyticsProps = {}) {
  if (typeof window === "undefined") return;
  const payload = {
    event: name,
    ...props,
    ts: Date.now(),
    path: window.location.pathname,
  };
  window.dataLayer = window.dataLayer ?? [];
  window.dataLayer.push(payload);
  window.dispatchEvent(new CustomEvent("uwa-analytics", { detail: payload }));
}
