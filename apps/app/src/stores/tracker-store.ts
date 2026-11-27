import type {
  AchievementStats,
  DevotionProgress,
  RecitationStats,
} from "@munib-tracker/shared/achievements";
import {
  computeDevotionProgress,
  summarizeQazaDebt,
  summarizeRozaDebt,
} from "@munib-tracker/shared/achievements";
import { OBLIGATORY_PRAYERS, QAZA_PRAYERS } from "@munib-tracker/shared/constants";
import type {
  AfterSalahPrayer,
  DailySummary,
  ExcusedReason,
  ObligatoryPrayer,
  PrayerCombineMode,
  PrayerId,
  PrayerStatus,
  QazaCounter,
  QazaDailyProgress,
  QazaPrayer,
  QazaRozaCounter,
  QazaSchedule,
  RawatibId,
} from "@munib-tracker/shared/types";
import {
  buildDailySummary,
  computeStreak,
  countPerfectDays,
  datesNeedingExcuseCarryForward,
  excusedReasonForDate,
  getLocalDateString,
  inferExcusedReasonFromYesterday,
  longestStreak,
} from "@munib-tracker/shared/utils";

import {
  initDatabase,
  PrayerRepository,
  PreferencesRepository,
  QazaRepository,
  ZikrRepository,
} from "@/db";
import { persistAchievementSync } from "@/lib/achievements-persistence";
import { requestReminderReschedule } from "@/lib/notifications/reschedule";
import { combinedFromLog, combinePartner, type PrayerCombined } from "@/lib/prayer-combining";
import { reconcileQazaDebtForStatusChange } from "@/lib/prayer-qaza-debt";
import { markPreferencesDirty } from "@/lib/sync/preferences-cloud-sync";
import { markTrackingChanged } from "@/lib/sync/tracking-changes";
import { zikrCountKey } from "@/lib/zikr-count-key";

import { createStore, useStore } from "./create-store";
import { preferencesStore } from "./preferences-store";

const OBLIGATORY_SET = new Set<string>(OBLIGATORY_PRAYERS);

function emptyStats(): AchievementStats {
  return {
    streak: 0,
    bestStreak: 0,
    prayersCompleted: 0,
    zikrCompleted: 0,
    perfectDays: 0,
    qazaDebt: null,
    rozaDebt: null,
  };
}

function emptySummary(date: string): DailySummary {
  return {
    date,
    salahCompleted: 0,
    salahTotal: OBLIGATORY_PRAYERS.length,
    zikrCompleted: 0,
    zikrTotal: 0,
    qazaRemaining: 0,
    qazaTargetToday: 0,
    qazaCompletedToday: 0,
    streakDays: 0,
  };
}

/** Rawatib log details (NF-3.1). */
export type RawatibLogOptions = {
  /** Rak'at prayed (variable-count rows only, e.g. 2 | 4 before Dhuhr). */
  rakahs?: number;
  /** Logged after its usual time (the Fajr sunnah after sunrise). */
  late?: boolean;
};

export type SetPrayerStatusOptions = {
  /** When marking missed, whether to increment the obligatory qaza counter. */
  addToQaza?: boolean;
};

export type ZikrCountWrite = {
  zikrId: string;
  count: number;
  target: number;
  prayerId?: AfterSalahPrayer;
};

export type ZikrProgressOptions = {
  /** Scope after-salah adhkar to one prayer (fard or Witr) for the day. */
  prayerId?: AfterSalahPrayer;
};

export interface TrackerState {
  date: string;
  isReady: boolean;
  /** Set when `load()` failed (storage unavailable); cleared on the next attempt. */
  loadError: unknown | null;
  prayerStatus: Record<string, PrayerStatus>;
  prayerNotes: Record<string, string | undefined>;
  /** Per-prayer congregation flag for the active day (NF-1.5). */
  prayerJama: Record<string, boolean>;
  /** Per-prayer "prayed at the masjid" flag for the active day (NF-3.11). */
  prayerAtMasjid: Record<string, boolean>;
  /** Per-prayer jam' (combined) flag for the active day (NF-3.0a); absent = not combined. */
  prayerCombined: Record<string, PrayerCombined>;
  /** Rak'at logged on the active day's rawatib rows (NF-3.1); absent = the preset default. */
  prayerRakahs: Record<string, number>;
  /** The active day's excused reason (hayd / sick / travel), or null (NF-1.2/1.4). */
  excusedReason: ExcusedReason | null;
  zikrCounts: Record<string, number>;
  qazaCounters: QazaCounter[];
  qazaSchedule: QazaSchedule;
  qazaDailyProgress: QazaDailyProgress;
  roza: QazaRozaCounter;
  summary: DailySummary;
  streakDays: number;
  achievementStats: AchievementStats;
  devotionProgress: DevotionProgress;

