import type { Metadata } from "next";
import type { Locale } from "next-intl";
import { getTranslations } from "next-intl/server";
import { externalLinks } from "@/config/links";
import {
  absoluteUrl,
  getSiteUrl,
  localeAlternates,
  ogImagePath,
  ogLocale,
  siteName,
  siteShortName,
} from "@/config/site";

export type SeoPage =
  | "home"
  | "roster"
  | "academy"
  | "tickets"
  | "events"
  | "titles"
  | "matches"
  | "news"
  | "media"
  | "universe"
  | "shop"
  | "about";

export const seoPaths: Record<SeoPage, string> = {
  home: "/",
  roster: "/roster",
  academy: "/academy",
  tickets: "/tickets",
  events: "/events",
  titles: "/titles",
  matches: "/matches",
  news: "/news",
  media: "/media",
  universe: "/universe",
  shop: "/shop",
  about: "/about",
};

export async function buildPageMetadata(
  { locale }: { locale: string },
  page: SeoPage
): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: "meta" });
  const path = seoPaths[page];
  const canonical = absoluteUrl(locale, path);
  const description = t(`pages.${page}.description`);
  const pageTitle = t(`pages.${page}.title`);
  const title =
    page === "home" ? { absolute: t("title") } : pageTitle;
  const socialTitle = page === "home" ? t("title") : `${pageTitle} | ${t("shortTitle")}`;

  return {
    title,
    description,
    alternates: {
      canonical,
      languages: localeAlternates(path),
    },
    openGraph: {
      type: "website",
      locale: ogLocale(locale),
      alternateLocale: locale === "en" ? ["uk_UA"] : ["en_US"],
      url: canonical,
      siteName: siteShortName,
      title: socialTitle,
      description,
      images: [{ url: ogImagePath, alt: t("ogAlt") }],
    },
    twitter: {
      card: "summary_large_image",
      title: socialTitle,
      description,
      images: [ogImagePath],
    },
  };
}

export function seoMetadata(page: SeoPage) {
  return async function generateMetadata({
    params,
  }: {
    params: Promise<{ locale: Locale }>;
  }): Promise<Metadata> {
    return buildPageMetadata(await params, page);
  };
}

export function organizationJsonLd() {
  const url = getSiteUrl();
  return {
    "@context": "https://schema.org",
    "@type": "SportsOrganization",
    "@id": `${url}/#organization`,
    name: siteName,
    alternateName: ["UWA", "Ukrainian Wrestling Arena", "Українська реслінг арена"],
    url,
    logo: `${url}/icon.svg`,
    image: `${url}${ogImagePath}`,
    sport: "Professional wrestling",
    areaServed: {
      "@type": "Country",
      name: "Ukraine",
    },
    sameAs: [
      externalLinks.facebook,
      externalLinks.instagram,
      externalLinks.youtube,
      externalLinks.tiktok,
      externalLinks.telegram,
    ],
  };
}

export function websiteJsonLd(locale: string) {
  const url = getSiteUrl();
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${url}/#website`,
    name: siteShortName,
    alternateName: siteName,
    url,
    inLanguage: locale === "en" ? ["en", "uk"] : ["uk", "en"],
    publisher: { "@id": `${url}/#organization` },
  };
}
