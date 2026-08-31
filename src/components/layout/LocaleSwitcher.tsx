"use client";

import { useLocale } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";

export function LocaleSwitcher() {
  const activeLocale = useLocale();
  const pathname = usePathname();

  return (
    <div className="flex items-center gap-3 text-xs font-bold uppercase tracking-wide">
      {routing.locales.map((locale) => (
        <Link
          key={locale}
          href={pathname}
          locale={locale}
          className={`transition-colors ${
            locale === activeLocale
              ? "text-uwa-white"
              : "text-uwa-white/40 hover:text-uwa-white/70"
          }`}
        >
          {locale}
        </Link>
      ))}
    </div>
  );
}
