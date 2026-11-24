import {
  DHUL_HIJJAH_DEEDS,
  type DhulHijjahDeedId,
} from "@munib-tracker/shared/content/dhul-hijjah";
import { MADHHAB_IDS, type MadhhabRules, rulesForSchool } from "@munib-tracker/shared/fiqh";
import type {
  DhulHijjahState,
  DhulHijjahStore,
  ObligatoryPrayer,
  UdhiyahAnimal,
  UdhiyahPlan,
  UdhiyahStatus,
} from "@munib-tracker/shared/types";
import { getLocalDateString, parseLocalDateString } from "@munib-tracker/shared/utils";

import { gregorianToHijri, type HijriDate, hijriToGregorian } from "@/lib/hijri";
import { mergeStamped, type StampedMap, sanitizeStamps, writeStamped } from "@/lib/stamped-map";

/**
 * Dhul-Hijjah mode (NF-3.3) — pure date, slot and state logic. All Hijri dates
 * go through `lib/hijri.ts`, so the user's sighting location and Hijri
 * adjustment (D14) apply everywhere. Rulings come from `MADHHAB_RULES`;
 * `rules === null` (all views) is handled by every caller.
 */

export const DHUL_HIJJAH_MONTH = 12;
export const DHUL_QADAH_MONTH = 11;
/** Teaser cards appear from this day of Dhul-Qa'dah. */
export const TEASER_FROM_DAY = 25;
/** Mode runs through the last day of Tashriq. */
export const MODE_LAST_DAY = 13;

const FARD_ORDER: readonly ObligatoryPrayer[] = ["fajr", "dhuhr", "asr", "maghrib", "isha"];

export type DhulHijjahPhase = "teaser" | "ten" | "arafah" | "eid" | "tashriq";

/**
 * Hijri date of a local `YYYY-MM-DD` day key. Pass no `timeZone` for a key that
 * is already the location's day (e.g. a tracker date) — re-zoning it would shift
 * it by a day when the device and the location are in different timezones.
 */
export function hijriForDateString(date: string, timeZone?: string): HijriDate {
  return gregorianToHijri(parseLocalDateString(date), timeZone);
}

/** Phase of the season for a Hijri date, or `null` outside it. */
export function phaseForHijri(hijri: HijriDate): DhulHijjahPhase | null {
  if (hijri.month === DHUL_QADAH_MONTH && hijri.day >= TEASER_FROM_DAY) return "teaser";
  if (hijri.month !== DHUL_HIJJAH_MONTH || hijri.day > MODE_LAST_DAY) return null;
  if (hijri.day <= 8) return "ten";
  if (hijri.day === 9) return "arafah";
  if (hijri.day === 10) return "eid";
  return "tashriq";
}

export function dhulHijjahPhase(
  date: Date = new Date(),
  timeZone?: string,
): DhulHijjahPhase | null {
  return phaseForHijri(gregorianToHijri(date, timeZone));
}

/** Mode is active from Hijri 12/1 through 12/13 (the teaser days are not "active"). */
export function isDhulHijjahModeActive(date: Date = new Date(), timeZone?: string): boolean {
  const phase = dhulHijjahPhase(date, timeZone);
  return phase != null && phase !== "teaser";
}

/** "Day X/10" — the day of the ten (1–10), or `null` outside them. */
export function dayOfTen(hijri: HijriDate): number | null {
  return hijri.month === DHUL_HIJJAH_MONTH && hijri.day >= 1 && hijri.day <= 10 ? hijri.day : null;
}

/** Local date string (YYYY-MM-DD) of a day of Dhul-Hijjah. */
export function dhulHijjahDate(hijriYear: number, day: number): string {
  return getLocalDateString(hijriToGregorian(hijriYear, DHUL_HIJJAH_MONTH, day));
}

// ── Takbir al-Tashriq slots ─────────────────────────────────────────────────

export interface TashriqSlotItem {
  date: string;
  hijriDay: number;
  prayer: ObligatoryPrayer;
}

/**
 * Every fard after which Takbir al-Tashriq is said, from `rules.takbirTashriq`
 * (inclusive at both ends). Hanafi / Shafi'i / Hanbali (Fajr 9 → Asr 13) give 23
 * slots; Maliki (Dhuhr 10 → Fajr 13) gives 15.
 */
