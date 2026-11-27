import { OBLIGATORY_PRAYERS, WITR_PRAYER } from "@munib-tracker/shared/constants";
import type {
  AfterSalahPrayer,
  ObligatoryPrayer,
  ZikrCategoryId,
  ZikrItem,
} from "@munib-tracker/shared/types";
import { addDays } from "@munib-tracker/shared/utils";
import { afterSalahItemsForPrayer } from "@/lib/after-salah-adhkar-progress";
import type { PrayerSlotId } from "@/lib/prayer-times";
import { zikrByCategory } from "@/lib/zikr";
import { getZikrCountFromMap, isZikrOptional, zikrTarget } from "@/lib/zikr-count-key";

/**
 * Guided adhkar sessions: one screen that walks through a whole set (morning,
 * evening, before-sleep, or one salah's after-salah adhkar) with the counter
 * inline, so users never bounce list → detail → tasbeeh → back between items.
 *
 * Everything here is pure (no stores / hooks) so it is shared by the session
 * screen, the category list, and tests.
 */

/** After-salah tabs in display order: the five fard prayers, then Witr. */
export const AFTER_SALAH_SESSION_PRAYERS: AfterSalahPrayer[] = [...OBLIGATORY_PRAYERS, WITR_PRAYER];

export type AdhkarScope = {
  categoryId: ZikrCategoryId;
  /** Required for `after_prayer` — counts are always logged per salah. */
  prayer?: AfterSalahPrayer;
};

/** The ordered adhkar of a session scope. */
export function sessionItems(scope: AdhkarScope): ZikrItem[] {
  if (scope.categoryId === "after_prayer") {
    return scope.prayer ? afterSalahItemsForPrayer(scope.prayer) : [];
  }
  return zikrByCategory(scope.categoryId);
}

/** Prayer key a count is stored under (after-salah only — other sets are per day). */
export function scopePrayerKey(scope: AdhkarScope): AfterSalahPrayer | undefined {
  return scope.categoryId === "after_prayer" ? scope.prayer : undefined;
}

export function sessionItemCount(
  item: ZikrItem,
  counts: Record<string, number>,
  scope: AdhkarScope,
): number {
  return getZikrCountFromMap(counts, item.id, scopePrayerKey(scope));
}

/** The zikr's repetition target within this scope (per salah for after-salah). */
export function sessionItemTarget(item: ZikrItem, scope: AdhkarScope): number {
  return zikrTarget(item, scopePrayerKey(scope));
}

/** Weak-chain adhkar: shown, never required (and skipped by auto-advance). */
export function isSessionItemOptional(item: ZikrItem, scope: AdhkarScope): boolean {
  return isZikrOptional(item, scopePrayerKey(scope));
}

export function isSessionItemDone(
  item: ZikrItem,
  counts: Record<string, number>,
  scope: AdhkarScope,
): boolean {
  return sessionItemCount(item, counts, scope) >= sessionItemTarget(item, scope);
}

/** Still to recite: required and not yet at its target. */
function isSessionItemPending(
  item: ZikrItem,
  counts: Record<string, number>,
  scope: AdhkarScope,
): boolean {
  return !isSessionItemOptional(item, scope) && !isSessionItemDone(item, counts, scope);
}

export type AdhkarSetProgress = {
  /** Adhkar whose target is met. */
  completed: number;
  total: number;
  /** Recitations still to go across every pending zikr. */
  remainingReps: number;
};

export function sessionProgress(
  items: ZikrItem[],
  counts: Record<string, number>,
  scope: AdhkarScope,
): AdhkarSetProgress {
  let completed = 0;
  let total = 0;
  let remainingReps = 0;
  for (const item of items) {
    if (isSessionItemOptional(item, scope)) continue;
    const target = sessionItemTarget(item, scope);
    const count = Math.min(sessionItemCount(item, counts, scope), target);
    total += 1;
    if (count >= target) completed += 1;
    remainingReps += target - count;
  }
  return { completed, total, remainingReps };
}

/** Index of the first required, not-yet-done zikr, or 0 when everything is complete. */
export function firstPendingIndex(
  items: ZikrItem[],
  counts: Record<string, number>,
  scope: AdhkarScope,
): number {
  const index = items.findIndex((item) => isSessionItemPending(item, counts, scope));
  return Math.max(index, 0);
}

