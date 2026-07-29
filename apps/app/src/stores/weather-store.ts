import type {
  WeatherEffectKind,
  WeatherPreferences,
  WeatherSnapshot,
} from "@munib-tracker/shared/types";

import { initDatabase, WeatherCacheRepository } from "@/db";
import {
  fetchCurrentWeather,
  isWeatherCacheStale,
  isWeatherForLocation,
} from "@/lib/weather/fetch-weather";
import { locationStore } from "@/stores/location-store";

import { createStore, useStore } from "./create-store";

export type WeatherStatus = "idle" | "loading" | "ready" | "error";

export interface WeatherState {
  snapshot: WeatherSnapshot | null;
  status: WeatherStatus;
  load: () => Promise<void>;
  /** Refreshes only when cache is stale or coordinates changed, unless forced. */
  sync: (options?: { force?: boolean }) => Promise<void>;
}

let syncPromise: Promise<void> | null = null;

async function resolveSnapshot(force: boolean): Promise<WeatherSnapshot | null> {
  const { latitude, longitude } = locationStore.getState().location;
  const cached = await WeatherCacheRepository.get(latitude, longitude);
  const cacheValid =
    cached &&
    isWeatherForLocation(cached, latitude, longitude) &&
    !isWeatherCacheStale(cached.fetchedAt);

  if (!force && cacheValid) {
    return cached;
  }

  const snapshot = await fetchCurrentWeather(latitude, longitude);
  await WeatherCacheRepository.set(snapshot);
  return snapshot;
}

export const weatherStore = createStore<WeatherState>((set, get) => ({
  snapshot: null,
  status: "idle",

  async load() {
    await initDatabase();
    const { latitude, longitude } = locationStore.getState().location;
    const cached = await WeatherCacheRepository.get(latitude, longitude);
    if (cached && isWeatherForLocation(cached, latitude, longitude)) {
      set({ snapshot: cached, status: "ready" });
    }
    await get().sync();
  },

  async sync(options) {
    if (syncPromise) {
      await syncPromise;
      if (!options?.force) return;
    }

    const run = async () => {
      const previous = get().snapshot;
      if (get().status === "idle") {
        set({ status: "loading" });
      } else if (!previous) {
        set({ status: "loading" });
      }

      try {
        const snapshot = await resolveSnapshot(Boolean(options?.force));
        set({ snapshot, status: "ready" });
      } catch {
        if (previous) {
          set({ snapshot: previous, status: "ready" });
        } else {
          set({ status: "error" });
        }
      }
    };

    syncPromise = run().finally(() => {
      syncPromise = null;
    });
    await syncPromise;
  },
}));

export function useWeatherSnapshot(): WeatherSnapshot | null {
  return useStore(weatherStore, (s) => s.snapshot);
}

export function useWeatherStatus(): WeatherStatus {
  return useStore(weatherStore, (s) => s.status);
}

export function resolveWeatherEffects(
  snapshot: WeatherSnapshot | null,
  prefs: WeatherPreferences,
): WeatherEffectKind[] {
  if (!snapshot || !prefs.effectsEnabled) return [];
  const effects: WeatherEffectKind[] = [snapshot.condition];
  if (snapshot.isWindy) {
    effects.push("windy");
  }
  return effects;
}

export const weatherActions = {
  load: () => weatherStore.getState().load(),
  sync: (options?: { force?: boolean }) => weatherStore.getState().sync(options),
} as const;

export function useWeatherActions() {
  return weatherActions;
}
