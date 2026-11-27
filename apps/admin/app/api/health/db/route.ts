import { type NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth/session";
import { requireAdminCronSecret } from "@/lib/cron/requireAdminCronSecret";
import { probeAdminDatabase } from "@/lib/db-probe";
import { dbProbeResponseBody } from "@/lib/db-probe-view";

export const dynamic = "force-dynamic";

/**
 * Gated diagnostics — only when ?iAmAdmin=1 (same reveal gate as sign-in).
 * Full detail (host / database / pg error) needs an admin session or
 * `Authorization: Bearer <ADMIN_CRON_SECRET>`; everyone else gets coarse status.
 */
export async function GET(request: NextRequest): Promise<NextResponse> {
  if (request.nextUrl.searchParams.get("iAmAdmin") !== "1") {
    return NextResponse.json({ ok: false }, { status: 404 });
  }

  const detailed =
    requireAdminCronSecret(request) === null || (await getSession().catch(() => null)) !== null;
  const probe = await probeAdminDatabase();
  return NextResponse.json(dbProbeResponseBody(probe, detailed), {
    headers: { "Cache-Control": "no-store" },
  });
}
