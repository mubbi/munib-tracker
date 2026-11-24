import { RAWATIB_PRAYERS } from "@munib-tracker/shared/constants";
import type {
  PrayerStatus,
  RawatibExtraPrayer,
  RawatibId,
  RawatibPreferences,
  RawatibPreset,
} from "@munib-tracker/shared/types";
import {
  type RawatibConfig,
  type RawatibDayTimes,
  rakahsForLog,
  sanitizeRawatibPreferences,
} from "@munib-tracker/shared/utils";
import type { Href } from "expo-router";

import { locationCalcExtras, type StoredLocation } from "@/lib/location";
import { computePrayerTimes } from "@/lib/prayer-times";
import { prayerDayAnchor, shiftPrayerDay } from "@/lib/timezone-anchor";
import { preferencesStore } from "@/stores/preferences-store";

/**
 * App glue for the sunnah rawatib (NF-3.1). Pure rules live in
 * `@munib-tracker/shared/utils` (`resolveRawatibConfig`, windows, stats); this
 * module computes today's prayer instants and writes the preference.
 */

/** Route of the rawatib hub (evidence, presets, per-school notes). */
export const RAWATIB_ROUTE = "/rawatib" as Href;

/** Home module id (hideable via `hiddenHomeModules`). */
export const RAWATIB_HOME_MODULE_ID = "rawatib-progress";

/** Deep-link anchor on the tracker (`/tracker?focus=rawatib`). */
export const RAWATIB_TRACKER_FOCUS = "rawatib";

/** Corpus ids rendered by reference (never typed). See `docs/proofs/rawatib.md`. */
export const RAWATIB_EVIDENCE = {
  /** Muslim 728 (Abd al-Baqi) — twelve rakahs a day, a house in Jannah. */
  twelve: "muslim:1694",
  /** Tirmidhi 415 — the breakdown of the twelve. */
  breakdown: "tirmidhi:415",
  /** Bukhari 1180 — Ibn 'Umar's ten. */
  ten: "bukhari:1180",
  /** Bukhari 1182 — never left four before Dhuhr. */
  fourBeforeDhuhr: "bukhari:1182",
  /** Muslim 725 (Abd al-Baqi) — the two of Fajr are better than the world. */
  fajr: "muslim:1688",
  /** Tirmidhi 423 — praying the Fajr sunnah after sunrise (graders differ). */
  fajrMakeup: "tirmidhi:423",
  /** Abu Dawud 1271 / Tirmidhi 430 — four before Asr. */
  asr: "abudawud:1271",
  /** Bukhari 1183 — pray before Maghrib, for whoever wishes. */
  maghribBefore: "bukhari:1183",
  /** Bukhari 624 — a salah between every adhan and iqamah. */
  betweenAdhanIqamah: "bukhari:624",
  /** Abu Dawud 1269 — four before and four after Dhuhr. */
  fourAfterDhuhr: "abudawud:1269",
} as const;

/** Which evidence card backs each extra (shown in the rawatib hub). */
export const RAWATIB_EXTRA_EVIDENCE: Readonly<Record<RawatibExtraPrayer, string>> = {
  dhuhr_after_extra: RAWATIB_EVIDENCE.fourAfterDhuhr,
  asr_before: RAWATIB_EVIDENCE.asr,
  maghrib_before: RAWATIB_EVIDENCE.maghribBefore,
  isha_before: RAWATIB_EVIDENCE.betweenAdhanIqamah,
};

/**
 * Today's prayer instants for the visibility windows. `null` with the default
 * (Makkah) display location, so a user without a location sees every row
 * instead of rows gated on another city's times.
 */
export function rawatibDayTimes(location: StoredLocation, now: Date): RawatibDayTimes | null {
  if (location.source === "default") return null;
  const coords = { latitude: location.latitude, longitude: location.longitude };
  const extras = locationCalcExtras(location);
  const anchor = prayerDayAnchor(now, location.timeZone);
  const today = computePrayerTimes(coords, anchor, location.method, location.madhab, extras);
  const tomorrow = computePrayerTimes(
    coords,
    shiftPrayerDay(anchor, 1),
    location.method,
    location.madhab,
    extras,
  );
  return {
    fajr: today.fajr,
    sunrise: today.sunrise,
    dhuhr: today.dhuhr,
    asr: today.asr,
    maghrib: today.maghrib,
    isha: today.isha,
    nextFajr: tomorrow.fajr,
  };
}

export type RawatibPrefsChange =
  | { enabled: boolean }
  | { preset: RawatibPreset | null }
  | { extra: RawatibExtraPrayer; on: boolean };

/**
 * The stored preference after one edit. The first edit pins the current
 * resolved state (so turning on an extra doesn't flip `enabled`); a `null`
 * preset returns to "follow my madhhab".
 */
export function nextRawatibPreferences(
  stored: unknown,
  config: Pick<RawatibConfig, "enabled" | "extras">,
  change: RawatibPrefsChange,
): RawatibPreferences {
  const base: RawatibPreferences = sanitizeRawatibPreferences(stored) ?? {
    enabled: config.enabled,
    extras: [...config.extras],
  };
  if ("enabled" in change) return { ...base, enabled: change.enabled };
  if ("preset" in change) {
    const { preset: _drop, ...rest } = base;
    return change.preset == null ? rest : { ...rest, preset: change.preset };
  }
  const extras = new Set(base.extras);
  if (change.on) extras.add(change.extra);
  else extras.delete(change.extra);
  return { ...base, extras: [...extras] };
}

/** Writes one rawatib preference edit (account-scoped; synced with the prefs blob). */
export async function updateRawatibPreferences(
  config: Pick<RawatibConfig, "enabled" | "extras">,
  change: RawatibPrefsChange,
): Promise<void> {
  const state = preferencesStore.getState();
  await state.update({ rawatib: nextRawatibPreferences(state.prefs.rawatib, config, change) });
}

/** First-run answer: turn rawatib on with the chosen preset (keeps any extras). */
export async function startRawatib(preset: RawatibPreset): Promise<void> {
  const state = preferencesStore.getState();
  const extras = sanitizeRawatibPreferences(state.prefs.rawatib)?.extras ?? [];
  await state.update({ rawatib: { enabled: true, preset, extras } });
}

/** Explicit Witr-qaza choice (`null` ⇒ back to the school default). */
export async function setWitrQazaPreference(value: boolean | null): Promise<void> {
  await preferencesStore.getState().update({ witrQaza: value ?? undefined });
}

/** i18n key for a chip label: "2 before", "4 after", … */
export function rawatibChipKey(position: "before" | "after"): string {
  return position === "before" ? "rawatib.chip.before" : "rawatib.chip.after";
}

/** Rows that are optional extras (labelled "Extra"). */
export function isRawatibExtra(id: RawatibId): id is RawatibExtraPrayer {
  return (
    id === "asr_before" ||
    id === "maghrib_before" ||
    id === "isha_before" ||
    id === "dhuhr_after_extra"
  );
}

/**
 * Mu'akkadah rakahs logged for one day toward the 12 / 10 target — extras never
 * count. Shared by the home card, the tracker header and the hub so all three agree.
 */
export function rawatibRakahsDone(
  status: Readonly<Record<string, PrayerStatus | undefined>>,
  rakahs: Readonly<Record<string, number | undefined>>,
  preset: RawatibPreset,
): number {
  return RAWATIB_PRAYERS.reduce(
    (sum, id) =>
      status[id] === "completed" ? sum + rakahsForLog({ rakahs: rakahs[id] }, id, preset) : sum,
    0,
  );
}
