import { MADHHAB_RULES } from "../fiqh/madhhab-rules";
import type {
  FastDayClassification,
  FastDayRuling,
  VoluntaryFastEntry,
  VoluntaryFastingMap,
  VoluntaryFastingPrefs,
  VoluntaryFastKind,
} from "../types/fasting";
import { DEFAULT_VOLUNTARY_FASTING_PREFS, WEEKLY_FAST_KINDS } from "../types/fasting";
import type { MadhhabId } from "../types/preferences";
import { addDays, diffInDays } from "./date";

/**
 * Voluntary fasting calendar (NF-3.2) — pure, Hijri engine injected.
 *
 * Every ruling here has a proof-log entry in `docs/proofs/voluntary-fasting.md`
 * (D11). The app injects `toHijri` from `apps/app/src/lib/hijri.ts`, which
 * applies the user's moon-sighting authority and Hijri adjustment (D14), so the
 * classification always agrees with every other Hijri date in the app.
 */

export interface HijriDayParts {
  year: number;
  month: number;
  day: number;
}

export interface FastingCalendarContext {
  /** Local `YYYY-MM-DD` → Hijri date (the app's `gregorianToHijri`). */
  toHijri: (dateKey: string) => HijriDayParts;
  prefs?: VoluntaryFastingPrefs;
  /**
   * School governing the fasting domain (`resolveSchool(prefs, "fasting")`).
   * `null` = show all views: school-specific restrictions become a note.
   */
  school: MadhhabId | null;
  /** The user's log, so planned neighbours / qaza days change the ruling. */
  entries?: VoluntaryFastingMap;
}

const RAMADAN = 9;
const SHABAN = 8;
const SHAWWAL = 10;
const DHUL_HIJJAH = 12;
const MUHARRAM = 1;

/** Kinds that make a Friday fast a fast "one customarily keeps" (Muslim 1144). */
const FRIDAY_EXEMPT_KINDS: readonly VoluntaryFastKind[] = [
  "arafah",
  "tasua",
  "ashura",
  "white_day",
  "dawud",
];

/** ISO weekday 0 (Sun) – 6 (Sat) of a `YYYY-MM-DD` key, timezone-independent. */
export function weekdayOfDateKey(dateKey: string): number {
  const [y, m, d] = dateKey.split("-").map(Number) as [number, number, number];
  return new Date(Date.UTC(y, m - 1, d)).getUTCDay();
}

/** An entry that is still on the log (not cleared). */
export function isLiveFastEntry(
  entry: VoluntaryFastEntry | undefined,
): entry is VoluntaryFastEntry {
  return entry != null && entry.deleted !== true;
}

/** Planned or kept (intended / fasted) — what counts as "fasting that day" for neighbour rules. */
export function isPlannedFastEntry(entry: VoluntaryFastEntry | undefined): boolean {
  return isLiveFastEntry(entry) && (entry.status === "intended" || entry.status === "fasted");
}

function isQazaDay(entries: VoluntaryFastingMap | undefined, dateKey: string): boolean {
  const entry = entries?.[dateKey];
  return isLiveFastEntry(entry) && entry.asQaza === true;
}

/** Why a voluntary fast can't be logged on a Hijri day (Eid / Tashriq prohibited; Ramadan has its own log). */
export type VoluntaryFastBlock = "eid" | "tashriq" | "ramadan";

/**
 * Hijri-only gate shared by every surface that suggests a voluntary fast (the
 * classifier, White Days, Dhul-Hijjah mode): 1 Shawwal and 10 Dhul-Hijjah are
 * Eid, 11–13 Dhul-Hijjah are Tashriq (Muslim 1141), and Ramadan days belong to
 * the Ramadan log. `null` = a voluntary fast may be suggested.
 */
export function voluntaryFastBlockForHijri(
  hijri: Pick<HijriDayParts, "month" | "day">,
): VoluntaryFastBlock | null {
  const { month, day } = hijri;
  if ((month === SHAWWAL && day === 1) || (month === DHUL_HIJJAH && day === 10)) return "eid";
  if (month === DHUL_HIJJAH && day >= 11 && day <= 13) return "tashriq";
  if (month === RAMADAN) return "ramadan";
  return null;
}

/**
 * Hijri year of the Hajj season a "performing Hajj" answer given on this day
 * refers to: the current year until the last day of Tashriq (13 Dhul-Hijjah),
 * the next year after it.
 */
export function hajjSeasonHijriYear(hijri: HijriDayParts): number {
  return hijri.month === DHUL_HIJJAH && hijri.day > 13 ? hijri.year + 1 : hijri.year;
}

/**
 * True when the user said they are performing Hajj in `hijriYear`. The flag is
 * scoped to one Hijri year so it expires by itself after that Dhul-Hijjah; a
 * flag without a year is ignored.
 */
