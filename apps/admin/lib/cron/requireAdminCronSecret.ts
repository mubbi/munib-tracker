import { createHash, timingSafeEqual } from "node:crypto";
import { NextResponse } from "next/server";

/** Constant-time compare; hashing first keeps the length out of the timing too. */
function safeEqual(a: string, b: string): boolean {
  const digest = (value: string) => createHash("sha256").update(value).digest();
  return timingSafeEqual(digest(a), digest(b));
}

/** Requires Authorization: Bearer <ADMIN_CRON_SECRET>. Used for external schedulers (cron-job.org). */
export function requireAdminCronSecret(request: Request): NextResponse | null {
  const secret = process.env.ADMIN_CRON_SECRET?.trim();
  if (!secret) {
    return NextResponse.json({ error: "Cron not configured" }, { status: 503 });
  }
  const auth = request.headers.get("authorization");
  if (!auth || !safeEqual(auth, `Bearer ${secret}`)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  return null;
}
