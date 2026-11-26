import {
  CUSTOM_HABIT_PREFIX,
  getSunnahHabit,
  SUNNAH_HABITS,
  type SunnahHabitDef,
  type SunnahHabitSource,
} from "@munib-tracker/shared/content/sunnah-habits";
import {
  SUNNAH_HABITS_MAX_SELECTED,
  type SunnahHabitCustom,
  type SunnahHabitsState,
} from "@munib-tracker/shared/types";
import { addDays, diffInDays } from "@munib-tracker/shared/utils";

import { adhkarSetsForDay } from "@/lib/adhkar-history";
import { mergeStamped, sanitizeStamps, writeStamped } from "@/lib/stamped-map";

/**
 * Pure logic for the daily Sunnah habits (NF-3.5). The store persists
 * {@link SunnahHabitsState}; everything here is derived. Linked habits read
 * their own stores through {@link HabitContext} and are never double-stored.
 */

export const EMPTY_SUNNAH_HABITS: SunnahHabitsState = {
  selected: [],
  custom: [],
  checks: {},
  spotlightSeen: {},
};

/** Days of consistency dots per habit. */
export const CONSISTENCY_DAYS = 30;
/** The spotlight skips a habit shown within this many days. */
export const SPOTLIGHT_COOLDOWN_DAYS = 14;
/** Custom titles are short labels, not notes. */
export const CUSTOM_TITLE_MAX = 60;
export const COUNT_TARGET_MAX = 1000;

export function habitCheckKey(habitId: string, date: string): string {
  return `${habitId}::${date}`;
}

export function isCustomHabitId(id: string): boolean {
  return id.startsWith(CUSTOM_HABIT_PREFIX);
}

// ── sanitising (sync / backup input is untrusted) ─────────────────────────────

const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

function cleanCustom(value: unknown): SunnahHabitCustom | null {
  if (value == null || typeof value !== "object") return null;
  const c = value as Partial<SunnahHabitCustom>;
  if (typeof c.id !== "string" || !isCustomHabitId(c.id)) return null;
  if (typeof c.title !== "string") return null;
  const title = c.title.trim().slice(0, CUSTOM_TITLE_MAX);
  if (!title) return null;
  const target =
    typeof c.target === "number" && Number.isFinite(c.target) && c.target >= 1
      ? Math.min(Math.round(c.target), COUNT_TARGET_MAX)
      : undefined;
  return target == null ? { id: c.id, title } : { id: c.id, title, target };
}

export function sanitizeSunnahHabits(raw: unknown): SunnahHabitsState {
  if (raw == null || typeof raw !== "object") return { ...EMPTY_SUNNAH_HABITS };
  const input = raw as Partial<SunnahHabitsState>;
  const custom = Array.isArray(input.custom)
    ? input.custom.map(cleanCustom).filter((c): c is SunnahHabitCustom => c != null)
    : [];
  const customIds = new Set(custom.map((c) => c.id));
  const seen = new Set<string>();
  const selected: string[] = [];
  for (const id of Array.isArray(input.selected) ? input.selected : []) {
    if (typeof id !== "string" || seen.has(id)) continue;
    if (!getSunnahHabit(id) && !customIds.has(id)) continue;
    seen.add(id);
    selected.push(id);
    if (selected.length >= SUNNAH_HABITS_MAX_SELECTED) break;
  }
  const prunedBefore =
    typeof input.prunedBefore === "string" && DATE_RE.test(input.prunedBefore)
      ? input.prunedBefore
      : undefined;
  const isLiveKey = (key: string) => {
    const [, date] = key.split("::");
    return !!date && DATE_RE.test(date) && (!prunedBefore || date >= prunedBefore);
  };
  const checks: Record<string, number> = {};
  for (const [key, value] of Object.entries(input.checks ?? {})) {
    if (!isLiveKey(key)) continue;
    if (typeof value !== "number" || !Number.isFinite(value) || value <= 0) continue;
    checks[key] = Math.min(Math.round(value), COUNT_TARGET_MAX * 10);
  }
  const checkStamps = sanitizeStamps(input.checkStamps, isLiveKey);
  const spotlightSeen: Record<string, string> = {};
  for (const [id, date] of Object.entries(input.spotlightSeen ?? {})) {
    if (typeof date === "string" && DATE_RE.test(date)) spotlightSeen[id] = date;
  }
  const targets: Record<string, number> = {};
  for (const [id, value] of Object.entries(input.targets ?? {})) {
    if (typeof value === "number" && Number.isFinite(value) && value >= 1) {
      targets[id] = Math.min(Math.round(value), COUNT_TARGET_MAX);
    }
  }
  return {
    selected,
    custom,
    checks,
    spotlightSeen,
    ...(Object.keys(checkStamps).length ? { checkStamps } : {}),
    ...(prunedBefore ? { prunedBefore } : {}),
    ...(Object.keys(targets).length ? { targets } : {}),
    ...(typeof input.listUpdatedAt === "string" ? { listUpdatedAt: input.listUpdatedAt } : {}),
  };
}