export function isPilgrimInHijriYear(
  prefs: Pick<VoluntaryFastingPrefs, "isPilgrimThisYear" | "pilgrimHijriYear"> | undefined,
  hijriYear: number,
): boolean {
  return prefs?.isPilgrimThisYear === true && prefs.pilgrimHijriYear === hijriYear;
}

/** Days since the Dawud start date are even ⇒ a fasting day (fast one day, skip one). */
export function isDawudDay(dateKey: string, prefs: VoluntaryFastingPrefs | undefined): boolean {
  const start = prefs?.dawudMode?.startDate;
  if (!start) return false;
  const diff = diffInDays(dateKey, start);
  return diff >= 0 && diff % 2 === 0;
}

/**
 * Recommended kinds a day matches, before any ruling is applied. Arafah (and
 * the Dhul-Hijjah 9th) drop out for someone performing Hajj this year.
 */
export function fastKindsForDay(
  dateKey: string,
  hijri: HijriDayParts,
  prefs: VoluntaryFastingPrefs | undefined,
): VoluntaryFastKind[] {
  const kinds: VoluntaryFastKind[] = [];
  const weekday = weekdayOfDateKey(dateKey);
  if (weekday === 1) kinds.push("monday");
  if (weekday === 4) kinds.push("thursday");
  if (hijri.day >= 13 && hijri.day <= 15) kinds.push("white_day");
  if (hijri.month === SHAWWAL && hijri.day >= 2) kinds.push("shawwal_six");
  const pilgrim = isPilgrimInHijriYear(prefs, hijri.year);
  if (hijri.month === DHUL_HIJJAH && hijri.day === 9 && !pilgrim) kinds.push("arafah");
  if (hijri.month === MUHARRAM && hijri.day === 9) kinds.push("tasua");
  if (hijri.month === MUHARRAM && hijri.day === 10) kinds.push("ashura");
  if (hijri.month === MUHARRAM) kinds.push("muharram");
  if (hijri.month === SHABAN) kinds.push("shaban");
  if (hijri.month === DHUL_HIJJAH && hijri.day <= 9 && !(pilgrim && hijri.day === 9)) {
    kinds.push("dhul_hijjah_nine");
  }
  if (isDawudDay(dateKey, prefs)) kinds.push("dawud");
  return kinds;
}

/** A habitual fast (the user's Mon/Thu habit or the fast of Dawud) — excepted from the Sha'ban limits. */
function isHabitual(kinds: VoluntaryFastKind[], prefs: VoluntaryFastingPrefs): boolean {
  if (kinds.includes("dawud")) return true;
  return kinds.some(
    (kind) => WEEKLY_FAST_KINDS.includes(kind) && prefs.enabledKinds.includes(kind),
  );
}

/**
 * Shafi'i exception: a fast joined, day after day, to fasting that began on or
 * before 15 Sha'ban. Walks back through planned/kept days (max 15).
 */
function isJoinedToFirstHalf(dateKey: string, ctx: FastingCalendarContext): boolean {
  let cursor = addDays(dateKey, -1);
  for (let i = 0; i < 15; i += 1) {
    if (!isPlannedFastEntry(ctx.entries?.[cursor])) return false;
    const h = ctx.toHijri(cursor);
    if (h.month !== SHABAN || h.day <= 15) return true;
    cursor = addDays(cursor, -1);
  }
  return false;
}

function result(
  hijri: HijriDayParts,
  kinds: VoluntaryFastKind[],
  ruling: FastDayRuling,
  reasons: string[],
  extra: Partial<Pick<FastDayClassification, "blocking" | "isRamadan" | "madhhabNoteId">> = {},
): FastDayClassification {
  return {
    kinds,
    ruling,
    reasons,
    blocking: extra.blocking ?? false,
    isRamadan: extra.isRamadan ?? false,
    ...(extra.madhhabNoteId ? { madhhabNoteId: extra.madhhabNoteId } : {}),
    hijri: { year: hijri.year, month: hijri.month, day: hijri.day },
  };
}

/** i18n key prefix for reasons. */
const R = "voluntaryFasting.reason";

/**
 * Classifies one local calendar day (plan NF-3.2 rules, in order; the first
 * ruling match wins, kinds accumulate):
 *
 * 1. 1 Shawwal / 10 Dhul-Hijjah → prohibited, blocking (Eid).
 * 2. 11–13 Dhul-Hijjah → prohibited, blocking (Tashriq).
 * 3. Ramadan → excluded (own store).
 * 4. Shafi'i, 16 Sha'ban onward → not permitted unless habitual, joined to the
 *    first half, or qaza (proof log: the relied-upon view is haram, not makruh).
 * 5. 30 Sha'ban (day of doubt) → disliked unless qaza.
 * 6. One or two days before 1 Ramadan → disliked unless habitual or qaza.
 * 7. Friday alone (no planned Thursday/Saturday, no customary kind) → disliked.
 * 8. 9 Dhul-Hijjah for a pilgrim → permitted with a note.
 * 9. Any recommended kind → recommended; otherwise permitted.
 */
