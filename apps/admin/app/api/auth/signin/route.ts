import { NextResponse } from "next/server";
import { buildGoogleSignInUrl } from "@/lib/auth/google";
import { createOAuthState, STATE_COOKIE } from "@/lib/auth/oauth-state";
import { isAuthConfigured } from "@/lib/env";

export async function GET(): Promise<NextResponse> {
  if (!isAuthConfigured()) {
    return NextResponse.json({ error: "Auth is not configured" }, { status: 503 });
  }
  const state = await createOAuthState();
  const url = buildGoogleSignInUrl(state);
  const response = NextResponse.redirect(url);
  response.cookies.set(STATE_COOKIE, state, {
    httpOnly: true,
    secure: process.env.ADMIN_URL?.startsWith("https") ?? false,
    sameSite: "lax",
    path: "/",
    maxAge: 600,
  });
  return response;
}

/** Ignore HEAD probes (scanners) — do not start OAuth or set state cookies. */
export function HEAD(): NextResponse {
  return new NextResponse(null, { status: 204 });
}
