/*
 * Structural copies of `MadhhabId`, `FiqhDomain`, `NisabBasis`,
 * `FiqhCustomValues` (`../types/preferences`) and of `MADHHAB_IDS`,
 * `FIQH_DOMAINS`, `FIQH_CUSTOM_BOUNDS` (`../fiqh`) — kept local and
 * dependency-free so the API (nodenext resolution) can import this file without
 * pulling the shared type graph. `fiqh-preferences.test.ts` asserts they stay
 * identical to the originals.
 */
type MadhhabId = "hanafi" | "shafii" | "maliki" | "hanbali";
type FiqhDomain =
  | "salah"
  | "taharah"
  | "fasting"
  | "zakat"
  | "travel"
  | "hajj"
  | "udhiyah"
  | "inheritance";
type NisabBasis = "lower" | "gold" | "silver";
interface FiqhCustomValues {
  qasrDistanceKm?: number;
  residencyDays?: number;
  nisabBasis?: NisabBasis;
  haydMaxDays?: number;
  nifasMaxDays?: number;
}

export const SYNC_MADHHAB_IDS: readonly MadhhabId[] = ["hanafi", "shafii", "maliki", "hanbali"];

export const SYNC_FIQH_DOMAINS: readonly FiqhDomain[] = [
  "salah",
  "taharah",
  "fasting",
  "zakat",
  "travel",
  "hajj",
  "udhiyah",
  "inheritance",
];

export const SYNC_NISAB_BASES: readonly NisabBasis[] = ["lower", "gold", "silver"];

/** Same ranges as `FIQH_CUSTOM_BOUNDS` in `../fiqh/resolve`. */
export const SYNC_FIQH_CUSTOM_BOUNDS = {
  qasrDistanceKm: { min: 1, max: 500 },
  residencyDays: { min: 1, max: 30 },
  haydMaxDays: { min: 1, max: 20 },
  nifasMaxDays: { min: 1, max: 90 },
} as const;

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return value != null && typeof value === "object" && !Array.isArray(value);
}

function isMadhhab(value: unknown): value is MadhhabId {
  return typeof value === "string" && (SYNC_MADHHAB_IDS as readonly string[]).includes(value);
}

/** `madhhab` is a school id or `null` ("show all views"); anything else is invalid. */
export function isValidMadhhabPreference(value: unknown): value is MadhhabId | null {
  return value === null || isMadhhab(value);
}

/** Keeps only known domains whose value is a school id or `null`; `undefined` when not an object. */
export function sanitizeMadhhabOverrides(
  raw: unknown,
): Partial<Record<FiqhDomain, MadhhabId | null>> | undefined {
  if (!isPlainObject(raw)) return undefined;
  const out: Partial<Record<FiqhDomain, MadhhabId | null>> = {};
  for (const domain of SYNC_FIQH_DOMAINS) {
    if (!Object.hasOwn(raw, domain)) continue;
    const value = raw[domain];
    if (isValidMadhhabPreference(value)) out[domain] = value;
  }
  return out;
}

/** Keeps only in-range numbers and a known nisab basis (same rules as `sanitizeFiqhCustom`). */
export function sanitizeFiqhCustomValues(raw: unknown): FiqhCustomValues | undefined {
  if (!isPlainObject(raw)) return undefined;
  const out: FiqhCustomValues = {};
  for (const key of Object.keys(
    SYNC_FIQH_CUSTOM_BOUNDS,
  ) as (keyof typeof SYNC_FIQH_CUSTOM_BOUNDS)[]) {
    const value = raw[key];
    const { min, max } = SYNC_FIQH_CUSTOM_BOUNDS[key];
    if (typeof value === "number" && Number.isFinite(value) && value >= min && value <= max) {
      out[key] = value;
    }
  }
  const basis = raw.nisabBasis;
  if (typeof basis === "string" && (SYNC_NISAB_BASES as readonly string[]).includes(basis)) {
    out.nisabBasis = basis as NisabBasis;
  }
  return out;
}

/**
 * Returns `data` with the madhhab fields (NF-3.0a) cleaned: an invalid
 * `madhhab` is removed (the client then treats it as "never asked"), and
 * `madhhabOverrides` / `fiqhCustom` keep only their valid entries (dropped
 * entirely when not an object). Never rejects the record; returns `data`
 * itself when none of the fields is present.
 */
export function sanitizeFiqhPreferenceFields(
  data: Record<string, unknown>,
): Record<string, unknown> {
  if (!("madhhab" in data) && !("madhhabOverrides" in data) && !("fiqhCustom" in data)) {
    return data;
  }
  const { madhhab, madhhabOverrides, fiqhCustom, ...rest } = data;
  const out: Record<string, unknown> = rest;
  if ("madhhab" in data && isValidMadhhabPreference(madhhab)) out.madhhab = madhhab;
  if ("madhhabOverrides" in data) {
    const clean = sanitizeMadhhabOverrides(madhhabOverrides);
    if (clean) out.madhhabOverrides = clean;
  }
  if ("fiqhCustom" in data) {
    const clean = sanitizeFiqhCustomValues(fiqhCustom);
    if (clean) out.fiqhCustom = clean;
  }
  return out;
}