/** Equal stamps (incl. two pre-stamp copies): the higher count — the old max-per-key merge. */
const maxTie = (a: number | undefined, b: number | undefined): number | undefined =>
  a == null ? b : b == null ? a : Math.max(a, b);

/**
 * Sync merge (blob entity `sunnah_habits`): each checks key keeps its newest
 * write (`checkStamps`; an untick / lowered count is a write too — unstamped
 * legacy values merge as the max), checks before the later `prunedBefore`
 * stay pruned, spotlight dates keep the latest, and the list (selected /
 * custom / targets) is last-write-wins on `listUpdatedAt`. Pure.
 */
export function mergeSunnahHabits(localRaw: unknown, remoteRaw: unknown): SunnahHabitsState {
  const local = sanitizeSunnahHabits(localRaw);
  const remote = sanitizeSunnahHabits(remoteRaw);
  const checks = mergeStamped(
    { values: local.checks, stamps: local.checkStamps ?? {} },
    { values: remote.checks, stamps: remote.checkStamps ?? {} },
    maxTie,
  );
  const prunedBefore = [local.prunedBefore, remote.prunedBefore].filter(Boolean).sort().at(-1);
  const spotlightSeen = { ...remote.spotlightSeen };
  for (const [id, date] of Object.entries(local.spotlightSeen)) {
    if (!spotlightSeen[id] || spotlightSeen[id] < date) spotlightSeen[id] = date;
  }
  const remoteWins = (remote.listUpdatedAt ?? "") > (local.listUpdatedAt ?? "");
  const list = remoteWins ? remote : local;
  return sanitizeSunnahHabits({
    selected: list.selected,
    custom: list.custom,
    targets: list.targets,
    listUpdatedAt: list.listUpdatedAt,
    checks: checks.values,
    checkStamps: checks.stamps,
    prunedBefore,
    spotlightSeen,
  });
}

// ── resolving a habit ────────────────────────────────────────────────────────

export interface ResolvedHabit {
  id: string;
  /** Catalog entry (undefined for a custom habit). */
  def?: SunnahHabitDef;
  custom?: SunnahHabitCustom;
  /** 1 for a yes/no habit. */
  target: number;
  isCount: boolean;
}

export function resolveHabit(state: SunnahHabitsState, id: string): ResolvedHabit | null {
  const def = getSunnahHabit(id);
  if (def) {
    const target = def.userTarget ? (state.targets?.[id] ?? def.target ?? 1) : (def.target ?? 1);
    return { id, def, target, isCount: target > 1 };
  }
  const custom = state.custom.find((c) => c.id === id);
  if (!custom) return null;
  const target = custom.target ?? 1;
  return { id, custom, target, isCount: target > 1 };
}

export function selectedHabits(state: SunnahHabitsState): ResolvedHabit[] {
  return state.selected
    .map((id) => resolveHabit(state, id))
    .filter((h): h is ResolvedHabit => h != null);
}

/** Data the linked habits are derived from (read-only views of other stores). */
export interface HabitContext {
  /** Zikr counts for a local date (keys as in the tracker store), or undefined if none. */
  zikrCountsFor: (date: string) => Record<string, number> | undefined;
  /** Local dates with at least one sadaqah log entry. */
  sadaqahDates: ReadonlySet<string>;
}

export const EMPTY_HABIT_CONTEXT: HabitContext = {
  zikrCountsFor: () => undefined,
  sadaqahDates: new Set(),
};

