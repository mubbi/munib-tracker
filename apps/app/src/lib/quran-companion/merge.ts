import type { MemorizationMap, PracticeHistory, PracticeSummary } from "./types";

/**
 * Sync merges for the two history blobs (§10, decision D7). The generic
 * `UNION_MERGE_ENTITIES` rule does `{ ...remote, ...local }`, which never
 * converges when two devices edit the same ayah, and cannot propagate a delete.
 * These are pure so Jest covers them without the sync engine.
 */

export const MAX_HISTORY = 30;

export const EMPTY_MEMORIZATION: MemorizationMap = { schemaVersion: 1, records: {} };
export const EMPTY_HISTORY: PracticeHistory = { schemaVersion: 1, items: [] };

function isObject(value: unknown): value is Record<string, unknown> {
  return value != null && typeof value === "object" && !Array.isArray(value);
}

/** Coerce a stored/remote value into a memorization map; unknown shapes become empty. */
export function asMemorizationMap(value: unknown): MemorizationMap | null {
  if (!isObject(value)) return EMPTY_MEMORIZATION;
  const version = typeof value.schemaVersion === "number" ? value.schemaVersion : 1;
  if (version > 1) return null; // written by a newer build — leave it alone
  return {
    schemaVersion: 1,
    records: isObject(value.records) ? (value.records as MemorizationMap["records"]) : {},
  };
}

export function asPracticeHistory(value: unknown): PracticeHistory | null {
  if (!isObject(value)) return EMPTY_HISTORY;
  const version = typeof value.schemaVersion === "number" ? value.schemaVersion : 1;
  if (version > 1) return null;
  return {
    schemaVersion: 1,
    clearedAt: typeof value.clearedAt === "string" ? value.clearedAt : undefined,
    items: Array.isArray(value.items) ? (value.items as PracticeSummary[]) : [],
  };
}

/**
 * Union of keys; for a key on both sides the later `updatedAt` wins (ties keep
 * local). Both devices reach the same map after one round trip each.
 */
export function mergeMemorization(local: unknown, remote: unknown): MemorizationMap {
  const l = asMemorizationMap(local);
  const r = asMemorizationMap(remote);
  // A local blob from a newer schema is left exactly as it is.
  if (!l) return local as MemorizationMap;
  if (!r) return l;
  const records = { ...l.records };
  for (const [key, remoteRecord] of Object.entries(r.records)) {
    const localRecord = records[key];
    // Stored records carry `u` = updatedAt in epoch seconds (memorization-codec.ts).
    if (!localRecord || (remoteRecord?.u ?? 0) > (localRecord.u ?? 0)) {
      records[key] = remoteRecord;
    }
  }
  return { schemaVersion: 1, records };
}

/** Drop items at/before `clearedAt`, dedupe by id, newest {@link MAX_HISTORY} by `endedAt`. */
export function normalizeHistory(history: PracticeHistory): PracticeHistory {
  const cleared = history.clearedAt;
  const byId = new Map<string, PracticeSummary>();
  for (const item of history.items) {
    if (!item?.id || !item.endedAt) continue;
    if (cleared && item.endedAt <= cleared) continue;
    const existing = byId.get(item.id);
    if (!existing || item.endedAt > existing.endedAt) byId.set(item.id, item);
  }
  const items = [...byId.values()]
    .sort((a, b) => (a.endedAt < b.endedAt ? 1 : a.endedAt > b.endedAt ? -1 : 0))
    .slice(0, MAX_HISTORY);
  return { schemaVersion: 1, ...(cleared ? { clearedAt: cleared } : {}), items };
}

/**
 * `clearedAt` is the later of the two; items are the union by id minus anything
 * ended at or before it; newest 30 kept. "Delete practice history" therefore
 * propagates, and an offline phone cannot bring the old sessions back.
 */
export function mergeSessions(local: unknown, remote: unknown): PracticeHistory {
  const l = asPracticeHistory(local);
  const r = asPracticeHistory(remote);
  if (!l) return local as PracticeHistory;
  if (!r) return l;
  const clearedAt = [l.clearedAt, r.clearedAt].filter(Boolean).sort().pop();
  return normalizeHistory({
    schemaVersion: 1,
    ...(clearedAt ? { clearedAt } : {}),
    items: [...l.items, ...r.items],
  });
}
