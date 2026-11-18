import { useEffect, useMemo } from "react";

import { DB_KEYS } from "@/db/keys";
import { readJSON, writeJSON } from "@/db/store";
import {
  introduceToHomeOrder,
  isWithinNewWindow,
  NEW_FEATURES,
  type NewFeaturesSeenMap,
  stampFirstSeen,
} from "@/lib/new-features";

import { createStore, useStore } from "./create-store";
import { preferencesStore } from "./preferences-store";

/**
 * "New" badges (see `lib/new-features.ts`). Loaded by the home grid and the
 * Library; the first load stamps each new feature's first-seen time (starting its
 * 15-day window) and adds it once to a customised home grid.
 */
interface NewFeaturesState {
  seen: NewFeaturesSeenMap;
  isReady: boolean;
  load: () => Promise<void>;
}

let loading: Promise<void> | null = null;

export const newFeaturesStore = createStore<NewFeaturesState>((set) => ({
  seen: {},
  isReady: false,

  load() {
    loading ??= (async () => {
      try {
        const stored = await readJSON<NewFeaturesSeenMap>(DB_KEYS.newFeaturesSeen, {});
        let seen = stampFirstSeen(stored, new Date());

        // Add new tiles once to a customised home grid. Wait for preferences so a
        // saved order is never mistaken for the default.
        const prefsState = preferencesStore.getState();
        if (prefsState.isReady) {
          const { order, seen: introduced } = introduceToHomeOrder(
            prefsState.prefs.quickActionOrder,
            seen,
          );
          seen = introduced;
          if (order) await prefsState.update({ quickActionOrder: order });
        }

        if (seen !== stored) await writeJSON(DB_KEYS.newFeaturesSeen, seen);
        set({ seen, isReady: true });
      } finally {
        loading = null;
      }
    })();
    return loading;
  },
}));

/** Load once preferences are ready (home and Library call this). */
export function useEnsureNewFeaturesLoaded(prefsReady: boolean): void {
  useEffect(() => {
    if (!prefsReady) return;
    const state = newFeaturesStore.getState();
    const needsHomePass = NEW_FEATURES.some(
      (f) => f.homeAnchor && !state.seen[f.id]?.homeIntroduced,
    );
    if (!state.isReady || needsHomePass) void state.load();
  }, [prefsReady]);
}

/** Ids that currently show a "New" badge (stable between renders). */
export function useNewFeatureIds(): ReadonlySet<string> {
  const seen = useStore(newFeaturesStore, (s) => s.seen);
  const ready = useStore(newFeaturesStore, (s) => s.isReady);
  return useMemo(() => {
    const ids = new Set<string>();
    if (!ready) return ids;
    const now = new Date();
    for (const feature of NEW_FEATURES) {
      if (isWithinNewWindow(seen[feature.id]?.firstSeenAt, now)) ids.add(feature.id);
    }
    return ids;
  }, [ready, seen]);
}
