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

/** AsyncStorage entries for a polished demo state. */
export function buildDemoStorageEntries({ locale = "en", theme = "dark" } = {}) {
  const today = isoDate();
  const yesterday = pastDate(1);
  const now = isoNow();

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
      prayerReminders: true,
      beforePrayer: true,
      afterSalah: true,
      qazaReminder: true,
      weeklyReport: true,
      achievements: true,
      dailyContent: true,
      friday: true,
      playAdhanOnPrayer: false,
      afterAzan: false,
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
    weatherPrefs: {
      enabled: true,
      showOnHome: true,
      showEffects: true,
      temperatureUnit: "celsius",
    },
    updatedAt: now,
  };

  const location = {
    latitude: 21.4225,
    longitude: 39.8262,
    label: "Makkah, Saudi Arabia",
    city: "Makkah",
    country: "Saudi Arabia",
    method: "MuslimWorldLeague",
    madhab: "Shafi",
    source: "manual",
    updatedAt: now,
  };

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

  const qazaCounters = Object.fromEntries(
    QAZA_PRAYERS.map((prayerId) => [
      prayerId,
      {
        prayerId,
        remaining: prayerId === "dhuhr" ? 12 : prayerId === "asr" ? 8 : prayerId === "isha" ? 5 : 0,
        completed: prayerId === "fajr" ? 40 : prayerId === "maghrib" ? 22 : 0,
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

  const qazaDailyProgress = {
    date: today,
    completed: {
      fajr: 1,
      dhuhr: 1,
    },
  };

  const zikrProgress = {
    [zikrProgressKey("morning-tasbih-hundred", today)]: {
      zikrId: "morning-tasbih-hundred",
      date: today,
      count: 3,
      target: 3,
      updatedAt: now,
    },
    [zikrProgressKey("morning-protection", today)]: {
      zikrId: "morning-protection",
      date: today,
      count: 1,
      target: 3,
      updatedAt: now,
    },
  };

  const achievements = {
    unlockedIds: ["streak_3", "salah_week", "zikr_starter", "quran_opener"],
    stats: {
      streak: 5,
      prayersCompleted: 128,
      zikrCompleted: 42,
      perfectDays: 3,
      qazaDebt: 25,
      rozaDebt: 2,
    },
    updatedAt: now,
  };

  const quranLastRead = {
    surahNumber: 2,
    ayahNumber: 255,
    editionId: "en-pickthall",
    updatedAt: now,
  };

  const quranBookmarks = {
    "demo-bm-1": {
      id: "demo-bm-1",
      surahNumber: 2,
      ayahNumber: 255,
      note: "Ayat al-Kursi",
      createdAt: now,
    },
  };

  const hadithBookmarks = {
    "demo-hadith-1": {
      id: "demo-hadith-1",
      collectionId: "nawawi40",
      hadithId: "nawawi-1",
      createdAt: now,
    },
  };

  const continueActivity = {
    route: "/quran/2",
    label: "Al-Baqarah",
    updatedAt: now,
  };

  const duaFavorites = ["quranic-hasanah", "morning-01"];
  const customTasbeeh = {
    "demo-tasbeeh-1": {
      id: "demo-tasbeeh-1",
      title: "SubhanAllah",
      target: 33,
      count: 21,
      updatedAt: now,
    },
  };

  const khatm = {
    startedAt: pastDate(14),
    targetDays: 30,
    completedSurahs: [1, 2, 3, 4, 5],
    updatedAt: now,
  };

  const toursSeen = {
    explore: true,
    jannah: true,
    qaza: true,
    quran: true,
  };

  const salahGuideProgress = {
    completedLessonIds: ["wudu", "before-prayer", "fard-steps"],
    updatedAt: now,
  };

  const entries = new Map([
    [DB_KEYS.version, 1],
    [DB_KEYS.userPreferences, userPreferences],
    [DB_KEYS.location, location],
    [DB_KEYS.prayerLogs, prayerLogs],
    [DB_KEYS.qazaCounters, qazaCounters],
    [DB_KEYS.qazaSchedule, qazaSchedule],
    [DB_KEYS.qazaDailyProgress, qazaDailyProgress],
    [DB_KEYS.qazaRoza, { remaining: 2, completed: 8 }],
    [DB_KEYS.zikrProgress, zikrProgress],
    [DB_KEYS.achievements, achievements],
    [DB_KEYS.quranLastRead, quranLastRead],
    [DB_KEYS.quranBookmarks, quranBookmarks],
    [DB_KEYS.hadithBookmarks, hadithBookmarks],
    [DB_KEYS.continueActivity, continueActivity],
    [DB_KEYS.duaFavorites, duaFavorites],
    [DB_KEYS.customTasbeeh, customTasbeeh],
    [DB_KEYS.khatm, khatm],
    [DB_KEYS.toursSeen, toursSeen],
    [DB_KEYS.salahGuideProgress, salahGuideProgress],
    [DB_KEYS.quranGuideProgress, { completedTopicIds: ["intro", "letters"], updatedAt: now }],
    [DB_KEYS.learnDuaProgress, { completedTopicIds: ["basics"], updatedAt: now }],
    [THEME_STORAGE_KEYS.colorMode, theme],
    [THEME_STORAGE_KEYS.accent, "forest"],
  ]);

  return entries;
}

/** Flatten to [[key, jsonString], ...] for native storage injection. */
export function buildDemoStoragePairs(options) {
  const entries = buildDemoStorageEntries(options);
  return [...entries.entries()].map(([key, value]) => [key, JSON.stringify(value)]);
}

/** Text markers per scene for Maestro extendedWaitUntil / validation. */
export function demoReadyMarkers(sceneId) {
  const common = {
    home: ["Makkah", "Fajr"],
    tracker: ["Fajr", "Dhuhr"],
    library: ["Qur", "Hadith"],
    settings: ["Appearance", "Notifications"],
    qaza: ["Qaza", "Fajr"],
    quran: ["Al-Baqarah", "Surah"],
    "quran-surah": ["Al-Baqarah"],
    hadith: ["Nawawi", "Riyad"],
    "hadith-collection": ["Nawawi"],
    zikr: ["Morning", "Evening"],
    "zikr-category": ["Morning"],
    dua: ["Morning", "Forgiveness"],
    duroods: ["Durood"],
    "names-of-allah": ["Allah"],
    statistics: ["Streak", "Salah"],
    achievements: ["Achievement"],
    calendar: ["Calendar"],
    qibla: ["Qibla"],
    ramadan: ["Ramadan"],
    search: ["Search"],
    profile: ["Account", "Profile"],
    "settings-appearance": ["Theme", "Accent"],
    "settings-language": ["Language", "English"],
    "settings-notifications": ["Notifications"],
    "settings-offline-data": ["Offline", "Cache"],
    "settings-backup": ["Backup", "Export"],
    "salah-guide": ["Salah", "Wudu"],
    jannah: ["Jannah", "Paradise"],
    "last-day": ["Day", "Judgment"],
    jahannam: ["Jahannam"],
    battles: ["Battle", "Islam"],
    "learn-quran": ["Qur", "Learn"],
    taharah: ["Taharah", "Purification"],
    prophets: ["Prophet"],
    aqeedah: ["Aqeedah"],
    "learn-dua": ["Dua", "Learn"],
    travel: ["Travel"],
    hajj: ["Hajj"],
    seerah: ["Seerah"],
    events: ["Events"],
    zakat: ["Zakat"],
    tahajjud: ["Tahajjud"],
    journal: ["Journal"],
    tasbeeh: ["Tasbeeh", "Subhan"],
    "adhkar-builder": ["Adhkar", "Build"],
    schedule: ["Schedule", "Fajr"],
    bookmarks: ["Bookmark"],
    "tracker-status-sheet": ["Completed", "Missed"],
  };
  return common[sceneId] ?? ["Munib"];
}
