import { useCallback, useEffect, useRef, useState } from "react";

export type EnsureContentState = {
  /** Bump this in `useMemo` deps that call content getters. */
  version: number;
  /** True after `ensure()` settles — wait for this before treating missing data as not-found. */
  ready: boolean;
  /**
   * The rejection from a cold `ensure()` (null otherwise). Render it through
   * `LearnContentGate error` / `ContentState status="error"` with `retry` — a
   * failed load is never an endless loader or an empty state (G-35).
   */
  error: unknown;
  /** Re-runs `ensure()` after a failure (clears `error`, shows loading again). */
  retry: () => void;
};

/**
 * Loads a content corpus and re-renders when ready.
 *
 * Prefer sync-imported corpora (`isCached` always true) so the first paint of a
 * learn hub already has full English data. For any remaining lazy corpora,
 * gate the body with {@link LearnContentGate} until `ready` (pass `error` /
 * `retry` so a failed chunk offers "Try again").
 *
 * Important: do not cancel the state update on effect cleanup. React Strict Mode
 * and short navigation transitions can clean up the first effect while the
 * dynamic import still resolves — if we skip `setState` then, the module cache
 * warms but the screen keeps a stale empty `useMemo` until remount (the
 * “first visit empty, second visit works” bug).
 */
export function useEnsureContent(
  ensure: () => Promise<unknown>,
  isCached?: () => boolean,
): EnsureContentState {
  const cached = isCached?.() === true;
  const [version, setVersion] = useState(cached ? 1 : 0);
  const [ready, setReady] = useState(cached);
  const [error, setError] = useState<unknown>(null);
  const [attempt, setAttempt] = useState(0);
  const isCachedRef = useRef(isCached);
  isCachedRef.current = isCached;

  // biome-ignore lint/correctness/useExhaustiveDependencies: `attempt` re-runs ensure() on retry
  useEffect(() => {
    void ensure()
      .then(() => {
        setError(null);
        setReady(true);
        // Always bump so memos that read getters recompute even on warm visits
        // where overlays or sibling ensures finished after first paint.
        setVersion((n) => n + 1);
      })
      .catch((err: unknown) => {
        // Only open the gate on failure when the corpus is already warm —
        // otherwise deep links would show EmptyState over a cold empty cache.
        if (isCachedRef.current?.() === true) {
          setReady(true);
          setVersion((n) => n + 1);
          return;
        }
        setError(err ?? new Error("ensure() rejected"));
      });
  }, [ensure, attempt]);

  const retry = useCallback(() => {
    setError(null);
    setAttempt((n) => n + 1);
  }, []);

  return { version, ready, error, retry };
}
