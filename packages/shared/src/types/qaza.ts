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

export interface QazaRozaCounter {
  remaining: number;
  completed: number;
  estimatedMissed?: number;
}
