import type { Locale } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { RosterView } from "@/components/roster/RosterView";
import type { RosterCategory } from "@/config/roster";
import { getWrestlers } from "@/lib/roster-store";

export const dynamic = "force-dynamic";
export const revalidate = 0;
export const fetchCache = "force-no-store";

export default async function RosterPage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("rosterPage");
  const wrestlers = await getWrestlers();

  const categories = {
    men: t("categories.men"),
    women: t("categories.women"),
    guests: t("categories.guests"),
    teams: t("categories.teams"),
    managers: t("categories.managers"),
    referees: t("categories.referees"),
    alumni: t("categories.alumni"),
  } as Record<RosterCategory, string>;

  return (
    <RosterView
      copy={{
        title: t("title"),
        categories,
        sections: {
          titles: t("sections.titles"),
          matches: t("sections.matches"),
          videos: t("sections.videos"),
          rivalries: t("sections.rivalries"),
        },
        photoSoon: t("photoSoon"),
      }}
      wrestlers={wrestlers}
    />
  );
}
