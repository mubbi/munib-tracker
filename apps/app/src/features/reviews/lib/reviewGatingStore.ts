import {
  type ReviewGatingState,
  readReviewGating,
  writeReviewGating,
} from "@/features/reviews/lib/reviewStorage";

/**
 * Single owner of the review gating state. Every writer (session tracking,
 * interactions, error markers, prompt bookkeeping) goes through
 * {@link updateReviewGating}, which applies updates one at a time on the latest
 * state — so two providers can never overwrite each other's counts.
 */

let cached: ReviewGatingState | null = null;
let loading: Promise<ReviewGatingState> | null = null;
let queue: Promise<unknown> = Promise.resolve();
const listeners = new Set<(state: ReviewGatingState) => void>();

export function loadReviewGating(): Promise<ReviewGatingState> {
  if (cached) return Promise.resolve(cached);
  loading ??= readReviewGating().then((state) => {
    cached ??= state;
    return cached;
  });
  return loading;
}

/** The last loaded state, or null before the first load finishes. */
export function peekReviewGating(): ReviewGatingState | null {
  return cached;
}

export function updateReviewGating(
  update: (state: ReviewGatingState) => ReviewGatingState,
): Promise<ReviewGatingState> {
  const run = queue.then(async () => {
    const current = await loadReviewGating();
    const next = update(current);
    if (next === current) return current;
    cached = next;
    for (const listener of listeners) listener(next);
    await writeReviewGating(next);
    return next;
  });
  queue = run.catch(() => undefined);
  return run;
}

export function subscribeReviewGating(listener: (state: ReviewGatingState) => void): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

/** Test / data-reset hook: forget the cached state so the next read hits storage. */
export function resetReviewGatingCache(): void {
  cached = null;
  loading = null;
  queue = Promise.resolve();
}
