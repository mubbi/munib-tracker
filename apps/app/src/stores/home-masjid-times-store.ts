import {
  type PrivateMasjidTimes,
  type PrivateMasjidTimesMap,
  sanitizePrivateMasjidTimes,
} from "@munib-tracker/shared/masjid";
import { useEffect } from "react";

import { DB_KEYS } from "@/db/keys";
import { readJSON, updateJSON } from "@/db/store";

import { createStore, useStore } from "./create-store";

/**
 * NF-3.11 private iqamah times ("Your times"), keyed by `masjidKey` (`node/123`).
 * Kept per masjid so switching home masjid and back restores them. Synced as
 * blob entity `home_masjid_times` to the user's own devices only — never sent
 * to the masjids API or shown to anyone else.
 */
interface HomeMasjidTimesState {
  times: PrivateMasjidTimesMap;
  isReady: boolean;
  load: () => Promise<void>;
  /** Saves (sanitised) times for one masjid; nothing usable left ⇒ removes the entry. */
  save: (key: string, times: Omit<PrivateMasjidTimes, "updatedAt">) => Promise<void>;
  remove: (key: string) => Promise<void>;
}

function cleanMap(raw: unknown): PrivateMasjidTimesMap {
  if (!raw || typeof raw !== "object" || Array.isArray(raw)) return {};
  const out: PrivateMasjidTimesMap = {};
  for (const [key, value] of Object.entries(raw as Record<string, unknown>)) {
    const clean = sanitizePrivateMasjidTimes(value);
    if (clean) out[key] = clean;
  }
  return out;
}

export async function readHomeMasjidTimes(): Promise<PrivateMasjidTimesMap> {
  return cleanMap(await readJSON<unknown>(DB_KEYS.homeMasjidTimes, {}));
}

export const homeMasjidTimesStore = createStore<HomeMasjidTimesState>((set) => ({
  times: {},
  isReady: false,

  async load() {
    set({ times: await readHomeMasjidTimes(), isReady: true });
  },

  async save(key, times) {
    const next = await updateJSON<PrivateMasjidTimesMap>(DB_KEYS.homeMasjidTimes, {}, (current) => {
      const map = cleanMap(current);
      const clean = sanitizePrivateMasjidTimes({ ...times, updatedAt: new Date().toISOString() });
      if (clean) map[key] = clean;
      else delete map[key];
      return map;
    });
    set({ times: next, isReady: true });
  },

  async remove(key) {
    const next = await updateJSON<PrivateMasjidTimesMap>(DB_KEYS.homeMasjidTimes, {}, (current) => {
      const map = cleanMap(current);
      delete map[key];
      return map;
    });
    set({ times: next, isReady: true });
  },
}));

export function useEnsureHomeMasjidTimesLoaded(): void {
  useEffect(() => {
    if (!homeMasjidTimesStore.getState().isReady) {
      void homeMasjidTimesStore.getState().load();
    }
  }, []);
}

export function usePrivateMasjidTimes(key: string | null | undefined): PrivateMasjidTimes | null {
  return useStore(homeMasjidTimesStore, (s) => (key ? (s.times[key] ?? null) : null));
}

export const homeMasjidTimesActions = {
  load: () => homeMasjidTimesStore.getState().load(),
  save: (key: string, times: Omit<PrivateMasjidTimes, "updatedAt">) =>
    homeMasjidTimesStore.getState().save(key, times),
  remove: (key: string) => homeMasjidTimesStore.getState().remove(key),
} as const;
