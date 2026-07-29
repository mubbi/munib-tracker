import { OBLIGATORY_PRAYERS } from "@munib-tracker/shared/constants";
import { FRIDAY_CHECKLIST } from "@munib-tracker/shared/content/friday-checklist";
import type { AppLocale } from "@munib-tracker/shared/types";
import { getLocalDateString } from "@munib-tracker/shared/utils";
import { Coordinates, Qibla } from "adhan";

import { buildAppUrl } from "@/lib/app-links";
import { WIDGET_MAX_SCHEDULE_ROWS } from "@/lib/appSurfaces/widgets/constants";
import {
  emptyWidgetSnapshot,
  type WidgetFridaySection,
  type WidgetHexColor,
  type WidgetScheduleRow,
  type WidgetSnapshot,
  type WidgetSurfaceStrings,
  type WidgetTasbeehSection,
  type WidgetThemeSnapshot,
} from "@/lib/appSurfaces/widgets/types";
import { resolveWidgetTheme } from "@/lib/appSurfaces/widgets/widgetTokens";
import { formatDualCalendarDate } from "@/lib/calendar-format";
import { dailyHadith } from "@/lib/daily-hadith";
import { fridayChecklistHref, isFriday } from "@/lib/friday";
import { formatHijriDate } from "@/lib/hijri";
import { isRtlLocale } from "@/lib/i18n/rtl-locale";
import {
  type KhatmPace,
  type KhatmPlan,
  khatmPercentComplete,
  khatmTodayProgress,
} from "@/lib/khatm";
import { localeToBcp47 } from "@/lib/locale-bcp47";
import type { StoredLocation } from "@/lib/location";
import { locationCalcExtras } from "@/lib/location";
import {
  buildDailySchedule,
  currentPrayer,
  formatDuration,
  formatPrayerTime,
  nextPrayer,
} from "@/lib/prayer-times";
import { getRamadanInfo } from "@/lib/ramadan";
import { resolveHadithTranslation } from "@/lib/translation-locale";
import { buildWidgetPayload } from "@/lib/widget-data";

/** Snapshot of the day's most recently active custom tasbeeh counter (or null). */
export type WidgetTasbeehInput = {
  title: string;
  count: number;
  target: number;
} | null;

export type BuildWidgetSnapshotInput = {
  location: StoredLocation | null;
  locationDenied: boolean;
  locale: AppLocale;
  translationLocale: AppLocale;
  calendar: "hijri" | "gregorian";
  timeFormat: "12" | "24";
  theme: { isDark: boolean; primaryColor: string; followsSystem: boolean };
  salahCompleted: number;
  salahTotal: number;
  prayerStatus: Record<string, string>;
  streakDays: number;
  qazaRemaining: number;
  qazaCompletedToday: number;
  qazaTargetToday: number;
  khatmPlan: KhatmPlan | null;
  khatmAyahsRead: number;
  /** Today's most recently updated custom tasbeeh counter, if any. */
  tasbeehToday: WidgetTasbeehInput;
  /** Jumu'ah checklist item ids completed today (`friday-checklist-store`). */
  fridayChecklistDone: Record<string, boolean>;
  now?: Date;
  t: (key: string, fallback: string, options?: Record<string, unknown>) => string;
};

const HADITH_MEANING_MAX = 160;
const HADITH_ARABIC_MAX = 120;
const HADITH_MEANING_SMALL_MAX = 90;

function asHex(color: string): WidgetHexColor {
  return color.startsWith("#") ? (color as WidgetHexColor) : (`#${color}` as WidgetHexColor);
}

function truncate(text: string, max: number): string {
  const trimmed = text.trim().replace(/\s+/g, " ");
  if (trimmed.length <= max) return trimmed;
  return `${trimmed.slice(0, Math.max(0, max - 1)).trimEnd()}…`;
}

function buildThemeSnapshot(input: BuildWidgetSnapshotInput): WidgetThemeSnapshot {
  const resolved = resolveWidgetTheme(input.theme);
  return {
    isDark: resolved.isDark,
    followsSystem: input.theme.followsSystem,
    primary: asHex(resolved.primary),
    background: asHex(resolved.background),
    cardBackground: asHex(resolved.cardBackground),
    textPrimary: asHex(resolved.textPrimary),
    textSecondary: asHex(resolved.textSecondary),
    border: asHex(resolved.border),
    success: asHex(resolved.success),
    warning: asHex(resolved.warning),
  };
}

