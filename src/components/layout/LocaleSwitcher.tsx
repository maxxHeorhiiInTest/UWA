"use client";

import { useLocale } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";

export function LocaleSwitcher() {
  const activeLocale = useLocale();
  const pathname = usePathname();

  return (
    <div className="flex items-center gap-1 rounded-full border border-uwa-panel-border bg-uwa-panel p-1 text-xs font-semibold uppercase">
      {routing.locales.map((locale) => (
        <Link
          key={locale}
          href={pathname}
          locale={locale}
          className={`rounded-full px-2.5 py-1 transition-colors ${
            locale === activeLocale
              ? "bg-uwa-gold text-uwa-black"
              : "text-uwa-white/60 hover:text-uwa-white"
          }`}
        >
          {locale}
        </Link>
      ))}
    </div>
  );
}
