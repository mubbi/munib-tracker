import { NextResponse } from "next/server";

/** Requires Authorization: Bearer <ADMIN_CRON_SECRET>. Used for external schedulers (cron-job.org). */
export function requireAdminCronSecret(request: Request): NextResponse | null {
  const secret = process.env.ADMIN_CRON_SECRET?.trim();
  if (!secret) {
    return NextResponse.json({ error: "Cron not configured" }, { status: 503 });
  }
  const auth = request.headers.get("authorization");
  if (auth !== `Bearer ${secret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  return null;
}
