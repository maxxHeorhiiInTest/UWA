import type { Locale } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import { Hero } from "@/components/home/Hero";

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return <Hero />;
}
