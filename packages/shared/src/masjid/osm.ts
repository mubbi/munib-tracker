/**
 * NF-3.11 OpenStreetMap layer shared by the app and the API: masjid types,
 * geohash cells, the `service_times` parser and Overpass query/parse helpers.
 *
 * **Self-contained on purpose — no imports.** The API compiles with nodenext
 * resolution, where the shared package's extensionless relative imports fail
 * (TS2835); the API imports only this file via `@munib-tracker/shared/masjid/osm`.
 */

// ── Types ──────────────────────────────────────────────────────────────────

/**
 * Masjid finder & layer (NF-3.11, D5). Every public field comes from
 * OpenStreetMap (ODbL) and is **optional**: a field with no public data is
 * omitted, never guessed. Private iqamah times are the user's own and never
 * leave their devices except through their own account sync.
 */

export type MasjidOsmType = "node" | "way" | "relation";

export const MASJID_OSM_TYPES: readonly MasjidOsmType[] = ["node", "way", "relation"];

/** Facility badges parsed from `wheelchair`, `toilets`, `toilets:wheelchair` (only when `yes`). */
export type MasjidBadge = "wheelchair" | "toilets" | "toilets_wheelchair";

/** "HH:mm" 24-hour wall clock in the masjid's local time. */
export type WallClockTime = string;

export interface MasjidSummary {
  osmType: MasjidOsmType;
  osmId: string;
  /** Untranslated `name` tag. */
  name?: string;
  /** `name:<lang>` tags (lang → name), only those present. */
  names?: Record<string, string>;
  lat: number;
  lon: number;
  /** Friday `service_times` entries between 11:00 and 15:30 ("HH:mm"), only when parsed from public data. */
  jumuah?: WallClockTime[];
  badges?: MasjidBadge[];
}

/** Address parts from `addr:*` tags (each only if present). */
export interface MasjidAddress {
  housenumber?: string;
  street?: string;
  city?: string;
  postcode?: string;
  country?: string;
  /** `addr:full` when the mapper used it. */
  full?: string;
}

export interface MasjidDetail extends MasjidSummary {
  address?: MasjidAddress;
  website?: string;
  phone?: string;
  denomination?: string;
  /** Non-Friday (or out-of-window) `service_times` entries, verbatim. */
  serviceTimes?: string[];
  /** Raw `opening_hours` (the app shows only an open/closed hint). */
  openingHours?: string;
  /** Public timetable from a licence-cleared `TimetableSource` (none cleared yet — §13 item 2). */
  timetable?: IqamahTimetable;
}

/** Structural copy of `ObligatoryPrayer` (this module has no imports so the API can use it). */
export type MasjidPrayer = "fajr" | "dhuhr" | "asr" | "maghrib" | "isha";

export type IqamahDaily = Partial<Record<MasjidPrayer, WallClockTime>>;

export interface JumuahSlot {
  khutbahAt?: WallClockTime;
  iqamahAt?: WallClockTime;
}

export type IqamahTimetableSource =
  | { id: string; attribution: string; fetchedAt: string }
  | { id: "private" };

export interface IqamahTimetable {
  daily?: IqamahDaily;
  /** YYYY-MM-DD → per-prayer times (e.g. an imported monthly timetable, NF-3.12). */
  monthly?: Record<string, IqamahDaily>;
  jumuah?: JumuahSlot[];
  source: IqamahTimetableSource;
}

/** `GET /masjids?cell=<geohash5>` response. */
export interface MasjidListResponse {
  masjids: MasjidSummary[];
  /** Attribution lines the client must show with the data (ODbL). */
  attribution: string[];
  /** True when the upstream failed and the data is older than the fresh TTL (or empty). */
  stale: boolean;
}

/** `GET /masjids/:osmType/:osmId` response. */
export type MasjidDetailResponse = MasjidDetail & { attribution: string[]; stale: boolean };

export const OSM_ATTRIBUTION = "© OpenStreetMap contributors";
export const OSM_LICENCE = "ODbL 1.0";
export const OSM_COPYRIGHT_URL = "https://www.openstreetmap.org/copyright";

// ── Geohash ────────────────────────────────────────────────────────────────

/**
 * Minimal geohash (base-32, Niemeyer) for the masjid finder (NF-3.11). The app
 * only ever sends a precision-5 cell (~4.9 × 4.9 km at the equator) to the API,
 * never precise coordinates; the API widens it to the cell plus its 8 neighbours.
 */