  load: () => Promise<void>;
  refresh: () => Promise<void>;
  setPrayerStatus: (
    prayerId: PrayerId,
    status: PrayerStatus,
    options?: SetPrayerStatusOptions,
  ) => Promise<void>;
  /** Same as setPrayerStatus but for an arbitrary calendar day (queue-safe). */
  setPrayerStatusOnDate: (
    date: string,
    prayerId: PrayerId,
    status: PrayerStatus,
    options?: SetPrayerStatusOptions,
  ) => Promise<void>;
  setPrayerNotes: (prayerId: PrayerId, notes: string) => Promise<void>;
  setPrayerNotesOnDate: (date: string, prayerId: PrayerId, notes: string) => Promise<void>;
  setPrayerJama: (prayerId: PrayerId, isJama: boolean) => Promise<void>;
  setPrayerJamaOnDate: (date: string, prayerId: PrayerId, isJama: boolean) => Promise<void>;
  /** NF-3.11: logs / clears "prayed at the masjid" (with the masjid OSM ref) without touching the status. */
  setPrayerAtMasjidOnDate: (
    date: string,
    prayerId: PrayerId,
    masjidId: string | null,
  ) => Promise<void>;
  /** Log / clear a sunnah rawatib row today (NF-3.1) — never touches qaza or the streak. */
  setRawatib: (
    prayerId: RawatibId,
    completed: boolean,
    options?: RawatibLogOptions,
  ) => Promise<void>;
  setRawatibOnDate: (
    date: string,
    prayerId: RawatibId,
    completed: boolean,
    options?: RawatibLogOptions,
  ) => Promise<void>;
  /**
   * Sets (or clears with `null`) the jam' flag on `prayerId` AND its pair
   * partner (Dhuhr↔Asr, Maghrib↔Isha). No-op for prayers that can't be combined.
   */
  setPrayerCombinedOnDate: (
    date: string,
    prayerId: PrayerId,
    mode: PrayerCombineMode | null,
  ) => Promise<void>;
  setDayExcused: (reason: ExcusedReason | null) => Promise<void>;
  setDayExcusedOnDate: (date: string, reason: ExcusedReason | null) => Promise<void>;
  setZikrCount: (
    zikrId: string,
    count: number,
    target: number,
    options?: ZikrProgressOptions,
  ) => Promise<void>;
  setZikrCountOnDate: (
    date: string,
    zikrId: string,
    count: number,
    target: number,
    options?: ZikrProgressOptions,
  ) => Promise<void>;
  /** Log many zikr counts for today at once (e.g. "Mark all as done"). */
  setZikrCounts: (entries: ReadonlyArray<ZikrCountWrite>) => Promise<void>;
  /** Batch write for any date (e.g. last night's Isha adhkar logged after midnight). */
  setZikrCountsOnDate: (date: string, entries: ReadonlyArray<ZikrCountWrite>) => Promise<void>;
  incrementZikr: (
    zikrId: string,
    target: number,
    by?: number,
    options?: ZikrProgressOptions,
  ) => Promise<void>;
  adjustQaza: (prayerId: QazaPrayer, remaining: number, completed: number) => Promise<void>;
  /**
   * Reverses one day's logged make-up for a Salah (history removal): reads the counter and
   * credits back at most what it still holds as completed, inside the mutation queue.
   */
  removeQazaProgress: (prayerId: QazaPrayer, date: string, count: number) => Promise<void>;
  /** Atomically set remaining/completed for many prayers (calculator apply). */
  setQazaCounters: (
    updates: Partial<Record<QazaPrayer, { remaining: number; completed: number }>>,
  ) => Promise<void>;
  performQaza: (prayerId: QazaPrayer, by?: number) => Promise<void>;
  undoQaza: (prayerId: QazaPrayer, by?: number) => Promise<void>;
  resetQazaCounter: (prayerId: QazaPrayer) => Promise<void>;
  resetAllQazaCounters: () => Promise<void>;
  setQazaSchedule: (schedule: QazaSchedule) => Promise<void>;
  setRoza: (roza: QazaRozaCounter) => Promise<void>;
  performRoza: (by?: number) => Promise<void>;
  resetRoza: () => Promise<void>;
}