export function tashriqSlots(
  rules: Pick<MadhhabRules, "takbirTashriq">,
  hijriYear: number,
): TashriqSlotItem[] {
  const { start, end } = rules.takbirTashriq;
  const startIdx = FARD_ORDER.indexOf(start.prayer);
  const endIdx = FARD_ORDER.indexOf(end.prayer);
  const slots: TashriqSlotItem[] = [];
  for (let day = start.hijriDay; day <= end.hijriDay; day += 1) {
    const date = dhulHijjahDate(hijriYear, day);
    FARD_ORDER.forEach((prayer, idx) => {
      if (day === start.hijriDay && idx < startIdx) return;
      if (day === end.hijriDay && idx > endIdx) return;
      slots.push({ date, hijriDay: day, prayer });
    });
  }
  return slots;
}

/**
 * All-views mode (`rules === null`): the union of the four schools' windows,
 * with the schools that include each slot so the UI can label it.
 */
export function tashriqSlotsAllViews(
  hijriYear: number,
): Array<TashriqSlotItem & { schools: (typeof MADHHAB_IDS)[number][] }> {
  const bySlot = new Map<string, TashriqSlotItem & { schools: (typeof MADHHAB_IDS)[number][] }>();
  for (const school of MADHHAB_IDS) {
    for (const slot of tashriqSlots(rulesForSchool(school), hijriYear)) {
      const key = tashriqKey(slot.date, slot.prayer);
      const existing = bySlot.get(key);
      if (existing) existing.schools.push(school);
      else bySlot.set(key, { ...slot, schools: [school] });
    }
  }
  return [...bySlot.values()].sort(
    (a, b) =>
      a.date.localeCompare(b.date) || FARD_ORDER.indexOf(a.prayer) - FARD_ORDER.indexOf(b.prayer),
  );
}

export function tashriqKey(date: string, prayer: ObligatoryPrayer): string {
  return `${date}::${prayer}`;
}

/** Slots for one local date (used by the tracker row chips). */
export function tashriqSlotsOn(
  slots: readonly TashriqSlotItem[],
  date: string,
): ObligatoryPrayer[] {
  return slots.filter((slot) => slot.date === date).map((slot) => slot.prayer);
}

export function tashriqProgress(
  state: DhulHijjahState | undefined,
  slots: readonly TashriqSlotItem[],
): { done: number; total: number } {
  const done = slots.filter((s) => state?.tashriq[tashriqKey(s.date, s.prayer)]).length;
  return { done, total: slots.length };
}

// ── Daily deeds ─────────────────────────────────────────────────────────────

export function dailyCheckKey(itemId: string, date: string): string {
  return `${itemId}::${date}`;
}

/**
 * Deeds offered on a day of the season. The fast is offered on days 1–9 only
 * (fasting Eid is forbidden and the days of Tashriq are days of eating and
 * drinking — Muslim 1141); it is also dropped while an excused period stops
 * fasting (hayd / nifas — make it up later, never "missed"), and on the Day of
 * Arafah for someone performing Hajj that year (the pilgrim note shows instead).
 */
export function deedsForDay(
  hijriDay: number,
  opts: { fastingExcused?: boolean; pilgrim?: boolean } = {},
): DhulHijjahDeedId[] {
  return DHUL_HIJJAH_DEEDS.filter((deed) => {
    if (deed !== "fast") return true;
    if (opts.pilgrim && hijriDay === 9) return false;
    return hijriDay >= 1 && hijriDay <= 9 && !opts.fastingExcused;
  });
}

/** The excused reasons under which no fast is valid (hayd and nifas share the ruling). */
export function excusedStopsFasting(reason: string | null | undefined): boolean {
  return reason === "hayd" || reason === "nifas";
}

// ── Udhiyah ─────────────────────────────────────────────────────────────────

export interface UdhiyahWindow {
  /** After the Eid prayer on 12/10. */
  startDate: string;
  /** Sunset of 12/`lastDayHijri`. */
  endDate: string;
  lastDayHijri: 12 | 13;
}

export function udhiyahWindow(
  rules: Pick<MadhhabRules, "udhiyah"> | null,
  hijriYear: number,
): UdhiyahWindow[] {
  const lastDays: (12 | 13)[] = rules
    ? [rules.udhiyah.lastDayHijri]
    : [...new Set(MADHHAB_IDS.map((s) => rulesForSchool(s).udhiyah.lastDayHijri))].sort();
  return lastDays.map((lastDayHijri) => ({
    startDate: dhulHijjahDate(hijriYear, 10),
    endDate: dhulHijjahDate(hijriYear, lastDayHijri),
    lastDayHijri,
  }));
}

export const UDHIYAH_STATUS_ORDER: readonly UdhiyahStatus[] = [
  "planned",
  "arranged",
  "slaughtered",
  "distributed",
];

export function isShareAnimal(animal: UdhiyahAnimal): boolean {
  return animal === "cow_share" || animal === "camel_share";
}

