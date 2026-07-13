import { useEffect, useState } from "react";

export type EnsureContentState = {
  /** Bump this in `useMemo` deps that call content getters. */
  version: number;
  /** True after `ensure()` settles — wait for this before treating missing data as not-found. */
  ready: boolean;
};

/**
 * Loads a lazily-imported content corpus and re-renders when ready.
 * Cold cache otherwise returns `[]` / `{}` from getters; deep links must wait
 * for `ready` before showing EmptyState / not-found UI.
 *
 * Pass a stable module export (e.g. `ensureAqeedahContent`).
 *
 * Important: do not cancel the state update on effect cleanup. React Strict Mode
 * and short navigation transitions can clean up the first effect while the
 * dynamic import still resolves — if we skip `setState` then, the module cache
 * warms but the screen keeps a stale empty `useMemo` until remount (the
 * “first visit empty, second visit works” bug).
 */
export function useEnsureContent(ensure: () => Promise<unknown>): EnsureContentState {
  const [version, setVersion] = useState(0);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    void ensure()
      .catch(() => {
        // Leave `ready` true so deep-link screens can show EmptyState instead of hanging.
      })
      .then(() => {
        setReady(true);
        setVersion((n) => n + 1);
      });
  }, [ensure]);

  return { version, ready };
}
