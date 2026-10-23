type AnalyticsValue = string | number | boolean | null | undefined;

export type AnalyticsProps = Record<string, AnalyticsValue>;

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

export const GA_MEASUREMENT_ID =
  process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID?.trim() ?? "";

export function isGaEnabled() {
  return /^G-[A-Z0-9]+$/i.test(GA_MEASUREMENT_ID);
}

const GA_EVENT_NAME: Record<string, string> = {
  checkout_view: "begin_checkout",
  checkout_iframe_load: "checkout_ready",
  checkout_iframe_error: "checkout_error",
  checkout_close: "checkout_close",
  payment_approved: "purchase",
  payment_declined: "checkout_fail",
  payment_pending: "add_payment_info",
};

function currentLocale() {
  if (typeof window === "undefined") return "ua";
  return window.location.pathname.startsWith("/en") ? "en" : "ua";
}

function sanitize(props: AnalyticsProps) {
  const params: Record<string, string | number | boolean> = {};
  for (const [key, value] of Object.entries(props)) {
    if (value === null || value === undefined || value === "") continue;
    params[key] = value;
  }
  return params;
}

export function track(name: string, props: AnalyticsProps = {}) {
  if (typeof window === "undefined") return;

  const params = {
    language: currentLocale(),
    page_path: window.location.pathname,
    page_title: document.title,
    page_location: window.location.href,
    ...sanitize(props),
  };

  window.dataLayer = window.dataLayer ?? [];
  window.dataLayer.push({ event: name, ...params, ts: Date.now() });
  window.dispatchEvent(new CustomEvent("uwa-analytics", { detail: { event: name, ...params } }));

  if (typeof window.gtag !== "function") return;

  const gaName = GA_EVENT_NAME[name] ?? name;
  const gaParams =
    name === "payment_approved"
      ? {
          ...params,
          currency: "UAH",
          transaction_id:
            typeof props.transaction_id === "string"
              ? props.transaction_id
              : `wfp-${Date.now()}`,
          items: [{ item_id: "tickets", item_name: "UWA tickets" }],
        }
      : params;

  window.gtag("event", gaName, gaParams);
}

let lastPageKey = "";

export function trackPageView() {
  if (typeof window === "undefined") return;
  const key = `${window.location.pathname}${window.location.search}`;
  if (lastPageKey === key) return;
  lastPageKey = key;
  track("page_view");
}