/**
 * Hair/nails reminder window. Starts at 12/1 if the intention was set before
 * the month, otherwise at the moment of intention; ends once "slaughtered" (or
 * a later status) is ticked, or after the last day of Tashriq.
 */
export function hairNailsWindowActive(
  state: DhulHijjahState | undefined,
  now: Date,
  timeZone?: string,
): boolean {
  if (!state?.intendsUdhiyah) return false;
  const status = state.udhiyah?.status;
  if (status === "slaughtered" || status === "distributed") return false;
  const hijri = gregorianToHijri(now, timeZone);
  if (hijri.year !== state.hijriYear || hijri.month !== DHUL_HIJJAH_MONTH) return false;
  if (hijri.day > MODE_LAST_DAY) return false;
  const since = Date.parse(state.intendsUdhiyah.since);
  return Number.isFinite(since) && since <= now.getTime();
}

// ── state, sanitising, merging ──────────────────────────────────────────────

export function emptyYearState(hijriYear: number): DhulHijjahState {
  return { hijriYear, dailyChecks: {}, tashriq: {} };
}

const ANIMALS: readonly UdhiyahAnimal[] = [
  "sheep",
  "goat",
  "cow_share",
  "camel_share",
  "cow",
  "camel",
];
const KEY_RE = /^[\w-]+::\d{4}-\d{2}-\d{2}$|^\d{4}-\d{2}-\d{2}::[a-z]+$/;

function trueMap(raw: unknown): Record<string, true> {
  const out: Record<string, true> = {};
  if (raw == null || typeof raw !== "object") return out;
  for (const [key, value] of Object.entries(raw as Record<string, unknown>)) {
    if (value === true && KEY_RE.test(key)) out[key] = true;
  }
  return out;
}

export function sanitizeUdhiyah(raw: unknown): UdhiyahPlan | undefined {
  if (raw == null || typeof raw !== "object") return undefined;
  const u = raw as Partial<UdhiyahPlan>;
  if (!u.animal || !ANIMALS.includes(u.animal)) return undefined;
  const status = UDHIYAH_STATUS_ORDER.includes(u.status as UdhiyahStatus)
    ? (u.status as UdhiyahStatus)
    : "planned";
  const via = u.via === "agency" ? "agency" : "self";
  const onBehalfOf = Array.isArray(u.onBehalfOf)
    ? u.onBehalfOf
        .filter((n): n is string => typeof n === "string")
        .map((n) => n.trim().slice(0, 80))
        .filter(Boolean)
        .slice(0, 7)
    : undefined;
  const shares =
    isShareAnimal(u.animal) && typeof u.shares === "number" && Number.isFinite(u.shares)
      ? Math.min(7, Math.max(1, Math.round(u.shares)))
      : undefined;
  return {
    animal: u.animal,
    via,
    status,
    ...(shares != null && { shares }),
    ...(onBehalfOf?.length ? { onBehalfOf } : {}),
  };
}

export function sanitizeYearState(raw: unknown, hijriYear: number): DhulHijjahState {
  if (raw == null || typeof raw !== "object") return emptyYearState(hijriYear);
  const s = raw as Partial<DhulHijjahState>;
  const since = s.intendsUdhiyah?.since;
  const udhiyah = sanitizeUdhiyah(s.udhiyah);
  return {
    hijriYear,
    ...(typeof since === "string" && Number.isFinite(Date.parse(since))
      ? { intendsUdhiyah: { since } }
      : {}),
    ...(udhiyah && { udhiyah }),
    dailyChecks: trueMap(s.dailyChecks),
    tashriq: trueMap(s.tashriq),
    ...stampsField("dailyStamps", sanitizeStamps(s.dailyStamps, isStampKey)),
    ...stampsField("tashriqStamps", sanitizeStamps(s.tashriqStamps, isStampKey)),
    ...(typeof s.updatedAt === "string" && { updatedAt: s.updatedAt }),
  };
}

function isStampKey(key: string): boolean {
  return KEY_RE.test(key);
}

function stampsField<K extends "dailyStamps" | "tashriqStamps">(
  field: K,
  stamps: Record<string, string>,
): Partial<Record<K, Record<string, string>>> {
  return Object.keys(stamps).length
    ? ({ [field]: stamps } as Record<K, Record<string, string>>)
    : {};
}

/** Equal stamps (incl. two pre-stamp copies): a tick on either side wins — the old union. */
const unionTie = (a: true | undefined, b: true | undefined): true | undefined => a ?? b;

function mergeTicks(l: StampedMap<true>, r: StampedMap<true>): StampedMap<true> {
  return mergeStamped(l, r, unionTie);
}

