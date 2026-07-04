import type { ObligatoryPrayer } from "./prayer";

export interface QazaCounter {
  prayerId: ObligatoryPrayer;
  remaining: number;
  completed: number;
  /** ISO datetime of the last change (used for sync last-write-wins). */
  updatedAt?: string;
}

export interface QazaDailyPlan {
  /** ISO date YYYY-MM-DD */
  date: string;
  targets: Partial<Record<ObligatoryPrayer, number>>;
}

/** Recurring daily qaza targets — how many of each prayer to make up every day. */
export interface QazaSchedule {
  targets: Partial<Record<ObligatoryPrayer, number>>;
}

/** Per-day qaza completions recorded via the qaza manager. */
export interface QazaDailyProgress {
  /** ISO date YYYY-MM-DD */
  date: string;
  completed: Partial<Record<ObligatoryPrayer, number>>;
}

export interface QazaRozaCounter {
  remaining: number;
  completed: number;
  estimatedMissed?: number;
}