export interface HabitDayProgress {
  value: number;
  target: number;
  done: boolean;
  /** Set when the value came from another store ("from Adhkar" label). */
  derivedFrom?: SunnahHabitSource;
  /**
   * A linked habit that may also be ticked by hand ({@link SunnahHabitDef.manualTick}):
   * `true` when the stored tick (not the source) makes it done, so the row can untick it.
   */
  ticked?: boolean;
}

function derivedValue(
  source: SunnahHabitSource,
  date: string,
  ctx: HabitContext,
): { value: number; done: boolean } {
  if (source === "sadaqah") {
    const done = ctx.sadaqahDates.has(date);
    return { value: done ? 1 : 0, done };
  }
  const counts = ctx.zikrCountsFor(date);
  if (!counts) return { value: 0, done: false };
  if (source === "adhkar:morning" || source === "adhkar:evening") {
    const index = source === "adhkar:morning" ? 0 : -2;
    const sets = adhkarSetsForDay(counts);
    const set = sets.at(index);
    return { value: set?.completed ?? 0, done: set?.done ?? false };
  }
  const zikrId = source.slice("zikr:".length);
  const value = counts[zikrId] ?? 0;
  return { value, done: false };
}

/** One habit's progress on one day, merging the stored check with any linked source. */
export function habitProgress(
  state: SunnahHabitsState,
  habit: ResolvedHabit,
  date: string,
  ctx: HabitContext,
): HabitDayProgress {
  const stored = state.checks[habitCheckKey(habit.id, date)] ?? 0;
  const source = habit.def?.source;
  if (!source) {
    return { value: stored, target: habit.target, done: stored >= habit.target };
  }
  const derived = derivedValue(source, date, ctx);
  if (source === "adhkar:morning" || source === "adhkar:evening") {
    // A whole adhkar set — done when the set is done.
    return {
      value: derived.done ? 1 : 0,
      target: 1,
      done: derived.done,
      derivedFrom: source,
    };
  }
  if (source === "sadaqah") {
    // The log auto-checks it; a manual tick covers giving that isn't logged (a smile, help…).
    const done = derived.done || stored >= 1;
    return { value: done ? 1 : 0, target: 1, done, ...(derived.done && { derivedFrom: source }) };
  }
  if (habit.def?.manualTick) {
    // Tasbeeh-linked but tickable (salawat away from the tasbeeh). A tick stores the
    // target; a stored stepper value from before the link (â‰¥ target) still counts.
    const ticked = stored >= habit.target;
    return {
      value: derived.value,
      target: habit.target,
      done: ticked || derived.value >= habit.target,
      derivedFrom: source,
      ...(ticked && { ticked }),
    };
  }
  // Tasbeeh-linked count (istighfar): only the tasbeeh count, never stored here.
  return {
    value: derived.value,
    target: habit.target,
    done: derived.value >= habit.target,
    derivedFrom: source,
  };
}

/** Oldest → newest done flags for the last {@link CONSISTENCY_DAYS} days ending `endDate`. */
export function consistencyDots(
  state: SunnahHabitsState,
  habit: ResolvedHabit,
  endDate: string,
  ctx: HabitContext,
  days = CONSISTENCY_DAYS,
): boolean[] {
  const dots: boolean[] = [];
  for (let offset = days - 1; offset >= 0; offset -= 1) {
    dots.push(habitProgress(state, habit, addDays(endDate, -offset), ctx).done);
  }
  return dots;
}

/**
 * The habit kept most often in the window — a soft highlight, never a ranking
 * or a streak. `null` until some habit was kept at least twice.
 */
export function mostConsistentHabit(
  state: SunnahHabitsState,
  endDate: string,
  ctx: HabitContext,
): { id: string; days: number } | null {
  let best: { id: string; days: number } | null = null;
  for (const habit of selectedHabits(state)) {
    const days = consistencyDots(state, habit, endDate, ctx).filter(Boolean).length;
    if (days >= 2 && (!best || days > best.days)) best = { id: habit.id, days };
  }
  return best;
}

/** How many selected habits are done today (for headers / the home card). */
export function dayProgressSummary(
  state: SunnahHabitsState,
  date: string,
  ctx: HabitContext,
): { done: number; total: number } {
  const habits = selectedHabits(state);
  const done = habits.filter((h) => habitProgress(state, h, date, ctx).done).length;
  return { done, total: habits.length };
}

