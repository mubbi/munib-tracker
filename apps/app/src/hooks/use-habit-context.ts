import type { ZikrProgress } from "@munib-tracker/shared/types";
import { getLocalDateString } from "@munib-tracker/shared/utils";
import { useEffect, useMemo, useState } from "react";

import { ZikrRepository } from "@/db";
import { zikrCountsByDate } from "@/lib/adhkar-history";
import type { HabitContext } from "@/lib/sunnah-habits";
import { useEnsureSadaqahLoaded, useSadaqahLog } from "@/stores/sadaqah-store";
import { useTrackerDate, useZikrCounts } from "@/stores/tracker-store";

/**
 * Read-only data the linked Sunnah habits derive from (NF-3.5): zikr history
 * (adhkar sets, the istighfar tasbeeh) and the sadaqah log. Today's counts come
 * live from the tracker store; older days from one `ZikrRepository` read.
 * Pass `withHistory: false` where only today matters (home card, tracker).
 */
export function useHabitContext({
  withHistory = true,
}: {
  withHistory?: boolean;
} = {}): HabitContext {
  useEnsureSadaqahLoaded();
  const sadaqahLog = useSadaqahLog();
  const trackerDate = useTrackerDate();
  const todayCounts = useZikrCounts();
  const [history, setHistory] = useState<ZikrProgress[] | null>(null);

  useEffect(() => {
    if (!withHistory) return;
    let active = true;
    void ZikrRepository.getAll()
      .then((entries) => {
        if (active) setHistory(entries);
      })
      .catch(() => {
        if (active) setHistory([]);
      });
    return () => {
      active = false;
    };
  }, [withHistory]);

  return useMemo(() => {
    const byDate = history ? zikrCountsByDate(history) : new Map<string, Record<string, number>>();
    const sadaqahDates = new Set(sadaqahLog.map((entry) => getLocalDateString(new Date(entry.at))));
    return {
      zikrCountsFor: (date: string) => (date === trackerDate ? todayCounts : byDate.get(date)),
      sadaqahDates,
    };
  }, [history, sadaqahLog, todayCounts, trackerDate]);
}
