import {
  RAWATIB_EXTRA_PRAYERS,
  RAWATIB_PARENT,
  RAWATIB_POSITION,
  RAWATIB_PRAYER_SET,
  RAWATIB_PRAYERS,
  RAWATIB_RAKAH_OPTIONS,
} from "../constants/index";
import { MADHHAB_RULES, type MadhhabRules } from "../fiqh/madhhab-rules";
import { type FiqhPreferences, resolveSchool } from "../fiqh/resolve";
import type {
  MadhhabId,
  ObligatoryPrayer,
  PrayerLog,
  PrayerStatus,
  RawatibExtraPrayer,
  RawatibId,
  RawatibPrayer,
  RawatibPreferences,
  RawatibPreset,
  UserPreferences,
} from "../types/index";
import { addDays } from "./date";

/**
 * Sunnah rawatib (NF-3.1) — pure rules shared by the tracker, statistics,
 * reminders and tests. Evidence and per-school notes: `docs/proofs/rawatib.md`.
 *
 * Invariants (regression-tested):
 * - rawatib ids are never qaza prayers and never count toward fard totals,
 *   streaks or perfect days (those helpers filter on `OBLIGATORY_PRAYER_SET`);
 * - the only statuses a rawatib log carries are `completed` and `pending`
 *   ("not prayed" is simply the absence of a completed log).
 */

export type RawatibPrefsInput = FiqhPreferences & Pick<UserPreferences, "rawatib">;

/** Used only when no school is chosen and the user enabled rawatib without picking a preset. */
export const RAWATIB_FALLBACK_PRESET: RawatibPreset = 12;

const PRESETS: readonly RawatibPreset[] = [10, 12];
const EXTRA_SET: ReadonlySet<string> = new Set(RAWATIB_EXTRA_PRAYERS);

export function isRawatibId(value: unknown): value is RawatibId {
  return typeof value === "string" && RAWATIB_PRAYER_SET.has(value);
}

export function isRawatibPreset(value: unknown): value is RawatibPreset {
  return typeof value === "number" && (PRESETS as readonly number[]).includes(value);
}

/** Drops malformed fields (e.g. from an older client or a corrupt sync blob). `undefined` ⇒ never set. */
export function sanitizeRawatibPreferences(raw: unknown): RawatibPreferences | undefined {
  if (raw == null || typeof raw !== "object") return undefined;
  const input = raw as Record<string, unknown>;
  if (typeof input.enabled !== "boolean") return undefined;
  const extras = Array.isArray(input.extras)
    ? RAWATIB_EXTRA_PRAYERS.filter((id) => (input.extras as unknown[]).includes(id))
    : [];
  return {
    enabled: input.enabled,
    ...(isRawatibPreset(input.preset) && { preset: input.preset }),
    extras,
  };
}

/** The school's default preset (D8): Hanafi 12, the other three 10. */
export function schoolRawatibPreset(school: MadhhabId): RawatibPreset {
  return MADHHAB_RULES[school].rawatib.defaultPreset;
}

export interface RawatibConfig {
  enabled: boolean;
  /** Never answered and no school chosen ⇒ the tracker asks (with both presets). */
  needsChoice: boolean;
  preset: RawatibPreset;
  /** `user` = picked explicitly; `school` = follows the madhhab; `fallback` = neither. */
  presetSource: "user" | "school" | "fallback";
  /** School governing salah (`null` ⇒ all views). */
  school: MadhhabId | null;
  extras: RawatibExtraPrayer[];
  /** Mu'akkadah rows then the chosen extras, in daily order. */
  ids: RawatibId[];
}

/** Daily order: each fard's rows, mu'akkadah first, extras after. */
const DAILY_ORDER: readonly RawatibId[] = [
  "fajr_before",
  "dhuhr_before",
  "dhuhr_after",
  "dhuhr_after_extra",
  "asr_before",
  "maghrib_before",
  "maghrib_after",
  "isha_before",
  "isha_after",
];

/** Active rows for the given extras, in daily order. */
export function activeRawatibIds(extras: readonly RawatibExtraPrayer[]): RawatibId[] {
  const chosen = new Set<string>(extras.filter((id) => EXTRA_SET.has(id)));
  return DAILY_ORDER.filter(
    (id) => (RAWATIB_PRAYERS as readonly string[]).includes(id) || chosen.has(id),
  );
}