function clampQazaCount(value: number): number {
  return Math.max(0, Math.round(value));
}

/** Optimistic counter patch so the qaza UI updates before AsyncStorage + recompute finish. */
function patchQazaCounters(
  counters: QazaCounter[],
  updates: Partial<Record<QazaPrayer, { remaining: number; completed: number }>>,
): QazaCounter[] {
  const now = new Date().toISOString();
  const byId = new Map(counters.map((counter) => [counter.prayerId, counter]));
  return QAZA_PRAYERS.map((prayerId) => {
    const existing = byId.get(prayerId) ?? { prayerId, remaining: 0, completed: 0 };
    const update = updates[prayerId];
    if (!update) return existing;
    return {
      ...existing,
      remaining: clampQazaCount(update.remaining),
      completed: clampQazaCount(update.completed),
      updatedAt: now,
    };
  });
}

/**
 * Starting or ending an excused period pauses / re-arms nudges right away
 * (D31 / rule 5) — not at the next foreground, and also when no UI is mounted
 * (a repository-only write before preferences load).
 */
function rescheduleRemindersForExcusedChange(): void {
  requestReminderReschedule();
}

/** Persist the ongoing excused period and keep the preferences store / sync in sync. */
async function syncActiveExcusedReason(reason: ExcusedReason | null): Promise<void> {
  if (preferencesStore.getState().isReady) {
    const previous = preferencesStore.getState().prefs.activeExcusedReason ?? null;
    await preferencesStore.getState().update({ activeExcusedReason: reason });
    if (previous !== reason) rescheduleRemindersForExcusedChange();
    return;
  }
  const previous = (await PreferencesRepository.get()).activeExcusedReason ?? null;
  await PreferencesRepository.update({ activeExcusedReason: reason });
  markPreferencesDirty();
  if (previous !== reason) rescheduleRemindersForExcusedChange();
}

/**
 * Continues an active excused period onto `date` (and empty gap days) so hayd /
 * illness / travel do not silently drop at midnight until the user resumes.
 *
 * @param allowLegacyBootstrap When true (default), an undefined preference is
 *   inferred from today or yesterday so upgrades mid-period keep working. Pass
 *   false after historical calendar edits so marking a past day does not start
 *   an ongoing period.
 */
async function ensureContinuingExcusedPeriod(
  date: string,
  options?: { allowLegacyBootstrap?: boolean },
): Promise<void> {
  const allowLegacyBootstrap = options?.allowLegacyBootstrap !== false;
  const [allLogs, prefs] = await Promise.all([
    PrayerRepository.getAll(),
    PreferencesRepository.get(),
  ]);

  let active = prefs.activeExcusedReason;

  if (active === undefined) {
    const todayReason = excusedReasonForDate(allLogs, date);
    const inferred =
      todayReason ?? (allowLegacyBootstrap ? inferExcusedReasonFromYesterday(allLogs, date) : null);
    if (inferred == null) return;
    await syncActiveExcusedReason(inferred);
    active = inferred;
  }

  if (active == null) return;

  const datesToFlag = datesNeedingExcuseCarryForward(allLogs, date);
  for (const day of datesToFlag) {
    for (const prayerId of OBLIGATORY_PRAYERS) {
      await PrayerRepository.setFlags(prayerId, day, {
        isExcused: true,
        excusedReason: active,
      });
    }
  }
}

/** Last recitation stats read, kept when a later read fails (no Noor / badge flapping). */
let lastRecitation: RecitationStats | null = null;

/**
 * D71: Qur'an practice totals for the Recitation track. Loaded with `import()`
 * so the practice reading-credit rules stay out of the home / tracker bundles.
 * `null` on TV (no practice) — the track is then left out, not shown empty.
 */
async function loadRecitation(): Promise<RecitationStats | null> {
  try {
    const { loadRecitationStats } = await import("@/lib/achievements-recitation");
    lastRecitation = await loadRecitationStats();
  } catch (error) {
    if (__DEV__) console.warn("Failed to load recitation stats", error);
  }
  return lastRecitation;
}

