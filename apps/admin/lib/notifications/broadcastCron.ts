import { adminBroadcastsTable } from "@munib-tracker/db/schema";
import { BROADCAST_BATCH_GUARD, BROADCAST_CRON_LIMIT } from "@munib-tracker/shared";
import { sql } from "drizzle-orm";
import { getDb } from "@/lib/db";
import { processBroadcastBatch } from "./broadcastProcessor";

async function runBroadcastUntilIdle(broadcastId: number): Promise<void> {
  let done = false;
  let guard = 0;
  while (!done && guard < BROADCAST_BATCH_GUARD) {
    guard += 1;
    const result = await processBroadcastBatch(broadcastId);
    done = result.done || result.waiting === true;
  }
}

/**
 * Process due broadcasts (scheduled, user-local, and stuck immediate sends).
 * Returns broadcast ids touched.
 */
export async function processDueBroadcasts(limit = BROADCAST_CRON_LIMIT): Promise<number[]> {
  const db = getDb();
  const now = new Date();
  const rows = await db
    .select({ id: adminBroadcastsTable.id })
    .from(adminBroadcastsTable)
    .where(
      sql`${adminBroadcastsTable.status} in ('scheduled', 'processing', 'pending')
        and (
          ${adminBroadcastsTable.scheduleMode} = 'immediate'
          or ${adminBroadcastsTable.scheduleMode} = 'user_local'
          or (
            ${adminBroadcastsTable.scheduleMode} = 'fixed_utc'
            and ${adminBroadcastsTable.scheduledAt} <= ${now}
          )
        )`,
    )
    .limit(limit);

  const processed: number[] = [];
  for (const row of rows) {
    await runBroadcastUntilIdle(row.id);
    processed.push(row.id);
  }
  return processed;
}

/** @deprecated Use {@link processDueBroadcasts}. */
export const processDueScheduledBroadcasts = processDueBroadcasts;
