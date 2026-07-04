import type { AchievementStats, DevotionProgress } from "@munib-tracker/shared/achievements";
import {
  computeDevotionProgress,
  summarizeQazaDebt,
  summarizeRozaDebt,
} from "@munib-tracker/shared/achievements";
import { OBLIGATORY_PRAYERS } from "@munib-tracker/shared/constants";
import type {
  DailySummary,
  ObligatoryPrayer,
  PrayerId,
  PrayerStatus,
  QazaCounter,
  QazaDailyProgress,
  QazaRozaCounter,
  QazaSchedule,
} from "@munib-tracker/shared/types";
import {
  buildDailySummary,
  computeStreak,
  countPerfectDays,
  getLocalDateString,
} from "@munib-tracker/shared/utils";
import { isObligatoryPrayer } from "@munib-tracker/shared/validators";

import { initDatabase, PrayerRepository, QazaRepository, ZikrRepository } from "@/db";

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

export interface TrackerState {
  date: string;
  isReady: boolean;
  prayerStatus: Record<string, PrayerStatus>;
  prayerNotes: Record<string, string | undefined>;
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
  setPrayerStatus: (prayerId: PrayerId, status: PrayerStatus) => Promise<void>;
  setPrayerNotes: (prayerId: PrayerId, notes: string) => Promise<void>;
  setZikrCount: (zikrId: string, count: number, target: number) => Promise<void>;
  incrementZikr: (zikrId: string, target: number, by?: number) => Promise<void>;
  adjustQaza: (prayerId: ObligatoryPrayer, remaining: number, completed: number) => Promise<void>;
  performQaza: (prayerId: ObligatoryPrayer, by?: number) => Promise<void>;
  resetQazaCounter: (prayerId: ObligatoryPrayer) => Promise<void>;
  resetAllQazaCounters: () => Promise<void>;
  setQazaSchedule: (schedule: QazaSchedule) => Promise<void>;
  setRoza: (roza: QazaRozaCounter) => Promise<void>;
  performRoza: (by?: number) => Promise<void>;
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
  for (const log of allLogs) {
    if (log.date !== date) continue;
    prayerStatus[log.prayerId] = log.status;
    if (log.notes) prayerNotes[log.prayerId] = log.notes;
  }

  const zikrCounts: Record<string, number> = {};
  for (const entry of todayZikr) zikrCounts[entry.zikrId] = entry.count;

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

  return {
    date: today,
    isReady: false,
    prayerStatus: {},
    prayerNotes: {},
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
      await initDatabase();
      const date = getLocalDateString();
      const next = await recompute(date);
      set({ ...next, date, isReady: true });
    },

    async refresh() {
      const date = getLocalDateString();
      const next = await recompute(date);
      set({ ...next, date });
    },

    setPrayerStatus(prayerId, status) {
      return enqueue(async () => {
        const { date, prayerStatus } = get();
        const previous = prayerStatus[prayerId];

        // Optimistic update.
        set({ prayerStatus: { ...prayerStatus, [prayerId]: status } });
        await PrayerRepository.setStatus(prayerId, date, status);

        // Reconcile the qaza debt for obligatory prayers on missed <-> not-missed.
        if (isObligatoryPrayer(prayerId)) {
          const wasMissed = previous === "missed";
          const isMissed = status === "missed";
          if (isMissed && !wasMissed) {
            await QazaRepository.incrementRemaining(prayerId, 1);
          } else if (wasMissed && !isMissed) {
            await QazaRepository.incrementRemaining(prayerId, -1);
          }
        }

        await get().refresh();
      });
    },

    setPrayerNotes(prayerId, notes) {
      return enqueue(async () => {
        const { date, prayerNotes } = get();
        set({ prayerNotes: { ...prayerNotes, [prayerId]: notes } });
        await PrayerRepository.setNotes(prayerId, date, notes);
        await get().refresh();
      });
    },

    setZikrCount(zikrId, count, target) {
      return enqueue(async () => {
        const { date, zikrCounts } = get();
        set({ zikrCounts: { ...zikrCounts, [zikrId]: Math.max(0, count) } });
        await ZikrRepository.setCount(zikrId, date, count, target);
        await get().refresh();
      });
    },

    incrementZikr(zikrId, target, by = 1) {
      return enqueue(async () => {
        const { date, zikrCounts } = get();
        const next = Math.max(0, (zikrCounts[zikrId] ?? 0) + by);
        set({ zikrCounts: { ...zikrCounts, [zikrId]: next } });
        await ZikrRepository.increment(zikrId, date, target, by);
        await get().refresh();
      });
    },

    adjustQaza(prayerId, remaining, completed) {
      return enqueue(async () => {
        await QazaRepository.setCounter(prayerId, remaining, completed);
        await get().refresh();
      });
    },

    performQaza(prayerId, by = 1) {
      return enqueue(async () => {
        await QazaRepository.performQaza(prayerId, by);
        await get().refresh();
      });
    },

    setQazaSchedule(schedule) {
      return enqueue(async () => {
        await QazaRepository.setSchedule(schedule);
        await get().refresh();
      });
    },

    resetQazaCounter(prayerId) {
      return enqueue(async () => {
        await QazaRepository.resetCounter(prayerId);
        await get().refresh();
      });
    },

    resetAllQazaCounters() {
      return enqueue(async () => {
        await QazaRepository.resetAllCounters();
        await get().refresh();
      });
    },

    setRoza(roza) {
      return enqueue(async () => {
        await QazaRepository.setRoza(roza);
        await get().refresh();
      });
    },

    performRoza(by = 1) {
      return enqueue(async () => {
        await QazaRepository.performRoza(by);
        await get().refresh();
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
  return useStore(trackerStore, (s) => ({
    remaining: s.qazaCounters.reduce((sum, c) => sum + c.remaining, 0),
    completed: s.qazaCounters.reduce((sum, c) => sum + c.completed, 0),
  }));
}

export function useRoza(): QazaRozaCounter {
  return useStore(trackerStore, (s) => s.roza);
}

export function useZikrCount(zikrId: string): number {
  return useStore(trackerStore, (s) => s.zikrCounts[zikrId] ?? 0);
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
  setZikrCount: (...args: Parameters<TrackerState["setZikrCount"]>) =>
    trackerStore.getState().setZikrCount(...args),
  incrementZikr: (...args: Parameters<TrackerState["incrementZikr"]>) =>
    trackerStore.getState().incrementZikr(...args),
  adjustQaza: (...args: Parameters<TrackerState["adjustQaza"]>) =>
    trackerStore.getState().adjustQaza(...args),
  performQaza: (...args: Parameters<TrackerState["performQaza"]>) =>
    trackerStore.getState().performQaza(...args),
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
} as const;

export function useTrackerActions() {
  return trackerActions;
}
