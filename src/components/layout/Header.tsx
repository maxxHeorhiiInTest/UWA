import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { navItems } from "@/config/nav";
import { externalLinks } from "@/config/links";
import { Logo } from "@/components/ui/Logo";
import { NavLink } from "./NavLink";
import { LocaleSwitcher } from "./LocaleSwitcher";
import { MobileMenu } from "./MobileMenu";

export async function Header() {
  const [tNav, tHeader] = await Promise.all([
    getTranslations("nav"),
    getTranslations("header"),
  ]);

  const items = navItems.map((item) => ({
    href: item.href,
    label: tNav(item.key),
  }));

  return (
    <header className="sticky top-0 z-50 border-b border-uwa-panel-border bg-uwa-black/95 backdrop-blur">
      <div className="relative mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <Link
          href="/"
          className="flex shrink-0 items-center gap-2.5 font-heading text-2xl tracking-wider text-uwa-white"
        >
          <Logo className="h-9 w-auto" idPrefix="header-logo" />
          <span className="hidden sm:inline">
            UW<span className="text-uwa-gold">A</span>
          </span>
        </Link>

        <nav className="hidden flex-1 items-center justify-center gap-6 overflow-x-auto lg:flex">
          {items.map((item) => (
            <NavLink key={item.href} href={item.href}>
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <a
            href={externalLinks.tickets}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden rounded-full bg-uwa-gold px-4 py-2 text-xs font-bold uppercase tracking-wide text-uwa-black transition-colors hover:bg-uwa-gold-dark sm:inline-block"
          >
            {tHeader("tickets")}
          </a>
          <LocaleSwitcher />
          <MobileMenu
            items={items}
            openLabel={tHeader("menuOpen")}
            closeLabel={tHeader("menuClose")}
          />
        </div>
      </div>
    </header>
  );
}
