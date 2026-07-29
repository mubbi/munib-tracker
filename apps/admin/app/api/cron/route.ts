import { NextResponse } from "next/server";
import { ADMIN_CRON_HTTP_BUCKETS } from "@/lib/admin-cron-buckets";
import { requireAdminCronSecret } from "@/lib/cron/requireAdminCronSecret";

export async function GET(request: Request): Promise<NextResponse> {
  const authError = requireAdminCronSecret(request);
  if (authError) {
    return authError;
  }

  return NextResponse.json({
    buckets: ADMIN_CRON_HTTP_BUCKETS.map((bucket) => ({
      id: bucket.id,
      description: bucket.description,
      scheduleUtc: bucket.scheduleUtc,
      jobIds: [...bucket.jobIds],
      url: `/api/cron/${bucket.id}`,
    })),
  });
}
