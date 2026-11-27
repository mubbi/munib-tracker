import { NextResponse } from "next/server";

function originOf(value: string | undefined | null): string | null {
  if (!value?.trim()) return null;
  try {
    return new URL(value.trim()).origin;
  } catch {
    return null;
  }
}

/**
 * CSRF guard for cookie-authenticated route handlers (server actions already get
 * Next's built-in Origin check; route handlers do not).
 *
 * A browser always attaches `Origin` and/or `Sec-Fetch-Site` to a cross-origin
 * POST, so: reject a foreign `Origin`, reject `Sec-Fetch-Site: cross-site|same-site`
 * (sibling subdomains such as the marketing site count as "same-site" and still
 * receive SameSite=Lax cookies). Requests with neither header come from
 * non-browser clients, which carry no ambient cookies.
 */
export function isSameOriginRequest(request: Request, adminUrl?: string): boolean {
  const allowed = new Set<string>();
  const own = originOf(request.url);
  if (own) allowed.add(own);
  const configured = originOf(adminUrl);
  if (configured) allowed.add(configured);

  const origin = request.headers.get("origin");
  if (origin !== null) {
    // `Origin: null` (sandboxed iframes, opaque redirects) never matches.
    if (!allowed.has(origin.trim())) return false;
  }

  const fetchSite = request.headers.get("sec-fetch-site")?.trim().toLowerCase();
  if (fetchSite === "cross-site" || fetchSite === "same-site") return false;

  return true;
}

/** Returns a 403 response for cross-origin requests, or null when the request may proceed. */
export function rejectCrossOrigin(request: Request): NextResponse | null {
  if (isSameOriginRequest(request, process.env.ADMIN_URL)) return null;
  return NextResponse.json({ error: "Forbidden" }, { status: 403 });
}
