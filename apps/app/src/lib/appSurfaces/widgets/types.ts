import i18n from "@/i18n";
import { buildAppUrl } from "@/lib/app-links";
import { WIDGET_DEFAULT_ACCENT, WIDGET_LIGHT, WIDGET_STATUS } from "./widgetTokens.generated";

export type WidgetHexColor = `#${string}`;

export type WidgetThemeSnapshot = {
  isDark: boolean;
  /** True when Settings → Appearance is "System" (Android dual light/dark slots). */
  followsSystem: boolean;
  /** Fill / tint only. Use `primaryText` for accent-coloured text. */
  primary: WidgetHexColor;
  /** Contrast-safe accent for text (= in-app `colors.accentText`). Optional: older snapshots lack it. */
  primaryText?: WidgetHexColor;
  background: WidgetHexColor;
  cardBackground: WidgetHexColor;
  textPrimary: WidgetHexColor;
  textSecondary: WidgetHexColor;
  border: WidgetHexColor;
  success: WidgetHexColor;
  warning: WidgetHexColor;
};

export type WidgetScheduleRow = {
  id: string;
  name: string;
  time: string;
  status: "completed" | "pending" | "active";
  /** Localized status for VoiceOver / TalkBack (not color-only). */
  statusLabel: string;
  /**
   * Adhan instant (epoch ms), 0 when unknown. Watch / Wear surfaces use it to move
   * to the next Salah on their own between phone pushes and to only offer marking
   * a Salah whose time has begun.
   */
  atMs: number;
};

/** One phrase of the after-Salah tasbeeh (text from the bundled adhkar dataset). */
export type WidgetZikrStep = {
  zikrId: string;
  title: string;
  arabic: string;
  transliteration: string;
  target: number;
};

/** The after-Salah tasbeeh sequence (D69) for the watch counters. */
export type WidgetAfterSalahTasbeehSection = {
  title: string;
  deepLink: string;
  steps: WidgetZikrStep[];
};

/** App-locale strings consumed by native surfaces that render outside React. */
export type WidgetSurfaceStrings = {
  prepareSalah: string;
  afterSalahAdhkar: string;
  qibla: string;
  markSalah: string;
  openAppToSync: string;
  setLocationHint: string;
  tasbeeh: string;
  reset: string;
  done: string;
  remaining: string;
  tasbeehUnlimited: string;
  /** Apple Watch / Wear OS companion labels (`watchSurfaceStrings`). */
  today: string;
  overview: string;
  cancel: string;
  markConfirm: string;
  sentToPhone: string;
  willSync: string;
  allDone: string;
  notYet: string;
  staleData: string;
  freeCount: string;
  tapToCount: string;
  sequenceDone: string;
  /** Watch Undo after a mark, and the hint shown beside it (optional natively: the watch falls back to English). */
  undo: string;
  markedUndoHint: string;
  /** Row status labels, so native surfaces can re-derive statuses between syncs. */
  statusCompleted: string;
  statusActive: string;
  statusPending: string;
  /** Siri answers ("Next Salah is {{prayer}} at {{time}}."): `{{…}}` filled natively. */
  voiceNextSalah: string;
  voiceSalahTime: string;
};

export type WidgetSectionBase = {
  title: string;
  summary: string;
  deepLink: string;
  lockScreenLine: string;
  lockScreenDetail: string;
  ctaLabel: string;
  /** Combined accessibility label for the whole card. */
  accessibilityLabel: string;
};

export type WidgetStreakSection = WidgetSectionBase & {
  streakDays: number;
  streakLabel: string;
};

export type WidgetQazaSection = WidgetSectionBase & {
  remaining: number;
  remainingLabel: string;
  todayDone: number;
  todayTarget: number;
  todayLabel: string;
  progressPercent: number;
};

export type WidgetRamadanSection = WidgetSectionBase & {
  isRamadan: boolean;
  dayLabel: string;
  suhoorLabel: string;
  suhoorTime: string;
  iftarLabel: string;
  iftarTime: string;
  countdownLabel: string;
  minutesUntil: number;
  targetTimeMs: number;
};

export type WidgetKhatmSection = WidgetSectionBase & {
  hasPlan: boolean;
  progressLabel: string;
  progressPercent: number;
  todayLabel: string;
  paceLabel: string;
};