export function classifyFastDay(
  dateKey: string,
  ctx: FastingCalendarContext,
): FastDayClassification {
  const prefs = ctx.prefs ?? DEFAULT_VOLUNTARY_FASTING_PREFS;
  const hijri = ctx.toHijri(dateKey);
  const { month, day } = hijri;

  const block = voluntaryFastBlockForHijri(hijri);
  if (block === "eid" || block === "tashriq") {
    return result(hijri, [], "prohibited", [`${R}.${block}`], { blocking: true });
  }
  if (block === "ramadan") {
    return result(hijri, [], "permitted", [`${R}.ramadan`], { isRamadan: true });
  }

  const kinds = fastKindsForDay(dateKey, hijri, prefs);
  const qaza = isQazaDay(ctx.entries, dateKey);
  const habitual = isHabitual(kinds, prefs);

  if (month === SHABAN && day >= 16) {
    const excepted = habitual || qaza || isJoinedToFirstHalf(dateKey, ctx);
    if (ctx.school == null) {
      // All views: the restriction is one school's — label it, don't impose it.
      if (!excepted) {
        const base = classifyLate(dateKey, hijri, kinds, ctx, qaza, habitual);
        return {
          ...base,
          reasons: [...base.reasons, `${R}.afterMidShabanNote`],
          madhhabNoteId: "fasting.afterMidShaban",
        };
      }
    } else if (MADHHAB_RULES[ctx.school].fasting.afterMidShaban === "restricted") {
      if (!excepted) {
        return result(hijri, kinds, "prohibited", [`${R}.afterMidShabanShafii`], {
          madhhabNoteId: "fasting.afterMidShaban",
        });
      }
      const base = classifyLate(dateKey, hijri, kinds, ctx, qaza, habitual);
      return { ...base, madhhabNoteId: "fasting.afterMidShaban" };
    }
  }

  return classifyLate(dateKey, hijri, kinds, ctx, qaza, habitual);
}

/** Rules 5–9 (shared by the madhhab branches above). */
function classifyLate(
  dateKey: string,
  hijri: HijriDayParts,
  kinds: VoluntaryFastKind[],
  ctx: FastingCalendarContext,
  qaza: boolean,
  habitual: boolean,
): FastDayClassification {
  const prefs = ctx.prefs ?? DEFAULT_VOLUNTARY_FASTING_PREFS;
  const { month, day } = hijri;

  if (month === SHABAN && day === 30 && !qaza) {
    return result(hijri, kinds, "disliked", [`${R}.dayOfDoubt`]);
  }
  if (!habitual && !qaza) {
    const plusOne = ctx.toHijri(addDays(dateKey, 1));
    const plusTwo = ctx.toHijri(addDays(dateKey, 2));
    const isStart = (h: HijriDayParts) => h.month === RAMADAN && h.day === 1;
    if (isStart(plusOne) || isStart(plusTwo)) {
      return result(hijri, kinds, "disliked", [`${R}.beforeRamadan`]);
    }
  }
  if (weekdayOfDateKey(dateKey) === 5 && !qaza) {
    const customary = kinds.some((kind) => FRIDAY_EXEMPT_KINDS.includes(kind));
    const neighbour =
      isPlannedFastEntry(ctx.entries?.[addDays(dateKey, -1)]) ||
      isPlannedFastEntry(ctx.entries?.[addDays(dateKey, 1)]);
    if (!customary && !neighbour) {
      return result(hijri, kinds, "disliked", [`${R}.fridayAlone`]);
    }
  }
  if (month === DHUL_HIJJAH && day === 9 && isPilgrimInHijriYear(prefs, hijri.year)) {
    return result(hijri, kinds, "permitted", [`${R}.pilgrimArafah`]);
  }
  if (kinds.length > 0) {
    return result(
      hijri,
      kinds,
      "recommended",
      kinds.map((kind) => `voluntaryFasting.kind.${kind}`),
    );
  }
  return result(hijri, kinds, "permitted", []);
}

/** Classifies every day in the inclusive `[from, to]` range (max 400 days). */
export function classifyFastRange(
  from: string,
  to: string,
  ctx: FastingCalendarContext,
): { date: string; classification: FastDayClassification }[] {
  const span = Math.min(400, diffInDays(to, from));
  const out: { date: string; classification: FastDayClassification }[] = [];
  for (let i = 0; i <= span; i += 1) {
    const date = addDays(from, i);
    out.push({ date, classification: classifyFastDay(date, ctx) });
  }
  return out;
}