function buildSurfaceStrings(input: BuildWidgetSnapshotInput): WidgetSurfaceStrings {
  return {
    prepareSalah: input.t("widgets.prepareSalah", "Prepare"),
    afterSalahAdhkar: input.t("zikrCat.after_prayer", "After Salah"),
    qibla: input.t("widgets.qibla", "Qibla"),
    markSalah: input.t("widgets.markSalah", "Mark Salah"),
    openAppToSync: input.t("widgets.openAppToSync", "Open the app to sync"),
    setLocationHint: input.t("widgets.setLocationHint", "Open the app to set your location"),
    tasbeeh: input.t("widgets.tasbeeh", "Tasbeeh"),
    reset: input.t("common.reset", "Reset"),
    done: input.t("widgets.done", "Done"),
    remaining: input.t("widgets.remaining", "Remaining"),
    tasbeehUnlimited: input.t("widgets.tasbeehUnlimited", "Unlimited count"),
  };
}

/** Exported so native/Android can recompute freshness from `updatedAt`. */
export function formatUpdatedAgo(iso: string, t: BuildWidgetSnapshotInput["t"]): string {
  const ms = Date.now() - new Date(iso).getTime();
  if (!Number.isFinite(ms) || ms < 0) return "";
  const minutes = Math.floor(ms / 60_000);
  if (minutes < 1) return t("widgets.updatedJustNow", "Updated just now");
  if (minutes < 60)
    return t("widgets.updatedMinutesAgo", "Updated {{count}}m ago", { count: minutes });
  const hours = Math.floor(minutes / 60);
  return t("widgets.updatedHoursAgo", "Updated {{count}}h ago", { count: hours });
}

function paceLabel(pace: KhatmPace, t: BuildWidgetSnapshotInput["t"]): string {
  switch (pace) {
    case "ahead":
      return t("widgets.khatmPaceAhead", "Ahead");
    case "behind":
      return t("widgets.khatmPaceBehind", "Behind");
    case "done":
      return t("widgets.khatmPaceDone", "Complete");
    default:
      return t("widgets.khatmPaceOnTrack", "On track");
  }
}

function statusLabel(
  status: WidgetScheduleRow["status"],
  t: BuildWidgetSnapshotInput["t"],
): string {
  if (status === "completed") return t("prayerStatus.completed", "Completed");
  if (status === "active") return t("widgets.statusActive", "Next");
  return t("prayerStatus.pending", "Pending");
}

function buildScheduleRows(input: BuildWidgetSnapshotInput, now: Date): WidgetScheduleRow[] {
  if (!input.location) return [];
  const coords = { latitude: input.location.latitude, longitude: input.location.longitude };
  const extras = locationCalcExtras(input.location);
  const schedule = buildDailySchedule(
    coords,
    now,
    input.location.method,
    input.location.madhab,
    input.location.timeZone,
    extras,
  );
  const next = nextPrayer(
    coords,
    now,
    input.location.method,
    input.location.madhab,
    input.location.timeZone,
    extras,
  );

  return schedule
    .filter((entry) => OBLIGATORY_PRAYERS.includes(entry.id as (typeof OBLIGATORY_PRAYERS)[number]))
    .slice(0, WIDGET_MAX_SCHEDULE_ROWS)
    .map((entry) => {
      const status = input.prayerStatus[entry.id];
      const rowStatus: WidgetScheduleRow["status"] =
        status === "completed" ? "completed" : entry.id === next.id ? "active" : "pending";
      return {
        id: entry.id,
        name: input.t(`prayers.${entry.id}`, entry.id),
        time: entry.at
          ? formatPrayerTime(entry.at, input.timeFormat, input.location?.timeZone)
          : "—",
        status: rowStatus,
        statusLabel: statusLabel(rowStatus, input.t),
      };
    });
}

