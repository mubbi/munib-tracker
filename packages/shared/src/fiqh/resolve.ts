import type {
  FiqhCustomValues,
  FiqhDomain,
  MadhhabId,
  NisabBasis,
  UserPreferences,
} from "../types/preferences";
import { FIQH_DOMAINS, MADHHAB_IDS, MADHHAB_RULES, type MadhhabRules } from "./madhhab-rules";

/** The preference fields the fiqh resolver reads. */
export type FiqhPreferences = Pick<UserPreferences, "madhhab" | "madhhabOverrides" | "fiqhCustom">;

export type FiqhCustomKey = keyof FiqhCustomValues;

/**
 * Accepted ranges for a scholar-given custom value. Out-of-range or non-numeric
 * values are ignored (treated as unset) — never clamped into a ruling.
 */
export const FIQH_CUSTOM_BOUNDS = {
  qasrDistanceKm: { min: 1, max: 500 },
  residencyDays: { min: 1, max: 30 },
  haydMaxDays: { min: 1, max: 20 },
  nifasMaxDays: { min: 1, max: 90 },
} as const satisfies Record<Exclude<FiqhCustomKey, "nisabBasis">, { min: number; max: number }>;

const NISAB_BASES: readonly NisabBasis[] = ["lower", "gold", "silver"];

export function isMadhhabId(value: unknown): value is MadhhabId {
  return typeof value === "string" && (MADHHAB_IDS as readonly string[]).includes(value);
}

export function isFiqhDomain(value: unknown): value is FiqhDomain {
  return typeof value === "string" && (FIQH_DOMAINS as readonly string[]).includes(value);
}

export function isNisabBasis(value: unknown): value is NisabBasis {
  return typeof value === "string" && (NISAB_BASES as readonly string[]).includes(value);
}

/** `undefined` = the user was never asked (show the "choose your madhhab" prompts). */
export function isMadhhabUnset(prefs: FiqhPreferences): boolean {
  return prefs.madhhab === undefined;
}

/** The global school, with anything malformed (e.g. a bad synced value) treated as "never asked". */
export function globalSchool(prefs: FiqhPreferences): MadhhabId | null | undefined {
  const { madhhab } = prefs;
  if (madhhab === null) return null;
  return isMadhhabId(madhhab) ? madhhab : undefined;
}

/** True when the user set this domain independently of the global school (talfiq caution applies). */
export function hasDomainOverride(prefs: FiqhPreferences, domain: FiqhDomain): boolean {
  const overrides = prefs.madhhabOverrides;
  if (overrides == null || !Object.hasOwn(overrides, domain)) return false;
  const value = overrides[domain];
  return value === null || isMadhhabId(value);
}

/**
 * The school that governs `domain`: a valid domain override (including an
 * explicit `null` = all views for this domain) beats the global school; an unset
 * or `null` global school resolves to `null` — the caller shows all views.
 */
export function resolveSchool(prefs: FiqhPreferences, domain: FiqhDomain): MadhhabId | null {
  if (hasDomainOverride(prefs, domain)) return prefs.madhhabOverrides?.[domain] ?? null;
  return globalSchool(prefs) ?? null;
}

function inBounds(value: unknown, bounds: { min: number; max: number }): value is number {
  return (
    typeof value === "number" &&
    Number.isFinite(value) &&
    value >= bounds.min &&
    value <= bounds.max
  );
}

/** Drops malformed / out-of-range custom values (e.g. from an older client or a corrupt sync blob). */
export function sanitizeFiqhCustom(raw: unknown): FiqhCustomValues {
  if (raw == null || typeof raw !== "object") return {};
  const input = raw as Record<string, unknown>;
  const out: FiqhCustomValues = {};
  for (const key of Object.keys(FIQH_CUSTOM_BOUNDS) as (keyof typeof FIQH_CUSTOM_BOUNDS)[]) {
    const value = input[key];
    if (inBounds(value, FIQH_CUSTOM_BOUNDS[key])) out[key] = value;
  }
  if (isNisabBasis(input.nisabBasis)) out.nisabBasis = input.nisabBasis;
  return out;
}

/** Keys of `fiqhCustom` that are valid and therefore applied (UI labels them "Custom"). */
export function customKeysApplied(prefs: FiqhPreferences): FiqhCustomKey[] {
  return Object.keys(sanitizeFiqhCustom(prefs.fiqhCustom)) as FiqhCustomKey[];
}

/** Returns a copy of `rules` with the valid custom numeric overrides applied. */
export function applyFiqhCustom(rules: MadhhabRules, custom: unknown): MadhhabRules {
  const c = sanitizeFiqhCustom(custom);
  if (Object.keys(c).length === 0) return rules;
  return {
    ...rules,
    hayd: {
      ...rules.hayd,
      ...(c.haydMaxDays != null && { maxDays: c.haydMaxDays }),
      ...(c.nifasMaxDays != null && { nifasMaxDays: c.nifasMaxDays }),
    },
    travel: {
      ...rules.travel,
      ...(c.qasrDistanceKm != null && {
        qasrDistanceKm: c.qasrDistanceKm,
        qasrDistanceKmRange: [c.qasrDistanceKm, c.qasrDistanceKm] as const,
      }),
      ...(c.residencyDays != null && { residencyDays: c.residencyDays }),
    },
    zakat: {
      ...rules.zakat,
      ...(c.nisabBasis != null && { nisabBasis: c.nisabBasis, nisabBasisContested: false }),
    },
  };
}

/** The school's rules with no user customisation — for all-views rows ("Hanafi: …, Shafi'i: …"). */
export function rulesForSchool(school: MadhhabId): MadhhabRules {
  return MADHHAB_RULES[school];
}

export interface ResolvedFiqh {
  /** `null` ⇒ show all views (no school chosen for this domain). */
  school: MadhhabId | null;
  /** `null` exactly when `school` is `null`. Custom values already applied. */
  rules: MadhhabRules | null;
  /** True when `school` came from `madhhabOverrides[domain]`. */
  isOverride: boolean;
  /** Custom values applied on top of the school's rules. */
  customKeys: FiqhCustomKey[];
}

export function resolveFiqh(prefs: FiqhPreferences, domain: FiqhDomain): ResolvedFiqh {
  const school = resolveSchool(prefs, domain);
  const isOverride = hasDomainOverride(prefs, domain);
  if (school == null) return { school, rules: null, isOverride, customKeys: [] };
  return {
    school,
    rules: applyFiqhCustom(MADHHAB_RULES[school], prefs.fiqhCustom),
    isOverride,
    customKeys: customKeysApplied(prefs),
  };
}

/** Resolves the domain school, then applies `fiqhCustom` numeric overrides. `null` ⇒ caller shows all views. */
export function rulesFor(prefs: FiqhPreferences, domain: FiqhDomain): MadhhabRules | null {
  return resolveFiqh(prefs, domain).rules;
}
