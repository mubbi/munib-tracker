import type { VoluntaryFastEntry, VoluntaryFastingMap } from "@munib-tracker/shared/types";
import { asVoluntaryFastingMap, isLiveFastEntry } from "@munib-tracker/shared/utils";
import { useEffect } from "react";

import { DB_KEYS } from "@/db/keys";
import { readJSON, updateJSON } from "@/db/store";
import { migrateLegacyWhiteDaysChecklist } from "@/lib/white-days-migration";

import { createStore, useStore } from "./create-store";

/**
 * Voluntary (nafl) fasting log — NF-3.2. A map of local `YYYY-MM-DD` → entry,
 * synced as blob entity `voluntary_fasting` with a per-date last-write-wins
 * merge (`mergeVoluntaryFasting`). Cleared days stay as tombstones
 * (`deleted: true`) so a removal propagates across devices; selectors hide them.
 *
 * This store is plain persistence. Validation (Eid / Tashriq / hayd blocks) and
 * the qaza roza link live in `lib/voluntary-fasting/actions.ts` — call
 * `markFast` / `clearFast` from there, not `writeEntry` directly.
 */

const STORAGE_KEY = DB_KEYS.voluntaryFasting;

interface VoluntaryFastingState {
  /** Every row including tombstones (use the selectors for live entries). */
  entries: VoluntaryFastingMap;
  isReady: boolean;
  load: () => Promise<void>;
  /**
   * Writes (or tombstones, with `null`) one day. `patch` is merged onto the
   * current live entry and stamped with a fresh `updatedAt`.
   */
  writeEntry: (
    date: string,
    patch: Partial<Omit<VoluntaryFastEntry, "updatedAt" | "deleted">> | null,
  ) => Promise<VoluntaryFastEntry | null>;
}

function nowIso(): string {
  return new Date().toISOString();
}

export const voluntaryFastingStore = createStore<VoluntaryFastingState>((set) => ({
  entries: {},
  isReady: false,

  async load() {
    // One record of a fast: fold legacy White Days checklist ticks in first (idempotent).
    await migrateLegacyWhiteDaysChecklist();
    const raw = await readJSON<unknown>(STORAGE_KEY, {});
    set({ entries: asVoluntaryFastingMap(raw), isReady: true });
  },

  async writeEntry(date, patch) {
    let written: VoluntaryFastEntry | null = null;
    const next = await updateJSON<VoluntaryFastingMap>(STORAGE_KEY, {}, (stored) => {
      const current = asVoluntaryFastingMap(stored);
      const previous = current[date];
      const live = isLiveFastEntry(previous) ? previous : undefined;
      if (patch === null) {
        if (!previous) return current;
        // A tombstone never holds a roza decrement (`clearFast` restores it first).
        const { qazaCounted: _counted, ...rest } = live ?? previous;
        current[date] = { ...rest, deleted: true, updatedAt: nowIso() };
        return current;
      }
      const entry: VoluntaryFastEntry = {
        status: patch.status ?? live?.status ?? "intended",
        updatedAt: nowIso(),
      };
      const asQaza = patch.asQaza ?? live?.asQaza;
      const qazaCounted = patch.qazaCounted ?? live?.qazaCounted;
      const note = patch.note ?? live?.note;
      if (asQaza) entry.asQaza = true;
      if (qazaCounted) entry.qazaCounted = true;
      if (note) entry.note = note.slice(0, 500);
      current[date] = entry;
      written = entry;
      return current;
    });
    set({ entries: next, isReady: true });
    return written;
  },
}));

export function useEnsureVoluntaryFastingLoaded(): void {
  useEffect(() => {
    if (!voluntaryFastingStore.getState().isReady) {
      void voluntaryFastingStore.getState().load();
    }
  }, []);
}

/** All rows including tombstones (pass to the pure classifier / counters, which skip them). */
export function useVoluntaryFastingEntries(): VoluntaryFastingMap {
  return useStore(voluntaryFastingStore, (s) => s.entries);
}

/** The live entry for one day (undefined when none or cleared). */
export function useVoluntaryFastEntry(date: string): VoluntaryFastEntry | undefined {
  return useStore(voluntaryFastingStore, (s) => {
    const entry = s.entries[date];
    return isLiveFastEntry(entry) ? entry : undefined;
  });
}

export function useVoluntaryFastingReady(): boolean {
  return useStore(voluntaryFastingStore, (s) => s.isReady);
}
