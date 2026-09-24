"use client";

import { useEffect, useState } from "react";
import { Link, usePathname } from "@/i18n/navigation";

export function MobileMenu({
  items,
  openLabel,
  closeLabel,
  ticketsHref,
  ticketsLabel,
}: {
  items: { href: string; label: string }[];
  openLabel: string;
  closeLabel: string;
  ticketsHref: string;
  ticketsLabel: string;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setIsOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isOpen]);

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setIsOpen((open) => !open)}
        aria-label={isOpen ? closeLabel : openLabel}
        aria-expanded={isOpen}
        className="flex h-10 w-10 flex-col items-center justify-center gap-1.5"
      >
        <span
          className={`block h-0.5 w-6 bg-uwa-white transition-transform ${
            isOpen ? "translate-y-2 rotate-45" : ""
          }`}
        />
        <span
          className={`block h-0.5 w-6 bg-uwa-white transition-opacity ${
            isOpen ? "opacity-0" : ""
          }`}
        />
        <span
          className={`block h-0.5 w-6 bg-uwa-white transition-transform ${
            isOpen ? "-translate-y-2 -rotate-45" : ""
          }`}
        />
      </button>

      {isOpen && (
        <div className="fixed inset-x-0 bottom-0 top-16 z-[70] overflow-y-auto bg-uwa-black px-6 py-6 pb-[max(1.5rem,env(safe-area-inset-bottom))] lg:absolute lg:inset-auto lg:top-full lg:z-10 lg:w-64 lg:border lg:border-uwa-panel-border lg:bg-uwa-panel lg:px-6 lg:py-4 lg:pb-4 lg:shadow-xl">
          <nav className="flex flex-col gap-1 lg:gap-4">
            {items.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  className={`py-3 text-base font-medium uppercase tracking-wide transition-colors hover:text-uwa-red lg:py-0 lg:text-sm ${
                    isActive ? "text-uwa-red" : "text-uwa-white/80"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
          <a
            href={ticketsHref}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => setIsOpen(false)}
            className="mt-6 inline-flex w-full items-center justify-center bg-uwa-red px-5 py-3.5 text-sm font-bold uppercase tracking-wide text-uwa-white lg:hidden"
          >
            {ticketsLabel}
          </a>
        </div>
      )}
    </div>
  );
}