const BASE32 = "0123456789bcdefghjkmnpqrstuvwxyz";

/** Precision used for masjid lookups and cache keys (plan: geohash-5, ~5 km). */
export const MASJID_CELL_PRECISION = 5;

const CELL_PATTERN = /^[0-9b-hjkmnp-z]+$/;

export interface GeohashBounds {
  south: number;
  west: number;
  north: number;
  east: number;
}

export function isValidGeohash(value: unknown, precision = MASJID_CELL_PRECISION): value is string {
  return typeof value === "string" && value.length === precision && CELL_PATTERN.test(value);
}

export function encodeGeohash(lat: number, lon: number, precision = MASJID_CELL_PRECISION): string {
  if (!Number.isFinite(lat) || !Number.isFinite(lon)) {
    throw new RangeError("encodeGeohash: non-finite coordinate");
  }
  const clampedLat = Math.max(-90, Math.min(90, lat));
  const wrappedLon = ((((lon + 180) % 360) + 360) % 360) - 180;
  let latMin = -90;
  let latMax = 90;
  let lonMin = -180;
  let lonMax = 180;
  let hash = "";
  let bit = 0;
  let ch = 0;
  let evenBit = true;
  while (hash.length < precision) {
    if (evenBit) {
      const mid = (lonMin + lonMax) / 2;
      if (wrappedLon >= mid) {
        ch = (ch << 1) | 1;
        lonMin = mid;
      } else {
        ch <<= 1;
        lonMax = mid;
      }
    } else {
      const mid = (latMin + latMax) / 2;
      if (clampedLat >= mid) {
        ch = (ch << 1) | 1;
        latMin = mid;
      } else {
        ch <<= 1;
        latMax = mid;
      }
    }
    evenBit = !evenBit;
    bit += 1;
    if (bit === 5) {
      hash += BASE32[ch];
      bit = 0;
      ch = 0;
    }
  }
  return hash;
}

export function decodeGeohashBounds(hash: string): GeohashBounds {
  let latMin = -90;
  let latMax = 90;
  let lonMin = -180;
  let lonMax = 180;
  let evenBit = true;
  for (const char of hash) {
    const idx = BASE32.indexOf(char);
    if (idx < 0) throw new RangeError(`decodeGeohashBounds: invalid character "${char}"`);
    for (let n = 4; n >= 0; n -= 1) {
      const bitN = (idx >> n) & 1;
      if (evenBit) {
        const mid = (lonMin + lonMax) / 2;
        if (bitN === 1) lonMin = mid;
        else lonMax = mid;
      } else {
        const mid = (latMin + latMax) / 2;
        if (bitN === 1) latMin = mid;
        else latMax = mid;
      }
      evenBit = !evenBit;
    }
  }
  return { south: latMin, west: lonMin, north: latMax, east: lonMax };
}

/**
 * The cell plus its 8 neighbours (deduped — near the poles some collapse).
 * Order: centre first, then N, NE, E, SE, S, SW, W, NW.
 */
export function geohashWithNeighbours(hash: string): string[] {
  const b = decodeGeohashBounds(hash);
  const height = b.north - b.south;
  const width = b.east - b.west;
  const lat = (b.north + b.south) / 2;
  const lon = (b.east + b.west) / 2;
  const offsets: Array<[number, number]> = [
    [0, 0],
    [1, 0],
    [1, 1],
    [0, 1],
    [-1, 1],
    [-1, 0],
    [-1, -1],
    [0, -1],
    [1, -1],
  ];
  const out: string[] = [];
  for (const [dy, dx] of offsets) {
    const nLat = lat + dy * height;
    if (nLat > 90 || nLat < -90) continue;
    const cell = encodeGeohash(nLat, lon + dx * width, hash.length);
    if (!out.includes(cell)) out.push(cell);
  }
  return out;
}

