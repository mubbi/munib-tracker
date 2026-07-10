/**
 * Demo AsyncStorage seed for screenshot captures.
 *
 * Shapes MUST match what repositories/stores actually read/write:
 * - apps/app/src/db/keys.ts + repositories/*
 * - apps/app/src/stores/*
 * - packages/shared defaults/types
 *
 * Do not invent field names — copy from those sources.
 */
import { DB_KEYS, prayerLogKey, THEME_STORAGE_KEYS, zikrProgressKey } from "./db-keys.mjs";

const QAZA_PRAYERS = ["fajr", "dhuhr", "asr", "maghrib", "isha", "witr"];

function isoDate(d = new Date()) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function isoNow() {
  return new Date().toISOString();
}

function pastDate(daysAgo) {
  const d = new Date();
  d.setDate(d.getDate() - daysAgo);
  return isoDate(d);
}

/**
 * Build the full seed map.
 * Values are the JS objects/arrays/strings that `writeJSON` / AsyncStorage would store
 * (theme keys are plain strings; everything else is JSON-serialized by buildDemoStoragePairs).
 */
export function buildDemoStorageEntries({ locale = "en", theme = "dark" } = {}) {
  const today = isoDate();
  const yesterday = pastDate(1);
  const now = isoNow();

  // packages/shared UserPreferences + DEFAULT_USER_PREFERENCES / NotificationPreferences / WeatherPreferences
  const userPreferences = {
    locale,
    translationLocale: locale,
    timeFormat: "24",
    defaultCalendar: "hijri",
    bedtime: "22:30",
    hasCompletedOnboarding: true,
    hapticsEnabled: false,
    cacheAudioLocally: true,
    cacheQuranEditionsLocally: true,
    cacheHadithLocally: true,
    audioVolume: 1,
    notificationPrefs: {
      masterEnabled: true,
      prayer: true,
      sunnahPrayer: true,
      qaza: true,
      morningZikr: true,
      eveningZikr: true,
      beforePrayer: true,
      afterPrayer: true,
      beforeSleep: true,
      afterAzan: false,
      achievements: true,
      playAdhanOnPrayer: false,
      dailyContent: true,
      friday: true,
      reviewReactivationEnabled: false,
    },
    prayerAlerts: {
      fajr: true,
      dhuhr: true,
      asr: false,
      maghrib: true,
      isha: true,
    },
    fontPrefs: {
      global: {},
      arabic: {},
      translation: {},
      transliteration: {},
      titles: {},
    },
    favoriteZikrIds: ["morning-tasbih-hundred", "morning-protection"],
    favoriteZikrOrder: ["morning-tasbih-hundred", "morning-protection"],
    // WeatherPreferences: { effectsEnabled, unit } — NOT enabled/showOnHome/temperatureUnit
    weatherPrefs: {
      effectsEnabled: true,
      unit: "celsius",
    },
    updatedAt: now,
  };

  // apps/app/src/lib/location.ts StoredLocation + DEFAULT_LOCATION
  // MadhabKey = "shafi" | "hanafi" (lowercase)
  const location = {
    latitude: 21.4225,
    longitude: 39.8262,
    label: "Makkah, Saudi Arabia",
    city: "Makkah",
    country: "Saudi Arabia",
    method: "MuslimWorldLeague",
    madhab: "shafi",
    source: "manual",
    updatedAt: now,
    timeZone: "Asia/Riyadh",
  };

  // PrayerLog via PrayerRepository / KeyedCollection
  const prayerLogs = {
    [prayerLogKey("fajr", today)]: {
      id: "demo-prayer-fajr-today",
      prayerId: "fajr",
      date: today,
      status: "completed",
      isJama: true,
      updatedAt: now,
      source: "manual",
    },
    [prayerLogKey("dhuhr", today)]: {
      id: "demo-prayer-dhuhr-today",
      prayerId: "dhuhr",
      date: today,
      status: "completed",
      updatedAt: now,
      source: "manual",
    },
    [prayerLogKey("asr", today)]: {
      id: "demo-prayer-asr-today",
      prayerId: "asr",
      date: today,
      status: "delayed",
      updatedAt: now,
      source: "manual",
    },
    [prayerLogKey("maghrib", today)]: {
      id: "demo-prayer-maghrib-today",
      prayerId: "maghrib",
      date: today,
      status: "pending",
      updatedAt: now,
      source: "manual",
    },
    [prayerLogKey("isha", today)]: {
      id: "demo-prayer-isha-today",
      prayerId: "isha",
      date: today,
      status: "pending",
      updatedAt: now,
      source: "manual",
    },
    [prayerLogKey("fajr", yesterday)]: {
      id: "demo-prayer-fajr-yday",
      prayerId: "fajr",
      date: yesterday,
      status: "completed",
      updatedAt: now,
      source: "manual",
    },
    [prayerLogKey("dhuhr", yesterday)]: {
      id: "demo-prayer-dhuhr-yday",
      prayerId: "dhuhr",
      date: yesterday,
      status: "missed",
      qazaDebtAdded: true,
      updatedAt: now,
      source: "manual",
    },
  };

  // QazaCounter map — QazaRepository.readCounters
  const qazaCounters = Object.fromEntries(
    QAZA_PRAYERS.map((prayerId) => [
      prayerId,
      {
        prayerId,
        remaining: prayerId === "dhuhr" ? 12 : prayerId === "asr" ? 8 : prayerId === "isha" ? 5 : 0,
        completed: prayerId === "fajr" ? 40 : prayerId === "maghrib" ? 22 : 0,
        updatedAt: now,
      },
    ]),
  );

  const qazaSchedule = {
    targets: {
      fajr: 1,
      dhuhr: 2,
      asr: 1,
      maghrib: 1,
      isha: 1,
      witr: 1,
    },
  };

  // Record<date, QazaDailyProgress>
  const qazaDailyProgress = {
    [today]: {
      date: today,
      completed: {
        fajr: 1,
        dhuhr: 1,
      },
    },
  };

  // ZikrProgress — needs id + completed (ZikrRepository.build)
  const zikrProgress = {
    [zikrProgressKey("morning-tasbih-hundred", today)]: {
      id: "demo-zikr-1",
      zikrId: "morning-tasbih-hundred",
      date: today,
      count: 100,
      target: 100,
      completed: true,
      updatedAt: now,
    },
    [zikrProgressKey("morning-protection", today)]: {
      id: "demo-zikr-2",
      zikrId: "morning-protection",
      date: today,
      count: 1,
      target: 3,
      completed: false,
      updatedAt: now,
    },
  };

  // achievements-persistence: string[] of milestone ids (e.g. "salah:1", "streak:2")
  const achievements = ["salah:1", "salah:6", "streak:2", "streak:3", "zikr:1", "consistency:1"];

  // QuranLastRead — { surah, ayah, page?, updatedAt }
  const quranLastRead = {
    surah: 2,
    ayah: 255,
    updatedAt: now,
  };

  // QuranBookmark map keyed by `${surah}:${ayah}`
  const quranBookmarks = {
    "2:255": {
      id: "demo-qbm-1",
      surah: 2,
      ayah: 255,
      createdAt: now,
    },
  };

  // HadithBookmark map keyed by hadithId (`${collection}:${number}`)
  const hadithBookmarks = {
    "nawawi40:1": {
      id: "demo-hbm-1",
      hadithId: "nawawi40:1",
      collection: "nawawi40",
      number: "1",
      createdAt: now,
    },
  };

  // ContinueActivity — lib/continue-activity.ts
  const continueActivity = {
    kind: "quran",
    href: "/quran/2?ayah=255",
    title: "Al-Baqarah",
    subtitle: "The Cow · 2:255",
    preview: "البقرة",
    updatedAt: now,
  };

  // dua favorites: ordered id list (real ids from packages/shared/src/content/duas.ts)
  const duaFavorites = ["quranic-hasanah", "quranic-ilma"];

  // CustomTasbeeh — stores/custom-tasbeeh-store.ts
  const customTasbeeh = {
    "demo-tasbeeh-1": {
      id: "demo-tasbeeh-1",
      title: "SubhanAllah",
      description: "",
      target: 33,
      count: 21,
      createdAt: now,
      updatedAt: now,
    },
  };

  // khatm-store KhatmData
  const khatm = {
    plan: {
      days: 30,
      startDate: pastDate(14),
      unit: "ayah",
    },
    ayahsRead: 520,
    unit: "ayah",
  };

  // tours-store: string[] of tour ids (feature-tours.ts → explore, jannah)
  const toursSeen = ["explore", "jannah"];

  // salah-guide-progress-store: string[] of topic ids (salah-guide.ts)
  const salahGuideProgress = ["introduction", "wudu", "how-to-pray"];

  // quran-guide-progress-store: { completedTopicIds, completedApplyChallengeIds }
  const quranGuideProgress = {
    completedTopicIds: ["introduction", "arabic-letters"],
    completedApplyChallengeIds: [],
  };

  // learn-dua-progress-store: string[] of topic ids
  const learnDuaProgress = ["introduction", "dua-etiquette"];

  // QuranPrefs — DEFAULT_QURAN_PREFS
  const quranPrefs = {
    preferredTranslationIds: ["en-pickthall"],
    preferredReciterDir: "Alafasy_128kbps",
    showTransliteration: true,
    showTranslation: true,
    script: "uthmani",
    readerLayout: "ayah",
  };

  const entries = new Map([
    // migrations.ts DB_VERSION
    [DB_KEYS.version, 1],
    [DB_KEYS.userPreferences, userPreferences],
    [DB_KEYS.location, location],
    [DB_KEYS.prayerLogs, prayerLogs],
    [DB_KEYS.qazaCounters, qazaCounters],
    [DB_KEYS.qazaSchedule, qazaSchedule],
    [DB_KEYS.qazaDailyProgress, qazaDailyProgress],
    [DB_KEYS.qazaRoza, { remaining: 2, completed: 8, updatedAt: now }],
    [DB_KEYS.zikrProgress, zikrProgress],
    [DB_KEYS.achievements, achievements],
    [DB_KEYS.quranLastRead, quranLastRead],
    [DB_KEYS.quranBookmarks, quranBookmarks],
    [DB_KEYS.quranPrefs, quranPrefs],
    [DB_KEYS.hadithBookmarks, hadithBookmarks],
    [DB_KEYS.continueActivity, continueActivity],
    [DB_KEYS.duaFavorites, duaFavorites],
    [DB_KEYS.customTasbeeh, customTasbeeh],
    [DB_KEYS.khatm, khatm],
    [DB_KEYS.toursSeen, toursSeen],
    [DB_KEYS.salahGuideProgress, salahGuideProgress],
    [DB_KEYS.quranGuideProgress, quranGuideProgress],
    [DB_KEYS.learnDuaProgress, learnDuaProgress],
    // packages/theme STORAGE_KEYS — plain strings, not JSON
    [THEME_STORAGE_KEYS.colorMode, theme],
    [THEME_STORAGE_KEYS.accent, "forest"],
  ]);

  return entries;
}

