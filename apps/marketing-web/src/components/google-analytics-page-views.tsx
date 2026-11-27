"use client";

import { usePathname, useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { trackScrollDepth } from "@/lib/analytics";
import { getGaMeasurementId, trackGtagPageView } from "@/lib/gtag";

/** Scroll milestones reported once per page view (GA4's built-in `scroll` is 90 % only). */
export const SCROLL_MILESTONES = [25, 50, 75, 90] as const;

/** Share of the page (0–100) the visitor has scrolled past the bottom of the viewport. */
export function scrolledPercent(scrollY: number, viewport: number, pageHeight: number): number {
  const scrollable = pageHeight - viewport;
  if (scrollable <= 0) return 100;
  return Math.min(100, Math.round((scrollY / scrollable) * 100));
}

/**
 * Sends GA4 page views on App Router navigations, and how far each page was
 * read (`scroll_depth` at 25 / 50 / 75 / 90 %), so the journey through long
 * feature pages and guides is visible. Does nothing without a measurement id;
 * consent mode still governs storage.
 */
export function GoogleAnalyticsPageViews() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (!getGaMeasurementId()) return;
    const query = searchParams?.toString();
    const path = query ? `${pathname}?${query}` : pathname;
    trackGtagPageView(path);
  }, [pathname, searchParams]);

  // biome-ignore lint/correctness/useExhaustiveDependencies: restart the milestones on each page
  useEffect(() => {
    if (!getGaMeasurementId()) return;
    const sent = new Set<number>();
    let ticking = false;
    const check = () => {
      ticking = false;
      const percent = scrolledPercent(
        window.scrollY,
        window.innerHeight,
        document.documentElement.scrollHeight,
      );
      for (const milestone of SCROLL_MILESTONES) {
        if (percent >= milestone && !sent.has(milestone)) {
          sent.add(milestone);
          trackScrollDepth(milestone);
        }
      }
      if (sent.size === SCROLL_MILESTONES.length) window.removeEventListener("scroll", onScroll);
    };
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(check);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [pathname]);

  return null;
}
