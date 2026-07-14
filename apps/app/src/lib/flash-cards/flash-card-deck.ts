import { shuffleArray } from "./mcq-helpers";
import type { StudyMcq } from "./types";

/** Pick one random card, optionally excluding a current id. */
export function pickRandomCard(
  cards: readonly StudyMcq[],
  excludeId?: string | null,
  random = Math.random,
): StudyMcq | null {
  if (cards.length === 0) return null;
  const candidates = excludeId == null ? [...cards] : cards.filter((card) => card.id !== excludeId);
  const pool = candidates.length > 0 ? candidates : [...cards];
  const index = Math.floor(random() * pool.length);
  return pool[index] ?? null;
}

export type FlashDeckState = {
  /** Cards not yet answered in this cycle. */
  remaining: StudyMcq[];
  current: StudyMcq | null;
};

/** Fresh shuffled remaining deck + a random starting card. */
export function startFlashDeck(pool: readonly StudyMcq[], random = Math.random): FlashDeckState {
  const remaining = shuffleArray(pool, random);
  return {
    remaining,
    current: pickRandomCard(remaining, null, random),
  };
}

/**
 * After answering: drop the current card from remaining.
 * When the cycle is finished, reshuffle the full pool.
 */
export function advanceAfterAnswer(
  remaining: readonly StudyMcq[],
  currentId: string,
  fullPool: readonly StudyMcq[],
  random = Math.random,
): FlashDeckState {
  const nextRemaining = remaining.filter((card) => card.id !== currentId);
  if (nextRemaining.length === 0) {
    return startFlashDeck(fullPool, random);
  }
  return {
    remaining: nextRemaining,
    current: pickRandomCard(nextRemaining, null, random),
  };
}

/**
 * Skip: keep the card in the remaining pool and draw a different random card.
 * With only one card left, returns the same card (caller should disable Skip).
 */
export function advanceAfterSkip(
  remaining: readonly StudyMcq[],
  currentId: string,
  random = Math.random,
): FlashDeckState {
  return {
    remaining: [...remaining],
    current: pickRandomCard(remaining, currentId, random),
  };
}