/** Days in the habits screen's "This week" strip. */
export const WEEK_STRIP_DAYS = 7;

/** Oldest → newest per-day done / total for the last `days` days ending `endDate`. */
export function weekSummary(
  state: SunnahHabitsState,
  endDate: string,
  ctx: HabitContext,
  days = WEEK_STRIP_DAYS,
): { date: string; done: number; total: number }[] {
  const out: { date: string; done: number; total: number }[] = [];
  for (let offset = days - 1; offset >= 0; offset -= 1) {
    const date = addDays(endDate, -offset);
    out.push({ date, ...dayProgressSummary(state, date, ctx) });
  }
  return out;
}

/** Today's habits with the done ones settled at the bottom (order kept within each part). */
export function habitsDoneLast(
  state: SunnahHabitsState,
  date: string,
  ctx: HabitContext,
): ResolvedHabit[] {
  const habits = selectedHabits(state);
  const done = habits.map((h) => habitProgress(state, h, date, ctx).done);
  return [...habits.filter((_, i) => !done[i]), ...habits.filter((_, i) => done[i])];
}

// ── spotlight ────────────────────────────────────────────────────────────────

/**
 * One unselected catalog habit per day, rotating by date and skipping any shown
 * in the last {@link SPOTLIGHT_COOLDOWN_DAYS} days. A habit already shown today
 * stays the spotlight all day. Pure — the caller records `spotlightSeen`.
 */
export function pickSpotlight(state: SunnahHabitsState, date: string): string | null {
  const selected = new Set(state.selected);
  const candidates = SUNNAH_HABITS.filter((h) => !selected.has(h.id)).map((h) => h.id);
  if (candidates.length === 0) return null;
  const shownToday = candidates.find((id) => state.spotlightSeen[id] === date);
  if (shownToday) return shownToday;
  const fresh = candidates.filter((id) => {
    const last = state.spotlightSeen[id];
    return !last || diffInDays(date, last) >= SPOTLIGHT_COOLDOWN_DAYS;
  });
  const pool = fresh.length > 0 ? fresh : candidates;
  const dayNumber = Math.abs(diffInDays(date, "2000-01-01"));
  return pool[dayNumber % pool.length] ?? null;
}

// ── mutations (pure; the store persists the result) ───────────────────────────

function touchList(state: SunnahHabitsState, now: Date): SunnahHabitsState {
  return { ...state, listUpdatedAt: now.toISOString() };
}

export function canAddHabit(state: SunnahHabitsState): boolean {
  return state.selected.length < SUNNAH_HABITS_MAX_SELECTED;
}

export function addHabit(
  state: SunnahHabitsState,
  id: string,
  now = new Date(),
): SunnahHabitsState {
  if (state.selected.includes(id) || !canAddHabit(state)) return state;
  if (!getSunnahHabit(id) && !state.custom.some((c) => c.id === id)) return state;
  return touchList({ ...state, selected: [...state.selected, id] }, now);
}

export function removeHabit(
  state: SunnahHabitsState,
  id: string,
  now = new Date(),
): SunnahHabitsState {
  if (!state.selected.includes(id)) return state;
  const custom = isCustomHabitId(id) ? state.custom.filter((c) => c.id !== id) : state.custom;
  return touchList({ ...state, selected: state.selected.filter((s) => s !== id), custom }, now);
}

export function moveHabit(
  state: SunnahHabitsState,
  id: string,
  delta: -1 | 1,
  now = new Date(),
): SunnahHabitsState {
  const from = state.selected.indexOf(id);
  const to = from + delta;
  if (from < 0 || to < 0 || to >= state.selected.length) return state;
  const selected = [...state.selected];
  [selected[from], selected[to]] = [selected[to] as string, selected[from] as string];
  return touchList({ ...state, selected }, now);
}

/**
 * Reorders the list to `ids` — a permutation of `selected` (anything else is
 * ignored, so a stale editor can't add or drop habits through a reorder).
 */
export function reorderHabits(
  state: SunnahHabitsState,
  ids: readonly string[],
  now = new Date(),
): SunnahHabitsState {
  if (ids.length !== state.selected.length) return state;
  const current = new Set(state.selected);
  if (new Set(ids).size !== ids.length || ids.some((id) => !current.has(id))) return state;
  if (ids.every((id, i) => state.selected[i] === id)) return state;
  return touchList({ ...state, selected: [...ids] }, now);
}

