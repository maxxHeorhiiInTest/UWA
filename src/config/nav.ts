export type NavKey =
  | "home"
  | "events"
  | "roster"
  | "titles"
  | "matches"
  | "news"
  | "media"
  | "universe"
  | "academy"
  | "shop"
  | "about";

export const navItems: { href: string; key: NavKey }[] = [
  { href: "/", key: "home" },
  { href: "/events", key: "events" },
  { href: "/roster", key: "roster" },
  { href: "/titles", key: "titles" },
  { href: "/matches", key: "matches" },
  { href: "/news", key: "news" },
  { href: "/media", key: "media" },
  { href: "/universe", key: "universe" },
  { href: "/academy", key: "academy" },
  { href: "/shop", key: "shop" },
  { href: "/about", key: "about" },
];

// Matches the exact header nav from the UWA Figma file: a shorter set of
// links than the full sitemap. The rest of the sitemap is still reachable
// from the footer.
const headerNavKeys: NavKey[] = [
  "events",
  "roster",
  "academy",
  "news",
  "shop",
  "about",
];

export const headerNavItems = headerNavKeys.map(
  (key) => navItems.find((item) => item.key === key)!
);
