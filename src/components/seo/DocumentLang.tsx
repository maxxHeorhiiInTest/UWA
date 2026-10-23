"use client";

import { useEffect } from "react";
import { htmlLang } from "@/config/site";

export function DocumentLang({ locale }: { locale: string }) {
  const lang = htmlLang(locale);

  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  return null;
}
