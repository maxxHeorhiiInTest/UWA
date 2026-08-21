import { getTranslations } from "next-intl/server";
import { externalLinks } from "@/config/links";

export async function NextEvent() {
  const t = await getTranslations("nextEvent");

  return (
    <section className="relative border-t border-uwa-panel-border bg-uwa-black-soft">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="overflow-hidden rounded-2xl border border-uwa-panel-border bg-uwa-panel">
          <div className="grid gap-8 p-8 sm:p-10 lg:grid-cols-[1.4fr_1fr] lg:items-center lg:gap-12">
            <div>
              <span className="rounded-full border border-uwa-blue/40 bg-uwa-blue/10 px-4 py-1 text-xs font-bold uppercase tracking-[0.2em] text-uwa-blue">
                {t("eyebrow")}
              </span>

              <h2 className="mt-5 font-heading text-4xl tracking-wide text-uwa-white sm:text-5xl">
                {t("title")}
              </h2>
              <p className="mt-2 text-sm font-medium uppercase tracking-wide text-uwa-white/50">
                {t("subtitle")}
              </p>

              <p className="mt-5 max-w-xl text-base text-uwa-white/70">
                {t("description")}
              </p>
            </div>

            <div className="flex flex-col gap-4 border-t border-uwa-panel-border pt-6 lg:border-t-0 lg:border-l lg:pt-0 lg:pl-12">
              <div>
                <div className="text-xs font-bold uppercase tracking-widest text-uwa-white/40">
                  {t("dateLabel")}
                </div>
                <div className="mt-1 text-lg font-semibold text-uwa-white">
                  {t("date")}
                </div>
              </div>
              <div>
                <div className="text-xs font-bold uppercase tracking-widest text-uwa-white/40">
                  {t("venueLabel")}
                </div>
                <div className="mt-1 text-sm text-uwa-white/70">
                  {t("venue")}
                </div>
              </div>

              <a
                href={externalLinks.tickets}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-2 inline-flex items-center justify-center rounded-full bg-uwa-gold px-6 py-3 text-sm font-bold uppercase tracking-wide text-uwa-black transition-colors hover:bg-uwa-gold-dark"
              >
                {t("cta")}
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