async function recompute(date: string): Promise<Partial<TrackerState>> {
  const [allLogs, todayZikr, allZikr, counters, roza, schedule, dailyProgress, recitation] =
    await Promise.all([
      PrayerRepository.getAll(),
      ZikrRepository.getByDate(date),
      ZikrRepository.getAll(),
      QazaRepository.getCounters(),
      QazaRepository.getRoza(),
      QazaRepository.getSchedule(),
      QazaRepository.getDailyProgress(date),
      loadRecitation(),
    ]);

  const prayerStatus: Record<string, PrayerStatus> = {};
  const prayerNotes: Record<string, string | undefined> = {};
  const prayerJama: Record<string, boolean> = {};
  const prayerAtMasjid: Record<string, boolean> = {};
  const prayerRakahs: Record<string, number> = {};
  const prayerCombined: Record<string, PrayerCombined> = {};
  let excusedReason: ExcusedReason | null = null;
  for (const log of allLogs) {
    if (log.date !== date) continue;
    prayerStatus[log.prayerId] = log.status;
    if (log.notes) prayerNotes[log.prayerId] = log.notes;
    if (log.isJama) prayerJama[log.prayerId] = true;
    if (log.atMasjid) prayerAtMasjid[log.prayerId] = true;
    if (typeof log.rakahs === "number") prayerRakahs[log.prayerId] = log.rakahs;
    const combined = combinedFromLog(log);
    if (combined) prayerCombined[log.prayerId] = combined;
    if (log.isExcused) excusedReason = log.excusedReason ?? "sick";
  }

  const zikrCounts: Record<string, number> = {};
  for (const entry of todayZikr) {
    zikrCounts[zikrCountKey(entry.zikrId, entry.prayerId)] = entry.count;
  }

  const streakDays = computeStreak(allLogs, true, date);
  const summary = buildDailySummary({
    date,
    prayerLogs: allLogs,
    zikrProgress: todayZikr,
    qazaCounters: counters,
    qazaSchedule: schedule,
    qazaDailyProgress: dailyProgress,
    streakDays,
  });

  // Lifetime achievement stats — mirrors the achievements screen so the two
  // stay in lock-step (streak, lifetime completed obligatory prayers, qaza
  // made up, zikr sessions completed, best single-day obligatory count).
  const prayersCompleted = allLogs.filter(
    (l) => l.status === "completed" && OBLIGATORY_SET.has(l.prayerId),
  ).length;
  const perfectDays = countPerfectDays(allLogs);
  const qazaDebt = summarizeQazaDebt(counters);
  const rozaDebt = summarizeRozaDebt(roza);
  const achievementStats: AchievementStats = {
    streak: streakDays,
    bestStreak: Math.max(longestStreak(allLogs, true), streakDays),
    prayersCompleted,
    qazaDebt,
    rozaDebt,
    zikrCompleted: allZikr.filter((z) => z.completed).length,
    perfectDays,
    recitation,
  };

  return {
    prayerStatus,
    prayerNotes,
    prayerJama,
    prayerAtMasjid,
    prayerRakahs,
    prayerCombined,
    excusedReason,
    zikrCounts,
    qazaCounters: counters,
    qazaSchedule: schedule,
    qazaDailyProgress: dailyProgress,
    roza,
    summary,
    streakDays,
    achievementStats,
    devotionProgress: computeDevotionProgress(achievementStats),
  };
}

// Serializes DB mutations so rapid taps can't interleave read-modify-write
// races (e.g. double-counting qaza when a prayer is toggled quickly).
let mutationQueue: Promise<unknown> = Promise.resolve();
function enqueue<T>(task: () => Promise<T>): Promise<T> {
  const run = mutationQueue.then(task, task);
  mutationQueue = run.catch(() => undefined);
  return run;
}

