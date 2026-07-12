import { NextResponse } from "next/server";
import { writeAuditLog } from "@/lib/audit";
import { getSession, revokeSession, SESSION_COOKIE } from "@/lib/auth/session";

export async function POST(): Promise<NextResponse> {
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
  );
  response.cookies.delete(SESSION_COOKIE);
  return response;
}