export function sanitizeDhulHijjahStore(raw: unknown): DhulHijjahStore {
  const out: DhulHijjahStore = {};
  if (raw == null || typeof raw !== "object" || Array.isArray(raw)) return out;
  for (const [key, value] of Object.entries(raw as Record<string, unknown>)) {
    const year = Number(key);
    if (!Number.isInteger(year) || year < 1300 || year > 1600) continue;
    out[String(year)] = sanitizeYearState(value, year);
  }
  return out;
}

/**
 * Sync merge (blob entity `dhul_hijjah`), per year: each checklist key keeps
 * its newest write (tick or untick, via the `*Stamps` maps — unstamped legacy
 * ticks merge as a union); the intention and planner are last-write-wins on
 * `updatedAt`. Pure.
 */
export function mergeDhulHijjah(localRaw: unknown, remoteRaw: unknown): DhulHijjahStore {
  const local = sanitizeDhulHijjahStore(localRaw);
  const remote = sanitizeDhulHijjahStore(remoteRaw);
  const out: DhulHijjahStore = { ...remote };
  for (const [year, l] of Object.entries(local)) {
    const r = remote[year];
    if (!r) {
      out[year] = l;
      continue;
    }
    const scalar = (r.updatedAt ?? "") > (l.updatedAt ?? "") ? r : l;
    const daily = mergeTicks(
      { values: l.dailyChecks, stamps: l.dailyStamps ?? {} },
      { values: r.dailyChecks, stamps: r.dailyStamps ?? {} },
    );
    const tashriq = mergeTicks(
      { values: l.tashriq, stamps: l.tashriqStamps ?? {} },
      { values: r.tashriq, stamps: r.tashriqStamps ?? {} },
    );
    out[year] = {
      hijriYear: l.hijriYear,
      ...(scalar.intendsUdhiyah ? { intendsUdhiyah: scalar.intendsUdhiyah } : {}),
      ...(scalar.udhiyah ? { udhiyah: scalar.udhiyah } : {}),
      dailyChecks: daily.values,
      tashriq: tashriq.values,
      ...stampsField("dailyStamps", daily.stamps),
      ...stampsField("tashriqStamps", tashriq.stamps),
      ...(scalar.updatedAt ? { updatedAt: scalar.updatedAt } : {}),
    };
  }
  return out;
}

// ── pure mutations (the store persists) ─────────────────────────────────────

/** Flips one key and stamps the write, so an untick is kept as a tombstone for sync. */
function toggleIn(
  values: Record<string, true>,
  stamps: Record<string, string> | undefined,
  key: string,
  now: Date,
): StampedMap<true> {
  return writeStamped(
    { values, stamps: stamps ?? {} },
    key,
    values[key] ? null : true,
    now.toISOString(),
  );
}

export function toggleDailyCheck(
  state: DhulHijjahState,
  itemId: string,
  date: string,
  now = new Date(),
): DhulHijjahState {
  const next = toggleIn(state.dailyChecks, state.dailyStamps, dailyCheckKey(itemId, date), now);
  return { ...state, dailyChecks: next.values, dailyStamps: next.stamps };
}

export function toggleTashriq(
  state: DhulHijjahState,
  date: string,
  prayer: ObligatoryPrayer,
  now = new Date(),
): DhulHijjahState {
  const next = toggleIn(state.tashriq, state.tashriqStamps, tashriqKey(date, prayer), now);
  return { ...state, tashriq: next.values, tashriqStamps: next.stamps };
}

export function setIntendsUdhiyah(
  state: DhulHijjahState,
  intends: boolean,
  now = new Date(),
): DhulHijjahState {
  const updatedAt = now.toISOString();
  if (!intends) {
    const { intendsUdhiyah: _drop, ...rest } = state;
    return { ...rest, intendsUdhiyah: null, updatedAt };
  }
  if (state.intendsUdhiyah) return state;
  return { ...state, intendsUdhiyah: { since: updatedAt }, updatedAt };
}

export function setUdhiyahPlan(
  state: DhulHijjahState,
  plan: UdhiyahPlan | null,
  now = new Date(),
): DhulHijjahState {
  const updatedAt = now.toISOString();
  if (!plan) {
    const { udhiyah: _drop, ...rest } = state;
    return { ...rest, updatedAt };
  }
  const clean = sanitizeUdhiyah(plan);
  return clean ? { ...state, udhiyah: clean, updatedAt } : state;
}

/** The Gregorian start (12/1) of a Hijri year's Dhul-Hijjah, at local midnight. */
export function dhulHijjahStart(hijriYear: number): Date {
  return hijriToGregorian(hijriYear, DHUL_HIJJAH_MONTH, 1);
}
