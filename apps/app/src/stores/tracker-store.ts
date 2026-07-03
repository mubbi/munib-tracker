import { OBLIGATORY_PRAYERS } from "@munib-tracker/shared/constants";
import type {
  DailySummary,
  ObligatoryPrayer,
  PrayerId,
  PrayerStatus,
  QazaCounter,
  QazaRozaCounter,
} from "@munib-tracker/shared/types";
import { buildDailySummary, computeStreak, getLocalDateString } from "@munib-tracker/shared/utils";
import { isObligatoryPrayer } from "@munib-tracker/shared/validators";

import { initDatabase, PrayerRepository, QazaRepository, ZikrRepository } from "@/db";

import { createStore, useStore } from "./create-store";

function emptySummary(date: string): DailySummary {
  return {
    date,
    salahCompleted: 0,
    salahTotal: OBLIGATORY_PRAYERS.length,
    zikrCompleted: 0,
    zikrTotal: 0,
    qazaRemaining: 0,
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
  roza: QazaRozaCounter;
  summary: DailySummary;
  streakDays: number;

  load: () => Promise<void>;
  refresh: () => Promise<void>;
  setPrayerStatus: (prayerId: PrayerId, status: PrayerStatus) => Promise<void>;
  setPrayerNotes: (prayerId: PrayerId, notes: string) => Promise<void>;
  setZikrCount: (zikrId: string, count: number, target: number) => Promise<void>;
  incrementZikr: (zikrId: string, target: number, by?: number) => Promise<void>;
  adjustQaza: (prayerId: ObligatoryPrayer, remaining: number, completed: number) => Promise<void>;
  performQaza: (prayerId: ObligatoryPrayer, by?: number) => Promise<void>;
  setRoza: (roza: QazaRozaCounter) => Promise<void>;
  performRoza: (by?: number) => Promise<void>;
}

async function recompute(date: string): Promise<Partial<TrackerState>> {
  const [allLogs, todayZikr, counters, roza] = await Promise.all([
    PrayerRepository.getAll(),
    ZikrRepository.getByDate(date),
    QazaRepository.getCounters(),
    QazaRepository.getRoza(),
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
    streakDays,
  });

  return {
    prayerStatus,
    prayerNotes,
    zikrCounts,
    qazaCounters: counters,
    roza,
    summary,
    streakDays,
  };
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
    roza: { remaining: 0, completed: 0 },
    summary: emptySummary(today),
    streakDays: 0,

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

    async setPrayerStatus(prayerId, status) {
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
    },

    async setPrayerNotes(prayerId, notes) {
      const { date, prayerNotes } = get();
      set({ prayerNotes: { ...prayerNotes, [prayerId]: notes } });
      await PrayerRepository.setNotes(prayerId, date, notes);
      await get().refresh();
    },

    async setZikrCount(zikrId, count, target) {
      const { date, zikrCounts } = get();
      set({ zikrCounts: { ...zikrCounts, [zikrId]: Math.max(0, count) } });
      await ZikrRepository.setCount(zikrId, date, count, target);
      await get().refresh();
    },

    async incrementZikr(zikrId, target, by = 1) {
      const { date, zikrCounts } = get();
      const next = Math.max(0, (zikrCounts[zikrId] ?? 0) + by);
      set({ zikrCounts: { ...zikrCounts, [zikrId]: next } });
      await ZikrRepository.increment(zikrId, date, target, by);
      await get().refresh();
    },

    async adjustQaza(prayerId, remaining, completed) {
      await QazaRepository.setCounter(prayerId, remaining, completed);
      await get().refresh();
    },

    async performQaza(prayerId, by = 1) {
      await QazaRepository.performQaza(prayerId, by);
      await get().refresh();
    },

    async setRoza(roza) {
      await QazaRepository.setRoza(roza);
      await get().refresh();
    },

    async performRoza(by = 1) {
      await QazaRepository.performRoza(by);
      await get().refresh();
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

export function useTrackerActions() {
  return useStore(trackerStore, (s) => ({
    load: s.load,
    refresh: s.refresh,
    setPrayerStatus: s.setPrayerStatus,
    setPrayerNotes: s.setPrayerNotes,
    setZikrCount: s.setZikrCount,
    incrementZikr: s.incrementZikr,
    adjustQaza: s.adjustQaza,
    performQaza: s.performQaza,
    setRoza: s.setRoza,
    performRoza: s.performRoza,
  }));
}
