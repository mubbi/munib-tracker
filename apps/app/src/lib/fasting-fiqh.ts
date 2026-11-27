import { MADHHAB_IDS, type MadhhabId, rulesForSchool } from "@munib-tracker/shared/fiqh";

/**
 * Per-school fasting rulings for the fidyah / kaffarah helper and Ramadan mode
 * (NF-3.0a retrofit, plan §4.1.4). The rulings themselves come from
 * `MADHHAB_RULES` (proof log `docs/proofs/madhhab.md` §9); this module only
 * adds the food measures and their APPROXIMATE modern weights, which differ
 * between contemporary fatwa bodies — the UI always labels them "approx.".
 */

/** Classical measures: a mudd is a double handful; a sa' is four mudd. */
export type FoodMeasureUnit = "mudd" | "half_sa" | "sa";
export type FoodKind = "wheat" | "dates_barley" | "staple" | "other_food";

export interface FoodMeasure {
  unit: FoodMeasureUnit;
  food: FoodKind;
  /** Approximate kilograms (low, high) — contemporary conversions differ. */
  kgRange: readonly [number, number];
}

export interface FoodMeasureRuling {
  school: MadhhabId;
  /** Alternatives the school allows (any one of them). */
  options: readonly FoodMeasure[];
  /** Hanafi: giving the value in cash is allowed; the others: food only. */
  cashAllowed: boolean;
}

export interface FidyahMeasureRuling extends FoodMeasureRuling {
  /** Maliki: fidyah for the very elderly is recommended (mandub), not required. */
  elderlyFidyahRecommendedOnly: boolean;
}

/**
 * Approximate weights. The Hanafi sa' is the larger "Iraqi" sa' (8 ratl), so a
 * Hanafi half sa' ≈ 1.6–2.05 kg (Deobandi fatwas ≈ 1.575 kg, Barelvi ≈ 2.045 kg)
 * and a full Hanafi sa' ≈ 3.2–4.1 kg. The other schools use the Hijazi sa'
 * (4 mudd ≈ 2–3 kg, depending on the grain and the fatwa body).
 */
export const FOOD_MEASURE_KG = {
  mudd: [0.5, 0.75],
  halfSaOther: [1, 1.5],
  sa: [2, 3],
  hanafiHalfSa: [1.6, 2.05],
  hanafiSa: [3.2, 4.1],
} as const satisfies Record<string, readonly [number, number]>;

const HANAFI_HALF_SA_WHEAT: FoodMeasure = {
  unit: "half_sa",
  food: "wheat",
  kgRange: FOOD_MEASURE_KG.hanafiHalfSa,
};
const HANAFI_SA_DATES: FoodMeasure = {
  unit: "sa",
  food: "dates_barley",
  kgRange: FOOD_MEASURE_KG.hanafiSa,
};
const MUDD_STAPLE: FoodMeasure = { unit: "mudd", food: "staple", kgRange: FOOD_MEASURE_KG.mudd };

/** Fidyah per missed fast (also the per-person measure for the kaffarah feeding option). */
export function fidyahMeasureFor(school: MadhhabId): FidyahMeasureRuling {
  const { fasting } = rulesForSchool(school);
  const options: FoodMeasure[] =
    fasting.fidyahMeasure === "half_sa_wheat"
      ? [HANAFI_HALF_SA_WHEAT, HANAFI_SA_DATES]
      : school === "hanbali"
        ? [
            { unit: "mudd", food: "wheat", kgRange: FOOD_MEASURE_KG.mudd },
            { unit: "half_sa", food: "other_food", kgRange: FOOD_MEASURE_KG.halfSaOther },
          ]
        : [MUDD_STAPLE];
  return {
    school,
    options,
    cashAllowed: fasting.fidyahCashAllowed,
    elderlyFidyahRecommendedOnly: school === "maliki",
  };
}

