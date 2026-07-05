import { initDatabase, LocationRepository } from "@/db";
import {
  DEFAULT_LOCATION,
  getDeviceLocation,
  type LocationSearchResult,
  resolvePlaceFromCoordinates,
  type StoredLocation,
} from "@/lib/location";
import type {
  CalculationMethodKey,
  HighLatitudeRuleKey,
  MadhabKey,
  PrayerSlotId,
} from "@/lib/prayer-times";

import { createStore, useStore } from "./create-store";

export type LocationStatus = "idle" | "loading" | "ready" | "denied" | "error";

export interface LocationState {
  location: StoredLocation;
  status: LocationStatus;
  isReady: boolean;

  /** Reads the cached location so the UI can render instantly, then refreshes. */
  load: () => Promise<void>;
  /**
   * Background/pull-to-refresh: re-fetch a device fix, but leave a
   * manually-chosen city untouched so it isn't silently overwritten by GPS.
   */
  refresh: () => Promise<void>;
  /**
   * Explicit "use my current location": always requests a fresh GPS fix and
   * replaces the stored location (clearing any manual selection).
   */
  requestDeviceLocation: () => Promise<void>;
  /** Persists a city the user picked from search; GPS won't overwrite it. */
  setManualLocation: (place: LocationSearchResult) => Promise<void>;
  setMethod: (method: CalculationMethodKey) => Promise<void>;
  setMadhab: (madhab: MadhabKey) => Promise<void>;
  /** High-latitude twilight rule override (NF-2.21). */
  setHighLatitudeRule: (rule: HighLatitudeRuleKey) => Promise<void>;
  /** Per-prayer manual minute offset (NF-2.20); 0 clears the offset. */
  setPrayerAdjustment: (prayerId: PrayerSlotId, minutes: number) => Promise<void>;
}

export const locationStore = createStore<LocationState>((set, get) => ({
  // Seeded with the persisted default so `location` is never undefined before
  // `load()` resolves the cached value.
  location: DEFAULT_LOCATION,
  status: "idle",
  isReady: false,

  async load() {
    await initDatabase();
    const location = await LocationRepository.get();
    set({ location, isReady: true });
    // Kick off a background refresh; failures keep the cached/default location.
    void get().refresh();
  },

  async refresh() {
    // Respect a city the user chose by hand — don't clobber it with GPS.
    if (get().location.source === "manual") {
      if (get().status !== "ready") set({ status: "ready" });
      return;
    }
    await get().requestDeviceLocation();
  },

  async requestDeviceLocation() {
    if (get().status === "loading") return;
    set({ status: "loading" });
    const result = await getDeviceLocation(get().location);
    if (result.status !== "granted") {
      set({ status: result.status });
      return;
    }
    const location = await LocationRepository.update(result.location);
    set({ location, status: "ready" });
  },

  async setManualLocation(place) {
    // Apply coords + timezone immediately so prayer times and the hero schedule
    // update before the reverse-geocode round-trip finishes.
    const optimistic = await LocationRepository.update({
      latitude: place.latitude,
      longitude: place.longitude,
      city: place.name,
      country: place.country,
      label: place.label,
      source: "manual",
      updatedAt: new Date().toISOString(),
      // Show the chosen city's prayer times in that city's clock, not the device's.
      timeZone: place.timeZone,
    });
    set({ location: optimistic, status: "ready" });

    const resolved = await resolvePlaceFromCoordinates(place.latitude, place.longitude);
    const city = resolved.city ?? place.name;
    const country = resolved.country ?? place.country;
    const label = resolved.city || resolved.country ? resolved.label : place.label;

    if (city === optimistic.city && country === optimistic.country && label === optimistic.label) {
      return;
    }

    const location = await LocationRepository.update({ city, country, label });
    set({ location });
  },

  async setMethod(method) {
    const location = await LocationRepository.update({ method });
    set({ location });
  },

  async setMadhab(madhab) {
    const location = await LocationRepository.update({ madhab });
    set({ location });
  },

  async setHighLatitudeRule(rule) {
    const location = await LocationRepository.update({ highLatitudeRule: rule });
    set({ location });
  },

  async setPrayerAdjustment(prayerId, minutes) {
    const current = get().location.prayerAdjustments ?? {};
    const next = { ...current };
    if (minutes === 0) delete next[prayerId];
    else next[prayerId] = minutes;
    const location = await LocationRepository.update({ prayerAdjustments: next });
    set({ location });
  },
}));

export function useLocation(): StoredLocation {
  return useStore(locationStore, (s) => s.location);
}

export function useLocationStatus(): LocationStatus {
  return useStore(locationStore, (s) => s.status);
}

const locationActions = {
  load: (...args: Parameters<LocationState["load"]>) => locationStore.getState().load(...args),
  refresh: (...args: Parameters<LocationState["refresh"]>) =>
    locationStore.getState().refresh(...args),
  requestDeviceLocation: (...args: Parameters<LocationState["requestDeviceLocation"]>) =>
    locationStore.getState().requestDeviceLocation(...args),
  setManualLocation: (...args: Parameters<LocationState["setManualLocation"]>) =>
    locationStore.getState().setManualLocation(...args),
  setMethod: (...args: Parameters<LocationState["setMethod"]>) =>
    locationStore.getState().setMethod(...args),
  setMadhab: (...args: Parameters<LocationState["setMadhab"]>) =>
    locationStore.getState().setMadhab(...args),
  setHighLatitudeRule: (...args: Parameters<LocationState["setHighLatitudeRule"]>) =>
    locationStore.getState().setHighLatitudeRule(...args),
  setPrayerAdjustment: (...args: Parameters<LocationState["setPrayerAdjustment"]>) =>
    locationStore.getState().setPrayerAdjustment(...args),
} as const;

export function useLocationActions() {
  return locationActions;
}
