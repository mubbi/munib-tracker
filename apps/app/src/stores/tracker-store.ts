import type { AchievementStats, DevotionProgress } from "@munib-tracker/shared/achievements";
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
  PrayerId,
  PrayerStatus,
  QazaCounter,
  QazaDailyProgress,
  QazaPrayer,
  QazaRozaCounter,
  QazaSchedule,
} from "@munib-tracker/shared/types";
import {
  buildDailySummary,
  computeStreak,
  countPerfectDays,
  getLocalDateString,
} from "@munib-tracker/shared/utils";

import { initDatabase, PrayerRepository, QazaRepository, ZikrRepository } from "@/db";
import { persistAchievementSync } from "@/lib/achievements-persistence";
import { reconcileQazaDebtForStatusChange } from "@/lib/prayer-qaza-debt";
import { zikrCountKey } from "@/lib/zikr-count-key";

import { createStore, useStore } from "./create-store";

const OBLIGATORY_SET = new Set<string>(OBLIGATORY_PRAYERS);

function emptyStats(): AchievementStats {
  return {
    streak: 0,
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

export type SetPrayerStatusOptions = {
  /** When marking missed, whether to increment the obligatory qaza counter. */
  addToQaza?: boolean;
};

export type ZikrProgressOptions = {
  /** Scope after-salah adhkar to one prayer (fard or Witr) for the day. */
  prayerId?: AfterSalahPrayer;
};

export interface TrackerState {
  date: string;
  isReady: boolean;
  prayerStatus: Record<string, PrayerStatus>;
  prayerNotes: Record<string, string | undefined>;
  /** Per-prayer congregation flag for the active day (NF-1.5). */
  prayerJama: Record<string, boolean>;
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
  incrementZikr: (
    zikrId: string,
    target: number,
    by?: number,
    options?: ZikrProgressOptions,
  ) => Promise<void>;
  adjustQaza: (prayerId: QazaPrayer, remaining: number, completed: number) => Promise<void>;
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

async function recompute(date: string): Promise<Partial<TrackerState>> {
  const [allLogs, todayZikr, allZikr, counters, roza, schedule, dailyProgress] = await Promise.all([
    PrayerRepository.getAll(),
    ZikrRepository.getByDate(date),
    ZikrRepository.getAll(),
    QazaRepository.getCounters(),
    QazaRepository.getRoza(),
    QazaRepository.getSchedule(),
    QazaRepository.getDailyProgress(date),
  ]);

  const prayerStatus: Record<string, PrayerStatus> = {};
  const prayerNotes: Record<string, string | undefined> = {};
  const prayerJama: Record<string, boolean> = {};
  let excusedReason: ExcusedReason | null = null;
  for (const log of allLogs) {
    if (log.date !== date) continue;
    prayerStatus[log.prayerId] = log.status;
    if (log.notes) prayerNotes[log.prayerId] = log.notes;
    if (log.isJama) prayerJama[log.prayerId] = true;
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
    prayersCompleted,
    qazaDebt,
    rozaDebt,
    zikrCompleted: allZikr.filter((z) => z.completed).length,
    perfectDays,
  };

  return {
    prayerStatus,
    prayerNotes,
    prayerJama,
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
  async function refreshUnlocked(): Promise<void> {
    const date = getLocalDateString();
    const next = await recompute(date);
    set({ ...next, date });
    await persistAchievementSync(next.achievementStats ?? emptyStats());
  }

  return {
    date: today,
    isReady: false,
    prayerStatus: {},
    prayerNotes: {},
    prayerJama: {},
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
      return enqueue(async () => {
        await initDatabase();
        const date = getLocalDateString();
        const next = await recompute(date);
        set({ ...next, date, isReady: true });
        await persistAchievementSync(next.achievementStats ?? emptyStats());
      });
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

    setPrayerJamaOnDate(date, prayerId, isJama) {
      return enqueue(async () => {
        if (date === get().date) {
          set({ prayerJama: { ...get().prayerJama, [prayerId]: isJama } });
        }
        await PrayerRepository.setFlags(prayerId, date, { isJama });
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
        await refreshUnlocked();
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
export function useTrackerReady(): boolean {
  return useStore(trackerStore, (s) => s.isReady);
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
  setDayExcused: (...args: Parameters<TrackerState["setDayExcused"]>) =>
    trackerStore.getState().setDayExcused(...args),
  setZikrCount: (...args: Parameters<TrackerState["setZikrCount"]>) =>
    trackerStore.getState().setZikrCount(...args),
  incrementZikr: (...args: Parameters<TrackerState["incrementZikr"]>) =>
    trackerStore.getState().incrementZikr(...args),
  adjustQaza: (...args: Parameters<TrackerState["adjustQaza"]>) =>
    trackerStore.getState().adjustQaza(...args),
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