/** Bounding box covering a set of cells (antimeridian-crossing sets fall back to the centre cell). */
export function boundsOfCells(cells: readonly string[]): GeohashBounds {
  const all = cells.map(decodeGeohashBounds);
  const merged = all.reduce<GeohashBounds>(
    (acc, b) => ({
      south: Math.min(acc.south, b.south),
      west: Math.min(acc.west, b.west),
      north: Math.max(acc.north, b.north),
      east: Math.max(acc.east, b.east),
    }),
    { south: 90, west: 180, north: -90, east: -180 },
  );
  // A 3×3 block is ~15 km wide; anything wider means the set wrapped the antimeridian.
  if (merged.east - merged.west > 1 && all[0]) return all[0];
  return merged;
}

// ── service_times ──────────────────────────────────────────────────────────

/**
 * OSM `service_times` parser (NF-3.11). The tag uses `opening_hours` syntax; we
 * accept the common subset — weekday selectors (`Fr`, `Mo-Fr`, `Sa,Su`) followed
 * by times (`13:00`, `12:30,13:30`, `13:00-14:00`). Rules that use anything else
 * (months, public holidays, comments, `off`, …) are **hidden**, never guessed.
 *
 * - A rule whose weekday selector is exactly Friday, with a start time between
 *   11:00 and 15:30, becomes a Jumu'ah time ("Jumu'ah (from OpenStreetMap)").
 * - Every other parseable rule is kept verbatim ("Service times (from
 *   OpenStreetMap)") and is never reinterpreted as a per-prayer iqamah time.
 */

const DAYS = ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"] as const;
type Day = (typeof DAYS)[number];

const TIME = "(?:[01]?\\d|2[0-3]):[0-5]\\d";
const TIME_SPAN = new RegExp(`^(${TIME})(?:\\s*-\\s*(${TIME}))?$`);
const DAY_TOKEN = /^(Mo|Tu|We|Th|Fr|Sa|Su)(?:\s*-\s*(Mo|Tu|We|Th|Fr|Sa|Su))?$/;

/** Jumu'ah window (local time, inclusive). */
export const JUMUAH_EARLIEST_MINUTES = 11 * 60;
export const JUMUAH_LATEST_MINUTES = 15 * 60 + 30;

export interface ParsedServiceTimes {
  /** Friday start times inside the Jumu'ah window, "HH:mm", ascending, deduped. */
  jumuah: string[];
  /** Other parseable rules, verbatim (trimmed). */
  other: string[];
}

function pad(value: string): string {
  const [h = "0", m = "00"] = value.split(":");
  return `${h.padStart(2, "0")}:${m}`;
}

function minutesOf(hhmm: string): number {
  const [h, m] = hhmm.split(":").map(Number);
  return (h ?? 0) * 60 + (m ?? 0);
}

function expandDays(selector: string): Set<Day> | null {
  const days = new Set<Day>();
  for (const part of selector.split(",")) {
    const match = DAY_TOKEN.exec(part.trim());
    if (!match) return null;
    const from = DAYS.indexOf(match[1] as Day);
    const to = match[2] ? DAYS.indexOf(match[2] as Day) : from;
    // Wrapping ranges (Sa-Mo) are valid opening_hours.
    for (let i = from; ; i = (i + 1) % 7) {
      days.add(DAYS[i] as Day);
      if (i === to) break;
    }
  }
  return days;
}

interface ParsedRule {
  days: Set<Day> | null;
  starts: string[];
}

function parseRule(rule: string): ParsedRule | null {
  const trimmed = rule.trim();
  if (!trimmed) return null;
  // "Fr 12:30,13:30" → selector + times; a bare time list applies to every day.
  const firstSpace = trimmed.search(/\s/);
  const head = firstSpace < 0 ? trimmed : trimmed.slice(0, firstSpace);
  let days: Set<Day> | null = null;
  let timesPart = trimmed;
  if (/^[A-Z][a-z]/.test(head)) {
    days = expandDays(head);
    if (!days) return null;
    timesPart = firstSpace < 0 ? "" : trimmed.slice(firstSpace + 1);
  }
  const starts: string[] = [];
  for (const span of timesPart.split(",")) {
    const match = TIME_SPAN.exec(span.trim());
    if (!match?.[1]) return null;
    starts.push(pad(match[1]));
  }
  if (starts.length === 0) return null;
  return { days, starts };
}