function buildTasbeehSection(input: BuildWidgetSnapshotInput): WidgetTasbeehSection {
  const title = input.t("widgets.tasbeeh", "Tasbeeh");
  const ctaLabel = input.t("actions.tasbeeh", "Tasbeeh");
  const deepLink = buildAppUrl("/tasbeeh/free");

  if (!input.tasbeehToday) {
    const hint = input.t("widgets.tasbeehHint", "Open the app to start counting");
    return {
      title,
      summary: hint,
      deepLink,
      lockScreenLine: title,
      lockScreenDetail: hint,
      ctaLabel,
      accessibilityLabel: `${title}. ${hint}`,
      hasActivity: false,
      dhikrTitle: "",
      count: 0,
      target: 0,
      countLabel: "0",
      progressPercent: 0,
    };
  }

  const { title: dhikrTitle, count, target } = input.tasbeehToday;
  const countLabel = target > 0 ? `${count} / ${target}` : String(count);
  const progressPercent = target > 0 ? Math.min(100, Math.round((count / target) * 100)) : 0;
  const detail =
    target > 0
      ? input.t("widgets.tasbeehRemaining", "{{count}} to go", {
          count: Math.max(0, target - count),
        })
      : input.t("widgets.tasbeehUnlimited", "Unlimited count");

  return {
    title,
    summary: countLabel,
    deepLink,
    lockScreenLine: dhikrTitle || title,
    lockScreenDetail: countLabel,
    ctaLabel,
    accessibilityLabel: `${dhikrTitle}. ${countLabel}. ${detail}`,
    hasActivity: true,
    dhikrTitle,
    count,
    target,
    countLabel,
    progressPercent,
  };
}

function buildFridaySection(input: BuildWidgetSnapshotInput, now: Date): WidgetFridaySection {
  const title = input.t("widgets.friday", "Jumu'ah");
  const ctaLabel = input.t("actions.friday", "Friday & Jumu'ah");
  const total = FRIDAY_CHECKLIST.length;
  const completed = FRIDAY_CHECKLIST.filter((item) => input.fridayChecklistDone[item.id]).length;
  const today = isFriday(now);
  // now.getDay() is never 5 here since `today` already handles Friday.
  const daysUntil = today ? 0 : (5 - now.getDay() + 7) % 7;

  if (today) {
    const allDone = total > 0 && completed === total;
    const progress = input.t("widgets.fridayProgress", "{{completed}}/{{total}} done", {
      completed,
      total,
    });
    const detail = allDone
      ? input.t("widgets.fridayAllDone", "All done — accepted, in sha Allah")
      : progress;
    return {
      title,
      summary: progress,
      deepLink: buildAppUrl(fridayChecklistHref()),
      lockScreenLine: title,
      lockScreenDetail: detail,
      ctaLabel,
      accessibilityLabel: `${title}. ${detail}`,
      isFriday: true,
      completed,
      total,
      progressPercent: total > 0 ? Math.round((completed / total) * 100) : 0,
      daysUntil: 0,
    };
  }

  const countdown = input.t("widgets.fridayCountdown", "Jumu'ah in {{count}} days", {
    count: daysUntil,
  });
  return {
    title,
    summary: countdown,
    deepLink: buildAppUrl("/friday"),
    lockScreenLine: title,
    lockScreenDetail: countdown,
    ctaLabel,
    accessibilityLabel: `${title}. ${countdown}`,
    isFriday: false,
    completed,
    total,
    progressPercent: 0,
    daysUntil,
  };
}

function buildIndependentSections(
  input: BuildWidgetSnapshotInput,
  now: Date,
): Pick<
  WidgetSnapshot,
  "progress" | "streak" | "qaza" | "khatm" | "dailyHadith" | "hijriDate" | "tasbeeh" | "friday"