/** True when the day's kinds include one the user follows (drives reminders + suggestions). */
export function matchesEnabledKinds(
  classification: FastDayClassification,
  prefs: VoluntaryFastingPrefs | undefined,
): boolean {
  if (classification.ruling !== "recommended") return false;
  const enabled = (prefs ?? DEFAULT_VOLUNTARY_FASTING_PREFS).enabledKinds;
  return classification.kinds.some((kind) => kind === "dawud" || enabled.includes(kind));
}

/** Fasted (kept) days of a Hijri month in a given Hijri year, optionally from a start day. */
export function countFastedInHijriMonth(
  entries: VoluntaryFastingMap,
  toHijri: (dateKey: string) => HijriDayParts,
  year: number,
  month: number,
  range: { fromDay?: number; toDay?: number } = {},
): number {
  const fromDay = range.fromDay ?? 1;
  const toDay = range.toDay ?? 30;
  let count = 0;
  for (const [date, entry] of Object.entries(entries)) {
    if (!isLiveFastEntry(entry) || entry.status !== "fasted") continue;
    const h = toHijri(date);
    if (h.year === year && h.month === month && h.day >= fromDay && h.day <= toDay) count += 1;
  }
  return count;
}

/** Shawwal six progress: kept fasts in Shawwal of `year` from the 2nd (capped display is the caller's). */
export function shawwalSixCount(
  entries: VoluntaryFastingMap,
  toHijri: (dateKey: string) => HijriDayParts,
  year: number,
): number {
  return countFastedInHijriMonth(entries, toHijri, year, SHAWWAL, { fromDay: 2 });
}

/** Dhul-Hijjah 1–9 progress for `year`. */
export function dhulHijjahNineCount(
  entries: VoluntaryFastingMap,
  toHijri: (dateKey: string) => HijriDayParts,
  year: number,
): number {
  return countFastedInHijriMonth(entries, toHijri, year, DHUL_HIJJAH, { toDay: 9 });
}

/**
 * Ashura hint: the 10th is planned/kept but neither the 9th nor the 11th —
 * suggest adding one (Muslim 1134).
 */
export function needsAshuraCompanion(ashuraDateKey: string, entries: VoluntaryFastingMap): boolean {
  if (!isPlannedFastEntry(entries[ashuraDateKey])) return false;
  return (
    !isPlannedFastEntry(entries[addDays(ashuraDateKey, -1)]) &&
    !isPlannedFastEntry(entries[addDays(ashuraDateKey, 1)])
  );
}

/**
 * Per-date last-write-wins merge for the `voluntary_fasting` sync blob: union of
 * dates; on a clash the later `updatedAt` wins (ties keep local). Tombstones
 * (`deleted`) merge like any entry, so removals propagate. Pure.
 */
export function mergeVoluntaryFasting(local: unknown, remote: unknown): VoluntaryFastingMap {
  const l = asVoluntaryFastingMap(local);
  const r = asVoluntaryFastingMap(remote);
  const merged: VoluntaryFastingMap = { ...l };
  for (const [date, remoteEntry] of Object.entries(r)) {
    const localEntry = merged[date];
    if (!localEntry || remoteEntry.updatedAt > localEntry.updatedAt) merged[date] = remoteEntry;
  }
  return merged;
}

const DATE_KEY = /^\d{4}-\d{2}-\d{2}$/;
const STATUSES = new Set(["intended", "fasted", "broken"]);

/** Coerces a stored / remote value into a clean map, dropping malformed rows. */
export function asVoluntaryFastingMap(value: unknown): VoluntaryFastingMap {
  if (value == null || typeof value !== "object" || Array.isArray(value)) return {};
  const out: VoluntaryFastingMap = {};
  for (const [date, raw] of Object.entries(value as Record<string, unknown>)) {
    if (!DATE_KEY.test(date) || raw == null || typeof raw !== "object") continue;
    const row = raw as Partial<VoluntaryFastEntry>;
    if (typeof row.status !== "string" || !STATUSES.has(row.status)) continue;
    if (typeof row.updatedAt !== "string") continue;
    out[date] = {
      status: row.status,
      updatedAt: row.updatedAt,
      ...(row.asQaza === true ? { asQaza: true } : {}),
      ...(row.qazaCounted === true ? { qazaCounted: true } : {}),
      ...(typeof row.note === "string" ? { note: row.note.slice(0, 500) } : {}),
      ...(row.deleted === true ? { deleted: true } : {}),
    };
  }
  return out;
}
