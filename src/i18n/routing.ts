import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  locales: ["ua", "en"],
  defaultLocale: "ua",
  // UWA is a Ukrainian promotion first — always default to `ua` for new
  // visitors instead of guessing from the browser's Accept-Language header.
  // Users can still switch to English via the header, which persists via cookie.
  localeDetection: false,
});

export type AppLocale = (typeof routing.locales)[number];
