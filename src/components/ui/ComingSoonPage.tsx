import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { RoadmapList } from "@/components/ui/RoadmapList";
import type { RoadmapNode } from "@/types/roadmap";

export async function ComingSoonPage({
  title,
  roadmap,
}: {
  title: string;
  roadmap?: RoadmapNode[];
}) {
  const t = await getTranslations("comingSoon");

  return (
    <section className="relative overflow-hidden bg-uwa-black px-4 py-24">
      <div
        className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(198,42,66,0.2),transparent_50%)]"
        aria-hidden
      />
      <div className="relative mx-auto flex max-w-5xl flex-col items-center text-center">
        <span className="rounded-full border border-uwa-red/40 bg-uwa-red/10 px-4 py-1 text-xs font-bold uppercase tracking-[0.2em] text-uwa-red">
          {t("badge")}
        </span>
        <h1 className="mt-6 font-heading text-4xl tracking-wide text-uwa-white sm:text-5xl">
          {title}
        </h1>
        <p className="mt-4 max-w-xl text-base text-uwa-white/60">
          {t("description")}
        </p>

        {roadmap && roadmap.length > 0 && (
          <div className="mt-12 w-full">
            <h2 className="text-xs font-bold uppercase tracking-widest text-uwa-white/40">
              {t("roadmapTitle")}
            </h2>
            <div className="mt-5">
              <RoadmapList items={roadmap} />
            </div>
          </div>
        )}

        <Link
          href="/"
          className="mt-12 rounded-full border border-uwa-white/30 px-6 py-2.5 text-sm font-bold uppercase tracking-wide text-uwa-white transition-colors hover:border-uwa-white"
        >
          {t("back")}
        </Link>
      </div>
    </section>
  );
}
