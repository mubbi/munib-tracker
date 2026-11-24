import { useEffect, useMemo, useState } from "react";
import { computeFocusPlan, type FocusPlanSnapshot } from "@/lib/focus-lock/controller";
import { activeWindowAt, type FocusWindow, nextWindowAfter } from "@/lib/focus-lock/plan";
import { useHomeIqamahTimetable } from "@/lib/masjid/home-masjid";
import { iqamahOn } from "@/lib/masjid/iqamah-on";
import { useStore } from "@/stores/create-store";
import { focusLockStore, useEnsureFocusLockLoaded } from "@/stores/focus-lock-store";
import { useLocation } from "@/stores/location-store";
import { usePreferences } from "@/stores/preferences-store";
import { trackerStore } from "@/stores/tracker-store";

/** Re-renders every `ms` so "active / ends at" stays current. */
export function useNow(ms = 30_000): Date {
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), ms);
    return () => clearInterval(id);
  }, [ms]);
  return now;
}

export interface FocusPlanView extends FocusPlanSnapshot {
  active: FocusWindow | null;
  next: FocusWindow | null;
  now: Date;
}

/** NF-3.13: the live focus-lock plan (today + tomorrow) from prefs, location, tracker and masjid stores. */
export function useFocusPlan(tickMs = 30_000): FocusPlanView {
  useEnsureFocusLockLoaded();
  const now = useNow(tickMs);
  const prefs = usePreferences();
  const location = useLocation();
  const tracker = useStore(trackerStore, (s) => ({ date: s.date, status: s.prayerStatus }));
  const endedIds = useStore(focusLockStore, (s) => s.endedIds);
  const timetable = useHomeIqamahTimetable();

  const snapshot = useMemo(
    () =>
      computeFocusPlan(
        {
          prefs,
          location,
          trackerDate: tracker.date,
          prayerStatus: tracker.status,
          endedIds,
          iqamah: timetable ? (date, prayer) => iqamahOn(date, prayer, timetable) : null,
        },
        now,
      ),
    [prefs, location, tracker.date, tracker.status, endedIds, timetable, now],
  );
  return {
    ...snapshot,
    active: activeWindowAt(snapshot.windows, now),
    next: nextWindowAfter(snapshot.windows, now),
    now,
  };
}
