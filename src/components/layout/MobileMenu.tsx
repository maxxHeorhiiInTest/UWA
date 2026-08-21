"use client";

import { useState } from "react";
import { Link, usePathname } from "@/i18n/navigation";

export function MobileMenu({
  items,
  openLabel,
  closeLabel,
}: {
  items: { href: string; label: string }[];
  openLabel: string;
  closeLabel: string;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  return (
    <div className="lg:hidden">
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
        <div className="absolute inset-x-0 top-full border-t border-uwa-panel-border bg-uwa-black-soft px-6 py-4">
          <nav className="flex flex-col gap-4">
            {items.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  className={`text-base font-medium uppercase tracking-wide ${
                    isActive ? "text-uwa-gold" : "text-uwa-white/80"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>
      )}
    </div>
  );
}
