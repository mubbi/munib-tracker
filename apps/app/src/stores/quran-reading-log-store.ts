import { getLocalDateString } from "@munib-tracker/shared/utils";
import { useEffect } from "react";

import { DB_KEYS } from "@/db/keys";
import { readJSON, withKeyLock, writeJSON } from "@/db/store";
import type { PracticeSummary } from "@/lib/quran-companion/types";
import {
  addQuranReading,
  type QuranReadingDay,
  type QuranReadingLog,
  sanitizeQuranReadingLog,
} from "@/lib/quran-reading-log";
import { READING_MIN_ACTIVE_SECONDS } from "@/lib/quran-reading-session";

import { createStore, useStore } from "./create-store";

/**
 * D40 daily Qur'an reading log — one blob under `DB_KEYS.quranReadingLog`,
 * synced as blob entity `quran_reading_log` (`mergeQuranReadingLog`). Written
 * by `useQuranReadingRecorder` (readers) and {@link recordPracticeReading}.
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

/** The log delta for a finished practice session, or `null` when nothing was recited. */
export function practiceReadingDelta(summary: PracticeSummary): QuranReadingDay | null {
  const span = Math.max(0, summary.ayahEnd - summary.ayahStart + 1);
  const ayahs = Math.max(0, span - Math.max(0, summary.notReached));
  const seconds = Math.max(0, Math.floor(summary.durationMs / 1000));
  if (ayahs === 0 && seconds < READING_MIN_ACTIVE_SECONDS) return null;
  return { seconds, ayahs, pages: 0 };
}

/** Records a finished Qur'an practice session on the day it ended. Best-effort. */
export async function recordPracticeReading(summary: PracticeSummary): Promise<void> {
  const delta = practiceReadingDelta(summary);
  const ended = new Date(summary.endedAt);
  if (!delta || Number.isNaN(ended.getTime())) return;
  try {
    await quranReadingLogStore.getState().record(getLocalDateString(ended), delta);
  } catch {
    // The reading log is a convenience signal; never fail a practice save on it.
  }
}
