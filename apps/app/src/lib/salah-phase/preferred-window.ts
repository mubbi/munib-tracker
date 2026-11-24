import type { FiqhDifferenceId, MadhhabRules } from "@munib-tracker/shared/fiqh";

/**
 * "Preferred window" sub-band inside a prayer's time (NF-3.0a, plan §4.1.4
 * "Preferred-time hints"). The schools agree on when each prayer's time BEGINS
 * and ENDS (Asr's start aside); they differ on the preferred (mustahabb) part:
 *
 * - Fajr: isfar (Hanafi — once the light has spread, leaving time to repeat the
 *   salah before sunrise) vs taghlis (the others — early, in the dark).
 * - Asr: delay preferred but before the sun yellows (Hanafi) vs early (others).
 * - Isha: delay to a third of the night (Hanafi, Hanbali) vs early (Shafi'i, Maliki).
 *
 * The classical texts describe these qualitatively; the minute boundaries
 * below are APP APPROXIMATIONS (recorded in the proof log), shown as a soft
 * hint only. The full time stays valid in every school — nothing here marks a
 * salah late, changes a reminder, or edits a log. With no school (all views)
 * the result is a neutral marker so the UI never silently picks a school.
 */

export type PreferredWindowPrayer = "fajr" | "asr" | "isha";

export type PreferredWindowMode =
  | "taghlis"
  | "isfar"
  | "early"
  | "delay_before_yellowing"
  | "delay_third";

export type PreferredWindow =
  | {
      kind: "band";
      prayer: PreferredWindowPrayer;
      mode: PreferredWindowMode;
      start: Date;
      end: Date;
      differenceId: FiqhDifferenceId;
    }
  /** All-views mode: "earliest / preferred time differs by school" — no band. */
  | { kind: "allViews"; prayer: PreferredWindowPrayer; differenceId: FiqhDifferenceId };

/** Prayer-time markers the bands are derived from (Maghrib ≈ sunset in adhan). */
export interface PreferredWindowTimes {
  fajr: Date;
  sunrise: Date;
  asr: Date;
  maghrib: Date;
  isha: Date;
  /** Next day's Fajr — ends the night used for "a third of the night". */
  nextFajr: Date;
}

export const PREFERRED_WINDOW_PRAYERS: readonly PreferredWindowPrayer[] = ["fajr", "asr", "isha"];

export const PREFERRED_DIFFERENCE_IDS: Record<PreferredWindowPrayer, FiqhDifferenceId> = {
  fajr: "fajr.preferred",
  asr: "asr.preferred",
  isha: "isha.preferred",
};

/**
 * App approximation: isfar ends this long before sunrise so there is time to
 * repeat the salah (the Hanafi condition). Not a classical number.
 */
export const ISFAR_REPEAT_BUFFER_MIN = 15;
/**
 * App approximation of when the sun "yellows" (isfirar al-shams): this many
 * minutes before Maghrib. Contemporary timetables use roughly 20–40 minutes;
 * the earlier edge is used so the hint never points into the disliked time.
 */
export const ASR_YELLOWING_BEFORE_MAGHRIB_MIN = 40;

const MIN = 60_000;

function band(
  prayer: PreferredWindowPrayer,
  mode: PreferredWindowMode,
  startMs: number,
  endMs: number,
): PreferredWindow | null {
  if (!Number.isFinite(startMs) || !Number.isFinite(endMs) || endMs <= startMs) return null;
  return {
    kind: "band",
    prayer,
    mode,
    start: new Date(startMs),
    end: new Date(endMs),
    differenceId: PREFERRED_DIFFERENCE_IDS[prayer],
  };
}

/** Fajr: taghlis = first third of Fajr→sunrise; isfar = second half, ending 15 min before sunrise. */
function fajrWindow(times: PreferredWindowTimes, mode: MadhhabRules["fajrPreferred"]) {
  const start = times.fajr.getTime();
  const sunrise = times.sunrise.getTime();
  const span = sunrise - start;
  if (mode === "taghlis") return band("fajr", "taghlis", start, start + span / 3);
  return band("fajr", "isfar", start + span / 2, sunrise - ISFAR_REPEAT_BUFFER_MIN * MIN);
}

/** Asr: early = first third of Asr→yellowing; Hanafi delay = second half of Asr→yellowing. */
function asrWindow(times: PreferredWindowTimes, mode: MadhhabRules["asrPreferred"]) {
  const start = times.asr.getTime();
  const yellowing = times.maghrib.getTime() - ASR_YELLOWING_BEFORE_MAGHRIB_MIN * MIN;
  const span = yellowing - start;
  if (mode === "early") return band("asr", "early", start, start + span / 3);
  return band("asr", "delay_before_yellowing", start + span / 2, yellowing);
}

/** End of the first third of the night (Maghrib → next Fajr). */
export function firstThirdOfNightEnd(times: Pick<PreferredWindowTimes, "maghrib" | "nextFajr">) {
  const maghrib = times.maghrib.getTime();
  return new Date(maghrib + (times.nextFajr.getTime() - maghrib) / 3);
}

/** Isha: early = first half of Isha→⅓ night; delay = second half, ending at ⅓ of the night. */
function ishaWindow(times: PreferredWindowTimes, mode: MadhhabRules["ishaPreferred"]) {
  const start = times.isha.getTime();
  const third = firstThirdOfNightEnd(times).getTime();
  const mid = start + (third - start) / 2;
  if (mode === "early") return band("isha", "early", start, mid);
  return band("isha", "delay_third", mid, third);
}

/**
 * The preferred sub-band for one prayer, or the all-views marker when
 * `rules` is null. Returns null when the band can't be drawn (e.g. high
 * latitudes where Isha starts after a third of the night).
 */
export function preferredWindowFor(
  prayer: PreferredWindowPrayer,
  times: PreferredWindowTimes,
  rules: Pick<MadhhabRules, "fajrPreferred" | "asrPreferred" | "ishaPreferred"> | null,
): PreferredWindow | null {
  if (rules == null) {
    return { kind: "allViews", prayer, differenceId: PREFERRED_DIFFERENCE_IDS[prayer] };
  }
  if (prayer === "fajr") return fajrWindow(times, rules.fajrPreferred);
  if (prayer === "asr") return asrWindow(times, rules.asrPreferred);
  return ishaWindow(times, rules.ishaPreferred);
}

/** All three hints for a day, keyed by prayer (missing = no band could be drawn). */
export function preferredWindows(
  times: PreferredWindowTimes,
  rules: Pick<MadhhabRules, "fajrPreferred" | "asrPreferred" | "ishaPreferred"> | null,
): Partial<Record<PreferredWindowPrayer, PreferredWindow>> {
  const out: Partial<Record<PreferredWindowPrayer, PreferredWindow>> = {};
  for (const prayer of PREFERRED_WINDOW_PRAYERS) {
    const window = preferredWindowFor(prayer, times, rules);
    if (window) out[prayer] = window;
  }
  return out;
}

export function isPreferredWindowPrayer(id: string): id is PreferredWindowPrayer {
  return (PREFERRED_WINDOW_PRAYERS as readonly string[]).includes(id);
}