/**
 * Resolves the user's rawatib setup. Unset preferences follow the madhhab (D8):
 * on with the school's preset once a school is chosen; with no school the
 * tracker asks first (`needsChoice`) and never silently picks one.
 */
export function resolveRawatibConfig(prefs: RawatibPrefsInput): RawatibConfig {
  const school = resolveSchool(prefs, "salah");
  const stored = sanitizeRawatibPreferences(prefs.rawatib);
  const extras = stored?.extras ?? [];
  const preset = stored?.preset ?? (school ? schoolRawatibPreset(school) : RAWATIB_FALLBACK_PRESET);
  const presetSource = stored?.preset != null ? "user" : school ? "school" : "fallback";
  return {
    enabled: stored ? stored.enabled : school != null,
    needsChoice: stored == null && school == null,
    preset,
    presetSource,
    school,
    extras,
    ids: activeRawatibIds(extras),
  };
}

/** Rak'at for a row when the user hasn't chosen (`dhuhr_before`: 4 on preset 12, 2 on preset 10). */
export function defaultRakahs(id: RawatibId, preset: RawatibPreset): number {
  if (id === "dhuhr_before") return preset === 12 ? 4 : 2;
  return RAWATIB_RAKAH_OPTIONS[id][0] ?? 2;
}

/** Whether a row offers a 2 / 4 choice (long-press sheet). */
export function hasRakahChoice(id: RawatibId): boolean {
  return RAWATIB_RAKAH_OPTIONS[id].length > 1;
}

/** The rak'at a log records, falling back to the preset default for missing/invalid values. */
export function rakahsForLog(
  log: Pick<PrayerLog, "rakahs"> | undefined,
  id: RawatibId,
  preset: RawatibPreset,
): number {
  const value = log?.rakahs;
  if (typeof value === "number" && RAWATIB_RAKAH_OPTIONS[id].includes(value)) return value;
  return defaultRakahs(id, preset);
}

/** The daily target in rak'at for the preset (12 or 10). */
export function rawatibTargetRakahs(preset: RawatibPreset): number {
  return preset;
}

/** Mu'akkadah rows attached to one fard (for the chip row under that fard). */
export function rawatibForParent(ids: readonly RawatibId[], parent: ObligatoryPrayer): RawatibId[] {
  return ids.filter((id) => RAWATIB_PARENT[id] === parent);
}

// ── Excused periods ─────────────────────────────────────────────────────────

export type RawatibTravelMode = MadhhabRules["travel"]["rawatib"];

export interface RawatibExcuseSplit {
  /** Rows shown as usual. */
  shown: RawatibId[];
  /** Rows collapsed under "Optional while travelling". */
  optional: RawatibId[];
  /** Hayd / nifas: every rawatib row is hidden. */
  hidden: boolean;
  /** False while excused (sick / travel): nothing is expected, nothing is judged. */
  expected: boolean;
}

/**
 * Applies the day's excused reason to the active rows:
 * - hayd / nifas → all hidden;
 * - sick → all visible, nothing expected;
 * - travel → only the Fajr sunnah stays (every school keeps or emphasises it);
 *   the rest are collapsed as optional. `travelMode` only changes the copy.
 */
export function splitRawatibForExcuse(
  ids: readonly RawatibId[],
  excusedReason: string | null | undefined,
): RawatibExcuseSplit {
  if (excusedReason === "hayd" || excusedReason === "nifas") {
    return { shown: [], optional: [], hidden: true, expected: false };
  }
  if (excusedReason === "sick") {
    return { shown: [...ids], optional: [], hidden: false, expected: false };
  }
  if (excusedReason === "travel") {
    return {
      shown: ids.filter((id) => id === "fajr_before"),
      optional: ids.filter((id) => id !== "fajr_before"),
      hidden: false,
      expected: false,
    };
  }
  return { shown: [...ids], optional: [], hidden: false, expected: true };
}

/** The travel rule of the school governing travel (`null` ⇒ all views). */
export function travelRawatibMode(prefs: FiqhPreferences): RawatibTravelMode | null {
  const school = resolveSchool(prefs, "travel");
  return school ? MADHHAB_RULES[school].travel.rawatib : null;
}

// ── Visibility windows ──────────────────────────────────────────────────────

