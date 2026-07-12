"use client";

import { usePathname, useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { getGaMeasurementId, trackGtagPageView } from "@/lib/gtag";

/** Sends GA4 page views on App Router navigations. */
export function GoogleAnalyticsPageViews() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (!getGaMeasurementId()) return;
    const query = searchParams?.toString();
    const path = query ? `${pathname}?${query}` : pathname;
    trackGtagPageView(path);
  }, [pathname, searchParams]);

  return null;
}