export const trackerStore = createStore<TrackerState>((set, get) => {
  const today = getLocalDateString();

  /** Recompute without re-entering the mutation queue (safe inside enqueue). */
  async function refreshUnlocked(options?: { allowLegacyBootstrap?: boolean }): Promise<void> {
    const date = getLocalDateString();
    await ensureContinuingExcusedPeriod(date, options);
    const next = await recompute(date);
    set({ ...next, date });
    await persistAchievementSync(next.achievementStats ?? emptyStats());
  }

  return {
    date: today,
    isReady: false,
    loadError: null,
    prayerStatus: {},
    prayerNotes: {},
    prayerJama: {},
    prayerAtMasjid: {},
    prayerRakahs: {},
    prayerCombined: {},
    excusedReason: null,
    zikrCounts: {},
    qazaCounters: [],
    qazaSchedule: { targets: {} },
    qazaDailyProgress: { date: today, completed: {} },
    roza: { remaining: 0, completed: 0 },
    summary: emptySummary(today),
    streakDays: 0,
    achievementStats: emptyStats(),
    devotionProgress: computeDevotionProgress(emptyStats()),

    async load() {
      set({ loadError: null });
      try {
        await enqueue(async () => {
          await initDatabase();
          const date = getLocalDateString();
          await ensureContinuingExcusedPeriod(date);
          const next = await recompute(date);
          set({ ...next, date, isReady: true, loadError: null });
          await persistAchievementSync(next.achievementStats ?? emptyStats());
        });
      } catch (error) {
        // isReady stays false; screens show a RetryCard that calls load() again.
        set({ loadError: error ?? new Error("tracker load failed") });
      }
    },

    async refresh() {
      return enqueue(() => refreshUnlocked());
    },

    setPrayerStatus(prayerId, status, options) {
      return get().setPrayerStatusOnDate(get().date, prayerId, status, options);
    },

    setPrayerStatusOnDate(date, prayerId, status, options) {
      return enqueue(async () => {
        const existingLog = await PrayerRepository.getLog(prayerId, date);
        const previous = existingLog?.status ?? get().prayerStatus[prayerId] ?? "pending";

        const qazaDebtAdded = await reconcileQazaDebtForStatusChange(
          prayerId,
          previous,
          status,
          existingLog,
          options,
        );

        if (date === get().date) {
          set({ prayerStatus: { ...get().prayerStatus, [prayerId]: status } });
        }
        await PrayerRepository.setStatus(prayerId, date, status, { qazaDebtAdded });
        await refreshUnlocked();
      });
    },

    setPrayerNotes(prayerId, notes) {
      return get().setPrayerNotesOnDate(get().date, prayerId, notes);
    },

    setPrayerNotesOnDate(date, prayerId, notes) {
      return enqueue(async () => {
        if (date === get().date) {
          set({ prayerNotes: { ...get().prayerNotes, [prayerId]: notes } });
        }
        await PrayerRepository.setNotes(prayerId, date, notes);
        await refreshUnlocked();
      });
    },

    setPrayerJama(prayerId, isJama) {
      return get().setPrayerJamaOnDate(get().date, prayerId, isJama);
    },

    setRawatib(prayerId, completed, options) {
      return get().setRawatibOnDate(get().date, prayerId, completed, options);
    },

    setRawatibOnDate(date, prayerId, completed, options) {
      return enqueue(async () => {
        if (date === get().date) {
          const { prayerStatus, prayerRakahs } = get();
          set({
            prayerStatus: { ...prayerStatus, [prayerId]: completed ? "completed" : "pending" },
            ...(options?.rakahs != null && {
              prayerRakahs: { ...prayerRakahs, [prayerId]: options.rakahs },
            }),
          });
        }
        await PrayerRepository.setRawatib(prayerId, date, completed, options);
        await refreshUnlocked();
      });
    },

    setPrayerJamaOnDate(date, prayerId, isJama) {
      return enqueue(async () => {
        if (date === get().date) {
          set({ prayerJama: { ...get().prayerJama, [prayerId]: isJama } });
        }
        await PrayerRepository.setFlags(prayerId, date, { isJama });
        await refreshUnlocked();
      });
    },

    setPrayerAtMasjidOnDate(date, prayerId, masjidId) {
      return enqueue(async () => {
        if (date === get().date) {
          set({ prayerAtMasjid: { ...get().prayerAtMasjid, [prayerId]: masjidId != null } });
        }
        await PrayerRepository.setFlags(prayerId, date, {
          masjid: masjidId != null ? { masjidId } : null,
        });
        await refreshUnlocked();
      });
    },

    setPrayerCombinedOnDate(date, prayerId, mode) {
      return enqueue(async () => {
        const partner = combinePartner(prayerId);
        if (partner == null) return;
        const self = prayerId as ObligatoryPrayer;
        await PrayerRepository.setFlags(self, date, {
          combined: mode ? { with: partner, mode } : null,
        });
        await PrayerRepository.setFlags(partner, date, {
          combined: mode ? { with: self, mode } : null,
        });
        await refreshUnlocked();
      });
    },

    setDayExcused(reason) {
      return get().setDayExcusedOnDate(get().date, reason);
    },

    setDayExcusedOnDate(date, reason) {
      return enqueue(async () => {
        // A day-level excuse flags all five fard prayers so streak + qaza logic
        // (which key off the logs) treat the whole day as excused.
        const isExcused = reason != null;
        for (const prayerId of OBLIGATORY_PRAYERS) {
          await PrayerRepository.setFlags(prayerId, date, {
            isExcused,
            excusedReason: reason ?? undefined,
          });
        }
        // Only today's mark/clear owns the ongoing period — calendar edits to
        // past days must not start or stop carry-forward.
        if (date === getLocalDateString()) {
          await syncActiveExcusedReason(reason);
          await refreshUnlocked();
        } else {
          // Skip yesterday-bootstrap so historical edits do not start a period.
          await refreshUnlocked({ allowLegacyBootstrap: false });
        }
      });
    },

    setZikrCount(zikrId, count, target, options) {
      return get().setZikrCountOnDate(get().date, zikrId, count, target, options);
    },

    setZikrCountOnDate(date, zikrId, count, target, options) {
      return enqueue(async () => {
        if (date === get().date) {
          const key = zikrCountKey(zikrId, options?.prayerId);
          set({ zikrCounts: { ...get().zikrCounts, [key]: Math.max(0, count) } });
        }
        await ZikrRepository.setCount(zikrId, date, count, target, options?.prayerId);
        markTrackingChanged();
        await refreshUnlocked();
      });
    },

    setZikrCounts(entries) {
      return get().setZikrCountsOnDate(get().date, entries);
    },

    setZikrCountsOnDate(date, entries) {
      return enqueue(async () => {
        if (entries.length === 0) return;
        if (date === get().date) {
          const next = { ...get().zikrCounts };
          for (const entry of entries) {
            next[zikrCountKey(entry.zikrId, entry.prayerId)] = Math.max(0, entry.count);
          }
          set({ zikrCounts: next });
        }
        await ZikrRepository.setCounts(date, entries);
        markTrackingChanged();
        await refreshUnlocked();
      });
    },

    incrementZikr(zikrId, target, by = 1, options) {
      return enqueue(async () => {
        const { date, zikrCounts } = get();
        const key = zikrCountKey(zikrId, options?.prayerId);
        const next = Math.max(0, (zikrCounts[key] ?? 0) + by);
        set({ zikrCounts: { ...zikrCounts, [key]: next } });
        await ZikrRepository.increment(zikrId, date, target, by, options?.prayerId);
        markTrackingChanged();
        await refreshUnlocked();
      });
    },

    adjustQaza(prayerId, remaining, completed) {
      return enqueue(async () => {
        const { qazaCounters } = get();
        set({
          qazaCounters: patchQazaCounters(qazaCounters, {
            [prayerId]: { remaining, completed },
          }),
        });
        await QazaRepository.setCounter(prayerId, remaining, completed);
        await refreshUnlocked();
      });
    },

    removeQazaProgress(prayerId, date, count) {
      return enqueue(async () => {
        if (count <= 0) return;
        const counter = await QazaRepository.getCounter(prayerId);
        const credit = Math.min(count, counter.completed);
        await QazaRepository.setCounter(
          prayerId,
          counter.remaining + credit,
          counter.completed - credit,
        );
        await QazaRepository.decrementDailyProgress(prayerId, date, count);
        await refreshUnlocked();
      });
    },

    setQazaCounters(updates) {
      return enqueue(async () => {
        const { qazaCounters } = get();
        set({ qazaCounters: patchQazaCounters(qazaCounters, updates) });
        await QazaRepository.setCounters(updates);
        await refreshUnlocked();
      });
    },

    performQaza(prayerId, by = 1) {
      return enqueue(async () => {
        const { qazaCounters } = get();
        const current = qazaCounters.find((c) => c.prayerId === prayerId);
        if (current && current.remaining > 0) {
          const step = Math.min(by, current.remaining);
          set({
            qazaCounters: patchQazaCounters(qazaCounters, {
              [prayerId]: {
                remaining: current.remaining - step,
                completed: current.completed + step,
              },
            }),
          });
        }
        await QazaRepository.performQaza(prayerId, by);
        await refreshUnlocked();
      });
    },

    undoQaza(prayerId, by = 1) {
      return enqueue(async () => {
        await QazaRepository.undoQaza(prayerId, by);
        await refreshUnlocked();
      });
    },

    setQazaSchedule(schedule) {
      return enqueue(async () => {
        await QazaRepository.setSchedule(schedule);
        await refreshUnlocked();
      });
    },

    resetQazaCounter(prayerId) {
      return enqueue(async () => {
        const { qazaCounters } = get();
        set({
          qazaCounters: patchQazaCounters(qazaCounters, {
            [prayerId]: { remaining: 0, completed: 0 },
          }),
        });
        await QazaRepository.resetCounter(prayerId);
        await refreshUnlocked();
      });
    },

    resetAllQazaCounters() {
      return enqueue(async () => {
        const { qazaCounters } = get();
        const cleared = Object.fromEntries(
          qazaCounters.map((c) => [c.prayerId, { remaining: 0, completed: 0 }]),
        ) as Partial<Record<QazaPrayer, { remaining: number; completed: number }>>;
        set({ qazaCounters: patchQazaCounters(qazaCounters, cleared) });
        await QazaRepository.resetAllCounters();
        await refreshUnlocked();
      });
    },

    setRoza(roza) {
      return enqueue(async () => {
        await QazaRepository.setRoza(roza);
        await refreshUnlocked();
      });
    },

    performRoza(by = 1) {
      return enqueue(async () => {
        await QazaRepository.performRoza(by);
        await refreshUnlocked();
      });
    },

    resetRoza() {
      return enqueue(async () => {
        await QazaRepository.resetRoza();
        await refreshUnlocked();
      });
    },
  };
});

