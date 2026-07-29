import { type NextRequest, NextResponse } from "next/server";
import { probeAdminDatabase } from "@/lib/db-probe";

/** Gated diagnostics — only when ?iAmAdmin=1 (same reveal gate as sign-in). */
export async function GET(request: NextRequest): Promise<NextResponse> {
  if (request.nextUrl.searchParams.get("iAmAdmin") !== "1") {
    return NextResponse.json({ ok: false }, { status: 404 });
  }

  const probe = await probeAdminDatabase();
  return NextResponse.json({
    ok: probe.connected && probe.adminTables,
    ...probe,
  });
}
