import { OBLIGATORY_PRAYERS } from "@munib-tracker/shared/constants";
import type {
  ObligatoryPrayer,
  QazaCounter,
  QazaDailyPlan,
  QazaDailyProgress,
  QazaRozaCounter,
  QazaSchedule,
} from "@munib-tracker/shared/types";
import { getLocalDateString } from "@munib-tracker/shared/utils";

import { DB_KEYS } from "../keys";
import { readJSON, writeJSON } from "../store";

type CounterMap = Record<ObligatoryPrayer, QazaCounter>;

const EMPTY_SCHEDULE: QazaSchedule = { targets: {} };

function emptyProgress(date: string): QazaDailyProgress {
  return { date, completed: {} };
}

function normalizeScheduleTargets(
  targets: Partial<Record<ObligatoryPrayer, number>>,
): Partial<Record<ObligatoryPrayer, number>> {
  const normalized: Partial<Record<ObligatoryPrayer, number>> = {};
  for (const prayerId of OBLIGATORY_PRAYERS) {
    const value = targets[prayerId];
    if (value == null) continue;
    normalized[prayerId] = Math.max(0, Math.min(999, Math.round(value)));
  }
  return normalized;
}

function emptyCounters(): CounterMap {
  const map = {} as CounterMap;
  for (const prayerId of OBLIGATORY_PRAYERS) {
    map[prayerId] = { prayerId, remaining: 0, completed: 0 };
  }
  return map;
}

async function readCounters(): Promise<CounterMap> {
  const stored = await readJSON<Partial<CounterMap>>(DB_KEYS.qazaCounters, {});
  const map = emptyCounters();
  for (const prayerId of OBLIGATORY_PRAYERS) {
    const counter = stored[prayerId];
    if (counter) map[prayerId] = { ...map[prayerId], ...counter, prayerId };
  }
  return map;
}

const DEFAULT_ROZA: QazaRozaCounter = { remaining: 0, completed: 0 };

