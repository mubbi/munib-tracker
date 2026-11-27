/**
 * Paging maths for the welcome carousel (`app/(onboarding)/intro.tsx`). The pager
 * is always laid out LTR; in RTL the slides are rendered in reverse so "next"
 * still moves the content the reading way. "Logical" = narrative slide index.
 */

/**
 * Current slide plus neighbours — keeps off-screen pages from mounting nested
 * ScrollViews / SF Symbols during cold start (Sentry WatchdogTermination).
 */
export function isNearbySlide(logicalIndex: number, currentIndex: number): boolean {
  return Math.abs(logicalIndex - currentIndex) <= 1;
}

/** Pager page (LTR content-offset units) for a narrative slide. Its own inverse. */
export function pageIndexForLogical(logical: number, pageCount: number, rtl: boolean): number {
  return rtl ? pageCount - 1 - logical : logical;
}

/** Narrative slide shown at a horizontal content offset (clamped to the pages). */
export function logicalForOffset(
  offsetX: number,
  width: number,
  pageCount: number,
  rtl: boolean,
): number {
  const page = Math.min(Math.max(Math.round(offsetX / width), 0), pageCount - 1);
  return pageIndexForLogical(page, pageCount, rtl);
}
