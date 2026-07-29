import { useEffect } from "react";

import { DB_KEYS } from "@/db/keys";
import { readJSON, writeJSON } from "@/db/store";

import { createStore, useStore } from "./create-store";

/**
 * Tracks which in-app feature tours (NF-2.24) the user has completed or dismissed,
 * so a tour can auto-run once and then stay out of the way. Stored as a single id
 * list blob; cloud-synced via `tours_seen`.
 */
interface ToursState {
  seen: string[];
  isReady: boolean;
  load: () => Promise<void>;
  markSeen: (id: string) => Promise<void>;
  reset: () => Promise<void>;
}

export const toursStore = createStore<ToursState>((set, get) => ({
  seen: [],
  isReady: false,

  async load() {
    set({ seen: await readJSON<string[]>(DB_KEYS.toursSeen, []), isReady: true });
  },

  async markSeen(id) {
    if (get().seen.includes(id)) return;
    const seen = [...get().seen, id];
    await writeJSON<string[]>(DB_KEYS.toursSeen, seen);
    set({ seen });
  },

  async reset() {
    await writeJSON<string[]>(DB_KEYS.toursSeen, []);
    set({ seen: [] });
  },
}));

export function useEnsureToursLoaded(): void {
  useEffect(() => {
    if (!toursStore.getState().isReady) void toursStore.getState().load();
  }, []);
}

export function useHasSeenTour(id: string): boolean {
  return useStore(toursStore, (s) => s.seen.includes(id));
}

const toursActions = {
  load: () => toursStore.getState().load(),
  markSeen: (id: string) => toursStore.getState().markSeen(id),
  reset: () => toursStore.getState().reset(),
} as const;

export function useToursActions() {
  return toursActions;
}
