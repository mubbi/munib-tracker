/**
 * Hit de-duplication by ABSOLUTE time (NF-3.20 step 5). Pure; no imports.
 *
 * Windows overlap, and the spotter reports every frame at which a phrase could
 * end, so one spoken phrase produces many candidates — in one window and again
 * in the next. Candidates are merged by time: the best-scoring candidate of an
 * overlapping cluster wins, and two accepted hits must start at least the
 * phrase's minimum duration apart. Once a hit is committed (counted) nothing that
 * overlaps it can ever count again, so overlapping windows can never double
 * count.
 */

export type TimedHit = {
  startMs: number;
  endMs: number;
  score: number;
  variant?: string;
};

/** Non-maximum suppression over one batch of candidates. Sorted by time. */
export function mergeHits<T extends TimedHit>(hits: readonly T[], minGapMs: number): T[] {
  const accepted: T[] = [];
  const byScore = [...hits].sort((a, b) => b.score - a.score || a.startMs - b.startMs);
  for (const hit of byScore) {
    if (accepted.some((kept) => conflicts(kept, hit, minGapMs))) continue;
    accepted.push(hit);
  }
  return accepted.sort((a, b) => a.startMs - b.startMs);
}

function conflicts(a: TimedHit, b: TimedHit, minGapMs: number): boolean {
  const overlap = a.startMs < b.endMs && b.startMs < a.endMs;
  return overlap || Math.abs(a.startMs - b.startMs) < minGapMs;
}

export type HitTracker = {
  /**
   * Offer one window's candidates. `settledBeforeMs`: audio before this time will
   * not be seen by a later window, so hits ending before it may be committed.
   * Returns the hits committed now (each one = one count).
   */
  offer(candidates: readonly TimedHit[], settledBeforeMs: number): TimedHit[];
  /** End of listening: commit whatever is still pending. */
  flush(): TimedHit[];
  /** Committed hits so far (oldest first). */
  readonly committed: readonly TimedHit[];
  reset(): void;
};

export function createHitTracker(minGapMs: number): HitTracker {
  let committed: TimedHit[] = [];
  let pending: TimedHit[] = [];

  const blocked = (hit: TimedHit) => committed.some((c) => conflicts(c, hit, minGapMs));

  const commit = (hits: TimedHit[]) => {
    committed = [...committed, ...hits].sort((a, b) => a.startMs - b.startMs);
    // Only recent hits can still conflict; keep the list short.
    if (committed.length > 64) committed = committed.slice(-32);
    return hits;
  };

  return {
    offer(candidates, settledBeforeMs) {
      const pool = mergeHits(
        [...pending, ...candidates].filter((hit) => !blocked(hit)),
        minGapMs,
      );
      const ready = pool.filter((hit) => hit.endMs <= settledBeforeMs);
      pending = pool.filter((hit) => hit.endMs > settledBeforeMs);
      return commit(ready);
    },
    flush() {
      const ready = mergeHits(
        pending.filter((hit) => !blocked(hit)),
        minGapMs,
      );
      pending = [];
      return commit(ready);
    },
    get committed() {
      return committed;
    },
    reset() {
      committed = [];
      pending = [];
    },
  };
}
