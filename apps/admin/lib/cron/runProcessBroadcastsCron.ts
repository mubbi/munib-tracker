import { getAdminEnv } from "@/lib/env";
import { processDueBroadcasts } from "@/lib/notifications/broadcastCron";
import { tryAcquireCronLock } from "@/lib/redis/redisCronLock";

/** ~14 minutes — slightly under the typical 15m external cron interval. */
const BROADCAST_CRON_LOCK_MS = 14 * 60 * 1000;

export async function runProcessBroadcastsCron(): Promise<{
  ok: true;
  processed: number[];
  skipped?: boolean;
}> {
  getAdminEnv();
  const dayBucket = new Date().toISOString().slice(0, 13); // YYYY-MM-DDTHH
  const acquired = await tryAcquireCronLock(
    "process-broadcasts",
    dayBucket,
    BROADCAST_CRON_LOCK_MS,
  );
  if (!acquired) {
    return { ok: true, processed: [], skipped: true };
  }
  const processed = await processDueBroadcasts();
  return { ok: true, processed };
}