/** Sadaqat al-fitr per person. */
export function fitrMeasureFor(school: MadhhabId): FoodMeasureRuling {
  const { fasting } = rulesForSchool(school);
  const options: FoodMeasure[] =
    fasting.fitrMeasure === "half_sa_wheat"
      ? [HANAFI_HALF_SA_WHEAT, HANAFI_SA_DATES]
      : [{ unit: "sa", food: "staple", kgRange: FOOD_MEASURE_KG.sa }];
  return { school, options, cashAllowed: fasting.fitrCashAllowed };
}

export type ForgetfulEatingOutcome = "valid" | "make_up";

/** Eating or drinking forgetfully in an obligatory fast. Maliki: continue, then make it up (no kaffarah). */
export function forgetfulEatingOutcome(school: MadhhabId): ForgetfulEatingOutcome {
  return rulesForSchool(school).fasting.forgetfulEatingBreaks ? "make_up" : "valid";
}

export type KaffarahTrigger = "intercourse" | "deliberate_eating";

export function kaffarahTriggersFor(school: MadhhabId): readonly KaffarahTrigger[] {
  return rulesForSchool(school).fasting.kaffarahTriggers;
}

/** i18n suffix for a trigger list: "intercourseOnly" or "intercourseOrEating". */
export function kaffarahTriggerKey(school: MadhhabId): "intercourseOnly" | "intercourseOrEating" {
  return kaffarahTriggersFor(school).includes("deliberate_eating")
    ? "intercourseOrEating"
    : "intercourseOnly";
}

/** Info only (the plan's tarawih note). */
export function tarawihRakahsFor(school: MadhhabId): number {
  return rulesForSchool(school).fasting.tarawihRakahs;
}

/** The schools to list: the selected one, or all four in all-views mode. */
export function schoolsToShow(school: MadhhabId | null): readonly MadhhabId[] {
  return school ? [school] : MADHHAB_IDS;
}

/** "1.6–2.05" style range, localized digits via `Intl.NumberFormat`. */
export function formatKgRange(range: readonly [number, number], locale?: string): string {
  const fmt = new Intl.NumberFormat(locale, { maximumFractionDigits: 2 });
  return `${fmt.format(range[0])}–${fmt.format(range[1])}`;
}

// ── Ramadan: days to make up → fasting qaza offer ─────────────────────────────

/** Prayer-log excused reasons that mean the woman could not fast that day. */
const NO_FAST_EXCUSES = new Set<string>(["hayd", "nifas"]);

export function isNoFastExcuse(reason: string | null | undefined): boolean {
  return reason != null && NO_FAST_EXCUSES.has(reason);
}

/**
 * Ramadan dates (up to `today`) that will need making up: logged "missed" or
 * "exempt", or excused for hayd/nifas in the salah tracker and not logged as
 * fasted. Read-only — the caller only OFFERS to add them to fasting qaza.
 */
export function ramadanMakeUpDates(
  ramadanDates: readonly string[],
  fastStatus: Readonly<Record<string, string | undefined>>,
  noFastExcusedDates: ReadonlySet<string>,
  today: string,
): string[] {
  return ramadanDates.filter((date) => {
    if (date > today) return false;
    const status = fastStatus[date];
    if (status === "missed" || status === "exempt") return true;
    return status !== "fasted" && noFastExcusedDates.has(date);
  });
}

const OFFER_PREFIX = "ramadan-fasting-qaza-offer";

/** Seen-id recording that `handled` make-up days of `hijriYear` were added or dismissed. */
export function rozaOfferSeenId(hijriYear: number, handled: number): string {
  return `${OFFER_PREFIX}:${hijriYear}:${handled}`;
}

/** Highest handled count recorded for `hijriYear` (0 when never offered). */
export function handledRozaOfferCount(seenIds: readonly string[], hijriYear: number): number {
  const prefix = `${OFFER_PREFIX}:${hijriYear}:`;
  let max = 0;
  for (const id of seenIds) {
    if (!id.startsWith(prefix)) continue;
    const n = Number(id.slice(prefix.length));
    if (Number.isInteger(n) && n > max) max = n;
  }
  return max;
}

/** Days not yet offered (new make-up days since the last add / dismiss). */
export function pendingRozaOffer(makeUpDays: number, handled: number): number {
  return Math.max(0, makeUpDays - handled);
}
