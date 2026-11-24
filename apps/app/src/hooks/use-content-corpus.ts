import { useEffect, useState } from "react";

import type { ContentCorpus } from "@/lib/content-loaders";

/** Shared empty list while loading (never mutated). */
const EMPTY: never[] = [];

export type ContentCorpusState<T> = {
  /** The corpus, or `[]` until it has loaded. */
  items: T[];
  /**
   * True once the load settled — wait for this before treating a missing id as
   * not found. A failed load settles with `[]` (the screen shows its empty /
   * not-found state instead of loading forever); the next mount retries.
   */
  ready: boolean;
};

/**
 * Loads a content corpus (duas, adhkar, duroods, 99 names) for a screen. A warm
 * corpus is returned on the first render (no empty flash on revisits); a cold
 * one loads its own chunk once.
 *
 * Like `useEnsureContent`, the state update is not cancelled on cleanup: Strict
 * Mode and quick navigations can clean up the first effect while the dynamic
 * import still resolves, and skipping the update would leave the screen empty.
 */
export function useContentCorpus<T>(corpus: ContentCorpus<T>): ContentCorpusState<T> {
  const [items, setItems] = useState<T[] | undefined>(corpus.peek);

  useEffect(() => {
    const warm = corpus.peek();
    if (warm) {
      setItems(warm);
      return;
    }
    void corpus.load().then(setItems, () => setItems(EMPTY));
  }, [corpus]);

  return { items: items ?? EMPTY, ready: items !== undefined };
}
