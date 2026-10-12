import type { Locale } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { AcademyView } from "@/components/academy/AcademyView";
import { academyTrainers } from "@/config/academy";
import { getWrestlers } from "@/lib/roster-store";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function AcademyPage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const [t, wrestlers] = await Promise.all([
    getTranslations("academyPage"),
    getWrestlers(),
  ]);

  const trainers = academyTrainers.map((trainer) => {
    const livePhoto = wrestlers.find(
      (wrestler) => wrestler.id === trainer.wrestlerId
    )?.photos[0];
    return {
      ...trainer,
      photo: livePhoto || trainer.photo,
    };
  });

  return (
    <AcademyView
      copy={{
        title: t("title"),
        trainers: t("trainers"),
        contacts: t("contacts"),
        play: t("play"),
      }}
      trainers={trainers}
    />
  );
}