/** Today's computed prayer instants plus the next day's Fajr (Isha rows run to it). */
export interface RawatibDayTimes {
  fajr: Date;
  sunrise: Date;
  dhuhr: Date;
  asr: Date;
  maghrib: Date;
  isha: Date;
  nextFajr: Date;
}

export interface RawatibWindow {
  start: Date;
  end: Date;
  /** Logged after this instant ⇒ `late` (the Fajr sunnah after sunrise; Tirmidhi 423). */
  lateAfter?: Date;
}

function validDate(date: Date | undefined): date is Date {
  return date instanceof Date && !Number.isNaN(date.getTime());
}

/** Window from the parent fard's time to the next fard's time; `null` when a time is unavailable. */
export function rawatibWindow(id: RawatibId, times: RawatibDayTimes): RawatibWindow | null {
  const parent = RAWATIB_PARENT[id];
  const bounds: Record<ObligatoryPrayer, [Date, Date]> = {
    fajr: [times.fajr, times.dhuhr],
    dhuhr: [times.dhuhr, times.asr],
    asr: [times.asr, times.maghrib],
    maghrib: [times.maghrib, times.isha],
    isha: [times.isha, times.nextFajr],
  };
  const [start, end] = bounds[parent];
  if (!validDate(start) || !validDate(end) || end.getTime() <= start.getTime()) return null;
  if (id === "fajr_before" && validDate(times.sunrise)) {
    return { start, end, lateAfter: times.sunrise };
  }
  return { start, end };
}

export interface RawatibRowState {
  id: RawatibId;
  /** In its window now, already logged, or the window can't be computed (polar edge). */
  visible: boolean;
  inWindow: boolean;
  /** Logging now would be after the usual time (Fajr sunnah after sunrise). */
  late: boolean;
  /** An after-row whose fard isn't marked yet — still loggable, with a soft hint. */
  beforeFard: boolean;
}

/**
 * Today's state for one row. A row shows from its fard's time until the next
 * fard's time; a logged row always stays visible so a completion never vanishes.
 * `times === null` (no location / unavailable) ⇒ every row stays visible.
 */
export function rawatibRowState(
  id: RawatibId,
  now: Date,
  times: RawatibDayTimes | null,
  parentStatus: PrayerStatus | undefined,
  logged: boolean,
): RawatibRowState {
  const window = times ? rawatibWindow(id, times) : null;
  const t = now.getTime();
  const inWindow = window == null || (t >= window.start.getTime() && t < window.end.getTime());
  const late = window?.lateAfter != null && t >= window.lateAfter.getTime();
  return {
    id,
    visible: logged || inWindow,
    inWindow,
    late,
    beforeFard: RAWATIB_POSITION[id] === "after" && parentStatus !== "completed",
  };
}

// ── Daily progress, statistics ──────────────────────────────────────────────

/** Rak'at prayed today toward the preset target (mu'akkadah rows only; extras are on top). */
export function completedRawatibRakahs(
  logs: readonly Pick<PrayerLog, "prayerId" | "status" | "rakahs">[],
  preset: RawatibPreset,
): number {
  let sum = 0;
  for (const log of logs) {
    if (log.status !== "completed") continue;
    if (!(RAWATIB_PRAYERS as readonly string[]).includes(log.prayerId)) continue;
    sum += rakahsForLog(log, log.prayerId as RawatibPrayer, preset);
  }
  return sum;
}

/** True when every mu'akkadah row of the preset is completed. */
export function isRawatibDayComplete(statuses: Partial<Record<string, PrayerStatus>>): boolean {
  return RAWATIB_PRAYERS.every((id) => statuses[id] === "completed");
}

export interface RawatibDayCell {
  date: string;
  /** Mu'akkadah rows completed that day. */
  done: number;
  total: number;
  complete: boolean;
  /** Any excused flag that day (hayd / sick / travel) — shown, never judged. */
  excused: boolean;
  /** Before the user's first rawatib log — faded, never counted. */
  beforeStart: boolean;
  isToday: boolean;
}

