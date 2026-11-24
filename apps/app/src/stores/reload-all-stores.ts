import { partnerGoalStore } from "@/lib/circles/partner-goal-store";
import { reloadVaultStores } from "@/lib/vault/vault-store";
import { aqeedahProgressStore } from "./aqeedah-progress-store";
import { battlesProgressStore } from "./battles-progress-store";
import { coachHistoryStore } from "./coach-history-store";
import { continueStore } from "./continue-store";
import { customAdhkarStore } from "./custom-adhkar-store";
import { customTasbeehStore } from "./custom-tasbeeh-store";
import { devicePreferencesStore } from "./device-preferences-store";
import { dhulHijjahStore } from "./dhul-hijjah-store";
import { duaFavoritesStore } from "./dua-favorites-store";
import { duaRecentsStore } from "./dua-recents-store";
import { duroodFavoritesStore } from "./durood-favorites-store";
import { fastingStore } from "./fasting-store";
import { focusLockStore } from "./focus-lock-store";
import { fridayChecklistStore } from "./friday-checklist-store";
import { hadithStore } from "./hadith-store";
import { hajjChecklistStore } from "./hajj-checklist-store";
import { hifzStore } from "./hifz-store";
import { homeMasjidTimesStore } from "./home-masjid-times-store";
import { jahannamIntentionsStore } from "./jahannam-intentions-store";
import { jannahIntentionsStore } from "./jannah-intentions-store";
import { khatmStore } from "./khatm-store";
import { khushuStore } from "./khushu-store";
import { lastDayProgressStore } from "./last-day-progress-store";
import { learnDuaProgressStore } from "./learn-dua-progress-store";
import { locationStore } from "./location-store";
import { nameFavoritesStore } from "./name-favorites-store";
import { preferencesStore } from "./preferences-store";
import { pronunciationCalibrationStore } from "./pronunciation-calibration-store";
import { prophetsProgressStore } from "./prophets-progress-store";
import { quranCompanionPrefsStore } from "./quran-companion-prefs-store";
import { quranGuideProgressStore } from "./quran-guide-progress-store";
import { quranMemorizationStore } from "./quran-memorization-store";
import { quranNotesStore } from "./quran-notes-store";
import { quranPracticeStore } from "./quran-practice-store";
import { quranReadingLogStore } from "./quran-reading-log-store";
import { quranStore } from "./quran-store";
import { sadaqahStore } from "./sadaqah-store";
import { salahGuideProgressStore } from "./salah-guide-progress-store";
import { sunnahHabitsStore } from "./sunnah-habits-store";
import { taharahProgressStore } from "./taharah-progress-store";
import { tajweedCoachingStore } from "./tajweed-coaching-store";
import { tasbeehVoiceCalibrationStore } from "./tasbeeh-voice-calibration-store";
import { toursStore } from "./tours-store";
import { trackerStore } from "./tracker-store";
import { umrahChecklistStore } from "./umrah-checklist-store";
import { umrahSessionStore } from "./umrah-session-store";
import { voluntaryFastingStore } from "./voluntary-fasting-store";

import { whiteDaysChecklistStore } from "./white-days-checklist-store";

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
    devicePreferencesStore.getState().load(),
    preferencesStore.getState().load(),
    trackerStore.getState().load(),
    locationStore.getState().load(),
    quranStore.getState().load(),
    hadithStore.getState().load(),
    continueStore.getState().load(),
    duaFavoritesStore.getState().load(),
    duaRecentsStore.getState().load(),
    tasbeehVoiceCalibrationStore.getState().load(),
    pronunciationCalibrationStore.getState().load(),
    duroodFavoritesStore.getState().load(),
    nameFavoritesStore.getState().load(),
    customTasbeehStore.getState().load(),
    customAdhkarStore.getState().load(),
    fastingStore.getState().load(),
    khatmStore.getState().load(),
    hifzStore.getState().load(),
    khushuStore.getState().load(),
    hajjChecklistStore.getState().load(),
    umrahChecklistStore.getState().load(),
    umrahSessionStore.getState().load(),
    fridayChecklistStore.getState().load(),
    whiteDaysChecklistStore.getState().load(),
    homeMasjidTimesStore.getState().load(),
    partnerGoalStore.getState().load(),
    focusLockStore.getState().load(),
    sunnahHabitsStore.getState().load(),
    dhulHijjahStore.getState().load(),
    voluntaryFastingStore.getState().load(),
    coachHistoryStore.getState().load(),
    quranReadingLogStore.getState().load(),
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
    sadaqahStore.getState().load(),
    // Qur'an practice stays lazy at launch; after a restore/reset any already-mounted
    // practice screen must see the new data.
    quranCompanionPrefsStore.getState().load(),
    quranPracticeStore.getState().load(),
    quranMemorizationStore.getState().load(),
    tajweedCoachingStore.getState().load(),
    quranNotesStore.getState().load(),
    // Vault documents (muhasabah, debts, wasiyyah, relatives) + vault status —
    // every `createVaultStore` registers itself, so new vault docs need no edit here.
    reloadVaultStores(),
  ]);
}
