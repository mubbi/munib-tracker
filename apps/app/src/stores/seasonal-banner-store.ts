import { useEffect } from "react";

import { DB_KEYS } from "@/db/keys";
import { readJSON, writeJSON } from "@/db/store";

import { createStore, useStore } from "./create-store";

/** Oldest keys drop off past this — a handful of seasons a year is plenty. */
export const SEASONAL_BANNER_DISMISS_CAP = 24;

interface SeasonalBannerState {
  /** `<seasonId>:<hijriYear>` keys hidden "for this season" on this device. */
  dismissed: readonly string[];
  isReady: boolean;
  load: () => Promise<void>;
  dismiss: (key: string) => Promise<void>;
}

function sanitize(raw: unknown): string[] {
  return Array.isArray(raw) ? raw.filter((k): k is string => typeof k === "string") : [];
}

let loading: Promise<void> | null = null;

/**
 * Device-local "hide for this season" dismissals for the home seasonal banner
 * (`DB_KEYS.seasonalBannerDismissed`, never synced). Turning seasonal banners
 * off altogether is the `seasonal-banner` home module in Customize home.
 */
export const seasonalBannerStore = createStore<SeasonalBannerState>((set, get) => ({
  dismissed: [],
  isReady: false,

  load() {
    loading ??= (async () => {
      try {
        const raw = await readJSON<unknown>(DB_KEYS.seasonalBannerDismissed, []);
        set({ dismissed: sanitize(raw), isReady: true });
      } finally {
        loading = null;
      }
    })();
    return loading;
  },

  async dismiss(key) {
    if (!get().isReady) await get().load();
    const current = get().dismissed;
    if (current.includes(key)) return;
    const next = [...current, key].slice(-SEASONAL_BANNER_DISMISS_CAP);
    set({ dismissed: next });
    await writeJSON(DB_KEYS.seasonalBannerDismissed, next);
  },
}));

export function useEnsureSeasonalBannerLoaded(): void {
  useEffect(() => {
    if (!seasonalBannerStore.getState().isReady) void seasonalBannerStore.getState().load();
  }, []);
}

export function useSeasonalBannerReady(): boolean {
  return useStore(seasonalBannerStore, (s) => s.isReady);
}

export function useSeasonalBannerDismissed(): readonly string[] {
  return useStore(seasonalBannerStore, (s) => s.dismissed);
}

/** Test-only: forget in-memory state so the next load reads storage again. */
export function __resetSeasonalBannerStore(): void {
  loading = null;
  seasonalBannerStore.setState({ dismissed: [], isReady: false });
}
