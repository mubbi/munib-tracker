import { useEffect } from "react";

import { DB_KEYS } from "@/db/keys";
import { readJSON, writeJSON } from "@/db/store";

import { createStore, useStore } from "./create-store";

/**
 * Hifz (memorization) tracker — lite (NF-1.9). A flat map of `surah:ayah` →
 * status, kept standalone (like the favorites stores) so it stays additive and
 * cross-platform. "review" flags an ayah that's memorized but needs revision.
 */
export type HifzStatus = "memorized" | "review";

type HifzMap = Record<string, HifzStatus>;

const STORAGE_KEY = DB_KEYS.hifz;

/** The tap-cycle for an ayah's hifz status: none → review → memorized → none. */
const CYCLE: Record<string, HifzStatus | null> = {
  none: "review",
  review: "memorized",
  memorized: null,
};

export function hifzKey(surah: number, ayah: number): string {
  return `${surah}:${ayah}`;
}

/** The status an ayah moves to on the next Hifz tap (`null` = cleared). */
export function nextHifzStatus(current: HifzStatus | undefined): HifzStatus | null {
  return CYCLE[current ?? "none"];
}

interface HifzState {
  statuses: HifzMap;
  isReady: boolean;
  load: () => Promise<void>;
  cycle: (surah: number, ayah: number) => Promise<HifzStatus | null>;
}

export const hifzStore = createStore<HifzState>((set, get) => ({
  statuses: {},
  isReady: false,

  async load() {
    const statuses = await readJSON<HifzMap>(STORAGE_KEY, {});
    set({ statuses, isReady: true });
  },

  async cycle(surah, ayah) {
    const key = hifzKey(surah, ayah);
    const next = { ...get().statuses };
    const nextStatus = nextHifzStatus(next[key]);
    if (nextStatus == null) delete next[key];
    else next[key] = nextStatus;
    set({ statuses: next });
    await writeJSON(STORAGE_KEY, next);
    return nextStatus;
  },
}));

export function useEnsureHifzLoaded(): void {
  useEffect(() => {
    if (!hifzStore.getState().isReady) void hifzStore.getState().load();
  }, []);
}

export function useHifzMap(): HifzMap {
  return useStore(hifzStore, (s) => s.statuses);
}

export function useHifzStatus(surah: number, ayah: number): HifzStatus | undefined {
  return useStore(hifzStore, (s) => s.statuses[hifzKey(surah, ayah)]);
}

/** Counts memorized + needs-review ayahs per surah for the hifz overview. */
export function countHifzBySurah(
  statuses: HifzMap,
): Record<number, { memorized: number; review: number }> {
  const bySurah: Record<number, { memorized: number; review: number }> = {};
  for (const [key, status] of Object.entries(statuses)) {
    const surah = Number(key.split(":")[0]);
    if (!Number.isFinite(surah)) continue;
    const entry = bySurah[surah] ?? { memorized: 0, review: 0 };
    if (status === "memorized") entry.memorized += 1;
    else entry.review += 1;
    bySurah[surah] = entry;
  }
  return bySurah;
}

export type HifzEntry = { key: string; surah: number; ayah: number; status: HifzStatus };

/** Flat, sorted list of marked ayahs for the hifz screen and deep links. */
export function listHifzEntries(statuses: HifzMap): HifzEntry[] {
  return Object.entries(statuses)
    .map(([key, status]) => {
      const colon = key.indexOf(":");
      if (colon < 0) return null;
      const surah = Number(key.slice(0, colon));
      const ayah = Number(key.slice(colon + 1));
      if (!Number.isFinite(surah) || !Number.isFinite(ayah)) return null;
      return { key, surah, ayah, status };
    })
    .filter((entry): entry is HifzEntry => entry != null)
    .sort((a, b) => a.surah - b.surah || a.ayah - b.ayah);
}

const hifzActions = {
  load: () => hifzStore.getState().load(),
  cycle: (surah: number, ayah: number) => hifzStore.getState().cycle(surah, ayah),
} as const;

export function useHifzActions() {
  return hifzActions;
}
