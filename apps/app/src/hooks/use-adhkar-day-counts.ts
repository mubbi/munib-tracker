import type { AfterSalahPrayer } from "@munib-tracker/shared/types";
import { useCallback, useEffect, useState } from "react";

import { ZikrRepository } from "@/db";
import { onTrackingChanged } from "@/lib/sync/tracking-changes";
import { zikrCountKey } from "@/lib/zikr-count-key";
import {
  trackerStore,
  useTrackerDate,
  useZikrCounts,
  type ZikrCountWrite,
} from "@/stores/tracker-store";

const EMPTY: Record<string, number> = {};

/**
 * Zikr counts (keyed per zikr and per salah) for one adhkar day, plus writers
 * that log under that same day. Today reads/writes through the tracker store;
 * another day (last night's adhkar after midnight) reads the repository and
 * reloads after each write — so every screen and the calendar / stats agree on
 * which date a recitation belongs to.
 */
export function useAdhkarDayCounts(date: string) {
  const storeDate = useTrackerDate();
  const storeCounts = useZikrCounts();
  const isStoreDay = date === storeDate;
  const [other, setOther] = useState<{ date: string; counts: Record<string, number> } | null>(null);

  useEffect(() => {
    if (isStoreDay) return;
    let active = true;
    const load = async () => {
      const entries = await ZikrRepository.getByDate(date);
      if (!active) return;
      const counts: Record<string, number> = {};
      for (const entry of entries) counts[zikrCountKey(entry.zikrId, entry.prayerId)] = entry.count;
      setOther({ date, counts });
    };
    void load();
    // Re-read after any persisted zikr write (this screen's or another's).
    const unsubscribe = onTrackingChanged(() => void load());
    return () => {
      active = false;
      unsubscribe();
    };
  }, [date, isStoreDay]);

  /** False until another day's counts have been read from storage. */
  const ready = isStoreDay || other?.date === date;
  const counts = isStoreDay ? storeCounts : other?.date === date ? other.counts : EMPTY;

  const setCount = useCallback(
    (zikrId: string, count: number, target: number, prayerId?: AfterSalahPrayer) =>
      trackerStore
        .getState()
        .setZikrCountOnDate(date, zikrId, count, target, prayerId ? { prayerId } : undefined),
    [date],
  );

  const setCounts = useCallback(
    (entries: ReadonlyArray<ZikrCountWrite>) =>
      trackerStore.getState().setZikrCountsOnDate(date, entries),
    [date],
  );

  return { date, isToday: isStoreDay, ready, counts, setCount, setCounts };
}
