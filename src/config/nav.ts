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
