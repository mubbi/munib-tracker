import { type NextRequest, NextResponse } from "next/server";
import createMiddleware from "next-intl/middleware";
import { isKnownContentPath } from "@/content/routes";
import { stripLocalePrefix } from "@/i18n/locales";
import { DEFAULT_LOCALE, routing } from "@/i18n/routing";

const handleI18nRouting = createMiddleware(routing);

/**
 * 1. Locale routing (next-intl): every page URL carries its locale
 *    (`/en/features`, `/ur/features`). Unprefixed URLs never reach here —
 *    `next.config.ts` redirects them permanently to `/en/…` first.
 * 2. Real 404s: dynamic content routes are prerendered with Partial
 *    Prerendering, so a `notFound()` inside the page can only stream a
 *    noindexed not-found UI with a 200 status. Unknown slugs are rejected
 *    here instead, so crawlers get a real 404.
 */
export function proxy(request: NextRequest) {
  if (!isKnownContentPath(stripLocalePrefix(request.nextUrl.pathname))) {
    // A path no route matches renders `app/global-not-found.tsx` with status 404.
    return NextResponse.rewrite(new URL(`/${DEFAULT_LOCALE}/__not-found`, request.url));
  }
  return handleI18nRouting(request);
}

export const config = {
  // Every page route; skips API routes, Next internals and files with an
  // extension (sitemap.xml, robots.txt, images, the web manifest…).
  matcher: ["/((?!api|_next|_vercel|.*\\..*).*)"],
};
