import { useEffect, useState } from "react";

export type EnsureContentState = {
  /** Bump this in `useMemo` deps that call content getters. */
  version: number;
  /** True after `ensure()` resolves — wait for this before treating missing data as not-found. */
  ready: boolean;
};

/**
 * Loads a lazily-imported content corpus and re-renders when ready.
 * Cold cache otherwise returns `[]` / `{}` from getters; deep links must wait
 * for `ready` before showing EmptyState / not-found UI.
 *
 * Pass a stable module export (e.g. `ensureAqeedahContent`).
 */
export function useEnsureContent(ensure: () => Promise<unknown>): EnsureContentState {
  const [version, setVersion] = useState(0);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let cancelled = false;
    void ensure().then(() => {
      if (cancelled) return;
      setReady(true);
      setVersion((n) => n + 1);
    });
    return () => {
      cancelled = true;
    };
  }, [ensure]);

  return { version, ready };
}
