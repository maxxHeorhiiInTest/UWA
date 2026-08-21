import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { Logo } from "@/components/ui/Logo";

export async function Hero() {
  const t = await getTranslations("home");

  return (
    <section className="relative overflow-hidden bg-uwa-black">
      <div
        className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(56,104,214,0.28),transparent_45%),radial-gradient(circle_at_80%_70%,rgba(231,185,58,0.16),transparent_50%)]"
        aria-hidden
      />
      <div
        className="absolute inset-y-0 right-0 hidden w-1/2 bg-uwa-blue/10 diagonal-clip sm:block"
        aria-hidden
      />
      <Logo
        className="pointer-events-none absolute -right-16 top-1/2 hidden h-[130%] w-auto -translate-y-1/2 opacity-[0.14] sm:block"
        highlight={false}
        aria-hidden
      />

      <div className="relative mx-auto flex min-h-[calc(100vh-4rem)] max-w-7xl flex-col items-start justify-center px-4 py-24 sm:px-6 lg:px-8">
        <span className="rounded-full border border-uwa-blue/40 bg-uwa-blue/10 px-4 py-1 text-xs font-bold uppercase tracking-[0.2em] text-uwa-blue">
          {t("kicker")}
        </span>

        <h1 className="mt-6 font-heading text-5xl leading-[1.05] tracking-wide text-uwa-white sm:text-7xl lg:text-8xl">
          <span className="block">{t("titleLine1")}</span>
          <span className="block text-uwa-gold">{t("titleLine2")}</span>
        </h1>

        <p className="mt-6 max-w-xl text-base text-uwa-white/70 sm:text-lg">
          {t("tagline")}
        </p>

        <div className="mt-10 flex flex-wrap gap-4">
          <Link
            href="/events"
            className="rounded-full bg-uwa-gold px-7 py-3 text-sm font-bold uppercase tracking-wide text-uwa-black transition-colors hover:bg-uwa-gold-dark"
          >
            {t("ctaPrimary")}
          </Link>
          <Link
            href="/roster"
            className="rounded-full border border-uwa-white/30 px-7 py-3 text-sm font-bold uppercase tracking-wide text-uwa-white transition-colors hover:border-uwa-white"
          >
            {t("ctaSecondary")}
          </Link>
        </div>
      </div>
    </section>
  );
}
