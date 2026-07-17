import { aqeedahProgressStore } from "./aqeedah-progress-store";
import { battlesProgressStore } from "./battles-progress-store";
import { continueStore } from "./continue-store";
import { customAdhkarStore } from "./custom-adhkar-store";
import { customTasbeehStore } from "./custom-tasbeeh-store";
import { duaFavoritesStore } from "./dua-favorites-store";
import { duroodFavoritesStore } from "./durood-favorites-store";
import { fastingStore } from "./fasting-store";
import { fridayChecklistStore } from "./friday-checklist-store";
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
import { quranGuideProgressStore } from "./quran-guide-progress-store";
import { quranStore } from "./quran-store";
import { salahGuideProgressStore } from "./salah-guide-progress-store";
import { taharahProgressStore } from "./taharah-progress-store";
import { toursStore } from "./tours-store";
import { trackerStore } from "./tracker-store";

/**
 * Reloads every store that reads a persisted key from disk, so screens already
 * mounted (and marked `isReady`, which makes their `useEnsure*Loaded` hooks skip
 * a reload) reflect data that changed underneath them — after restoring a backup
 * or resetting the account. Kept in one place, next to the stores, so it stays in
 * step as stores are added. Caches (weather) are intentionally omitted; they
 * refetch on demand.
 */
export async function reloadAllStores(): Promise<void> {
  await Promise.all([
    preferencesStore.getState().load(),
    trackerStore.getState().load(),
    locationStore.getState().load(),
    quranStore.getState().load(),
    continueStore.getState().load(),
    duaFavoritesStore.getState().load(),
    duroodFavoritesStore.getState().load(),
    nameFavoritesStore.getState().load(),
    customTasbeehStore.getState().load(),
    customAdhkarStore.getState().load(),
    fastingStore.getState().load(),
    khatmStore.getState().load(),
    hifzStore.getState().load(),
    khushuStore.getState().load(),
    hajjChecklistStore.getState().load(),
    fridayChecklistStore.getState().load(),
    toursStore.getState().load(),
    jannahIntentionsStore.getState().load(),
    jahannamIntentionsStore.getState().load(),
    salahGuideProgressStore.getState().load(),
    battlesProgressStore.getState().load(),
    quranGuideProgressStore.getState().load(),
    taharahProgressStore.getState().load(),
    prophetsProgressStore.getState().load(),
    aqeedahProgressStore.getState().load(),
    lastDayProgressStore.getState().load(),
    learnDuaProgressStore.getState().load(),
  ]);
}