export function addCustomHabit(
  state: SunnahHabitsState,
  input: { id: string; title: string; target?: number },
  now = new Date(),
): SunnahHabitsState {
  const custom = cleanCustom({ ...input, id: `${CUSTOM_HABIT_PREFIX}${input.id}` });
  if (!custom || !canAddHabit(state)) return state;
  return touchList(
    { ...state, custom: [...state.custom, custom], selected: [...state.selected, custom.id] },
    now,
  );
}

export function setHabitTarget(
  state: SunnahHabitsState,
  id: string,
  target: number,
  now = new Date(),
): SunnahHabitsState {
  if (!getSunnahHabit(id)?.userTarget) return state;
  const clean = Math.min(Math.max(1, Math.round(target)), COUNT_TARGET_MAX);
  return touchList({ ...state, targets: { ...state.targets, [id]: clean } }, now);
}

/**
 * Sets a stored day value (0 clears it). Linked-only habits are ignored. The
 * write is stamped (a clear leaves a tombstone stamp) so sync keeps it.
 */
export function setHabitValue(
  state: SunnahHabitsState,
  id: string,
  date: string,
  value: number,
  now = new Date(),
): SunnahHabitsState {
  const def = getSunnahHabit(id);
  if (def?.kind === "linked" && !def.manualTick) return state;
  const clean = Math.max(0, Math.round(value));
  const next = writeStamped(
    { values: state.checks, stamps: state.checkStamps ?? {} },
    habitCheckKey(id, date),
    clean === 0 ? null : Math.min(clean, COUNT_TARGET_MAX * 10),
    now.toISOString(),
  );
  return { ...state, checks: next.values, checkStamps: next.stamps };
}

export function toggleHabit(
  state: SunnahHabitsState,
  id: string,
  date: string,
  now = new Date(),
): SunnahHabitsState {
  const current = state.checks[habitCheckKey(id, date)] ?? 0;
  if (getSunnahHabit(id)?.manualTick) {
    // A tickable linked count habit: a tick stores today's target (done), an untick clears it.
    const target = resolveHabit(state, id)?.target ?? 1;
    return setHabitValue(state, id, date, current >= target ? 0 : target, now);
  }
  return setHabitValue(state, id, date, current >= 1 ? 0 : 1, now);
}

export function markSpotlightSeen(
  state: SunnahHabitsState,
  id: string,
  date: string,
): SunnahHabitsState {
  if (state.spotlightSeen[id] === date) return state;
  return { ...state, spotlightSeen: { ...state.spotlightSeen, [id]: date } };
}

/**
 * Drops checks (and their stamps / tombstones) older than `keepDays` so the
 * synced blob stays small, and records the cutoff as `prunedBefore` so a merge
 * with a device that still holds them doesn't bring them back.
 */
export function pruneOldChecks(
  state: SunnahHabitsState,
  today: string,
  keepDays = 120,
): SunnahHabitsState {
  const cutoff = addDays(today, -keepDays);
  const isOld = (key: string) => (key.split("::")[1] ?? "") < cutoff;
  const oldChecks = Object.keys(state.checks).filter(isOld);
  const oldStamps = Object.keys(state.checkStamps ?? {}).filter(isOld);
  if (!oldChecks.length && !oldStamps.length) return state;
  const checks = { ...state.checks };
  for (const key of oldChecks) delete checks[key];
  const checkStamps = { ...state.checkStamps };
  for (const key of oldStamps) delete checkStamps[key];
  const prunedBefore =
    state.prunedBefore && state.prunedBefore > cutoff ? state.prunedBefore : cutoff;
  return { ...state, checks, checkStamps, prunedBefore };
}

// ── reminders ────────────────────────────────────────────────────────────────

/** Selected habits done at bedtime — folded into the before-sleep reminder text. */
export function bedtimeHabitIds(state: SunnahHabitsState): string[] {
  return state.selected.filter((id) => getSunnahHabit(id)?.bedtime === true);
}

/** Selected habits that involve reciting the Qur'an (madhhab note during hayd). */
export function isQuranRecitationHabit(id: string): boolean {
  return getSunnahHabit(id)?.quranRecitation === true;
}
