import { aqeedahProgressStore } from "./aqeedah-progress-store";
import { battlesProgressStore } from "./battles-progress-store";
import { continueStore } from "./continue-store";
import type { Store } from "./create-store";
import { customAdhkarStore } from "./custom-adhkar-store";
import { customTasbeehStore } from "./custom-tasbeeh-store";
import { duaFavoritesStore } from "./dua-favorites-store";
import { duroodFavoritesStore } from "./durood-favorites-store";
import { fastingStore } from "./fasting-store";
import { fridayChecklistStore } from "./friday-checklist-store";
import { hadithStore } from "./hadith-store";
import { hajjChecklistStore } from "./hajj-checklist-store";
import { hifzStore } from "./hifz-store";
import { jahannamIntentionsStore } from "./jahannam-intentions-store";
import { jannahIntentionsStore } from "./jannah-intentions-store";
import { khatmStore } from "./khatm-store";
import { khushuStore } from "./khushu-store";
import { lastDayProgressStore } from "./last-day-progress-store";
import { learnDuaProgressStore } from "./learn-dua-progress-store";
import { locationStore } from "./location-store";
import { nameFavoritesStore } from "./name-favorites-store";
import { preferencesStore } from "./preferences-store";
import { prophetsProgressStore } from "./prophets-progress-store";
import { quranCompanionPrefsStore } from "./quran-companion-prefs-store";
import { quranGuideProgressStore } from "./quran-guide-progress-store";
import { quranMemorizationStore } from "./quran-memorization-store";
import { quranPracticeStore } from "./quran-practice-store";
import { quranStore } from "./quran-store";
import { reloadAllStores } from "./reload-all-stores";
import { sadaqahStore } from "./sadaqah-store";
import { salahGuideProgressStore } from "./salah-guide-progress-store";
import { taharahProgressStore } from "./taharah-progress-store";
import { toursStore } from "./tours-store";
import { trackerStore } from "./tracker-store";
import { umrahChecklistStore } from "./umrah-checklist-store";
import { whiteDaysChecklistStore } from "./white-days-checklist-store";

const STORES = [
  aqeedahProgressStore,
  battlesProgressStore,
  continueStore,
  customAdhkarStore,
  customTasbeehStore,
  duaFavoritesStore,
  duroodFavoritesStore,
  fastingStore,
  fridayChecklistStore,
  hadithStore,
  hajjChecklistStore,
  hifzStore,
  jahannamIntentionsStore,
  jannahIntentionsStore,
  khatmStore,
  khushuStore,
  lastDayProgressStore,
  learnDuaProgressStore,
  locationStore,
  nameFavoritesStore,
  preferencesStore,
  prophetsProgressStore,
  quranCompanionPrefsStore,
  quranGuideProgressStore,
  quranMemorizationStore,
  quranPracticeStore,
  quranStore,
  sadaqahStore,
  salahGuideProgressStore,
  taharahProgressStore,
  toursStore,
  trackerStore,
  umrahChecklistStore,
  whiteDaysChecklistStore,
] as unknown as Store<{ load: () => Promise<void> }>[];

describe("reloadAllStores", () => {
  it("reloads every persisted store from disk", async () => {
    const originals = STORES.map((store) => store.getState().load);
    const loads = STORES.map((store) => {
      const load = jest.fn(async () => {});
      store.setState({ load });
      return load;
    });

    await reloadAllStores();

    STORES.forEach((store, i) => {
      store.setState({ load: originals[i] });
    });
    for (const load of loads) expect(load).toHaveBeenCalledTimes(1);
  });
});

describe("reloadAllStores — lazily loaded stores outside stores/", () => {
  it("re-reads the live ones from disk and leaves never-loaded ones alone", async () => {
    const { DB_KEYS } = require("@/db/keys") as typeof import("@/db/keys");
    const { writeJSON } = require("@/db/store") as typeof import("@/db/store");
    const { homeMasjidCacheStore } =
      require("@/lib/masjid/home-masjid") as typeof import("@/lib/masjid/home-masjid");
    const { setupDismissStore } =
      require("@/lib/settings/setup-checklist") as typeof import("@/lib/settings/setup-checklist");
    const { vaultLockPrefStore } =
      require("@/lib/vault/vault-lock") as typeof import("@/lib/vault/vault-lock");

    // Stale in-memory values from before a reset (the keys are already gone on disk).
    vaultLockPrefStore.setState({ lockJournals: true, isReady: true });
    setupDismissStore.setState({ dismissed: ["location"], isReady: true });
    homeMasjidCacheStore.setState({ cache: null, isReady: false });
    await writeJSON(DB_KEYS.homeMasjidCache, { stale: true });

    await reloadAllStores();

    expect(vaultLockPrefStore.getState().lockJournals).toBe(false);
    expect(setupDismissStore.getState()).toMatchObject({ dismissed: [], isReady: true });
    // Never loaded on this run → not force-loaded by the reset.
    expect(homeMasjidCacheStore.getState()).toMatchObject({ cache: null, isReady: false });
  });
});