> {
  const markLabel = input.t("widgets.markSalah", "Mark Salah");
  const progressPercent =
    input.salahTotal > 0 ? Math.round((input.salahCompleted / input.salahTotal) * 100) : 0;
  const progressLabel = `${input.salahCompleted}/${input.salahTotal}`;
  const progressDetail = input.t(
    "tracker.summaryLogged",
    "{{completed}} of {{total}} obligatory prayers logged today.",
    {
      completed: input.salahCompleted,
      total: input.salahTotal,
    },
  );

  const streakSummary = input.t("widgets.streakDays", "{{count}} days", {
    count: input.streakDays,
  });
  const streakHint = input.t("widgets.streakHint", "Keep logging every obligatory Salah");

  const qazaTodayLabel =
    input.qazaTargetToday > 0
      ? input.t("qaza.dailyProgress", "{{done}} / {{target}} today", {
          done: input.qazaCompletedToday,
          target: input.qazaTargetToday,
        })
      : input.t("widgets.qazaNoTarget", "No daily target set");
  const qazaRemainingLabel = input.t("widgets.qazaRemainingCount", "{{count}} remaining", {
    count: input.qazaRemaining,
  });
  const qazaProgressPercent =
    input.qazaTargetToday > 0
      ? Math.min(100, Math.round((input.qazaCompletedToday / input.qazaTargetToday) * 100))
      : 0;

  const todayStr = getLocalDateString(now);
  let khatmHasPlan = false;
  let khatmProgressLabel = "0%";
  let khatmProgressPercent = 0;
  let khatmTodayLabel = input.t("widgets.khatmStartHint", "Start a Khatm plan in the app");
  let khatmPace = "";
  let khatmSummary = khatmTodayLabel;
  if (input.khatmPlan) {
    khatmHasPlan = true;
    const unit = input.khatmPlan.unit ?? "ayah";
    khatmProgressPercent = khatmPercentComplete(input.khatmAyahsRead, unit);
    khatmProgressLabel = `${khatmProgressPercent}%`;
    const today = khatmTodayProgress(input.khatmPlan, input.khatmAyahsRead, todayStr);
    khatmTodayLabel = input.t("tracker.khatm.progress", "{{done}} of {{total}} today", {
      done: today.done,
      total: today.target,
    });
    khatmPace = paceLabel(today.pace, input.t);
    khatmSummary = khatmTodayLabel;
  }

  const hadith = dailyHadith(todayStr);
  const hadithMeaning = hadith
    ? truncate(
        resolveHadithTranslation(hadith, { translationLocale: input.translationLocale }),
        HADITH_MEANING_MAX,
      )
    : input.t("widgets.openAppToSync", "Open the app to sync");
  const hadithArabic = hadith ? truncate(hadith.arabic ?? "", HADITH_ARABIC_MAX) : "";
  const hadithRef = hadith?.reference ?? "";

  const timeZone = input.location?.timeZone;
  const dual = formatDualCalendarDate(now, input.calendar, input.locale, timeZone);
  const hijri = formatHijriDate(now, input.locale, timeZone);
  const gregorian = now.toLocaleDateString(localeToBcp47(input.locale), {
    month: "long",
    day: "numeric",
    year: "numeric",
    timeZone,
  });
  const weekday = now.toLocaleDateString(localeToBcp47(input.locale), {
    weekday: "long",
    timeZone,
  });

  return {
    progress: {
      title: input.t("widgets.progress", "Today's progress"),
      summary: progressLabel,
      deepLink: buildAppUrl("/tracker"),
      lockScreenLine: progressLabel,
      lockScreenDetail: progressDetail,
      ctaLabel: input.t("actions.checklist", "Checklist"),
      accessibilityLabel: `${progressLabel}. ${progressDetail}`,
      progressLabel,
      progressPercent,
      completed: input.salahCompleted,
      total: input.salahTotal,
      markLabel,
    },
    streak: {
      title: input.t("widgets.streak", "Salah streak"),
      summary: streakSummary,
      deepLink: buildAppUrl("/statistics"),
      lockScreenLine: streakSummary,
      lockScreenDetail: streakHint,
      ctaLabel: input.t("actions.stats", "Stats"),
      accessibilityLabel: `${streakSummary}. ${streakHint}`,
      streakDays: input.streakDays,
      streakLabel: String(input.streakDays),
    },
    qaza: {
      title: input.t("widgets.qaza", "Qaza"),
      summary: qazaRemainingLabel,
      deepLink: buildAppUrl("/qaza"),
      lockScreenLine: qazaRemainingLabel,
      lockScreenDetail: qazaTodayLabel,
      ctaLabel: input.t("actions.qaza", "Qaza"),
      accessibilityLabel: `${qazaRemainingLabel}. ${qazaTodayLabel}`,
      remaining: input.qazaRemaining,
      remainingLabel: qazaRemainingLabel,
      todayDone: input.qazaCompletedToday,
      todayTarget: input.qazaTargetToday,
      todayLabel: qazaTodayLabel,
      progressPercent: qazaProgressPercent,
    },
    khatm: {
      title: input.t("widgets.khatm", "Khatm plan"),
      summary: khatmSummary,
      deepLink: buildAppUrl("/quran/khatm"),
      lockScreenLine: khatmHasPlan ? khatmProgressLabel : input.t("widgets.khatm", "Khatm plan"),
      lockScreenDetail: khatmTodayLabel,
      ctaLabel: input.t("actions.quran", "Qur'an"),
      accessibilityLabel: `${khatmProgressLabel}. ${khatmTodayLabel}`,
      hasPlan: khatmHasPlan,
      progressLabel: khatmProgressLabel,
      progressPercent: khatmProgressPercent,
      todayLabel: khatmTodayLabel,
      paceLabel: khatmPace,
    },
    dailyHadith: {
      title: input.t("widgets.dailyHadith", "Daily hadith"),
      summary: hadithRef || truncate(hadithMeaning, HADITH_MEANING_SMALL_MAX),
      deepLink: buildAppUrl("/hadith/daily"),
      lockScreenLine: hadithRef || input.t("widgets.dailyHadith", "Daily hadith"),
      lockScreenDetail: truncate(hadithMeaning, HADITH_MEANING_SMALL_MAX),
      ctaLabel: input.t("actions.hadith", "Hadith"),
      accessibilityLabel: [hadithRef, hadithMeaning].filter(Boolean).join(". "),
      reference: hadithRef,
      arabic: hadithArabic,
      meaning: hadithMeaning,
    },
    hijriDate: {
      title: input.t("widgets.hijriDate", "Islamic date"),
      summary: dual.primary,
      deepLink: buildAppUrl("/calendar"),
      lockScreenLine: dual.primary,
      lockScreenDetail: dual.secondary,
      ctaLabel: input.t("actions.calendar", "Calendar"),
      accessibilityLabel: `${weekday}. ${hijri}. ${gregorian}`,
      hijriDate: hijri,
      gregorianDate: gregorian,
      weekday,
    },
    tasbeeh: buildTasbeehSection(input),
    friday: buildFridaySection(input, now),
  };
}