/** One cell per day in [from, to] (oldest first) for the consistency grid. */
export function rawatibConsistency(
  logs: readonly PrayerLog[],
  from: string,
  to: string,
  today: string,
): RawatibDayCell[] {
  const done = new Map<string, number>();
  const excused = new Set<string>();
  let first: string | null = null;
  for (const log of logs) {
    if (log.isExcused) excused.add(log.date);
    if (!RAWATIB_PRAYER_SET.has(log.prayerId)) continue;
    if (first === null || log.date < first) first = log.date;
    if (log.status !== "completed") continue;
    if (!(RAWATIB_PRAYERS as readonly string[]).includes(log.prayerId)) continue;
    done.set(log.date, (done.get(log.date) ?? 0) + 1);
  }
  const total = RAWATIB_PRAYERS.length;
  const cells: RawatibDayCell[] = [];
  for (let date = from; date <= to; date = addDays(date, 1)) {
    const count = done.get(date) ?? 0;
    cells.push({
      date,
      done: count,
      total,
      complete: count >= total,
      excused: excused.has(date),
      beforeStart: first === null || date < first,
      isToday: date === today,
    });
  }
  return cells;
}

export interface RawatibSummary {
  /** Days with every mu'akkadah row completed. */
  completeDays: number;
  /** Days that count: tracked, not excused, and (if today) with something logged. */
  countedDays: number;
  /** Mu'akkadah rows completed over the counted days. */
  rowsCompleted: number;
}

export function summarizeRawatib(cells: readonly RawatibDayCell[]): RawatibSummary {
  const summary: RawatibSummary = { completeDays: 0, countedDays: 0, rowsCompleted: 0 };
  for (const cell of cells) {
    if (cell.beforeStart || cell.excused) continue;
    if (cell.isToday && cell.done === 0) continue;
    summary.countedDays += 1;
    summary.rowsCompleted += cell.done;
    if (cell.complete) summary.completeDays += 1;
  }
  return summary;
}

// ── After-fard nudge ────────────────────────────────────────────────────────

export const RAWATIB_NUDGE_DELAY_MINUTES = 10;

export interface RawatibNudge {
  parent: ObligatoryPrayer;
  rawatib: RawatibId;
  fireAt: Date;
}

/**
 * One nudge per fard marked completed on `date` whose first active after-row is
 * still unlogged: `RAWATIB_NUDGE_DELAY_MINUTES` after the fard was marked
 * (`updatedAt`). Callers drop nudges in the past and gate on the toggle.
 */
export function rawatibNudgeCandidates(
  logs: readonly PrayerLog[],
  ids: readonly RawatibId[],
  date: string,
): RawatibNudge[] {
  const byId = new Map<string, PrayerLog>();
  for (const log of logs) if (log.date === date) byId.set(log.prayerId, log);
  const nudges: RawatibNudge[] = [];
  for (const parent of ["fajr", "dhuhr", "asr", "maghrib", "isha"] as const) {
    const fard = byId.get(parent);
    if (fard?.status !== "completed") continue;
    const after = ids.find(
      (id) => RAWATIB_PARENT[id] === parent && RAWATIB_POSITION[id] === "after",
    );
    if (!after || byId.get(after)?.status === "completed") continue;
    const markedAt = Date.parse(fard.updatedAt);
    if (!Number.isFinite(markedAt)) continue;
    nudges.push({
      parent,
      rawatib: after,
      fireAt: new Date(markedAt + RAWATIB_NUDGE_DELAY_MINUTES * 60_000),
    });
  }
  return nudges;
}

// ── Witr (§4.1.4 retrofit) ──────────────────────────────────────────────────

export type WitrPrefsInput = FiqhPreferences & Pick<UserPreferences, "witrQaza">;

/**
 * Witr qaza default: the school's `witr.qazaDefault` (on only for Hanafi; D9).
 * With no school chosen the app keeps its earlier behaviour (asks each time).
 */
export function witrQazaDefault(prefs: FiqhPreferences): boolean {
  const school = resolveSchool(prefs, "salah");
  return school ? MADHHAB_RULES[school].witr.qazaDefault : true;
}

/** Whether marking Witr missed offers to add it to qaza. An explicit choice always wins. */
export function isWitrQazaEnabled(prefs: WitrPrefsInput): boolean {
  return typeof prefs.witrQaza === "boolean" ? prefs.witrQaza : witrQazaDefault(prefs);
}

/** Witr's ruling in the governing school (`null` ⇒ all views). */
export function witrStatusFor(prefs: FiqhPreferences): MadhhabRules["witr"]["status"] | null {
  const school = resolveSchool(prefs, "salah");
  return school ? MADHHAB_RULES[school].witr.status : null;
}