/** Returns null when the value is empty or nothing in it parses. */
export function parseServiceTimes(value: string | undefined | null): ParsedServiceTimes | null {
  if (typeof value !== "string") return null;
  const jumuah = new Set<string>();
  const other: string[] = [];
  for (const rule of value.split(/;|\|\|/)) {
    const parsed = parseRule(rule);
    if (!parsed) continue;
    const fridayOnly = parsed.days?.size === 1 && parsed.days.has("Fr");
    if (fridayOnly) {
      const inWindow = parsed.starts.filter((start) => {
        const minutes = minutesOf(start);
        return minutes >= JUMUAH_EARLIEST_MINUTES && minutes <= JUMUAH_LATEST_MINUTES;
      });
      for (const start of inWindow) jumuah.add(start);
      if (inWindow.length === parsed.starts.length) continue;
    }
    other.push(rule.trim());
  }
  if (jumuah.size === 0 && other.length === 0) return null;
  return { jumuah: [...jumuah].sort(), other };
}

// ── Overpass ───────────────────────────────────────────────────────────────

/**
 * OpenStreetMap Overpass query building + tolerant tag parsing (NF-3.11, D5).
 * Every field is optional; a missing, empty or malformed tag is omitted.
 */

export interface OverpassElement {
  type?: unknown;
  id?: unknown;
  lat?: unknown;
  lon?: unknown;
  center?: { lat?: unknown; lon?: unknown } | null;
  tags?: Record<string, unknown> | null;
}

export interface OverpassResponse {
  elements?: unknown;
}

const OSM_TYPES = new Set<MasjidOsmType>(["node", "way", "relation"]);
const MAX_TAG_LENGTH = 255;

function fmt(value: number): string {
  return value.toFixed(6);
}

/** Masjids inside a bounding box (the requested geohash cell + neighbours, ≤ ~15 km wide). */
export function buildOverpassBboxQuery(bounds: GeohashBounds, timeoutSeconds = 20): string {
  const bbox = `${fmt(bounds.south)},${fmt(bounds.west)},${fmt(bounds.north)},${fmt(bounds.east)}`;
  return [
    `[out:json][timeout:${timeoutSeconds}];`,
    "(",
    `nwr["amenity"="place_of_worship"]["religion"="muslim"](${bbox});`,
    `nwr["building"="mosque"](${bbox});`,
    ");",
    "out center tags;",
  ].join("");
}

/** One element by its OSM ref. */
export function buildOverpassElementQuery(
  osmType: MasjidOsmType,
  osmId: string,
  timeoutSeconds = 20,
): string {
  return `[out:json][timeout:${timeoutSeconds}];${osmType}(${osmId});out center tags;`;
}

export function isValidOsmId(value: unknown): value is string {
  return typeof value === "string" && /^[1-9]\d{0,15}$/.test(value);
}

export function isMasjidOsmType(value: unknown): value is MasjidOsmType {
  return typeof value === "string" && OSM_TYPES.has(value as MasjidOsmType);
}

function tag(tags: Record<string, unknown>, key: string): string | undefined {
  const value = tags[key];
  if (typeof value !== "string") return undefined;
  const trimmed = value.trim();
  if (!trimmed || trimmed.length > MAX_TAG_LENGTH) return undefined;
  return trimmed;
}

function coord(value: unknown, limit: number): number | undefined {
  return typeof value === "number" && Number.isFinite(value) && Math.abs(value) <= limit
    ? value
    : undefined;
}

function isMasjid(tags: Record<string, unknown>): boolean {
  const religion = tag(tags, "religion");
  if (tag(tags, "amenity") === "place_of_worship" && religion === "muslim") return true;
  // building=mosque without a conflicting religion tag.
  return tag(tags, "building") === "mosque" && (religion === undefined || religion === "muslim");
}

function badges(tags: Record<string, unknown>): MasjidBadge[] | undefined {
  const out: MasjidBadge[] = [];
  if (tag(tags, "wheelchair") === "yes") out.push("wheelchair");
  if (tag(tags, "toilets") === "yes") out.push("toilets");
  if (tag(tags, "toilets:wheelchair") === "yes") out.push("toilets_wheelchair");
  return out.length > 0 ? out : undefined;
}

function localisedNames(tags: Record<string, unknown>): Record<string, string> | undefined {
  const out: Record<string, string> = {};
  for (const key of Object.keys(tags)) {
    const match = /^name:([a-z]{2,3})$/.exec(key);
    if (!match?.[1]) continue;
    const value = tag(tags, key);
    if (value) out[match[1]] = value;
  }
  return Object.keys(out).length > 0 ? out : undefined;
}

