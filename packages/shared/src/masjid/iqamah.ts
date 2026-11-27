import type { PrivateMasjidTimes } from "../types/masjid";
import type { ObligatoryPrayer } from "../types/prayer";
import type { IqamahDaily, IqamahTimetable, JumuahSlot, MasjidOsmType, MasjidSummary } from "./osm";

/**
 * Iqamah precedence + lookups (NF-3.11). Times shown, in order: the user's
 * private times ("Your times"), then a licence-cleared public source, then
 * **nothing** — with nothing, iqamah UI is hidden and features fall back to the
 * adhan times.
 */

export const IQAMAH_PRAYERS: readonly ObligatoryPrayer[] = [
  "fajr",
  "dhuhr",
  "asr",
  "maghrib",
  "isha",
];

const WALL_CLOCK = /^([01]\d|2[0-3]):[0-5]\d$/;

/** Default and bounds for "leave now" lead time (walk/drive minutes). */
export const MASJID_WALK_MINUTES_DEFAULT = 10;
export const MASJID_WALK_MINUTES_MIN = 0;
export const MASJID_WALK_MINUTES_MAX = 90;

export function clampWalkMinutes(value: unknown): number {
  if (typeof value !== "number" || !Number.isFinite(value)) return MASJID_WALK_MINUTES_DEFAULT;
  return Math.min(MASJID_WALK_MINUTES_MAX, Math.max(MASJID_WALK_MINUTES_MIN, Math.round(value)));
}

export function isWallClock(value: unknown): value is string {
  return typeof value === "string" && WALL_CLOCK.test(value);
}

/** Stable key for a masjid (`node/123`). */
export function masjidKey(ref: { osmType: MasjidOsmType; osmId: string }): string {
  return `${ref.osmType}/${ref.osmId}`;
}

export function osmUrl(ref: { osmType: MasjidOsmType; osmId: string }): string {
  return `https://www.openstreetmap.org/${ref.osmType}/${ref.osmId}`;
}

function cleanDaily(daily: unknown): IqamahDaily | undefined {
  if (!daily || typeof daily !== "object") return undefined;
  const out: IqamahDaily = {};
  for (const prayer of IQAMAH_PRAYERS) {
    const value = (daily as Record<string, unknown>)[prayer];
    if (isWallClock(value)) out[prayer] = value;
  }
  return Object.keys(out).length > 0 ? out : undefined;
}

function cleanJumuah(slots: unknown): JumuahSlot[] | undefined {
  if (!Array.isArray(slots)) return undefined;
  const out: JumuahSlot[] = [];
  for (const slot of slots) {
    if (!slot || typeof slot !== "object") continue;
    const s = slot as Record<string, unknown>;
    const clean: JumuahSlot = {};
    if (isWallClock(s.khutbahAt)) clean.khutbahAt = s.khutbahAt;
    if (isWallClock(s.iqamahAt)) clean.iqamahAt = s.iqamahAt;
    if (clean.khutbahAt || clean.iqamahAt) out.push(clean);
  }
  return out.length > 0 ? out : undefined;
}

/**
 * Drops malformed entries from a private-times record (sync payloads, OCR
 * imports). Returns null when nothing usable is left.
 */
export function sanitizePrivateMasjidTimes(value: unknown): PrivateMasjidTimes | null {
  if (!value || typeof value !== "object") return null;
  const v = value as Record<string, unknown>;
  const daily = cleanDaily(v.daily);
  const jumuah = cleanJumuah(v.jumuah);
  let monthly: Record<string, IqamahDaily> | undefined;
  if (v.monthly && typeof v.monthly === "object") {
    for (const [date, row] of Object.entries(v.monthly as Record<string, unknown>)) {
      if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) continue;
      const clean = cleanDaily(row);
      if (!clean) continue;
      monthly ??= {};
      monthly[date] = clean;
    }
  }
  if (!daily && !jumuah && !monthly) return null;
  const out: PrivateMasjidTimes = {
    updatedAt: typeof v.updatedAt === "string" ? v.updatedAt : new Date(0).toISOString(),
  };
  if (daily) out.daily = daily;
  if (monthly) out.monthly = monthly;
  if (jumuah) out.jumuah = jumuah;
  if (v.origin === "manual" || v.origin === "ocr") out.origin = v.origin;
  return out;
}

export function hasAnyIqamah(timetable: IqamahTimetable | null | undefined): boolean {
  if (!timetable) return false;
  return !!(
    (timetable.daily && Object.keys(timetable.daily).length > 0) ||
    (timetable.monthly && Object.keys(timetable.monthly).length > 0) ||
    (timetable.jumuah && timetable.jumuah.length > 0)
  );
}

/** Private > public > null. */
export function resolveIqamahTimetable(input: {
  privateTimes?: PrivateMasjidTimes | null;
  publicTimetable?: IqamahTimetable | null;
}): IqamahTimetable | null {
  const own = sanitizePrivateMasjidTimes(input.privateTimes);
  if (own) {
    const timetable: IqamahTimetable = { source: { id: "private" } };
    if (own.daily) timetable.daily = own.daily;
    if (own.monthly) timetable.monthly = own.monthly;
    if (own.jumuah) timetable.jumuah = own.jumuah;
    return timetable;
  }
  if (hasAnyIqamah(input.publicTimetable)) return input.publicTimetable ?? null;
  return null;
}

/** Iqamah "HH:mm" for a prayer on a local date (`YYYY-MM-DD`): the dated row, then the daily row. */
export function iqamahTimeFor(
  timetable: IqamahTimetable | null | undefined,
  date: string,
  prayer: ObligatoryPrayer,
): string | null {
  if (!timetable) return null;
  const dated = timetable.monthly?.[date]?.[prayer];
  if (isWallClock(dated)) return dated;
  const daily = timetable.daily?.[prayer];
  return isWallClock(daily) ? daily : null;
}

/** Jumu'ah iqamah times ("HH:mm", ascending) from a timetable. */
export function jumuahIqamahTimes(timetable: IqamahTimetable | null | undefined): string[] {
  const out = new Set<string>();
  for (const slot of timetable?.jumuah ?? []) {
    const at = slot.iqamahAt ?? slot.khutbahAt;
    if (isWallClock(at)) out.add(at);
  }
  return [...out].sort();
}

/** Great-circle distance in metres. */
export function distanceMeters(
  a: { lat: number; lon: number },
  b: { lat: number; lon: number },
): number {
  const R = 6_371_000;
  const toRad = (deg: number) => (deg * Math.PI) / 180;
  const dLat = toRad(b.lat - a.lat);
  const dLon = toRad(b.lon - a.lon);
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(a.lat)) * Math.cos(toRad(b.lat)) * Math.sin(dLon / 2) ** 2;
  return 2 * R * Math.asin(Math.min(1, Math.sqrt(h)));
}

/** Summaries sorted by exact distance from the user (computed on-device only). */
export function sortByDistance<T extends { lat: number; lon: number }>(
  items: readonly T[],
  from: { lat: number; lon: number },
): Array<T & { distanceMeters: number }> {
  return items
    .map((item) => ({ ...item, distanceMeters: distanceMeters(from, item) }))
    .sort((a, b) => a.distanceMeters - b.distanceMeters);
}

/** Localised name: `name:<locale>` first, then `name`; undefined when OSM has none. */
export function masjidDisplayName(
  masjid: Pick<MasjidSummary, "name" | "names">,
  locale: string,
): string | undefined {
  const lang = locale.split(/[-_]/)[0]?.toLowerCase() ?? locale;
  return masjid.names?.[lang] ?? masjid.name;
}
