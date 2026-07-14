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
 * Pass a stable module export (e.g. `ensureAqeedahContent`). Optionally pass a
 * stable `isCached` (e.g. `isAqeedahContentReady`) so warm visits skip the
 * loading flash and paint with `ready: true` on the first render.
 *
 * Important: do not cancel the state update on effect cleanup. React Strict Mode
 * and short navigation transitions can clean up the first effect while the
 * dynamic import still resolves — if we skip `setState` then, the module cache
 * warms but the screen keeps a stale empty `useMemo` until remount (the
 * “first visit empty, second visit works” bug).
 *
 * Screens should gate their body with {@link LearnContentGate} / `ready` so
 * users never see chrome-only or partial stubs while the corpus is still cold.
 */
export function useEnsureContent(
  ensure: () => Promise<unknown>,
  isCached?: () => boolean,
): EnsureContentState {
  const cached = isCached?.() === true;
  const [version, setVersion] = useState(cached ? 1 : 0);
  const [ready, setReady] = useState(cached);

  useEffect(() => {
    void ensure()
      .catch(() => {
        // Leave `ready` true so deep-link screens can show EmptyState instead of hanging.
      })
      .then(() => {
        setReady(true);
        // Warm visits already start at version 1 — avoid an extra useless bump.
        setVersion((n) => (n === 0 ? 1 : n));
      });
  }, [ensure]);

  return { version, ready };
}