/** Flatten to [[key, storageString], ...] for native injection. */
export function buildDemoStoragePairs(options) {
  const entries = buildDemoStorageEntries(options);
  return [...entries.entries()].map(([key, value]) => [
    key,
    // Theme keys are set via AsyncStorage.setItem(rawString).
    // DB keys go through writeJSON → JSON.stringify.
    typeof value === "string" ? value : JSON.stringify(value),
  ]);
}

/**
 * Text markers per scene for Maestro `extendedWaitUntil`.
 * Values are regexes (Maestro treats `visible` strings as regex). Prefer
 * patterns that match truncated labels (e.g. "Makkah, Saudi Ar…").
 */
export function demoReadyMarkers(sceneId) {
  const common = {
    home: [".*Makkah.*", ".*Fajr.*", ".*Today.?s Goal.*"],
    tracker: [".*Fajr.*", ".*Dhuhr.*"],
    library: [".*Qur.*", ".*Hadith.*"],
    settings: [".*Appearance.*", ".*Notifications.*"],
    qaza: [".*Qaza.*", ".*Fajr.*"],
    quran: [".*Al-Baqarah.*", ".*Surah.*"],
    "quran-surah": [".*Al-Baqarah.*"],
    hadith: [".*Nawawi.*", ".*Riyad.*"],
    "hadith-collection": [".*Nawawi.*"],
    zikr: [".*Morning.*", ".*Evening.*"],
    "zikr-category": [".*Morning.*"],
    dua: [".*Morning.*", ".*Forgiveness.*"],
    duroods: [".*Durood.*"],
    "names-of-allah": [".*Allah.*"],
    statistics: [".*Streak.*", ".*Salah.*"],
    achievements: [".*Achievement.*"],
    calendar: [".*Calendar.*"],
    qibla: [".*Qibla.*"],
    ramadan: [".*Ramadan.*"],
    search: [".*Search.*"],
    profile: [".*Account.*", ".*Profile.*"],
    "settings-appearance": [".*Theme.*", ".*Accent.*"],
    "settings-language": [".*Language.*", ".*English.*"],
    "settings-notifications": [".*Notifications.*"],
    "settings-offline-data": [".*Offline.*", ".*Cache.*"],
    "settings-backup": [".*Backup.*", ".*Export.*"],
    "salah-guide": [".*Salah.*", ".*Wudu.*"],
    jannah: [".*Jannah.*", ".*Paradise.*"],
    "last-day": [".*Day.*", ".*Judgment.*"],
    jahannam: [".*Jahannam.*"],
    battles: [".*Battle.*", ".*Islam.*"],
    "learn-quran": [".*Qur.*", ".*Learn.*"],
    taharah: [".*Taharah.*", ".*Purification.*"],
    prophets: [".*Prophet.*"],
    aqeedah: [".*Aqeedah.*"],
    "learn-dua": [".*Dua.*", ".*Learn.*"],
    travel: [".*Travel.*"],
    hajj: [".*Hajj.*"],
    seerah: [".*Seerah.*"],
    events: [".*Events.*"],
    zakat: [".*Zakat.*"],
    tahajjud: [".*Tahajjud.*"],
    journal: [".*Journal.*"],
    tasbeeh: [".*Tasbeeh.*", ".*Subhan.*"],
    "adhkar-builder": [".*Adhkar.*", ".*Build.*"],
    schedule: [".*Schedule.*", ".*Fajr.*"],
    bookmarks: [".*Bookmark.*"],
    "tracker-status-sheet": [".*Completed.*", ".*Missed.*"],
  };
  return common[sceneId] ?? [".*Munib.*"];
}
