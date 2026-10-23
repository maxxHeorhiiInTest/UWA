import type { MetadataRoute } from "next";
import {
  absoluteUrl,
  localeAlternates,
  publicPaths,
  seoLocales,
} from "@/config/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  return seoLocales.flatMap((locale) =>
    publicPaths.map((path) => ({
      url: absoluteUrl(locale, path),
      lastModified: now,
      changeFrequency: path === "/" || path === "/roster" ? "weekly" : "monthly",
      priority:
        path === "/" ? 1 : path === "/roster" || path === "/academy" ? 0.8 : 0.5,
      alternates: {
        languages: localeAlternates(path),
      },
    }))
  );
}