export type WidgetHadithSection = WidgetSectionBase & {
  reference: string;
  arabic: string;
  meaning: string;
};

export type WidgetHijriSection = WidgetSectionBase & {
  hijriDate: string;
  gregorianDate: string;
  weekday: string;
};

export type WidgetQiblaSection = WidgetSectionBase & {
  bearingDegrees: number;
  bearingLabel: string;
  location: string;
};

export type WidgetTasbeehSection = WidgetSectionBase & {
  /** True when a custom tasbeeh counter was updated today. */
  hasActivity: boolean;
  dhikrTitle: string;
  count: number;
  target: number;
  countLabel: string;
  progressPercent: number;
};

export type WidgetFridaySection = WidgetSectionBase & {
  /** True when the local calendar day is Friday. */
  isFriday: boolean;
  completed: number;
  total: number;
  progressPercent: number;
  /** Days until the next Jumu'ah (0 when today is Friday). */
  daysUntil: number;
};

/** One timed adhkar set (morning, after each Salah, evening, before sleep) for the adhkar day. */
export type WidgetAdhkarSet = {
  /** `adhkarSetKey` id ("morning", "after_prayer:fajr", …). */
  key: string;
  title: string;
  completed: number;
  total: number;
  /** Localized "{{completed}}/{{total}} done". */
  progressLabel: string;
  /** Window opens (epoch ms). */
  startMs: number;
  /** Window closes (epoch ms); open-ended sets close at the next Fajr. */
  endMs: number;
  /** Localized "Next: {{set}} at {{time}}" for when this set is the next to open. */
  nextLabel: string;
  deepLink: string;
};

/**
 * Daily adhkar sets with their windows. Native surfaces pick the set that is due
 * at render time, so the widget moves from morning → after Dhuhr → evening on
 * its own between app syncs.
 */
export type WidgetAdhkarSection = WidgetSectionBase & {
  sets: WidgetAdhkarSet[];
  dueLabel: string;
  allDoneLabel: string;
};

export type WidgetEventItem = {
  id: string;
  name: string;
  /** Gregorian YYYY-MM-DD. */
  date: string;
  /** Localized absolute date ("20 March 2027"). */
  dateLabel: string;
  /** Localized relative label at sync time ("Today" / "in 3 days"). */
  relativeLabel: string;
  daysUntil: number;
};

export type WidgetEventsSection = WidgetSectionBase & {
  items: WidgetEventItem[];
};

/** Hijri / Gregorian labels for the next calendar day (shown after midnight until the next sync). */
export type WidgetHijriDay = {
  summary: string;
  lockScreenLine: string;
  lockScreenDetail: string;
  accessibilityLabel: string;
  hijriDate: string;
  gregorianDate: string;
  weekday: string;
};

export type WidgetSnapshot = {
  version: 1;
  updatedAt: string;
  /**
   * Local calendar day (YYYY-MM-DD) the schedule was built for. Watch / Wear treat
   * a snapshot from another day as stale and send marks with this date.
   */
  date: string;
  /**
   * Optional freshness line. Prefer recomputing from `updatedAt` on the native
   * side so the label does not freeze between snapshot writes.
   */
  updatedAgoLabel: string;
  locationDenied: boolean;
  /** BCP-47-ish app locale used when this snapshot was built. */
  locale: string;
  /** True when the app UI locale is RTL (ar/ur/fa/ps/ku). */
  isRtl: boolean;
  /** Labels for native-only controls, resolved with the in-app locale. */
  strings: WidgetSurfaceStrings;
  theme: WidgetThemeSnapshot;
  nextPrayer: WidgetSectionBase & {
    prayerId: string;
    prayerName: string;
    prayerTime: string;
    /** Localized "at {{time}}" line for lock-screen / Live Activity context. */
    prayerTimeLabel: string;
    countdownLabel: string;
    /** Localized caption above the live countdown (e.g. "Remaining"). */
    remainingLabel: string;
    minutesUntil: number;
    /** Exact next-prayer instant (epoch ms) for ActivityKit `Text(timerInterval:)`. */
    targetTimeMs: number;
    /** Latest prayer marker that has begun, used by time-aware native surfaces. */
    currentPrayerId: string;
    currentPrayerName: string;
    currentPrayerTime: string;
    currentPrayerTimeLabel: string;
    currentPrayerAtMs: number;
    displayDate: string;
    location: string;
    /** Next-after-next Salah for medium layouts. */
    followingName: string;
    followingTime: string;
    /** Mark-current action label (iOS Button / Android secondary tap). */
    markLabel: string;
  };
  schedule: WidgetSectionBase & {
    rows: WidgetScheduleRow[];
    /** Mark-current action label for the active (next due) row's Mark control. */
    markLabel: string;
    /** Next local day (YYYY-MM-DD) and its obligatory times, so surfaces roll over at midnight. */
    tomorrowDate: string;
    tomorrowRows: WidgetScheduleRow[];
  };
  progress: WidgetSectionBase & {
    progressLabel: string;
    progressPercent: number;
    completed: number;
    total: number;
    markLabel: string;
    /** Localized "0 of 5 …" detail for a new day before the next sync. */
    resetDetail: string;
  };
  streak: WidgetStreakSection;
  qaza: WidgetQazaSection;
  ramadan: WidgetRamadanSection;
  khatm: WidgetKhatmSection;
  dailyHadith: WidgetHadithSection;
  hijriDate: WidgetHijriSection & { tomorrow: WidgetHijriDay | null };
  qibla: WidgetQiblaSection;
  tasbeeh: WidgetTasbeehSection;
  friday: WidgetFridaySection;
  afterSalahTasbeeh: WidgetAfterSalahTasbeehSection;
  adhkar: WidgetAdhkarSection;
  events: WidgetEventsSection;
};

