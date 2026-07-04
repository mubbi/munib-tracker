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
import { readJSON, updateJSON, withKeyLock, writeJSON } from "../store";

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

/** Atomic read-modify-write of the qaza counter map under the per-key lock. */
async function mutateCounters(mutate: (map: CounterMap) => void): Promise<CounterMap> {
  return withKeyLock(DB_KEYS.qazaCounters, async () => {
    const map = await readCounters();
    mutate(map);
    await writeJSON(DB_KEYS.qazaCounters, map);
    return map;
  });
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
    const map = await mutateCounters((counters) => {
      counters[prayerId] = {
        prayerId,
        remaining: Math.max(0, Math.round(remaining)),
        completed: Math.max(0, Math.round(completed)),
        updatedAt: new Date().toISOString(),
      };
    });
    return map[prayerId];
  },

  /** Applies a pulled counter with last-write-wins on `updatedAt` (server time preserved). */
  async applyRemoteCounter(prayerId: ObligatoryPrayer, counter: QazaCounter): Promise<void> {
    await mutateCounters((counters) => {
      const existing = counters[prayerId];
      if (existing.updatedAt && counter.updatedAt && existing.updatedAt >= counter.updatedAt) {
        return;
      }
      counters[prayerId] = {
        prayerId,
        remaining: Math.max(0, Math.round(counter.remaining)),
        completed: Math.max(0, Math.round(counter.completed)),
        updatedAt: counter.updatedAt,
      };
    });
  },

  async resetCounter(prayerId: ObligatoryPrayer): Promise<QazaCounter> {
    return this.setCounter(prayerId, 0, 0);
  },

  async resetAllCounters(): Promise<QazaCounter[]> {
    const map = await withKeyLock(DB_KEYS.qazaCounters, async () => {
      const counters = emptyCounters();
      await writeJSON(DB_KEYS.qazaCounters, counters);
      return counters;
    });
    return OBLIGATORY_PRAYERS.map((prayerId) => map[prayerId]);
  },

  /** Marks a missed prayer: one more qaza owed. */
  async incrementRemaining(prayerId: ObligatoryPrayer, by = 1): Promise<QazaCounter> {
    const map = await mutateCounters((counters) => {
      const counter = counters[prayerId];
      counters[prayerId] = {
        prayerId,
        remaining: Math.max(0, Math.round(counter.remaining + by)),
        completed: counter.completed,
        updatedAt: new Date().toISOString(),
      };
    });
    return map[prayerId];
  },

  /** Performs qaza: remaining decreases, completed increases. */
  async performQaza(prayerId: ObligatoryPrayer, by = 1): Promise<QazaCounter> {
    let step = 0;
    const map = await mutateCounters((counters) => {
      const counter = counters[prayerId];
      step = Math.min(by, counter.remaining);
      counters[prayerId] = {
        prayerId,
        remaining: counter.remaining - step,
        completed: counter.completed + step,
        updatedAt: new Date().toISOString(),
      };
    });
    if (step > 0) {
      await this.incrementDailyProgress(prayerId, getLocalDateString(), step);
    }
    return map[prayerId];
  },

  async getRoza(): Promise<QazaRozaCounter> {
    return readJSON<QazaRozaCounter>(DB_KEYS.qazaRoza, DEFAULT_ROZA);
  },

  async setRoza(next: QazaRozaCounter): Promise<QazaRozaCounter> {
    const value: QazaRozaCounter = {
      remaining: Math.max(0, Math.round(next.remaining)),
      completed: Math.max(0, Math.round(next.completed)),
      estimatedMissed: next.estimatedMissed,
      // Preserve a supplied timestamp (remote apply); stamp fresh for local edits.
      updatedAt: next.updatedAt ?? new Date().toISOString(),
    };
    await writeJSON(DB_KEYS.qazaRoza, value);
    return value;
  },

  async performRoza(by = 1): Promise<QazaRozaCounter> {
    return withKeyLock(DB_KEYS.qazaRoza, async () => {
      const roza = await this.getRoza();
      const step = Math.min(by, roza.remaining);
      const value: QazaRozaCounter = {
        remaining: roza.remaining - step,
        completed: roza.completed + step,
        estimatedMissed: roza.estimatedMissed,
        updatedAt: new Date().toISOString(),
      };
      await writeJSON(DB_KEYS.qazaRoza, value);
      return value;
    });
  },

  /** Applies a pulled roza counter with last-write-wins on `updatedAt`. */
  async applyRemoteRoza(roza: QazaRozaCounter): Promise<void> {
    await withKeyLock(DB_KEYS.qazaRoza, async () => {
      const existing = await this.getRoza();
      if (existing.updatedAt && roza.updatedAt && existing.updatedAt >= roza.updatedAt) return;
      await writeJSON(DB_KEYS.qazaRoza, {
        remaining: Math.max(0, Math.round(roza.remaining)),
        completed: Math.max(0, Math.round(roza.completed)),
        estimatedMissed: roza.estimatedMissed,
        updatedAt: roza.updatedAt,
      });
    });
  },

  async getPlan(date: string): Promise<QazaDailyPlan | undefined> {
    const plans = await readJSON<Record<string, QazaDailyPlan>>(DB_KEYS.qazaDailyPlans, {});
    return plans[date];
  },

  async setPlan(plan: QazaDailyPlan): Promise<QazaDailyPlan> {
    await updateJSON<Record<string, QazaDailyPlan>>(DB_KEYS.qazaDailyPlans, {}, (plans) => {
      plans[plan.date] = plan;
      return plans;
    });
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
    const step = Math.max(0, Math.round(by));
    const map = await updateJSON<Record<string, QazaDailyProgress>>(
      DB_KEYS.qazaDailyProgress,
      {},
      (current) => {
        const day = current[date] ?? emptyProgress(date);
        current[date] = {
          date,
          completed: {
            ...day.completed,
            [prayerId]: Math.max(0, (day.completed[prayerId] ?? 0) + step),
          },
        };
        return current;
      },
    );
    return map[date];
  },
};

export type QazaRepositoryType = typeof QazaRepository;