function locationDeniedLocationSections(
  input: BuildWidgetSnapshotInput,
  empty: WidgetSnapshot,
): Pick<WidgetSnapshot, "nextPrayer" | "schedule" | "ramadan" | "qibla"> {
  const setLocation = input.t("widgets.setLocation", "Set location");
  const hint = input.t("widgets.setLocationHint", "Open the app to set your location");
  const locationLink = buildAppUrl("/location");
  const markLabel = input.t("widgets.markSalah", "Mark Salah");
  return {
    nextPrayer: {
      ...empty.nextPrayer,
      title: input.t("widgets.nextPrayer", "Next Salah"),
      summary: hint,
      lockScreenLine: setLocation,
      lockScreenDetail: hint,
      deepLink: locationLink,
      ctaLabel: setLocation,
      accessibilityLabel: `${setLocation}. ${hint}`,
      prayerName: setLocation,
      countdownLabel: hint,
      remainingLabel: input.t("widgets.remaining", "Remaining"),
      prayerTimeLabel: setLocation,
      location: "",
      followingName: "",
      followingTime: "",
      markLabel,
    },
    schedule: {
      ...empty.schedule,
      title: input.t("widgets.schedule", "Today's schedule"),
      summary: hint,
      lockScreenLine: setLocation,
      lockScreenDetail: hint,
      deepLink: locationLink,
      accessibilityLabel: `${setLocation}. ${hint}`,
      rows: [],
      markLabel,
    },
    ramadan: {
      ...empty.ramadan,
      title: input.t("widgets.ramadan", "Ramadan"),
      summary: hint,
      lockScreenLine: setLocation,
      lockScreenDetail: hint,
      deepLink: locationLink,
      accessibilityLabel: `${setLocation}. ${hint}`,
      suhoorLabel: input.t("ramadan.suhoor", "Suhoor ends"),
      iftarLabel: input.t("ramadan.iftar", "Iftar"),
    },
    qibla: {
      ...empty.qibla,
      title: input.t("widgets.qibla", "Qibla"),
      summary: hint,
      lockScreenLine: setLocation,
      lockScreenDetail: hint,
      deepLink: locationLink,
      accessibilityLabel: `${setLocation}. ${hint}`,
    },
  };
}