/** Selector hooks. */
/** The tracker's current calendar day (YYYY-MM-DD). */
export function useTrackerDate(): string {
  return useStore(trackerStore, (s) => s.date);
}

export function useTrackerReady(): boolean {
  return useStore(trackerStore, (s) => s.isReady);
}

/** The error from the last failed `load()` (null while loading / ready). */
export function useTrackerLoadError(): unknown | null {
  return useStore(trackerStore, (s) => s.loadError);
}

export function useDailySummary(): DailySummary {
  return useStore(trackerStore, (s) => s.summary);
}

export function useStreak(): number {
  return useStore(trackerStore, (s) => s.streakDays);
}

export function useAchievementStats(): AchievementStats {
  return useStore(trackerStore, (s) => s.achievementStats);
}

export function useDevotionProgress(): DevotionProgress {
  return useStore(trackerStore, (s) => s.devotionProgress);
}

export function useTodayPrayers(): {
  status: Record<string, PrayerStatus>;
  notes: Record<string, string | undefined>;
} {
  return useStore(trackerStore, (s) => ({ status: s.prayerStatus, notes: s.prayerNotes }));
}

export function usePrayerStatus(prayerId: PrayerId): PrayerStatus {
  return useStore(trackerStore, (s) => s.prayerStatus[prayerId] ?? "pending");
}