/**
 * The next pending zikr after `fromIndex` (wrapping to the start so skipped
 * items are revisited), or -1 when every required item is done. Optional
 * (weak-chain) adhkar are never auto-advanced into — reachable by hand only.
 */
export function nextPendingIndex(
  items: ZikrItem[],
  counts: Record<string, number>,
  scope: AdhkarScope,
  fromIndex: number,
): number {
  const n = items.length;
  for (let step = 1; step <= n; step += 1) {
    const index = (fromIndex + step) % n;
    if (isSessionItemPending(items[index], counts, scope)) return index;
  }
  return -1;
}

export type ZikrCountEntry = {
  zikrId: string;
  count: number;
  target: number;
  prayerId?: AfterSalahPrayer;
};

/**
 * Count writes that log every required zikr in the scope as fully recited
 * (quick "Mark all done"). Optional adhkar are left as the user recorded them.
 */
export function completeAllEntries(items: ZikrItem[], scope: AdhkarScope): ZikrCountEntry[] {
  const prayerId = scopePrayerKey(scope);
  return items
    .filter((item) => !isSessionItemOptional(item, scope))
    .map((item) => {
      const target = sessionItemTarget(item, scope);
      return { zikrId: item.id, count: target, target, ...(prayerId ? { prayerId } : {}) };
    });
}

// ── Time windows ─────────────────────────────────────────────────────────────

/** Today's prayer instants the adhkar windows hang off. */
export type PrayerInstants = Record<PrayerSlotId, Date>;

export type AdhkarWindow = { start?: Date; end?: Date };

const NEXT_FARD: Record<ObligatoryPrayer, PrayerSlotId | undefined> = {
  fajr: "dhuhr",
  dhuhr: "asr",
  asr: "maghrib",
  maghrib: "isha",
  // Isha's adhkar stay open through the night.
  isha: undefined,
};

/**
 * When a scope's adhkar are due today:
 * - after-salah: from that salah's time until the next fard salah begins
 *   (Witr: from Isha, open all night);
 * - morning: Fajr → Dhuhr; evening: Asr → Isha; before sleep: from Isha;
 * - other categories are situational (no window).
 */
export function adhkarWindow(scope: AdhkarScope, times: PrayerInstants): AdhkarWindow {
  switch (scope.categoryId) {
    case "after_prayer": {
      const prayer = scope.prayer;
      if (!prayer) return {};
      if (prayer === WITR_PRAYER) return { start: times.isha };
      const next = NEXT_FARD[prayer as ObligatoryPrayer];
      return { start: times[prayer as ObligatoryPrayer], end: next ? times[next] : undefined };
    }
    case "morning":
      return { start: times.fajr, end: times.dhuhr };
    case "evening":
      return { start: times.asr, end: times.isha };
    case "before_sleep":
      return { start: times.isha };
    default:
      return {};
  }
}

/**
 * - `done` — every zikr met its target
 * - `inProgress` — started, still in its window
 * - `pending` — due now, not started
 * - `upcoming` — its time has not begun yet
 * - `missed` — its window closed before it was finished (can still be logged)
 */
export type AdhkarSetStatus = "done" | "inProgress" | "pending" | "upcoming" | "missed";

export function adhkarSetStatus(
  progress: Pick<AdhkarSetProgress, "completed" | "total">,
  window: AdhkarWindow,
  now: Date,
): AdhkarSetStatus {
  if (progress.total > 0 && progress.completed >= progress.total) return "done";
  const started = progress.completed > 0;
  const time = now.getTime();
  if (window.end && time >= window.end.getTime()) return "missed";
  if (window.start && time < window.start.getTime()) return started ? "inProgress" : "upcoming";
  return started ? "inProgress" : "pending";
}

/**
 * The after-salah tab to open by default: the salah whose time is running now
 * (sunrise still belongs to Fajr's adhkar). Before Fajr, last night's Isha.
 */
export function afterSalahPrayerForSlot(slot: PrayerSlotId | undefined): ObligatoryPrayer {
  if (!slot || slot === "sunrise") return "fajr";
  return slot;
}

/**
 * Resolve which salah an after-salah zikr's count belongs to: the requested
 * one when it applies, else the current salah when it applies, else the first
 * salah the zikr is recited after (e.g. Witr-only adhkar).
 */
