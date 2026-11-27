import { NextResponse } from "next/server";
import { writeAuditLog } from "@/lib/audit";
import { rejectCrossOrigin } from "@/lib/auth/csrf";
import { getSession, revokeSession, SESSION_COOKIE } from "@/lib/auth/session";

export async function POST(request: Request): Promise<NextResponse> {
  // Logout CSRF: a foreign page must not be able to end (or probe) an admin session.
  const forbidden = rejectCrossOrigin(request);
  if (forbidden) return forbidden;

  const session = await getSession();
  if (session) {
    await revokeSession(session.sessionId);
    await writeAuditLog({
      adminUserId: session.adminUserId,
      adminEmail: session.email,
      adminRole: session.role,
      action: "sign_out",
    });
  }
  const response = NextResponse.redirect(
    new URL("/login", process.env.ADMIN_URL ?? "http://localhost:3002"),
    // 303 so the browser follows the POST with a GET.
    303,
  );
  response.cookies.delete(SESSION_COOKIE);
  return response;
}
