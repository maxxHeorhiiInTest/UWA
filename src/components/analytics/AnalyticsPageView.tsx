"use client";

import { useEffect, useRef } from "react";
import { useLocale } from "next-intl";
import { usePathname } from "@/i18n/navigation";
import { isGaEnabled, trackPageView } from "@/lib/analytics";

export function AnalyticsPageView() {
  const pathname = usePathname();
  const locale = useLocale();
  const isFirst = useRef(true);

  useEffect(() => {
    if (isFirst.current) {
      isFirst.current = false;
      if (!isGaEnabled()) trackPageView();
      return;
    }
    trackPageView();
  }, [pathname, locale]);

  return null;
}
