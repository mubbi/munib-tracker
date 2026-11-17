import { getAdminCronHttpBucket } from "@/lib/admin-cron-buckets";
import { recordCronRun } from "@/lib/cron/recordCronRun";
import { getAdminEnv } from "@/lib/env";
import { processDueBroadcasts } from "@/lib/notifications/broadcastCron";
import { tryAcquireCronLock } from "@/lib/redis/redisCronLock";

const BUCKET_ID = "process-broadcasts";

/** ~14 minutes — slightly under the typical 15m external cron interval. */
const BROADCAST_CRON_LOCK_MS = 14 * 60 * 1000;

export async function runProcessBroadcastsCron(): Promise<{
  ok: true;
  processed: number[];
  skipped?: boolean;
}> {
  getAdminEnv();
  const dayBucket = new Date().toISOString().slice(0, 13); // YYYY-MM-DDTHH
  const acquired = await tryAcquireCronLock(BUCKET_ID, dayBucket, BROADCAST_CRON_LOCK_MS);
  if (!acquired) {
    return { ok: true, processed: [], skipped: true };
  }
  // Lock-skipped runs are not logged — the instance holding the lock records its own run.
  const jobIds = getAdminCronHttpBucket(BUCKET_ID)?.jobIds ?? [BUCKET_ID];
  const processed = await recordCronRun(BUCKET_ID, jobIds, () => processDueBroadcasts());
  return { ok: true, processed };
}