export const QazaRepository = {
  async getCounters(): Promise<QazaCounter[]> {
    const map = await readCounters();
    return OBLIGATORY_PRAYERS.map((prayerId) => map[prayerId]);
  },

  async getCounter(prayerId: ObligatoryPrayer): Promise<QazaCounter> {
    return (await readCounters())[prayerId];
  },

  async setCounter(
    prayerId: ObligatoryPrayer,
    remaining: number,
    completed: number,
  ): Promise<QazaCounter> {
    const map = await readCounters();
    map[prayerId] = {
      prayerId,
      remaining: Math.max(0, Math.round(remaining)),
      completed: Math.max(0, Math.round(completed)),
      updatedAt: new Date().toISOString(),
    };
    await writeJSON(DB_KEYS.qazaCounters, map);
    return map[prayerId];
  },

  async resetCounter(prayerId: ObligatoryPrayer): Promise<QazaCounter> {
    return this.setCounter(prayerId, 0, 0);
  },

  async resetAllCounters(): Promise<QazaCounter[]> {
    const map = emptyCounters();
    await writeJSON(DB_KEYS.qazaCounters, map);
    return OBLIGATORY_PRAYERS.map((prayerId) => map[prayerId]);
  },

  /** Marks a missed prayer: one more qaza owed. */
  async incrementRemaining(prayerId: ObligatoryPrayer, by = 1): Promise<QazaCounter> {
    const counter = await this.getCounter(prayerId);
    return this.setCounter(prayerId, counter.remaining + by, counter.completed);
  },

  /** Performs qaza: remaining decreases, completed increases. */
  async performQaza(prayerId: ObligatoryPrayer, by = 1): Promise<QazaCounter> {
    const counter = await this.getCounter(prayerId);
    const step = Math.min(by, counter.remaining);
    const next = await this.setCounter(
      prayerId,
      counter.remaining - step,
      counter.completed + step,
    );
    if (step > 0) {
      await this.incrementDailyProgress(prayerId, getLocalDateString(), step);
    }
    return next;
  },

  async getRoza(): Promise<QazaRozaCounter> {
    return readJSON<QazaRozaCounter>(DB_KEYS.qazaRoza, DEFAULT_ROZA);
  },

  async setRoza(next: QazaRozaCounter): Promise<QazaRozaCounter> {
    const value: QazaRozaCounter = {
      remaining: Math.max(0, Math.round(next.remaining)),
      completed: Math.max(0, Math.round(next.completed)),
      estimatedMissed: next.estimatedMissed,
    };
    await writeJSON(DB_KEYS.qazaRoza, value);
    return value;
  },

  async performRoza(by = 1): Promise<QazaRozaCounter> {
    const roza = await this.getRoza();
    const step = Math.min(by, roza.remaining);
    return this.setRoza({
      remaining: roza.remaining - step,
      completed: roza.completed + step,
      estimatedMissed: roza.estimatedMissed,
    });
  },

  async getPlan(date: string): Promise<QazaDailyPlan | undefined> {
    const plans = await readJSON<Record<string, QazaDailyPlan>>(DB_KEYS.qazaDailyPlans, {});
    return plans[date];
  },

  async setPlan(plan: QazaDailyPlan): Promise<QazaDailyPlan> {
    const plans = await readJSON<Record<string, QazaDailyPlan>>(DB_KEYS.qazaDailyPlans, {});
    plans[plan.date] = plan;
    await writeJSON(DB_KEYS.qazaDailyPlans, plans);
    return plan;
  },

  async getSchedule(): Promise<QazaSchedule> {
    const stored = await readJSON<QazaSchedule | null>(DB_KEYS.qazaSchedule, null);
    if (stored) {
      return { targets: normalizeScheduleTargets(stored.targets) };
    }

    // Fall back to the most recent legacy per-date plan, if any.
    const plans = await readJSON<Record<string, QazaDailyPlan>>(DB_KEYS.qazaDailyPlans, {});
    const latestDate = Object.keys(plans).sort().at(-1);
    if (!latestDate) return EMPTY_SCHEDULE;
    return { targets: normalizeScheduleTargets(plans[latestDate]?.targets ?? {}) };
  },

  async setSchedule(schedule: QazaSchedule): Promise<QazaSchedule> {
    const value: QazaSchedule = { targets: normalizeScheduleTargets(schedule.targets) };
    await writeJSON(DB_KEYS.qazaSchedule, value);
    return value;
  },

  async getDailyProgress(date: string): Promise<QazaDailyProgress> {
    const map = await this.getAllDailyProgress();
    const progress = map[date];
    if (!progress) return emptyProgress(date);
    return progress;
  },

  async getAllDailyProgress(): Promise<Record<string, QazaDailyProgress>> {
    const map = await readJSON<Record<string, QazaDailyProgress>>(DB_KEYS.qazaDailyProgress, {});
    const normalized: Record<string, QazaDailyProgress> = {};
    for (const [date, progress] of Object.entries(map)) {
      normalized[date] = {
        date,
        completed: normalizeScheduleTargets(progress.completed),
      };
    }
    return normalized;
  },

  async incrementDailyProgress(
    prayerId: ObligatoryPrayer,
    date: string,
    by = 1,
  ): Promise<QazaDailyProgress> {
    const map = await readJSON<Record<string, QazaDailyProgress>>(DB_KEYS.qazaDailyProgress, {});
    const current = map[date] ?? emptyProgress(date);
    const step = Math.max(0, Math.round(by));
    const next: QazaDailyProgress = {
      date,
      completed: {
        ...current.completed,
        [prayerId]: Math.max(0, (current.completed[prayerId] ?? 0) + step),
      },
    };
    map[date] = next;
    await writeJSON(DB_KEYS.qazaDailyProgress, map);
    return next;
  },
};

export type QazaRepositoryType = typeof QazaRepository;
