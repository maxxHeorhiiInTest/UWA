import type { Metadata } from "next";
import { NextIntlClientProvider, hasLocale, type Locale } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import { htmlLang } from "@/config/site";
import { AnalyticsPageView } from "@/components/analytics/AnalyticsPageView";
import { GoogleAnalytics } from "@/components/analytics/GoogleAnalytics";
import { Header } from "@/components/layout/Header";
import { DocumentLang } from "@/components/seo/DocumentLang";
import { JsonLd } from "@/components/seo/JsonLd";
import { TicketsProvider } from "@/components/tickets/TicketsProvider";
import { getSiteSettings } from "@/lib/site-settings-store";
import { organizationJsonLd, websiteJsonLd } from "@/lib/seo";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "meta" });

  return {
    title: {
      default: t("title"),
      template: `%s | ${t("shortTitle")}`,
    },
    description: t("description"),
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  setRequestLocale(locale);
  const [tTickets, settings] = await Promise.all([
    getTranslations("ticketsPage"),
    getSiteSettings(),
  ]);
  const lang = htmlLang(locale);

  return (
    <NextIntlClientProvider>
      <GoogleAnalytics />
      <AnalyticsPageView />
      <DocumentLang locale={locale} />
      <JsonLd data={organizationJsonLd()} />
      <JsonLd data={websiteJsonLd(locale)} />
      <TicketsProvider
        ticketsUrl={settings.ticketsUrl}
        copy={{
          title: tTickets("title"),
          iframeTitle: tTickets("iframeTitle"),
          close: tTickets("close"),
          fallback: tTickets("fallback"),
          fallbackHint: tTickets("fallbackHint"),
        }}
      >
        <Header />
        <main lang={lang} className="min-h-0 flex-1 overflow-y-auto">
          {children}
        </main>
      </TicketsProvider>
    </NextIntlClientProvider>
  );
}
