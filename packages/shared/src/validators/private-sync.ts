/**
 * D46 (2026-11-24): what must never reach the server in plaintext, shared by the
 * client (strip before push, ignore on pull) and the API (strip on push and on
 * pull, so an old client or an old row can't leak it).
 *
 * - The excused period (hayd / nifas / illness / travel) — the active reason
 *   in preferences and the per-day reason on prayer logs — syncs only inside the
 *   E2E vault document `vault_excused` (or stays on the device).
 * - The khushu journal syncs only as the vault document `vault_khushu`; the old
 *   plaintext `khushu_journal` entity is accepted for one release so old clients
 *   don't fail, but the server stores nothing for it.
 * - The synced location is rounded to ~1 km; exact coordinates stay on the device.
 */

/** Preference fields kept off the plaintext `preferences` sync record. */
export const PRIVATE_PREFERENCE_KEYS = ["activeExcusedReason"] as const;

/** Prayer-log fields kept off the plaintext `prayer_logs` sync records (`isExcused` stays). */
export const PRIVATE_PRAYER_LOG_KEYS = ["excusedReason"] as const;

/** Plaintext entities replaced by a vault document: accepted, never stored or returned. */
export const DEPRECATED_PLAINTEXT_ENTITIES = ["khushu_journal"] as const;

/** Decimal places kept for synced coordinates: 0.01° ≈ 1.1 km of latitude. */
export const SYNCED_COORDINATE_DECIMALS = 2;

export function isDeprecatedPlaintextEntity(entity: unknown): boolean {
  return (DEPRECATED_PLAINTEXT_ENTITIES as readonly unknown[]).includes(entity);
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return value != null && typeof value === "object" && !Array.isArray(value);
}

function without(data: Record<string, unknown>, keys: readonly string[]): Record<string, unknown> {
  if (!keys.some((key) => key in data)) return data;
  const out = { ...data };
  for (const key of keys) delete out[key];
  return out;
}

export function stripPrivatePreferenceFields<T extends Record<string, unknown>>(data: T): T {
  return without(data, PRIVATE_PREFERENCE_KEYS) as T;
}

export function stripPrivatePrayerLogFields<T extends Record<string, unknown>>(data: T): T {
  return without(data, PRIVATE_PRAYER_LOG_KEYS) as T;
}

/** Rounds one coordinate to {@link SYNCED_COORDINATE_DECIMALS} places (non-numbers pass through). */
export function coarsenCoordinate<T>(value: T): T {
  if (typeof value !== "number" || !Number.isFinite(value)) return value;
  const factor = 10 ** SYNCED_COORDINATE_DECIMALS;
  return (Math.round(value * factor) / factor) as T;
}

/** A location object with `latitude` / `longitude` rounded to ~1 km. */
export function coarsenLocation<T>(location: T): T {
  if (!isRecord(location)) return location;
  if (!("latitude" in location) && !("longitude" in location)) return location;
  return {
    ...location,
    latitude: coarsenCoordinate(location.latitude),
    longitude: coarsenCoordinate(location.longitude),
  } as T;
}

/**
 * The `data` of one sync record with every private field removed. Unknown
 * entities pass through untouched. Never throws.
 */
export function stripPrivateSyncData(
  entity: unknown,
  data: Record<string, unknown>,
): Record<string, unknown> {
  if (!isRecord(data)) return data;
  switch (entity) {
    case "preferences":
      return stripPrivatePreferenceFields(data);
    case "prayer_logs":
      return stripPrivatePrayerLogFields(data);
    case "location":
      return "value" in data ? { ...data, value: coarsenLocation(data.value) } : data;
    default:
      return data;
  }
}
