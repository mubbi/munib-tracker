import { type NextRequest, NextResponse } from "next/server";
import { isKnownContentPath } from "@/content/routes";

/**
 * Dynamic content routes are prerendered with Partial Prerendering, so a
 * `notFound()` inside the page can only stream a noindexed not-found UI with a
 * 200 status. Reject unknown slugs here instead, so crawlers get a real 404.
 */
export function proxy(request: NextRequest) {
  if (isKnownContentPath(request.nextUrl.pathname)) return NextResponse.next();
  // Rewriting to a path no route matches renders the app's not-found page with status 404.
  return NextResponse.rewrite(new URL("/__not-found", request.url));
}

export const config = {
  matcher: ["/features/:path+", "/compare/:path+", "/for/:path+", "/resources/:path+"],
};