const DEFAULT_THEME: WidgetThemeSnapshot = {
  isDark: false,
  followsSystem: true,
  primary: WIDGET_DEFAULT_ACCENT.light,
  primaryText: WIDGET_DEFAULT_ACCENT.light,
  ...WIDGET_LIGHT,
  success: WIDGET_DEFAULT_ACCENT.light,
  warning: WIDGET_STATUS.warning,
};

type WatchStringKey =
  | "today"
  | "overview"
  | "cancel"
  | "markConfirm"
  | "sentToPhone"
  | "willSync"
  | "allDone"
  | "notYet"
  | "staleData"
  | "freeCount"
  | "tapToCount"
  | "sequenceDone"
  | "undo"
  | "markedUndoHint";

/** Watch / Wear companion labels, shared by the empty and the built snapshot. */
export function watchSurfaceStrings(
  t: (key: string, fallback: string) => string,
): Pick<WidgetSurfaceStrings, WatchStringKey> {
  return {
    today: t("widgets.watch.today", "Today"),
    overview: t("widgets.watch.overview", "Overview"),
    cancel: t("common.cancel", "Cancel"),
    markConfirm: t("widgets.watch.markConfirm", "Mark as prayed?"),
    sentToPhone: t("widgets.watch.sentToPhone", "Sent to your phone"),
    willSync: t("widgets.watch.willSync", "Will sync when your phone is nearby"),
    allDone: t("widgets.watch.allDone", "All Salah done today"),
    notYet: t("widgets.watch.notYet", "Not time yet"),
    staleData: t("widgets.watch.staleData", "Open the app to refresh today's times"),
    freeCount: t("widgets.watch.freeCount", "Free count"),
    tapToCount: t("widgets.watch.tapToCount", "Tap to count"),
    sequenceDone: t("widgets.watch.sequenceDone", "Tasbeeh complete"),
    undo: t("widgets.watch.undo", "Undo"),
    markedUndoHint: t("widgets.watch.markedUndoHint", "Marked — tap Undo to change"),
  };
}

type NativeStringKey =
  | "statusCompleted"
  | "statusActive"
  | "statusPending"
  | "voiceNextSalah"
  | "voiceSalahTime";

/**
 * Row status + Siri answer templates, shared by the empty and the built snapshot.
 * `{{prayer}}` / `{{time}}` stay literal (i18next would fill them) — native code
 * substitutes them when answering.
 */
export function nativeSurfaceStrings(
  t: (key: string, fallback: string, options?: Record<string, unknown>) => string,
): Pick<WidgetSurfaceStrings, NativeStringKey> {
  const keep = { prayer: "{{prayer}}", time: "{{time}}" };
  return {
    statusCompleted: t("prayerStatus.completed", "Completed"),
    statusActive: t("widgets.statusActive", "Next"),
    statusPending: t("prayerStatus.pending", "Pending"),
    voiceNextSalah: t("widgets.voiceNextSalah", "Next Salah is {{prayer}} at {{time}}.", keep),
    voiceSalahTime: t("widgets.voiceSalahTime", "{{prayer}} is at {{time}} today.", keep),
  };
}

