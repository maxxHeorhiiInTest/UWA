import type { Locale } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { AcademyView } from "@/components/academy/AcademyView";
import {
  academyCities,
  academyTrainerFromRoster,
} from "@/config/academy";
import { getWrestlers } from "@/lib/roster-store";
import { seoMetadata } from "@/lib/seo";

export const dynamic = "force-dynamic";
export const revalidate = 0;
export const generateMetadata = seoMetadata("academy");

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

  const trainers = academyCities.flatMap((city) =>
    city.trainers.map((slot) =>
      academyTrainerFromRoster(
        city.id,
        slot,
        wrestlers.find((wrestler) => wrestler.id === slot.wrestlerId)
      )
    )
  );

  return (
    <AcademyView
      copy={{
        title: t("title"),
        trainers: t("trainers"),
        contacts: t("contacts"),
        play: t("play"),
        cities: {
          kyiv: t("cities.kyiv"),
          dnipro: t("cities.dnipro"),
          lviv: t("cities.lviv"),
          kharkiv: t("cities.kharkiv"),
        },
      }}
      trainers={trainers}
    />
  );
}
