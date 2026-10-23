import { Suspense } from "react";
import type { Locale } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { TicketsCheckout } from "@/components/tickets/TicketsCheckout";
import { getSiteSettings } from "@/lib/site-settings-store";
import { seoMetadata } from "@/lib/seo";

export const dynamic = "force-dynamic";
export const revalidate = 0;
export const generateMetadata = seoMetadata("tickets");

export default async function TicketsPage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const [t, settings] = await Promise.all([
    getTranslations("ticketsPage"),
    getSiteSettings(),
  ]);

  return (
    <Suspense>
      <TicketsCheckout
        ticketsUrl={settings.ticketsUrl}
        copy={{
          title: t("title"),
          description: t("description"),
          iframeTitle: t("iframeTitle"),
          fallback: t("fallback"),
          fallbackHint: t("fallbackHint"),
        }}
      />
    </Suspense>
  );
}
