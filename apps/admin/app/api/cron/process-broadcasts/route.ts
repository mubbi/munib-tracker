import { NextResponse } from "next/server";
import { requireAdminCronSecret } from "@/lib/cron/requireAdminCronSecret";
import { runProcessBroadcastsCron } from "@/lib/cron/runProcessBroadcastsCron";

export const maxDuration = 300;

async function handleCron(request: Request): Promise<NextResponse> {
  const authError = requireAdminCronSecret(request);
  if (authError) {
    return authError;
  }

  const result = await runProcessBroadcastsCron();
  return NextResponse.json(result);
}

/** cron-job.org and similar services often default to GET. */
export async function GET(request: Request): Promise<NextResponse> {
  return handleCron(request);
}

export async function POST(request: Request): Promise<NextResponse> {
  return handleCron(request);
}
