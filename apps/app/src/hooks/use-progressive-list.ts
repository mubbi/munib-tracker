import { useEffect, useState } from "react";

import { runWhenIdle } from "@/lib/run-when-idle";

export type ProgressiveListOptions = {
  /** Rows mounted on the first paint (default 16 — more than a phone viewport). */
  initial?: number;
  /** Rows added on each idle slice until the whole list is mounted (default 16). */
  batch?: number;
};

/**
 * Incremental rendering for long `ScrollView` + `.map()` lists of user data
 * (journal, notes, bookmarks, history) — the FlatList "render in batches" idea
 * without changing the screen's layout, cards, grids or entering animations.
 *
 * The first `initial` rows paint immediately so navigation transitions stay
 * smooth; the rest mount in `batch`-sized slices whenever the JS thread is idle
 * ({@link runWhenIdle}), so the full list is present within a few frames.
 * Items keep their order and indexes (it is always a prefix of `items`), and
 * shrinking or replacing the list never hides rows already shown. Jest runs idle
 * work synchronously, so tests still see the complete list.
 */
export function useProgressiveList<T>(
  items: readonly T[],
  { initial = 16, batch = 16 }: ProgressiveListOptions = {},
): readonly T[] {
  const [count, setCount] = useState(initial);
  const total = items.length;

  useEffect(() => {
    if (count >= total) return;
    const handle = runWhenIdle(() =>
      setCount((current) => Math.min(total, current + Math.max(1, batch))),
    );
    return () => handle.cancel();
  }, [batch, count, total]);

  return count >= total ? items : items.slice(0, count);
}