export function useQazaCounters(): QazaCounter[] {
  return useStore(trackerStore, (s) => s.qazaCounters);
}

export function useQazaSchedule(): QazaSchedule {
  return useStore(trackerStore, (s) => s.qazaSchedule);
}

export function useQazaDailyProgress(): QazaDailyProgress {
  return useStore(trackerStore, (s) => s.qazaDailyProgress);
}

export function useQazaSummary(): { remaining: number; completed: number } {
  return useStore(trackerStore, (s) => {
    let remaining = 0;
    let completed = 0;
    for (const counter of s.qazaCounters) {
      remaining += Number(counter.remaining) || 0;
      completed += Number(counter.completed) || 0;
    }
    return { remaining, completed };
  });
}

export function useRoza(): QazaRozaCounter {
  return useStore(trackerStore, (s) => s.roza);
}

export function useZikrCount(zikrId: string, prayerId?: AfterSalahPrayer): number {
  const key = zikrCountKey(zikrId, prayerId);
  return useStore(trackerStore, (s) => s.zikrCounts[key] ?? 0);
}

/** Today's raw zikr counts keyed by zikrId — used to derive per-category progress. */
export function useZikrCounts(): Record<string, number> {
  return useStore(trackerStore, (s) => s.zikrCounts);
}

export function usePrayerJama(prayerId: PrayerId): boolean {
  return useStore(trackerStore, (s) => s.prayerJama[prayerId] ?? false);
}

export function usePrayerJamaMap(): Record<string, boolean> {
  return useStore(trackerStore, (s) => s.prayerJama);
}

/** Today's "prayed at the masjid" flags keyed by prayer id (NF-3.11). */
export function usePrayerAtMasjidMap(): Record<string, boolean> {
  return useStore(trackerStore, (s) => s.prayerAtMasjid);
}

