import { type NextRequest, NextResponse } from "next/server";
import { writeAuditLog } from "@/lib/audit";
import { exchangeGoogleCode, fetchGoogleProfile } from "@/lib/auth/google";
import { isPlausibleGoogleAuthCode } from "@/lib/auth/oauth-code";
import { STATE_COOKIE, verifyOAuthState } from "@/lib/auth/oauth-state";
import { createAdminSession, lookupAdminByEmail, SESSION_COOKIE } from "@/lib/auth/session";
import { classifyAdminDatabaseError, extractPgError } from "@/lib/db-errors";
import { getAdminEnv, isAuthConfigured } from "@/lib/env";
import { normalizeEmail } from "@/lib/utils";

function logOAuthFailure(error: unknown): void {
  const message = error instanceof Error ? error.message : String(error);
  const cause =
    error instanceof Error && error.cause instanceof Error ? error.cause.message : undefined;
  console.error("[admin oauth] callback failed:", message, cause ? { cause } : undefined);
}

async function safeWriteAuditLog(input: Parameters<typeof writeAuditLog>[0]): Promise<void> {
  try {
    await writeAuditLog(input);
  } catch (error) {
    if (process.env.NODE_ENV === "development") {
      console.error("[admin oauth] audit log failed:", error);
    }
  }
}

export async function GET(request: NextRequest): Promise<NextResponse> {
  if (!isAuthConfigured()) {
    return NextResponse.redirect(new URL("/login?error=auth_not_configured", request.url));
  }

  const code = request.nextUrl.searchParams.get("code");
  const state = request.nextUrl.searchParams.get("state");
  const storedState = request.cookies.get(STATE_COOKIE)?.value;

  if (
    !code ||
    !state ||
    !storedState ||
    state !== storedState ||
    !isPlausibleGoogleAuthCode(code)
  ) {
    return NextResponse.redirect(new URL("/login?error=invalid_oauth", request.url));
  }

  const validState = await verifyOAuthState(state);
  if (!validState) {
    return NextResponse.redirect(new URL("/login?error=expired_oauth", request.url));
  }

  const ipAddress =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    request.headers.get("x-real-ip") ??
    undefined;
  const userAgent = request.headers.get("user-agent") ?? undefined;

  try {
    const { accessToken } = await exchangeGoogleCode(code);
    const profile = await fetchGoogleProfile(accessToken);
    const admin = await lookupAdminByEmail(normalizeEmail(profile.email));

    const response = admin?.enabled
      ? NextResponse.redirect(new URL("/dashboard", getAdminEnv().ADMIN_URL))
      : NextResponse.redirect(new URL("/access-denied", getAdminEnv().ADMIN_URL));

    response.cookies.delete(STATE_COOKIE);

    if (!admin?.enabled) {
      await safeWriteAuditLog({
        adminEmail: normalizeEmail(profile.email),
        adminRole: "support",
        action: "sign_in_denied",
        metadata: { reason: admin ? "disabled" : "not_allowlisted" },
        ipAddress,
      });
      return response;
    }

    const sessionToken = await createAdminSession(admin, { ipAddress, userAgent });
    response.cookies.set(SESSION_COOKIE, sessionToken, {
      httpOnly: true,
      secure: getAdminEnv().ADMIN_URL.startsWith("https"),
      sameSite: "lax",
      path: "/",
      maxAge: 7 * 24 * 60 * 60,
    });

    await safeWriteAuditLog({
      adminUserId: admin.id,
      adminEmail: admin.email,
      adminRole: admin.role,
      action: "sign_in",
      ipAddress,
    });

    return response;
  } catch (error) {
    logOAuthFailure(error);
    const dbCode = classifyAdminDatabaseError(error);
    const errorCode =
      dbCode === "db_schema" || dbCode === "db_connect" || dbCode === "db_unavailable"
        ? dbCode
        : "oauth_failed";
    if (errorCode !== "oauth_failed") {
      const pg = extractPgError(error);
      console.error("[admin oauth] database error detail:", {
        code: pg?.code,
        message: pg?.message,
        classified: dbCode,
      });
    }
    return NextResponse.redirect(new URL(`/login?error=${errorCode}`, request.url));
  }
}

/** Ignore HEAD probes — do not exchange codes or redirect to login with oauth_failed. */
export function HEAD(): NextResponse {
  return new NextResponse(null, { status: 204 });
}