function summaryOf(element: OverpassElement): MasjidSummary | null {
  if (!isMasjidOsmType(element.type)) return null;
  const id =
    typeof element.id === "number" && Number.isSafeInteger(element.id) && element.id > 0
      ? String(element.id)
      : typeof element.id === "string" && isValidOsmId(element.id)
        ? element.id
        : null;
  if (!id) return null;
  const tags = element.tags && typeof element.tags === "object" ? element.tags : {};
  if (!isMasjid(tags)) return null;
  const lat = coord(element.lat, 90) ?? coord(element.center?.lat, 90);
  const lon = coord(element.lon, 180) ?? coord(element.center?.lon, 180);
  if (lat === undefined || lon === undefined) return null;

  const summary: MasjidSummary = { osmType: element.type, osmId: id, lat, lon };
  const name = tag(tags, "name");
  if (name) summary.name = name;
  const names = localisedNames(tags);
  if (names) summary.names = names;
  const jumuah = parseServiceTimes(tag(tags, "service_times"))?.jumuah;
  if (jumuah && jumuah.length > 0) summary.jumuah = jumuah;
  const b = badges(tags);
  if (b) summary.badges = b;
  return summary;
}

function elementsOf(response: unknown): OverpassElement[] {
  if (!response || typeof response !== "object") return [];
  const elements = (response as OverpassResponse).elements;
  return Array.isArray(elements)
    ? elements.filter((e): e is OverpassElement => !!e && typeof e === "object")
    : [];
}

/** Parses an Overpass JSON response into deduped masjid summaries (bad elements skipped). */
export function parseOverpassSummaries(response: unknown): MasjidSummary[] {
  const seen = new Set<string>();
  const out: MasjidSummary[] = [];
  for (const element of elementsOf(response)) {
    const summary = summaryOf(element);
    if (!summary) continue;
    const key = `${summary.osmType}/${summary.osmId}`;
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(summary);
  }
  return out;
}

function safeUrl(value: string | undefined): string | undefined {
  if (!value) return undefined;
  const withScheme = /^https?:\/\//i.test(value) ? value : `https://${value}`;
  try {
    const url = new URL(withScheme);
    return url.protocol === "https:" || url.protocol === "http:" ? url.toString() : undefined;
  } catch {
    return undefined;
  }
}

function safePhone(value: string | undefined): string | undefined {
  // First number only (mappers separate several with ";"), digits and dial symbols.
  const first = value?.split(";")[0]?.trim();
  if (!first || !/^\+?[\d\s().-]{4,32}$/.test(first)) return undefined;
  return first;
}

function addressOf(tags: Record<string, unknown>): MasjidAddress | undefined {
  const address: MasjidAddress = {};
  const parts: Array<[keyof MasjidAddress, string]> = [
    ["housenumber", "addr:housenumber"],
    ["street", "addr:street"],
    ["city", "addr:city"],
    ["postcode", "addr:postcode"],
    ["country", "addr:country"],
    ["full", "addr:full"],
  ];
  for (const [field, key] of parts) {
    const value = tag(tags, key);
    if (value) address[field] = value;
  }
  return Object.keys(address).length > 0 ? address : undefined;
}

/** Detail for one element (or null when it isn't a masjid / lacks coordinates). */
export function parseOverpassDetail(response: unknown): MasjidDetail | null {
  for (const element of elementsOf(response)) {
    const summary = summaryOf(element);
    if (!summary) continue;
    const tags = element.tags && typeof element.tags === "object" ? element.tags : {};
    const detail: MasjidDetail = { ...summary };
    const address = addressOf(tags);
    if (address) detail.address = address;
    const website = safeUrl(tag(tags, "website") ?? tag(tags, "contact:website"));
    if (website) detail.website = website;
    const phone = safePhone(tag(tags, "phone") ?? tag(tags, "contact:phone"));
    if (phone) detail.phone = phone;
    const denomination = tag(tags, "denomination");
    if (denomination) detail.denomination = denomination;
    const other = parseServiceTimes(tag(tags, "service_times"))?.other;
    if (other && other.length > 0) detail.serviceTimes = other;
    const openingHours = tag(tags, "opening_hours");
    if (openingHours) detail.openingHours = openingHours;
    return detail;
  }
  return null;
}