/** Today's jam' (combined) flags keyed by prayer id (NF-3.0a). */
export function usePrayerCombinedMap(): Record<string, PrayerCombined> {
  return useStore(trackerStore, (s) => s.prayerCombined);
}

/** Today's logged rawatib rak'at keyed by prayer id (NF-3.1). */
export function usePrayerRakahsMap(): Record<string, number> {
  return useStore(trackerStore, (s) => s.prayerRakahs);
}

export function useDayExcused(): ExcusedReason | null {
  return useStore(trackerStore, (s) => s.excusedReason);
}

// Actions are defined once and never change reference, so expose them as a
// stable singleton — components don't need to subscribe to the store for these.
const trackerActions = {
  load: (...args: Parameters<TrackerState["load"]>) => trackerStore.getState().load(...args),
  refresh: (...args: Parameters<TrackerState["refresh"]>) =>
    trackerStore.getState().refresh(...args),
  setPrayerStatus: (...args: Parameters<TrackerState["setPrayerStatus"]>) =>
    trackerStore.getState().setPrayerStatus(...args),
  setPrayerNotes: (...args: Parameters<TrackerState["setPrayerNotes"]>) =>
    trackerStore.getState().setPrayerNotes(...args),
  setPrayerJama: (...args: Parameters<TrackerState["setPrayerJama"]>) =>
    trackerStore.getState().setPrayerJama(...args),
  setRawatib: (...args: Parameters<TrackerState["setRawatib"]>) =>
    trackerStore.getState().setRawatib(...args),
  setRawatibOnDate: (...args: Parameters<TrackerState["setRawatibOnDate"]>) =>
    trackerStore.getState().setRawatibOnDate(...args),
  setPrayerCombinedOnDate: (...args: Parameters<TrackerState["setPrayerCombinedOnDate"]>) =>
    trackerStore.getState().setPrayerCombinedOnDate(...args),
  setPrayerAtMasjidOnDate: (...args: Parameters<TrackerState["setPrayerAtMasjidOnDate"]>) =>
    trackerStore.getState().setPrayerAtMasjidOnDate(...args),
  setDayExcused: (...args: Parameters<TrackerState["setDayExcused"]>) =>
    trackerStore.getState().setDayExcused(...args),
  setZikrCount: (...args: Parameters<TrackerState["setZikrCount"]>) =>
    trackerStore.getState().setZikrCount(...args),
  setZikrCounts: (...args: Parameters<TrackerState["setZikrCounts"]>) =>
    trackerStore.getState().setZikrCounts(...args),
  setZikrCountsOnDate: (...args: Parameters<TrackerState["setZikrCountsOnDate"]>) =>
    trackerStore.getState().setZikrCountsOnDate(...args),
  incrementZikr: (...args: Parameters<TrackerState["incrementZikr"]>) =>
    trackerStore.getState().incrementZikr(...args),
  adjustQaza: (...args: Parameters<TrackerState["adjustQaza"]>) =>
    trackerStore.getState().adjustQaza(...args),
  removeQazaProgress: (...args: Parameters<TrackerState["removeQazaProgress"]>) =>
    trackerStore.getState().removeQazaProgress(...args),
  setQazaCounters: (...args: Parameters<TrackerState["setQazaCounters"]>) =>
    trackerStore.getState().setQazaCounters(...args),
  performQaza: (...args: Parameters<TrackerState["performQaza"]>) =>
    trackerStore.getState().performQaza(...args),
  undoQaza: (...args: Parameters<TrackerState["undoQaza"]>) =>
    trackerStore.getState().undoQaza(...args),
  setQazaSchedule: (...args: Parameters<TrackerState["setQazaSchedule"]>) =>
    trackerStore.getState().setQazaSchedule(...args),
  resetQazaCounter: (...args: Parameters<TrackerState["resetQazaCounter"]>) =>
    trackerStore.getState().resetQazaCounter(...args),
  resetAllQazaCounters: (...args: Parameters<TrackerState["resetAllQazaCounters"]>) =>
    trackerStore.getState().resetAllQazaCounters(...args),
  setRoza: (...args: Parameters<TrackerState["setRoza"]>) =>
    trackerStore.getState().setRoza(...args),
  performRoza: (...args: Parameters<TrackerState["performRoza"]>) =>
    trackerStore.getState().performRoza(...args),
  resetRoza: (...args: Parameters<TrackerState["resetRoza"]>) =>
    trackerStore.getState().resetRoza(...args),
} as const;

export function useTrackerActions() {
  return trackerActions;
}