export function resolveAfterSalahPrayer(
  item: Pick<ZikrItem, "prayers">,
  requested: AfterSalahPrayer | undefined,
  current: AfterSalahPrayer,
): AfterSalahPrayer {
  const applicable: AfterSalahPrayer[] = item.prayers?.length
    ? item.prayers
    : [...OBLIGATORY_PRAYERS];
  if (requested && applicable.includes(requested)) return requested;
  if (applicable.includes(current)) return current;
  return applicable[0];
}

/** Categories that run as a daily guided session with a time window. */
export const DAILY_SESSION_CATEGORIES: ReadonlySet<ZikrCategoryId> = new Set([
  "morning",
  "evening",
  "before_sleep",
  "after_prayer",
]);

export type AdhkarScopeState = AdhkarSetProgress & { status: AdhkarSetStatus };

/** Progress + status for one scope (times may be unavailable, e.g. polar nights). */
export function adhkarScopeState(
  scope: AdhkarScope,
  counts: Record<string, number>,
  now: Date,
  times: PrayerInstants | null,
  items: ZikrItem[] = sessionItems(scope),
): AdhkarScopeState {
  const progress = sessionProgress(items, counts, scope);
  const window = times ? adhkarWindow(scope, times) : {};
  return { ...progress, status: adhkarSetStatus(progress, window, now) };
}

/** Status of every after-salah tab (chip row). */
export function afterSalahScopeStates(
  counts: Record<string, number>,
  now: Date,
  times: PrayerInstants | null,
): Record<AfterSalahPrayer, AdhkarScopeState> {
  const out = {} as Record<AfterSalahPrayer, AdhkarScopeState>;
  for (const prayer of AFTER_SALAH_SESSION_PRAYERS) {
    out[prayer] = adhkarScopeState({ categoryId: "after_prayer", prayer }, counts, now, times);
  }
  return out;
}

/** Every timed daily set, in the order a day runs (Fajr → Fajr). */
export const DAILY_ADHKAR_SCOPES: readonly AdhkarScope[] = [
  { categoryId: "after_prayer", prayer: "fajr" },
  { categoryId: "morning" },
  { categoryId: "after_prayer", prayer: "dhuhr" },
  { categoryId: "after_prayer", prayer: "asr" },
  { categoryId: "evening" },
  { categoryId: "after_prayer", prayer: "maghrib" },
  { categoryId: "after_prayer", prayer: "isha" },
  { categoryId: "after_prayer", prayer: WITR_PRAYER },
  { categoryId: "before_sleep" },
];

export type TimedAdhkarSet = {
  scope: AdhkarScope;
  state: AdhkarScopeState;
  window: AdhkarWindow;
};

/**
 * What the Zikr hub leads with: the sets whose window is open right now and
 * not finished (in-progress first, then by when they opened), plus the next
 * set still to open today. Without prayer times (no location, polar night)
 * nothing is "due" — windows are unknown, so the hub just shows categories.
 */
export function adhkarDueNow(
  counts: Record<string, number>,
  now: Date,
  times: PrayerInstants | null,
): { due: TimedAdhkarSet[]; next?: TimedAdhkarSet } {
  if (!times) return { due: [] };
  const sets = DAILY_ADHKAR_SCOPES.map((scope) => ({
    scope,
    state: adhkarScopeState(scope, counts, now, times),
    window: adhkarWindow(scope, times),
  })).filter((set) => set.state.total > 0);
  const opened = (set: TimedAdhkarSet) => set.window.start?.getTime() ?? 0;
  const due = sets
    .filter((set) => set.state.status === "pending" || set.state.status === "inProgress")
    .sort(
      (a, b) =>
        Number(b.state.status === "inProgress") - Number(a.state.status === "inProgress") ||
        opened(a) - opened(b),
    );
  const next = sets
    .filter((set) => set.state.status === "upcoming" && set.window.start)
    .sort((a, b) => opened(a) - opened(b))[0];
  return { due, next };
}

/**
 * The "adhkar day" a recitation belongs to. Night worship runs Fajr → Fajr, so
 * between midnight and Fajr adhkar (last night's Isha / Witr / before-sleep)
 * still belong to the previous date — otherwise logging Isha adhkar at 00:30
 * would mark *today's* Isha done before it happened and leave last night's
 * missed in the calendar and stats.
 */
export function adhkarDayFor(now: Date, todayFajr: Date | undefined, today: string): string {
  if (todayFajr && now.getTime() < todayFajr.getTime()) return addDays(today, -1);
  return today;
}
