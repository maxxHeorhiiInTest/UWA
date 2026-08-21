import type { Locale } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { ComingSoonPage } from "@/components/ui/ComingSoonPage";
import type { RoadmapNode } from "@/types/roadmap";

export default async function NewsPage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const [t, tRoadmap] = await Promise.all([
    getTranslations("nav"),
    getTranslations("roadmap"),
  ]);

  return (
    <ComingSoonPage
      title={t("news")}
      roadmap={tRoadmap.raw("news") as RoadmapNode[]}
    />
  );
}
