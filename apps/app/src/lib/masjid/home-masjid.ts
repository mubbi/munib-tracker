import {
  type HomeMasjid,
  type IqamahTimetable,
  type MasjidDetailResponse,
  masjidKey,
  type PrivateMasjidTimesMap,
  resolveIqamahTimetable,
} from "@munib-tracker/shared/masjid";
import type { ObligatoryPrayer, UserPreferences } from "@munib-tracker/shared/types";
import { getLocalDateString } from "@munib-tracker/shared/utils";

import { DB_KEYS } from "@/db/keys";
import { readJSON, removeKey, writeJSON } from "@/db/store";
import { fetchMasjidDetail } from "@/lib/masjid/api";
import { iqamahOn } from "@/lib/masjid/iqamah-on";
import { createStore, useStore } from "@/stores/create-store";
import { homeMasjidTimesStore } from "@/stores/home-masjid-times-store";
import { preferencesStore } from "@/stores/preferences-store";

/**
 * NF-3.11 home masjid layer. The selection lives in `UserPreferences.homeMasjid`
 * (account-synced); the public OSM detail is cached in `DB_KEYS.homeMasjidCache`;
 * the user's own times live in the `home_masjid_times` blob. Iqamah precedence:
 * private > licence-cleared public > none (then features fall back to adhan).
 */

export interface HomeMasjidCache {
  key: string;
  savedAt: string;
  detail: MasjidDetailResponse;
}

interface HomeMasjidCacheState {
  cache: HomeMasjidCache | null;
  isReady: boolean;
  load: () => Promise<void>;
  set: (cache: HomeMasjidCache | null) => Promise<void>;
}

export const homeMasjidCacheStore = createStore<HomeMasjidCacheState>((set) => ({
  cache: null,
  isReady: false,
  async load() {
    set({
      cache: await readJSON<HomeMasjidCache | null>(DB_KEYS.homeMasjidCache, null),
      isReady: true,
    });
  },
  async set(cache) {
    if (cache) await writeJSON(DB_KEYS.homeMasjidCache, cache);
    else await removeKey(DB_KEYS.homeMasjidCache);
    set({ cache, isReady: true });
  },
}));

export function getHomeMasjid(
  prefs: UserPreferences = preferencesStore.getState().prefs,
): HomeMasjid | null {
  const home = prefs.homeMasjid;
  return home?.osmType && home.osmId ? home : null;
}

export function useHomeMasjid(): HomeMasjid | null {
  return useStore(preferencesStore, (s) => getHomeMasjid(s.prefs));
}

/** The public timetable cached for the current home masjid (none cleared today, D26). */
function publicTimetableFor(
  home: HomeMasjid,
  cache: HomeMasjidCache | null,
): IqamahTimetable | null {
  return cache?.key === masjidKey(home) ? (cache.detail.timetable ?? null) : null;
}

/** Pure resolver: private > public > null for the given home masjid. */
export function resolveHomeIqamah(
  home: HomeMasjid | null,
  times: PrivateMasjidTimesMap,
  cache: HomeMasjidCache | null,
): IqamahTimetable | null {
  if (!home) return null;
  return resolveIqamahTimetable({
    privateTimes: times[masjidKey(home)] ?? null,
    publicTimetable: publicTimetableFor(home, cache),
  });
}

/** Current home masjid timetable from the loaded stores (sync; null ⇒ hide iqamah UI). */
export function getHomeIqamahTimetable(): IqamahTimetable | null {
  return resolveHomeIqamah(
    getHomeMasjid(),
    homeMasjidTimesStore.getState().times,
    homeMasjidCacheStore.getState().cache,
  );
}

export function useHomeIqamahTimetable(): IqamahTimetable | null {
  const home = useHomeMasjid();
  const times = useStore(homeMasjidTimesStore, (s) => s.times);
  const cache = useStore(homeMasjidCacheStore, (s) => s.cache);
  return resolveHomeIqamah(home, times, cache);
}

/**
 * Iqamah "HH:mm" for the home masjid on a local date — the hook NF-3.13 (focus
 * lock) and the rawatib tahiyyat hint use. On Fridays Dhuhr resolves to the
 * earliest Jumu'ah iqamah when one exists. Null ⇒ no times (fall back to adhan).
 */
export function iqamahFor(
  date: Date | string,
  prayer: ObligatoryPrayer,
  timetable: IqamahTimetable | null = getHomeIqamahTimetable(),
): string | null {
  return iqamahOn(typeof date === "string" ? date : getLocalDateString(date), prayer, timetable);
}

/** Loads the stores the iqamah resolvers read (call before `iqamahFor` outside React). */
export async function ensureHomeMasjidLoaded(): Promise<void> {
  await Promise.all([
    homeMasjidTimesStore.getState().isReady ? undefined : homeMasjidTimesStore.getState().load(),
    homeMasjidCacheStore.getState().isReady ? undefined : homeMasjidCacheStore.getState().load(),
  ]);
}

/** Refreshes the cached public detail of the home masjid (best-effort). */
export async function refreshHomeMasjidCache(
  home: HomeMasjid | null = getHomeMasjid(),
): Promise<void> {
  if (!home) {
    await homeMasjidCacheStore.getState().set(null);
    return;
  }
  try {
    const detail = await fetchMasjidDetail(home.osmType, home.osmId);
    await homeMasjidCacheStore.getState().set({
      key: masjidKey(home),
      savedAt: new Date().toISOString(),
      detail,
    });
  } catch {
    /* offline — keep the previous cache */
  }
}

/** Sets (or clears) the home masjid; the masjids API never learns about it. */
export async function setHomeMasjid(home: HomeMasjid | null): Promise<void> {
  await preferencesStore.getState().update({ homeMasjid: home });
  void refreshHomeMasjidCache(home);
  requestIqamahReschedule();
}

/** Rebuilds reminders after iqamah inputs change (times, walk minutes, home masjid). */
export function requestIqamahReschedule(): void {
  if (preferencesStore.getState().prefs.notificationPrefs.iqamah !== true) return;
  void (async () => {
    const [{ rescheduleAll }, { locationStore }] = await Promise.all([
      import("@/notifications/scheduler"),
      import("@/stores/location-store"),
    ]);
    await rescheduleAll(preferencesStore.getState().prefs, locationStore.getState().location);
  })().catch(() => {
    /* best-effort; the next foreground reschedule catches up */
  });
}
