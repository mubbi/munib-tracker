import { pushTokensTable } from "@munib-tracker/db/schema";
import { inArray } from "drizzle-orm";
import { getDb } from "@/lib/db";
import type { PushTargetRow } from "./pushDelivery";

/** Load push tokens for a user batch; drops duplicate token strings. */
export async function loadPushTargetsForUsers(
  userIds: readonly string[],
): Promise<PushTargetRow[]> {
  if (userIds.length === 0) return [];
  const db = getDb();
  const rows = await db
    .select({
      userId: pushTokensTable.userId,
      token: pushTokensTable.token,
      platform: pushTokensTable.platform,
    })
    .from(pushTokensTable)
    .where(inArray(pushTokensTable.userId, [...userIds]));

  const seen = new Set<string>();
  const unique: PushTargetRow[] = [];
  for (const row of rows) {
    if (seen.has(row.token)) continue;
    seen.add(row.token);
    unique.push(row);
  }
  return unique;
}

/**
 * Delete tokens a push provider reported as permanently gone (Expo
 * `DeviceNotRegistered`, Web Push 404/410). Best-effort — a failed prune must
 * never fail the broadcast batch that already delivered.
 */
export async function prunePushTokens(tokens: readonly string[]): Promise<void> {
  if (tokens.length === 0) return;
  try {
    await getDb()
      .delete(pushTokensTable)
      .where(inArray(pushTokensTable.token, [...new Set(tokens)]));
  } catch {
    // Retried naturally on the next broadcast that hits the same token.
  }
}