/** Builds the JSON snapshot native widgets read from the shared app group. */
export function buildWidgetSnapshot(input: BuildWidgetSnapshotInput): WidgetSnapshot {
  const now = input.now ?? new Date();
  const updatedAt = now.toISOString();
  const empty = emptyWidgetSnapshot();
  const theme = buildThemeSnapshot(input);
  const strings = buildSurfaceStrings(input);
  const independent = buildIndependentSections(input, now);

  if (input.locationDenied || !input.location) {
    const denied = locationDeniedLocationSections(input, empty);
    return {
      ...empty,
      updatedAt,
      updatedAgoLabel: formatUpdatedAgo(updatedAt, input.t),
      locationDenied: true,
      locale: input.locale,
      isRtl: isRtlLocale(input.locale),
      strings,
      theme,
      ...denied,
      ...independent,
    };
  }

  const location = input.location;
  const payload = buildWidgetPayload(
    location,
    input.locale,
    now,
    input.salahCompleted,
    input.calendar,
    input.timeFormat,
  );
  const prayerName = input.t(`prayers.${payload.nextPrayerId}`, payload.nextPrayerId);
  const countdownLabel = input.t("hero.nextIn", "in {{time}}", {
    time: formatDuration(payload.minutesUntil),
  });
  const prayerTimeLabel = input.t("widgets.atTime", "at {{time}}", {
    time: payload.nextPrayerTime,
  });
  const coords = { latitude: location.latitude, longitude: location.longitude };
  const extras = locationCalcExtras(location);
  const current = currentPrayer(
    coords,
    now,
    location.method,
    location.madhab,
    location.timeZone,
    extras,
  );
  const currentIsObligatory = OBLIGATORY_PRAYERS.includes(
    current.id as (typeof OBLIGATORY_PRAYERS)[number],
  );
  const currentPrayerName = currentIsObligatory ? input.t(`prayers.${current.id}`, current.id) : "";
  const currentPrayerTime = currentIsObligatory
    ? formatPrayerTime(current.date, input.timeFormat, location.timeZone)
    : "";
  const currentPrayerTimeLabel = currentIsObligatory
    ? input.t("widgets.atTime", "at {{time}}", { time: currentPrayerTime })
    : "";
  const remainingLabel = input.t("widgets.remaining", "Remaining");
  const markLabel = input.t("widgets.markSalah", "Mark Salah");
  const scheduleRows = buildScheduleRows(input, now);
  const activeIdx = scheduleRows.findIndex((r) => r.status === "active");
  const following = activeIdx >= 0 ? scheduleRows[activeIdx + 1] : undefined;

  const ramadan = getRamadanInfo(location, now);
  const suhoorTime = formatPrayerTime(ramadan.suhoorEnds, input.timeFormat, location.timeZone);
  const iftarTime = formatPrayerTime(ramadan.iftar, input.timeFormat, location.timeZone);
  const beforeIftar = now.getTime() < ramadan.iftar.getTime();
  const beforeSuhoor = now.getTime() < ramadan.suhoorEnds.getTime();
  const ramadanTarget = beforeSuhoor
    ? ramadan.suhoorEnds
    : beforeIftar
      ? ramadan.iftar
      : ramadan.iftar;
  const ramadanMinutes = Math.max(
    0,
    Math.round((ramadanTarget.getTime() - now.getTime()) / 60_000),
  );
  const ramadanCountdown = beforeSuhoor
    ? input.t("ramadan.countdownSuhoor", "Suhoor ends in {{time}}", {
        time: formatDuration(ramadanMinutes),
      })
    : beforeIftar
      ? input.t("ramadan.countdownIftar", "Iftar in {{time}}", {
          time: formatDuration(ramadanMinutes),
        })
      : input.t("ramadan.afterIftar", "Fast complete for today");
  const ramadanDayLabel = ramadan.isRamadan
    ? input.t("ramadan.dayOf", "Day {{day}} of {{total}}", {
        day: ramadan.day,
        total: ramadan.totalDays,
      })
    : input.t("widgets.suhoorIftar", "Suhoor & Iftar");

  const bearing = Qibla(new Coordinates(location.latitude, location.longitude));
  const bearingRounded = Math.round(((bearing % 360) + 360) % 360);
  const bearingLabel = input.t("widgets.qiblaBearing", "{{degrees}}°", {
    degrees: bearingRounded,
  });
  const qiblaHint = input.t("widgets.qiblaHint", "Direction to the Kaaba");

  return {
    version: 1,
    updatedAt,
    updatedAgoLabel: formatUpdatedAgo(updatedAt, input.t),
    locationDenied: false,
    locale: input.locale,
    isRtl: isRtlLocale(input.locale),
    strings,
    theme,
    nextPrayer: {
      title: input.t("widgets.nextPrayer", "Next Salah"),
      summary: payload.displayDate,
      deepLink: buildAppUrl("/"),
      lockScreenLine: `${prayerName} · ${payload.nextPrayerTime}`,
      lockScreenDetail: countdownLabel,
      ctaLabel: input.t("actions.checklist", "Checklist"),
      accessibilityLabel: `${prayerName}, ${payload.nextPrayerTime}, ${countdownLabel}`,
      prayerId: payload.nextPrayerId,
      prayerName,
      prayerTime: payload.nextPrayerTime,
      prayerTimeLabel,
      countdownLabel,
      remainingLabel,
      minutesUntil: payload.minutesUntil,
      targetTimeMs: payload.nextPrayerAtMs,
      currentPrayerId: currentIsObligatory ? current.id : "",
      currentPrayerName,
      currentPrayerTime,
      currentPrayerTimeLabel,
      currentPrayerAtMs: currentIsObligatory ? current.date.getTime() : 0,
      displayDate: payload.displayDate,
      location: payload.location,
      followingName: following?.name ?? "",
      followingTime: following?.time ?? "",
      markLabel,
    },
    schedule: {
      title: input.t("widgets.schedule", "Today's schedule"),
      summary: payload.location,
      deepLink: buildAppUrl("/tracker"),
      lockScreenLine: scheduleRows.find((r) => r.status === "active")?.name ?? prayerName,
      lockScreenDetail:
        scheduleRows.find((r) => r.status === "active")?.time ?? payload.nextPrayerTime,
      ctaLabel: input.t("actions.checklist", "Checklist"),
      accessibilityLabel: scheduleRows
        .map((r) => `${r.name} ${r.time}, ${r.statusLabel}`)
        .join(". "),
      rows: scheduleRows,
      markLabel,
    },
    ...independent,
    ramadan: {
      title: ramadan.isRamadan
        ? input.t("widgets.ramadan", "Ramadan")
        : input.t("widgets.suhoorIftar", "Suhoor & Iftar"),
      summary: ramadanDayLabel,
      deepLink: buildAppUrl("/ramadan"),
      lockScreenLine: beforeIftar
        ? `${input.t("ramadan.iftar", "Iftar")} · ${iftarTime}`
        : `${input.t("ramadan.suhoor", "Suhoor ends")} · ${suhoorTime}`,
      lockScreenDetail: ramadanCountdown,
      ctaLabel: input.t("actions.ramadan", "Ramadan"),
      accessibilityLabel: `${ramadanDayLabel}. ${input.t("ramadan.suhoor", "Suhoor ends")} ${suhoorTime}. ${input.t("ramadan.iftar", "Iftar")} ${iftarTime}. ${ramadanCountdown}`,
      isRamadan: ramadan.isRamadan,
      dayLabel: ramadanDayLabel,
      suhoorLabel: input.t("ramadan.suhoor", "Suhoor ends"),
      suhoorTime,
      iftarLabel: input.t("ramadan.iftar", "Iftar"),
      iftarTime,
      countdownLabel: ramadanCountdown,
      minutesUntil: ramadanMinutes,
      targetTimeMs: ramadanTarget.getTime(),
    },
    qibla: {
      title: input.t("widgets.qibla", "Qibla"),
      summary: location.label,
      deepLink: buildAppUrl("/qibla"),
      lockScreenLine: bearingLabel,
      lockScreenDetail: qiblaHint,
      ctaLabel: input.t("actions.qibla", "Qibla"),
      accessibilityLabel: `${bearingLabel}. ${qiblaHint}`,
      bearingDegrees: bearingRounded,
      bearingLabel,
      location: location.label,
    },
  };
}
