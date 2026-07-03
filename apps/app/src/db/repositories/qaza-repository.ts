import { OBLIGATORY_PRAYERS } from "@munib-tracker/shared/constants";
import type {
  ObligatoryPrayer,
  QazaCounter,
  QazaDailyPlan,
  QazaRozaCounter,
} from "@munib-tracker/shared/types";

import { DB_KEYS } from "../keys";
import { readJSON, writeJSON } from "../store";

type CounterMap = Record<ObligatoryPrayer, QazaCounter>;

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
    };
    await writeJSON(DB_KEYS.qazaCounters, map);
    return map[prayerId];
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
    return this.setCounter(prayerId, counter.remaining - step, counter.completed + step);
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
};

export type QazaRepositoryType = typeof QazaRepository;
