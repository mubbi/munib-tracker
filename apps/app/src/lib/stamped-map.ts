/**
 * Per-key newest-write-wins merge for small synced maps (habit checks,
 * Dhul-Hijjah deeds). Each map keeps its values exactly as before plus a
 * parallel `stamps` map: key → ISO instant of the last write to that key,
 * **including a clear** (value absent + stamp present = tombstone). That is
 * what lets an untick or a lowered count survive the next sync instead of
 * being restored by the other device's union / max.
 *
 * Migration: data written before stamps existed has none. A missing stamp
 * sorts as the empty string, so any stamped write beats it, and two unstamped
 * sides fall back to `tie` (the old union / max behaviour).
 */
export interface StampedMap<V> {
  values: Record<string, V>;
  stamps: Record<string, string>;
}

/** Records a write (or, with `value == null`, a clear) of one key at `nowIso`. */
export function writeStamped<V>(
  map: StampedMap<V>,
  key: string,
  value: V | null | undefined,
  nowIso: string,
): StampedMap<V> {
  const values = { ...map.values };
  if (value == null) delete values[key];
  else values[key] = value;
  return { values, stamps: { ...map.stamps, [key]: nowIso } };
}

/**
 * Merges two stamped maps key by key: the side with the newer stamp wins
 * (including a newer clear); on equal stamps `tie` picks the value (`null` =
 * cleared). Pure and symmetric when `tie` is.
 */
export function mergeStamped<V>(
  local: StampedMap<V>,
  remote: StampedMap<V>,
  tie: (a: V | undefined, b: V | undefined) => V | undefined,
): StampedMap<V> {
  const keys = new Set([
    ...Object.keys(local.values),
    ...Object.keys(local.stamps),
    ...Object.keys(remote.values),
    ...Object.keys(remote.stamps),
  ]);
  const values: Record<string, V> = {};
  const stamps: Record<string, string> = {};
  for (const key of keys) {
    const l = local.stamps[key] ?? "";
    const r = remote.stamps[key] ?? "";
    // ISO strings compare chronologically; a missing stamp ("") is the oldest.
    const localNewer = l > r;
    const value =
      l === r
        ? tie(local.values[key], remote.values[key])
        : localNewer
          ? local.values[key]
          : remote.values[key];
    const stamp = localNewer ? l : r;
    if (value !== undefined) values[key] = value;
    if (stamp) stamps[key] = stamp;
  }
  return { values, stamps };
}

/** Keeps only stamp entries that are valid ISO strings (sync / backup input is untrusted). */
export function sanitizeStamps(
  raw: unknown,
  isKey: (key: string) => boolean,
): Record<string, string> {
  const out: Record<string, string> = {};
  if (raw == null || typeof raw !== "object" || Array.isArray(raw)) return out;
  for (const [key, value] of Object.entries(raw as Record<string, unknown>)) {
    if (typeof value === "string" && isKey(key) && Number.isFinite(Date.parse(value)))
      out[key] = value;
  }
  return out;
}
