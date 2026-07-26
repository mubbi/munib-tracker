import { QAZA_PRAYERS } from "@munib-tracker/shared/constants";
import type {
  QazaCounter,
  QazaDailyPlan,
  QazaDailyProgress,
  QazaPrayer,
  QazaRozaCounter,
  QazaSchedule,
} from "@munib-tracker/shared/types";
import { getLocalDateString } from "@munib-tracker/shared/utils";

import { DB_KEYS } from "../keys";
import { readJSON, updateJSON, withKeyLock, writeJSON } from "../store";

type CounterMap = Record<QazaPrayer, QazaCounter>;

const EMPTY_SCHEDULE: QazaSchedule = { targets: {} };

function emptyProgress(date: string): QazaDailyProgress {
  return { date, completed: {} };
}

function normalizeScheduleTargets(
  targets: Partial<Record<QazaPrayer, number>>,
): Partial<Record<QazaPrayer, number>> {
  const normalized: Partial<Record<QazaPrayer, number>> = {};
  for (const prayerId of QAZA_PRAYERS) {
    const value = targets[prayerId];
    if (value == null) continue;
    normalized[prayerId] = Math.max(0, Math.min(999, Math.round(value)));
  }
  return normalized;
}

function emptyCounters(): CounterMap {
  const map = {} as CounterMap;
  for (const prayerId of QAZA_PRAYERS) {
    map[prayerId] = { prayerId, remaining: 0, completed: 0 };
  }
  return map;
}

/** Coerce persisted remaining/completed to non-negative integers (guards string pollution). */
function normalizeCount(value: unknown): number {
  const n = typeof value === "number" ? value : Number(value);
  if (!Number.isFinite(n)) return 0;
  return Math.max(0, Math.round(n));
}

function normalizeCounter(
  prayerId: QazaPrayer,
  counter: Partial<QazaCounter> | undefined,
): QazaCounter {
  return {
    prayerId,
    remaining: normalizeCount(counter?.remaining),
    completed: normalizeCount(counter?.completed),
    updatedAt: counter?.updatedAt,
  };
}

async function readCounters(): Promise<CounterMap> {
  const stored = await readJSON<Partial<CounterMap>>(DB_KEYS.qazaCounters, {});
  const map = emptyCounters();
  for (const prayerId of QAZA_PRAYERS) {
    map[prayerId] = normalizeCounter(prayerId, stored[prayerId]);
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
    return QAZA_PRAYERS.map((prayerId) => map[prayerId]);
  },

  async getCounter(prayerId: QazaPrayer): Promise<QazaCounter> {
    return (await readCounters())[prayerId];
  },

  async setCounter(
    prayerId: QazaPrayer,
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

  /**
   * Atomically apply remaining/completed for multiple prayers in one write.
   * Used by the lifetime calculator so the qaza screen updates in a single refresh.
   */
  async setCounters(
    updates: Partial<Record<QazaPrayer, { remaining: number; completed: number }>>,
  ): Promise<QazaCounter[]> {
    const map = await mutateCounters((counters) => {
      const now = new Date().toISOString();
      for (const prayerId of QAZA_PRAYERS) {
        const update = updates[prayerId];
        if (!update) continue;
        counters[prayerId] = {
          prayerId,
          remaining: Math.max(0, Math.round(update.remaining)),
          completed: Math.max(0, Math.round(update.completed)),
          updatedAt: now,
        };
      }
    });
    return QAZA_PRAYERS.map((prayerId) => map[prayerId]);
  },

  /** Applies a pulled counter with last-write-wins on `updatedAt` (server time preserved). */
  async applyRemoteCounter(prayerId: QazaPrayer, counter: QazaCounter): Promise<void> {
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

  async resetCounter(prayerId: QazaPrayer): Promise<QazaCounter> {
    return this.setCounter(prayerId, 0, 0);
  },

  async resetAllCounters(): Promise<QazaCounter[]> {
    const map = await withKeyLock(DB_KEYS.qazaCounters, async () => {
      const counters = emptyCounters();
      await writeJSON(DB_KEYS.qazaCounters, counters);
      return counters;
    });
    return QAZA_PRAYERS.map((prayerId) => map[prayerId]);
  },

  /** Marks a missed prayer: one more qaza owed. */
  async incrementRemaining(prayerId: QazaPrayer, by = 1): Promise<QazaCounter> {
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
  async performQaza(prayerId: QazaPrayer, by = 1): Promise<QazaCounter> {
    const date = getLocalDateString();
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
      try {
        await this.incrementDailyProgress(prayerId, date, step);
      } catch (error) {
        // Compensate so lifetime counters and daily progress stay aligned.
        await mutateCounters((counters) => {
          const counter = counters[prayerId];
          counters[prayerId] = {
            prayerId,
            remaining: counter.remaining + step,
            completed: Math.max(0, counter.completed - step),
            updatedAt: new Date().toISOString(),
          };
        });
        throw error;
      }
    }
    return map[prayerId];
  },

  async getRoza(): Promise<QazaRozaCounter> {
    return readJSON<QazaRozaCounter>(DB_KEYS.qazaRoza, DEFAULT_ROZA);
  },

  async setRoza(next: QazaRozaCounter): Promise<QazaRozaCounter> {
    return withKeyLock(DB_KEYS.qazaRoza, async () => {
      const value: QazaRozaCounter = {
        remaining: Math.max(0, Math.round(next.remaining)),
        completed: Math.max(0, Math.round(next.completed)),
        estimatedMissed: next.estimatedMissed,
        // Preserve a supplied timestamp (remote apply); stamp fresh for local edits.
        updatedAt: next.updatedAt ?? new Date().toISOString(),
      };
      await writeJSON(DB_KEYS.qazaRoza, value);
      return value;
    });
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

  async resetRoza(): Promise<QazaRozaCounter> {
    return this.setRoza({ remaining: 0, completed: 0 });
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
    prayerId: QazaPrayer,
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

  async decrementDailyProgress(
    prayerId: QazaPrayer,
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
            [prayerId]: Math.max(0, (day.completed[prayerId] ?? 0) - step),
          },
        };
        return current;
      },
    );
    return map[date];
  },

  /** Reverses a performed qaza: remaining increases, completed decreases. */
  async undoQaza(prayerId: QazaPrayer, by = 1): Promise<QazaCounter> {
    let step = 0;
    const map = await mutateCounters((counters) => {
      const counter = counters[prayerId];
      step = Math.min(by, counter.completed);
      if (step <= 0) return;
      counters[prayerId] = {
        prayerId,
        remaining: counter.remaining + step,
        completed: counter.completed - step,
        updatedAt: new Date().toISOString(),
      };
    });
    if (step > 0) {
      // Prefer the most recent day that still has progress for this prayer so
      // undoing after midnight does not debit today's empty bucket.
      const allProgress = await this.getAllDailyProgress();
      let remaining = step;
      const dates = Object.keys(allProgress).sort().reverse();
      for (const date of dates) {
        if (remaining <= 0) break;
        const have = allProgress[date]?.completed[prayerId] ?? 0;
        if (have <= 0) continue;
        const take = Math.min(remaining, have);
        await this.decrementDailyProgress(prayerId, date, take);
        remaining -= take;
      }
      if (remaining > 0) {
        await this.decrementDailyProgress(prayerId, getLocalDateString(), remaining);
      }
    }
    return map[prayerId];
  },
};

export type QazaRepositoryType = typeof QazaRepository;
