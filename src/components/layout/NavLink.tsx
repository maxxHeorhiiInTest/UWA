"use client";

import { Link, usePathname } from "@/i18n/navigation";

export function NavLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isActive = pathname === href;

  return (
    <Link
      href={href}
      className={`relative text-sm font-medium uppercase tracking-wide transition-colors hover:text-uwa-red ${
        isActive ? "text-uwa-red" : "text-uwa-white/80"
      }`}
    >
      {children}
      {isActive && (
        <span className="absolute -bottom-1.5 left-0 h-0.5 w-full bg-uwa-red" />
      )}
    </Link>
  );
}
