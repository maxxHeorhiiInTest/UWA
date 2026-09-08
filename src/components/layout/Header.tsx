import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { headerNavItems, navItems } from "@/config/nav";
import { externalLinks } from "@/config/links";
import { Logo } from "@/components/ui/Logo";
import { SparkleIcon, TicketBadgeIcon } from "@/components/ui/Icons";
import { NavLink } from "./NavLink";
import { LocaleSwitcher } from "./LocaleSwitcher";
import { MobileMenu } from "./MobileMenu";

export async function Header() {
  const [tNav, tHeader] = await Promise.all([
    getTranslations("nav"),
    getTranslations("header"),
  ]);

  const items = headerNavItems.map((item) => ({
    href: item.href,
    label: tNav(item.key),
  }));

  const allItems = navItems.map((item) => ({
    href: item.href,
    label: tNav(item.key),
  }));

  return (
    <header className="sticky top-0 z-50 bg-uwa-black">
      <div className="mx-auto flex h-16 max-w-[1920px] items-center gap-5 px-4 sm:px-6 lg:px-8">
        <Link
          href="/"
          className="flex shrink-0 items-center text-uwa-red"
          aria-label="UWA"
        >
          <Logo className="h-8 w-auto" />
        </Link>

        <MobileMenu
          items={allItems}
          openLabel={tHeader("menuOpen")}
          closeLabel={tHeader("menuClose")}
        />

        <nav className="scrollbar-none hidden flex-1 items-center gap-6 overflow-x-auto lg:flex">
          {items.map((item) => (
            <NavLink key={item.href} href={item.href}>
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-5">
          <Link
            href="/about"
            className="hidden items-center gap-2 text-xs font-bold uppercase tracking-wide text-uwa-white/80 transition-colors hover:text-uwa-red md:flex"
          >
            <SparkleIcon className="h-3.5 w-3.5" />
            {tHeader("partners")}
          </Link>

          <LocaleSwitcher />

          <a
            href={externalLinks.tickets}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden items-center gap-2 bg-uwa-red px-5 py-2.5 text-xs font-bold uppercase tracking-wide text-uwa-white transition-colors hover:bg-uwa-red-dark sm:inline-flex"
          >
            <TicketBadgeIcon className="h-4 w-4" />
            {tHeader("tickets")}
          </a>
        </div>
      </div>
    </header>
  );
}
