import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { navItems } from "@/config/nav";
import { externalLinks } from "@/config/links";
import { Logo } from "@/components/ui/Logo";

const socialLinks = [
  { label: "Instagram", href: externalLinks.instagram },
  { label: "Facebook", href: externalLinks.facebook },
  { label: "YouTube", href: externalLinks.youtube },
  { label: "TikTok", href: externalLinks.tiktok },
  { label: "Telegram", href: externalLinks.telegram },
];

export async function Footer() {
  const [tNav, tFooter] = await Promise.all([
    getTranslations("nav"),
    getTranslations("footer"),
  ]);

  return (
    <footer className="border-t border-uwa-panel-border bg-uwa-black-soft">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-10 sm:grid-cols-3">
          <div>
            <Link
              href="/"
              className="flex items-center gap-2.5 font-heading text-2xl tracking-wider text-uwa-white"
            >
              <Logo className="h-9 w-auto" idPrefix="footer-logo" />
              UW<span className="text-uwa-gold">A</span>
            </Link>
            <p className="mt-3 max-w-xs text-sm text-uwa-white/60">
              {tFooter("tagline")}
            </p>
          </div>

          <div>
            <h3 className="text-xs font-bold uppercase tracking-widest text-uwa-white/40">
              {tFooter("sections")}
            </h3>
            <ul className="mt-4 grid grid-cols-2 gap-2 text-sm text-uwa-white/70">
              {navItems.slice(1).map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="transition-colors hover:text-uwa-gold"
                  >
                    {tNav(item.key)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-xs font-bold uppercase tracking-widest text-uwa-white/40">
              {tFooter("follow")}
            </h3>
            <ul className="mt-4 flex flex-col gap-2 text-sm text-uwa-white/70">
              {socialLinks.map((social) => (
                <li key={social.label}>
                  <a
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="transition-colors hover:text-uwa-gold"
                  >
                    {social.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <p className="mt-10 border-t border-uwa-panel-border pt-6 text-xs text-uwa-white/40">
          {tFooter("rights", { year: new Date().getFullYear() })}
        </p>
      </div>
    </footer>
  );
}
