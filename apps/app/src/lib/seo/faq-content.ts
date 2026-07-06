import faqData from "@/config/seo-faq.data.json";
import { normalizePath } from "@/config/seo-routes";
import type { FaqEntry } from "@/lib/seo/structured-data";

/**
 * Human-readable FAQ content surfaced as `FAQPage` JSON-LD on key pages.
 *
 * These plain-language question/answer pairs are the single most useful signal
 * for AI answer engines (ChatGPT, Gemini, Claude, Perplexity, Google AI
 * Overviews): they state, unambiguously, what the app is and how it works.
 *
 * The data lives in `src/config/seo-faq.data.json` so it can be read both here
 * (client `<Seo>`) and by the build script `scripts/inject-seo-head.mjs` (which
 * bakes the same FAQPage into the exported HTML for non-JS crawlers) — one
 * source, no duplication. Keyed by canonical route path.
 */
const FAQ_BY_ROUTE = faqData as Record<string, readonly FaqEntry[]>;

/** FAQ entries for a route, or `undefined` if the route has none. */
export function getRouteFaq(path: string): readonly FaqEntry[] | undefined {
  return FAQ_BY_ROUTE[normalizePath(path)];
}

/** Home-page FAQ (kept as a named export for the home screen). */
export const HOME_FAQ: readonly FaqEntry[] = FAQ_BY_ROUTE["/"] ?? [];
