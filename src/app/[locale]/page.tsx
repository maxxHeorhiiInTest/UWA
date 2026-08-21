import type { Locale } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import { Hero } from "@/components/home/Hero";
import { NextEvent } from "@/components/home/NextEvent";
import { ComingSoonWidgets } from "@/components/home/ComingSoonWidgets";

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <>
      <Hero />
      <NextEvent />
      <ComingSoonWidgets />
    </>
  );
}
