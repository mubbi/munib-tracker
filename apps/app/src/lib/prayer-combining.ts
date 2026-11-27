import type { MadhhabRules } from "@munib-tracker/shared/fiqh";
import type {
  ObligatoryPrayer,
  PrayerCombineMode,
  PrayerId,
  PrayerLog,
} from "@munib-tracker/shared/types";

/**
 * Jam' (combining two fard prayers) — NF-3.0a retrofit of plan §4.1.4.
 *
 * Only two pairs can ever be combined: Dhuhr with Asr, and Maghrib with Isha
 * (Fajr is never combined). `taqdim` prays both in the earlier prayer's time,
 * `takhir` prays both in the later prayer's time. Whether the user is offered
 * the flag depends on their school: `rules.travel.jamTravel` and
 * `rules.travel.jamRain` (see `docs/proofs/madhhab.md` §7). The flag on the
 * prayer log is a record of what the user did — never a ruling and never
 * applied automatically.
 */

export type CombinePair = readonly [ObligatoryPrayer, ObligatoryPrayer];
export type CombineContext = "travel" | "rain";

/** The only combinable pairs, earlier prayer first. */
export const COMBINE_PAIRS: readonly CombinePair[] = [
  ["dhuhr", "asr"],
  ["maghrib", "isha"],
] as const;

export const COMBINE_MODES: readonly PrayerCombineMode[] = ["taqdim", "takhir"] as const;

/** The pair containing `prayerId`, or null for Fajr / Witr / sunnah prayers. */
export function combinePairFor(prayerId: PrayerId): CombinePair | null {
  return COMBINE_PAIRS.find((pair) => pair.includes(prayerId as ObligatoryPrayer)) ?? null;
}

/** The other prayer of the pair (Dhuhr ↔ Asr, Maghrib ↔ Isha), or null. */
export function combinePartner(prayerId: PrayerId): ObligatoryPrayer | null {
  const pair = combinePairFor(prayerId);
  if (!pair) return null;
  return pair[0] === prayerId ? pair[1] : pair[0];
}

/** The prayer whose time window both are prayed in for this mode. */
export function combineHostPrayer(pair: CombinePair, mode: PrayerCombineMode): ObligatoryPrayer {
  return mode === "taqdim" ? pair[0] : pair[1];
}

/**
 * Contexts in which the school allows combining this pair. Empty ⇒ not offered
 * (e.g. Hanafi: no travel or rain combining outside 'Arafah and Muzdalifah).
 */
export function combiningContexts(
  rules: Pick<MadhhabRules, "travel">,
  pair: CombinePair,
): CombineContext[] {
  const contexts: CombineContext[] = [];
  if (rules.travel.jamTravel) contexts.push("travel");
  const rain = rules.travel.jamRain;
  if (rain === "both" || (rain === "maghrib_isha" && pair[0] === "maghrib")) {
    contexts.push("rain");
  }
  return contexts;
}

export type CombineOffer =
  /** The school allows it in these contexts. */
  | { kind: "allowed"; pair: CombinePair; contexts: CombineContext[] }
  /** All-views mode: offered with a neutral "schools differ" note — no school is picked. */
  | { kind: "allViews"; pair: CombinePair }
  /** Not offered (not a pair prayer, or the school does not allow combining it). */
  | { kind: "none" };

/**
 * Whether the status sheet offers the "combined with…" flag for `prayerId`.
 * Travel combining is a `travel`-domain ruling and rain combining a
 * `salah`-domain one (they can differ under per-domain overrides), so each
 * context reads its own rules. A `null` rules object is all-views mode for
 * that domain: the flag is offered with a neutral note and no school is picked.
 */
export function combineOfferFor(
  prayerId: PrayerId,
  rules: {
    travel: Pick<MadhhabRules, "travel"> | null;
    rain: Pick<MadhhabRules, "travel"> | null;
  },
): CombineOffer {
  const pair = combinePairFor(prayerId);
  if (!pair) return { kind: "none" };
  if (rules.travel == null || rules.rain == null) return { kind: "allViews", pair };
  const contexts: CombineContext[] = [
    ...combiningContexts(rules.travel, pair).filter((c) => c === "travel"),
    ...combiningContexts(rules.rain, pair).filter((c) => c === "rain"),
  ];
  return contexts.length > 0 ? { kind: "allowed", pair, contexts } : { kind: "none" };
}

/** Convenience: true when the school allows combining in `context` for this pair. */
export function combiningAllowed(
  rules: Pick<MadhhabRules, "travel">,
  context: CombineContext,
  pair: CombinePair = COMBINE_PAIRS[0],
): boolean {
  return combiningContexts(rules, pair).includes(context);
}

export interface PrayerCombined {
  with: ObligatoryPrayer;
  mode: PrayerCombineMode;
}

function isCombineMode(value: unknown): value is PrayerCombineMode {
  return value === "taqdim" || value === "takhir";
}

/**
 * Reads the combined flag from a log, ignoring malformed values (old clients,
 * corrupt sync blobs, or a partner that isn't this prayer's pair).
 */
export function combinedFromLog(
  log: Pick<PrayerLog, "prayerId" | "combinedWith" | "combineMode">,
): PrayerCombined | null {
  const partner = combinePartner(log.prayerId);
  if (partner == null || log.combinedWith !== partner || !isCombineMode(log.combineMode)) {
    return null;
  }
  return { with: partner, mode: log.combineMode };
}
