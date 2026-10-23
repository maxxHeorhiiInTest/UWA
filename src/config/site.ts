import { routing, type AppLocale } from "@/i18n/routing";

export const siteName = "UWA — Ukrainian Wrestling Arena";
export const siteShortName = "UWA";
export const ogImagePath = "/hero-photo-v3.jpg";

export function getSiteUrl() {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "");
  if (explicit) return explicit;
  const production = process.env.VERCEL_PROJECT_PRODUCTION_URL?.replace(
    /\/$/,
    ""
  );
  if (production) {
    return production.startsWith("http") ? production : `https://${production}`;
  }
  return "https://uwa-orpin.vercel.app";
}

export function htmlLang(locale: string) {
  return locale === "en" ? "en" : "uk";
}

export function ogLocale(locale: string) {
  return locale === "en" ? "en_US" : "uk_UA";
}

export function localizedPath(locale: string, path: string) {
  const suffix = path === "/" ? "" : path;
  return `/${locale}${suffix}`;
}

export function absoluteUrl(locale: string, path: string) {
  return `${getSiteUrl()}${localizedPath(locale, path)}`;
}

export function localeAlternates(path: string) {
  const languages: Record<string, string> = {
    uk: absoluteUrl("ua", path),
    en: absoluteUrl("en", path),
    "x-default": absoluteUrl(routing.defaultLocale, path),
  };
  return languages;
}

export const publicPaths = [
  "/",
  "/roster",
  "/academy",
  "/tickets",
  "/events",
  "/titles",
  "/matches",
  "/news",
  "/media",
  "/universe",
  "/shop",
  "/about",
] as const;

export const seoLocales = routing.locales as readonly AppLocale[];