function emptySection(
  overrides: Partial<WidgetSectionBase> & Pick<WidgetSectionBase, "title">,
): WidgetSectionBase {
  return {
    summary: "",
    deepLink: buildAppUrl("/"),
    lockScreenLine: overrides.title,
    lockScreenDetail: "",
    ctaLabel: "",
    accessibilityLabel: overrides.title,
    ...overrides,
  };
}

/**
 * Fallback snapshot shown before the app has ever synced a real snapshot to
 * the native widget/lock-screen surfaces. Built as a function (not a module-
 * scope constant) because it resolves user-facing strings via the `i18n`
 * singleton — a top-level constant would call `t()` before i18n finishes
 * initializing and could freeze in the wrong/default locale.
 */
export function emptyWidgetSnapshot(): WidgetSnapshot {
  const openAppToSync = i18n.t("widgets.openAppToSync", "Open the app to sync");
  const placeholderProgress = "0/5";
  return {
    version: 1,
    updatedAt: new Date(0).toISOString(),
    date: "",
    updatedAgoLabel: "",
    locationDenied: false,
    locale: "en",
    isRtl: false,
    strings: {
      prepareSalah: i18n.t("widgets.prepareSalah", "Prepare"),
      afterSalahAdhkar: i18n.t("zikrCat.after_prayer", "After Salah"),
      qibla: i18n.t("widgets.qibla", "Qibla"),
      markSalah: i18n.t("widgets.markSalah", "Mark Salah"),
      openAppToSync,
      setLocationHint: i18n.t("widgets.setLocationHint", "Open the app to set your location"),
      tasbeeh: i18n.t("widgets.tasbeeh", "Tasbeeh"),
      reset: i18n.t("common.reset", "Reset"),
      done: i18n.t("widgets.done", "Done"),
      remaining: i18n.t("widgets.remaining", "Remaining"),
      tasbeehUnlimited: i18n.t("widgets.tasbeehUnlimited", "Unlimited count"),
      ...watchSurfaceStrings((key, fallback) => i18n.t(key, fallback)),
      ...nativeSurfaceStrings((key, fallback) => i18n.t(key, fallback)),
    },
    theme: DEFAULT_THEME,
    nextPrayer: {
      ...emptySection({
        title: i18n.t("widgets.nextPrayer", "Next Salah"),
        deepLink: buildAppUrl("/"),
      }),
      summary: openAppToSync,
      lockScreenDetail: openAppToSync,
      prayerId: "",
      prayerName: "—",
      prayerTime: "—",
      prayerTimeLabel: "—",
      countdownLabel: "—",
      remainingLabel: i18n.t("widgets.remaining", "Remaining"),
      minutesUntil: 15,
      targetTimeMs: 0,
      currentPrayerId: "",
      currentPrayerName: "",
      currentPrayerTime: "",
      currentPrayerTimeLabel: "",
      currentPrayerAtMs: 0,
      displayDate: "",
      location: "",
      followingName: "",
      followingTime: "",
      markLabel: i18n.t("widgets.markSalah", "Mark Salah"),
    },
    schedule: {
      ...emptySection({
        title: i18n.t("widgets.schedule", "Today's schedule"),
        deepLink: buildAppUrl("/tracker"),
      }),
      summary: openAppToSync,
      lockScreenDetail: openAppToSync,
      rows: [],
      markLabel: i18n.t("widgets.markSalah", "Mark Salah"),
      tomorrowDate: "",
      tomorrowRows: [],
    },
    progress: {
      ...emptySection({
        title: i18n.t("widgets.progress", "Today's progress"),
        deepLink: buildAppUrl("/tracker"),
      }),
      summary: placeholderProgress,
      lockScreenDetail: placeholderProgress,
      progressLabel: placeholderProgress,
      progressPercent: 0,
      completed: 0,
      total: 5,
      markLabel: i18n.t("widgets.markSalah", "Mark Salah"),
      resetDetail: placeholderProgress,
    },
    streak: {
      ...emptySection({
        title: i18n.t("widgets.streak", "Salah streak"),
        deepLink: buildAppUrl("/statistics"),
      }),
      summary: openAppToSync,
      lockScreenDetail: openAppToSync,
      streakDays: 0,
      streakLabel: "0",
    },
    qaza: {
      ...emptySection({
        title: i18n.t("widgets.qaza", "Qaza"),
        deepLink: buildAppUrl("/qaza"),
      }),
      summary: openAppToSync,
      lockScreenDetail: openAppToSync,
      remaining: 0,
      remainingLabel: "0",
      todayDone: 0,
      todayTarget: 0,
      todayLabel: "",
      progressPercent: 0,
    },
    ramadan: {
      ...emptySection({
        title: i18n.t("widgets.ramadan", "Ramadan"),
        deepLink: buildAppUrl("/ramadan"),
      }),
      summary: openAppToSync,
      lockScreenDetail: openAppToSync,
      isRamadan: false,
      dayLabel: "",
      suhoorLabel: i18n.t("ramadan.suhoor", "Suhoor ends"),
      suhoorTime: "—",
      iftarLabel: i18n.t("ramadan.iftar", "Iftar"),
      iftarTime: "—",
      countdownLabel: openAppToSync,
      minutesUntil: 0,
      targetTimeMs: 0,
    },
    khatm: {
      ...emptySection({
        title: i18n.t("widgets.khatm", "Khatm plan"),
        deepLink: buildAppUrl("/quran/khatm"),
      }),
      summary: openAppToSync,
      lockScreenDetail: openAppToSync,
      hasPlan: false,
      progressLabel: "0%",
      progressPercent: 0,
      todayLabel: "",
      paceLabel: "",
    },
    dailyHadith: {
      ...emptySection({
        title: i18n.t("widgets.dailyHadith", "Daily hadith"),
        deepLink: buildAppUrl("/hadith/daily"),
      }),
      summary: openAppToSync,
      lockScreenDetail: openAppToSync,
      reference: "",
      arabic: "",
      meaning: openAppToSync,
    },
    hijriDate: {
      ...emptySection({
        title: i18n.t("widgets.hijriDate", "Islamic date"),
        deepLink: buildAppUrl("/calendar"),
      }),
      summary: openAppToSync,
      lockScreenDetail: openAppToSync,
      hijriDate: "—",
      gregorianDate: "—",
      weekday: "",
      tomorrow: null,
    },
    qibla: {
      ...emptySection({
        title: i18n.t("widgets.qibla", "Qibla"),
        deepLink: buildAppUrl("/qibla"),
      }),
      summary: openAppToSync,
      lockScreenDetail: openAppToSync,
      bearingDegrees: 0,
      bearingLabel: "—",
      location: "",
    },
    tasbeeh: {
      ...emptySection({
        title: i18n.t("widgets.tasbeeh", "Tasbeeh"),
        deepLink: buildAppUrl("/tasbeeh/free"),
      }),
      summary: openAppToSync,
      lockScreenDetail: openAppToSync,
      hasActivity: false,
      dhikrTitle: "",
      count: 0,
      target: 0,
      countLabel: "0",
      progressPercent: 0,
    },
    friday: {
      ...emptySection({
        title: i18n.t("widgets.friday", "Jumu'ah"),
        deepLink: buildAppUrl("/friday"),
      }),
      summary: openAppToSync,
      lockScreenDetail: openAppToSync,
      isFriday: false,
      completed: 0,
      total: 0,
      progressPercent: 0,
      daysUntil: 0,
    },
    afterSalahTasbeeh: {
      title: i18n.t("zikrCat.after_prayer", "After Salah"),
      deepLink: buildAppUrl("/tasbeeh/sequence"),
      steps: [],
    },
    adhkar: {
      ...emptySection({
        title: i18n.t("widgets.adhkar", "Adhkar"),
        deepLink: buildAppUrl("/zikr"),
      }),
      summary: openAppToSync,
      lockScreenDetail: openAppToSync,
      sets: [],
      dueLabel: i18n.t("zikr.dueNow", "Due now"),
      allDoneLabel: i18n.t("zikr.caughtUpTitle", "You're all caught up"),
    },
    events: {
      ...emptySection({
        title: i18n.t("events.title", "Islamic events"),
        deepLink: buildAppUrl("/events"),
      }),
      summary: openAppToSync,
      lockScreenDetail: openAppToSync,
      items: [],
    },
  };
}
