import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { isLocalAuthBypassEnabled, SESSION_COOKIE } from "@/lib/auth/constants";

// Route handlers listed here enforce their own auth (OAuth state, cron bearer,
// coarse-only health output without a session).
const PUBLIC_PATHS = ["/login", "/access-denied", "/api/auth", "/api/cron", "/api/health"];

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  if (PUBLIC_PATHS.some((p) => pathname === p || pathname.startsWith(`${p}/`))) {
    return NextResponse.next();
  }
  if (pathname.startsWith("/_next") || pathname.startsWith("/favicon")) {
    return NextResponse.next();
  }
  if (isLocalAuthBypassEnabled()) {
    return NextResponse.next();
  }
  const session = request.cookies.get(SESSION_COOKIE)?.value;
  if (!session && pathname !== "/") {
    return NextResponse.redirect(new URL("/login", request.url));
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)"],
};
