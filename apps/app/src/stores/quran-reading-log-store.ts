import { getLocalDateString } from "@munib-tracker/shared/utils";
import { useEffect } from "react";

import { DB_KEYS } from "@/db/keys";
import { readJSON, withKeyLock, writeJSON } from "@/db/store";
import {
  addQuranReading,
  type QuranReadingDay,
  type QuranReadingLog,
  sanitizeQuranReadingLog,
} from "@/lib/quran-reading-log";

import { createStore, useStore } from "./create-store";

/**
 * D40 daily Qur'an reading log — one blob under `DB_KEYS.quranReadingLog`,
 * synced as blob entity `quran_reading_log` (`mergeQuranReadingLog`). Written
 * by `useQuranReadingRecorder` (readers) and, for finished Qur'an practice
 * sessions, `applyReadingCredit` (D68, `lib/quran-companion/reading-credit*`).
 */
interface QuranReadingLogState {
  log: QuranReadingLog;
  isReady: boolean;
  load: () => Promise<void>;
  record: (date: string, delta: Partial<QuranReadingDay>) => Promise<void>;
}

const KEY = DB_KEYS.quranReadingLog;

export const quranReadingLogStore = createStore<QuranReadingLogState>((set, get) => ({
  log: {},
  isReady: false,

  async load() {
    const raw = await readJSON<unknown>(KEY, null);
    set({ log: sanitizeQuranReadingLog(raw), isReady: true });
  },

  async record(date, delta) {
    if (!get().isReady) await get().load();
    await withKeyLock(KEY, async () => {
      const current = get().log;
      const next = addQuranReading(current, date, delta, getLocalDateString());
      if (next === current) return;
      set({ log: next });
      await writeJSON(KEY, next);
    });
  },
}));

export function useEnsureQuranReadingLogLoaded(): void {
  useEffect(() => {
    if (!quranReadingLogStore.getState().isReady) void quranReadingLogStore.getState().load();
  }, []);
}

export function useQuranReadingLog(): QuranReadingLog {
  return useStore(quranReadingLogStore, (s) => s.log);
}

/** Reading log entries for the coach / statistics (loads from disk when needed). */
export async function getQuranReadingLog(): Promise<QuranReadingLog> {
  if (!quranReadingLogStore.getState().isReady) await quranReadingLogStore.getState().load();
  return quranReadingLogStore.getState().log;
}
