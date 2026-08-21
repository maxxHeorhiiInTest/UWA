import { getTranslations } from "next-intl/server";
import { RoadmapList } from "@/components/ui/RoadmapList";
import type { RoadmapNode } from "@/types/roadmap";

export async function ComingSoonWidgets() {
  const t = await getTranslations("roadmap");

  return (
    <section className="relative border-t border-uwa-panel-border bg-uwa-black px-4 py-20">
      <div className="mx-auto max-w-5xl text-center">
        <span className="rounded-full border border-uwa-blue/40 bg-uwa-blue/10 px-4 py-1 text-xs font-bold uppercase tracking-[0.2em] text-uwa-blue">
          {t("homeTitle")}
        </span>
        <div className="mt-8">
          <RoadmapList items={t.raw("home") as RoadmapNode[]} />
        </div>
      </div>
    </section>
  );
}
