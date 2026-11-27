import {
  differencesForDomain,
  FIQH_CUSTOM_BOUNDS,
  FIQH_DOMAINS,
  type FiqhCustomKey,
  type FiqhCustomValues,
  type FiqhDomain,
  type FiqhPreferences,
  isMadhhabId,
  MADHHAB_IDS,
  MADHHAB_RULES,
  type MadhhabId,
  type MadhhabRules,
  resolveFiqh,
  sanitizeFiqhCustom,
} from "@munib-tracker/shared/fiqh";
import type { TFunction } from "i18next";

import { preferencesStore } from "@/stores/preferences-store";

/**
 * Settings › Fiqh & madhhab (NF-3.0a §4.1.5) — pure helpers + the write paths
 * for the advanced per-domain overrides and the scholar-given custom values.
 * "My madhhab" itself writes through `lib/fiqh/set-madhhab.ts` (shared with
 * onboarding, the home card and the lazy sheet).
 */

/** Per-domain override choice: follow "My madhhab", a school, or all views. */
export type FiqhOverrideChoice = "inherit" | MadhhabId | "all";

export function overrideChoiceOf(prefs: FiqhPreferences, domain: FiqhDomain): FiqhOverrideChoice {
  const overrides = prefs.madhhabOverrides;
  if (overrides == null || !Object.hasOwn(overrides, domain)) return "inherit";
  const value = overrides[domain];
  if (value === null) return "all";
  return isMadhhabId(value) ? value : "inherit";
}

/** Returns the new overrides map after choosing `choice` for `domain` (inherit removes the key). */
export function withOverride(
  overrides: FiqhPreferences["madhhabOverrides"],
  domain: FiqhDomain,
  choice: FiqhOverrideChoice,
): NonNullable<FiqhPreferences["madhhabOverrides"]> {
  const next = { ...(overrides ?? {}) };
  if (choice === "inherit") delete next[domain];
  else next[domain] = choice === "all" ? null : choice;
  return next;
}

export function setFiqhOverride(domain: FiqhDomain, choice: FiqhOverrideChoice): Promise<void> {
  const current = preferencesStore.getState().prefs.madhhabOverrides;
  return preferencesStore
    .getState()
    .update({ madhhabOverrides: withOverride(current, domain, choice) });
}

/** Numeric custom values, in display order, with the domain whose school supplies the default. */
export const FIQH_CUSTOM_NUMERIC: readonly {
  key: Exclude<FiqhCustomKey, "nisabBasis">;
  domain: FiqhDomain;
  unit: "km" | "days";
}[] = [
  { key: "qasrDistanceKm", domain: "travel", unit: "km" },
  { key: "residencyDays", domain: "travel", unit: "days" },
  { key: "haydMaxDays", domain: "taharah", unit: "days" },
  { key: "nifasMaxDays", domain: "taharah", unit: "days" },
];

function ruleValue(rules: MadhhabRules, key: Exclude<FiqhCustomKey, "nisabBasis">): number {
  switch (key) {
    case "qasrDistanceKm":
      return rules.travel.qasrDistanceKm;
    case "residencyDays":
      return rules.travel.residencyDays;
    case "haydMaxDays":
      return rules.hayd.maxDays;
    case "nifasMaxDays":
      return rules.hayd.nifasMaxDays;
  }
}

/**
 * The school's own value for a custom key (ignoring any custom override), or
 * `null` when the domain shows all views — the UI then never pretends one
 * school's number is "the" default.
 */
export function schoolDefaultFor(
  prefs: FiqhPreferences,
  key: Exclude<FiqhCustomKey, "nisabBasis">,
  domain: FiqhDomain,
): number | null {
  const { school } = resolveFiqh({ ...prefs, fiqhCustom: undefined }, domain);
  return school ? ruleValue(MADHHAB_RULES[school], key) : null;
}

/** Starting point when the user first adds a custom value: the school's, else the lowest school value. */
export function initialCustomValue(
  prefs: FiqhPreferences,
  key: Exclude<FiqhCustomKey, "nisabBasis">,
  domain: FiqhDomain,
): number {
  const school = schoolDefaultFor(prefs, key, domain);
  const bounds = FIQH_CUSTOM_BOUNDS[key];
  const value = school ?? Math.min(...MADHHAB_IDS.map((id) => ruleValue(MADHHAB_RULES[id], key)));
  return Math.max(bounds.min, Math.min(bounds.max, Math.round(value)));
}

/** New custom map with `key` set (bounded by `FIQH_CUSTOM_BOUNDS`) or cleared (`undefined`). */
export function withCustomValue<K extends FiqhCustomKey>(
  custom: FiqhCustomValues | undefined,
  key: K,
  value: FiqhCustomValues[K] | undefined,
): FiqhCustomValues {
  const next: FiqhCustomValues = { ...sanitizeFiqhCustom(custom) };
  if (value === undefined) {
    delete next[key];
    return next;
  }
  // Out-of-range / malformed values are dropped (never clamped into a ruling).
  return { ...next, ...sanitizeFiqhCustom({ [key]: value }) };
}

export function setFiqhCustomValue<K extends FiqhCustomKey>(
  key: K,
  value: FiqhCustomValues[K] | undefined,
): Promise<void> {
  const current = preferencesStore.getState().prefs.fiqhCustom;
  return preferencesStore.getState().update({ fiqhCustom: withCustomValue(current, key, value) });
}

/** Count of advanced choices in effect (domain overrides + custom values). */
export function advancedCount(prefs: FiqhPreferences): number {
  const overrides = FIQH_DOMAINS.filter((d) => overrideChoiceOf(prefs, d) !== "inherit").length;
  return overrides + Object.keys(sanitizeFiqhCustom(prefs.fiqhCustom)).length;
}

/** "Hanafi" / "All views" / "Not chosen" for a global madhhab value. */
export function madhhabSummary(value: MadhhabId | null | undefined, t: TFunction): string {
  if (value === null) return t("fiqh.allViews");
  if (value && isMadhhabId(value)) return t(`fiqh.school.${value}`);
  return t("zakat.fiqh.basisNotSet");
}

/**
 * Turns a catalog `usedIn` entry into a pushable route: drops the `#section`
 * suffix and the `(tabs)` group (`/(tabs)/index` → `/`). Settings routes
 * listed in the catalog stay as they are.
 */
export function usedInRoute(entry: string): string {
  const path = entry.split("#")[0] ?? entry;
  const withoutGroup = path.replace(/^\/\(tabs\)/, "");
  if (withoutGroup === "/index" || withoutGroup === "") return "/";
  return withoutGroup;
}

export interface WhereAppliesItem {
  id: string;
  titleKey: string;
  /** First place the difference is shown (deep link). */
  route: string;
}

export interface WhereAppliesDomain {
  domain: FiqhDomain;
  items: WhereAppliesItem[];
}

/** "Where this applies" (§4.1.5 item 4): every catalogued difference by domain, with a deep link. */
export function whereThisApplies(): WhereAppliesDomain[] {
  return FIQH_DOMAINS.map((domain) => ({
    domain,
    items: differencesForDomain(domain)
      .filter((d) => d.usedIn.length > 0)
      .map((d) => ({ id: d.id, titleKey: d.titleKey, route: usedInRoute(d.usedIn[0] as string) })),
  })).filter((group) => group.items.length > 0);
}
