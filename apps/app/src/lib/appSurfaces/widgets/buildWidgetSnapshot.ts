import { OBLIGATORY_PRAYERS } from "@munib-tracker/shared/constants";
import { FRIDAY_CHECKLIST } from "@munib-tracker/shared/content/friday-checklist";
import type { AppLocale, ZikrItem } from "@munib-tracker/shared/types";
import { getLocalDateString } from "@munib-tracker/shared/utils";
import { Coordinates, Qibla } from "adhan";
import type { TFunction } from "i18next";

import { adhkarSetKey } from "@/lib/adhkar-history";
import {
  type AdhkarScope,
  adhkarDayFor,
  adhkarWindow,
  DAILY_ADHKAR_SCOPES,
  type PrayerInstants,
  sessionItems,
  sessionProgress,
} from "@/lib/adhkar-session";
import { afterSalahAdhkarHref } from "@/lib/after-salah-adhkar-reminder";
import { buildAppUrl } from "@/lib/app-links";
import { WIDGET_MAX_SCHEDULE_ROWS } from "@/lib/appSurfaces/widgets/constants";
import {
  emptyWidgetSnapshot,
  nativeSurfaceStrings,
  type WidgetAdhkarSection,
  type WidgetAdhkarSet,
  type WidgetAfterSalahTasbeehSection,
  type WidgetEventsSection,
  type WidgetFridaySection,
  type WidgetHexColor,
  type WidgetHijriDay,
  type WidgetScheduleRow,
  type WidgetSnapshot,
  type WidgetSurfaceStrings,
  type WidgetTasbeehSection,
  type WidgetThemeSnapshot,
  type WidgetZikrStep,
  watchSurfaceStrings,
} from "@/lib/appSurfaces/widgets/types";
import { resolveWidgetTheme } from "@/lib/appSurfaces/widgets/widgetTokens";
import { formatDualCalendarDate } from "@/lib/calendar-format";
import { dailyHadith } from "@/lib/daily-hadith";
import { fridayChecklistHref, isFriday } from "@/lib/friday";
import { formatHijriDate } from "@/lib/hijri";
import { isRtlLocale } from "@/lib/i18n/rtl-locale";
import { getUpcomingEvents } from "@/lib/islamic-events";
import {
  type KhatmPace,
  type KhatmPlan,
  khatmPercentComplete,
  khatmTodayProgress,
} from "@/lib/khatm";
import { localeToBcp47 } from "@/lib/locale-bcp47";
import type { StoredLocation } from "@/lib/location";
import { computeLocationPrayerTimes, locationCalcExtras } from "@/lib/location";
import {
  buildDailySchedule,
  currentPrayer,
  formatDuration,
  formatPrayerTime,
  hasValidPrayerTimes,
  nextPrayer,
} from "@/lib/prayer-times";
import { getRamadanInfo } from "@/lib/ramadan";
import { sequenceSteps } from "@/lib/tasbeeh/after-salah-sequence";
import { prayerDayAnchor } from "@/lib/timezone-anchor";
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
  /**
   * After-Salah tasbeeh phrases resolved from the adhkar dataset
   * (`afterSalahTasbeehSteps`). Empty while the corpus is still loading.
   */
  afterSalahSteps?: WidgetZikrStep[];
  /**
   * Zikr counts (`zikrCountKey`) for the current adhkar day (Fajr -> Fajr, see
   * `useAdhkarClock`). Omitted: every set counts as not started.
   */
  adhkarCounts?: Record<string, number>;
  now?: Date;
  t: TFunction;
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
    primaryText: asHex(resolved.primaryText),
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
    ...watchSurfaceStrings((key, fallback) => input.t(key, fallback)),
    ...nativeSurfaceStrings((key, fallback, options) => input.t(key, fallback, options ?? {})),
  };
}

/**
 * The after-Salah tasbeeh (D69, default 33 / 33 / 34 ending) with each phrase's
 * text taken from the bundled adhkar item. Returns [] unless every phrase
 * resolves, so a watch never shows half a sequence.
 */
export function afterSalahTasbeehSteps(
  lookup: (zikrId: string) => ZikrItem | undefined,
): WidgetZikrStep[] {
  const steps: WidgetZikrStep[] = [];
  for (const step of sequenceSteps("takbir34")) {
    const item = lookup(step.zikrId);
    if (!item) return [];
    steps.push({
      zikrId: step.zikrId,
      title: item.title,
      arabic: item.arabic,
      transliteration: item.transliteration ?? "",
      target: step.target,
    });
  }
  return steps;
}

function buildAfterSalahTasbeeh(input: BuildWidgetSnapshotInput): WidgetAfterSalahTasbeehSection {
  return {
    title: input.t("zikrCat.after_prayer", "After Salah"),
    deepLink: buildAppUrl("/tasbeeh/sequence"),
    steps: (input.afterSalahSteps ?? []).filter((step) => step.target > 0),
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

/**
 * Obligatory rows for the day containing `day`. `prayerStatus` / `nextId` are
 * today's; tomorrow's rows pass `{}` / `""` so every row starts pending.
 */
function buildDayRows(
  input: BuildWidgetSnapshotInput,
  day: Date,
  prayerStatus: Record<string, string>,
  nextId: string,
): WidgetScheduleRow[] {
  if (!input.location) return [];
  const coords = { latitude: input.location.latitude, longitude: input.location.longitude };
  const extras = locationCalcExtras(input.location);
  const schedule = buildDailySchedule(
    coords,
    day,
    input.location.method,
    input.location.madhab,
    input.location.timeZone,
    extras,
  );

  return schedule
    .filter((entry) => OBLIGATORY_PRAYERS.includes(entry.id as (typeof OBLIGATORY_PRAYERS)[number]))
    .slice(0, WIDGET_MAX_SCHEDULE_ROWS)
    .map((entry) => {
      const status = prayerStatus[entry.id];
      const rowStatus: WidgetScheduleRow["status"] =
        status === "completed" ? "completed" : entry.id === nextId ? "active" : "pending";
      return {
        id: entry.id,
        name: input.t(`prayers.${entry.id}`, entry.id),
        time: entry.at
          ? formatPrayerTime(entry.at, input.timeFormat, input.location?.timeZone)
          : "—",
        status: rowStatus,
        statusLabel: statusLabel(rowStatus, input.t),
        atMs: entry.at ? entry.at.getTime() : 0,
      };
    });
}

function buildScheduleRows(input: BuildWidgetSnapshotInput, now: Date): WidgetScheduleRow[] {
  if (!input.location) return [];
  const next = nextPrayer(
    { latitude: input.location.latitude, longitude: input.location.longitude },
    now,
    input.location.method,
    input.location.madhab,
    input.location.timeZone,
    locationCalcExtras(input.location),
  );
  return buildDayRows(input, now, input.prayerStatus, next.id);
}

/** `days` calendar days after `date` at the same wall-clock time (DST-safe). */
function shiftDays(date: Date, days: number): Date {
  const next = new Date(date);
  next.setDate(next.getDate() + days);
  return next;
}

function adhkarSetTitle(scope: AdhkarScope, t: BuildWidgetSnapshotInput["t"]): string {
  return scope.categoryId === "after_prayer" && scope.prayer
    ? t("zikrSession.afterPrayerEyebrow", "After {{prayer}}", {
        prayer: t(`prayers.${scope.prayer}`, scope.prayer),
      })
    : t(`zikrCat.${scope.categoryId}`, scope.categoryId);
}

function adhkarSetHref(scope: AdhkarScope): string {
  if (scope.categoryId === "after_prayer" && scope.prayer && scope.prayer !== "witr") {
    return afterSalahAdhkarHref(scope.prayer);
  }
  return scope.prayer
    ? `/zikr/session/${scope.categoryId}?prayer=${scope.prayer}`
    : `/zikr/session/${scope.categoryId}`;
}

/**
 * The set to lead with at `nowMs`: an open, unfinished set (started ones first,
 * then the earliest opened), else the next set still to open. Mirrored natively
 * in `targets/_shared/WidgetTimeResolver.swift`.
 */
export function pickDueAdhkarSet(
  sets: readonly WidgetAdhkarSet[],
  nowMs: number,
): { kind: "due" | "next"; set: WidgetAdhkarSet } | null {
  const open = sets
    .filter((set) => set.startMs <= nowMs && nowMs < set.endMs && set.completed < set.total)
    .sort((a, b) => Number(b.completed > 0) - Number(a.completed > 0) || a.startMs - b.startMs);
  if (open[0]) return { kind: "due", set: open[0] };
  const upcoming = sets
    .filter((set) => set.startMs > nowMs && set.completed < set.total)
    .sort((a, b) => a.startMs - b.startMs);
  return upcoming[0] ? { kind: "next", set: upcoming[0] } : null;
}

/** Lock-screen / summary fields for the adhkar section at `nowMs`. */
export function adhkarHeadline(
  section: Pick<WidgetAdhkarSection, "title" | "sets" | "dueLabel" | "allDoneLabel">,
  nowMs: number,
  fallbackLink: string,
): Pick<
  WidgetAdhkarSection,
  "summary" | "deepLink" | "lockScreenLine" | "lockScreenDetail" | "accessibilityLabel"
> {
  const pick = pickDueAdhkarSet(section.sets, nowMs);
  const line = pick?.set.title ?? section.title;
  const detail = pick
    ? pick.kind === "due"
      ? pick.set.progressLabel
      : pick.set.nextLabel
    : section.allDoneLabel;
  return {
    summary: pick?.kind === "due" ? section.dueLabel : detail,
    deepLink: pick?.kind === "due" ? pick.set.deepLink : fallbackLink,
    lockScreenLine: line,
    lockScreenDetail: detail,
    accessibilityLabel: `${section.title}. ${line}. ${detail}`,
  };
}

/**
 * The adhkar day's timed sets with their windows. The adhkar day runs
 * Fajr -> Fajr, so before today's Fajr the sets are still last night's.
 */
function buildAdhkarSection(input: BuildWidgetSnapshotInput, now: Date): WidgetAdhkarSection {
  const title = input.t("widgets.adhkar", "Adhkar");
  const deepLink = buildAppUrl("/zikr");
  const base = {
    title,
    deepLink,
    ctaLabel: input.t("zikr.title", "Zikr"),
    dueLabel: input.t("zikr.dueNow", "Due now"),
    allDoneLabel: input.t("zikr.caughtUpTitle", "You're all caught up"),
    summary: title,
    lockScreenLine: title,
    lockScreenDetail: "",
    accessibilityLabel: title,
    sets: [] as WidgetAdhkarSet[],
  };
  const location = input.location;
  if (!location) return base;

  let times: PrayerInstants;
  let nextFajrMs: number;
  try {
    const anchor = prayerDayAnchor(now, location.timeZone);
    const todays = computeLocationPrayerTimes(location, anchor);
    if (!hasValidPrayerTimes(todays)) return base;
    const today = getLocalDateString(now);
    if (adhkarDayFor(now, todays.fajr, today) !== today) {
      const previous = computeLocationPrayerTimes(location, shiftDays(anchor, -1));
      if (!hasValidPrayerTimes(previous)) return base;
      times = previous;
      nextFajrMs = todays.fajr.getTime();
    } else {
      times = todays;
      const tomorrow = computeLocationPrayerTimes(location, shiftDays(anchor, 1));
      nextFajrMs = hasValidPrayerTimes(tomorrow)
        ? tomorrow.fajr.getTime()
        : todays.fajr.getTime() + 86_400_000;
    }
  } catch {
    return base;
  }

  const counts = input.adhkarCounts ?? {};
  const sets: WidgetAdhkarSet[] = [];
  for (const scope of DAILY_ADHKAR_SCOPES) {
    const progress = sessionProgress(sessionItems(scope), counts, scope);
    if (progress.total <= 0) continue;
    const window = adhkarWindow(scope, times);
    if (!window.start) continue;
    const setTitle = adhkarSetTitle(scope, input.t);
    sets.push({
      key: adhkarSetKey(scope),
      title: setTitle,
      completed: progress.completed,
      total: progress.total,
      progressLabel: input.t("zikrSession.progressShort", "{{completed}}/{{total}} done", {
        completed: progress.completed,
        total: progress.total,
      }),
      startMs: window.start.getTime(),
      endMs: window.end ? window.end.getTime() : nextFajrMs,
      nextLabel: input.t("zikr.caughtUpNext", "Next: {{set}} at {{time}}", {
        set: setTitle,
        time: formatPrayerTime(window.start, input.timeFormat, location.timeZone),
      }),
      deepLink: buildAppUrl(adhkarSetHref(scope)),
    });
  }

  const section = { ...base, sets };
  return { ...section, ...adhkarHeadline(section, now.getTime(), deepLink) };
}

function buildEventsSection(input: BuildWidgetSnapshotInput, now: Date): WidgetEventsSection {
  const title = input.t("events.title", "Islamic events");
  const timeZone = input.location?.timeZone;
  const today = getLocalDateString(prayerDayAnchor(now, timeZone));
  const bcp47 = localeToBcp47(input.locale);
  const items = getUpcomingEvents(today, 3, timeZone).map((event) => ({
    id: event.id,
    name: input.t(`events.names.${event.id}`, event.id),
    date: event.date,
    dateLabel: new Date(`${event.date}T12:00:00`).toLocaleDateString(bcp47, {
      day: "numeric",
      month: "long",
      year: "numeric",
    }),
    relativeLabel:
      event.daysUntil === 0
        ? input.t("events.today", "Today")
        : input.t("events.inDays", "in {{count}} days", { count: event.daysUntil }),
    daysUntil: event.daysUntil,
  }));
  const first = items[0];
  const detail = first ? `${first.relativeLabel} · ${first.dateLabel}` : "";
  return {
    title,
    summary: first?.name ?? title,
    deepLink: buildAppUrl("/events"),
    lockScreenLine: first?.name ?? title,
    lockScreenDetail: detail,
    ctaLabel: title,
    accessibilityLabel:
      items.map((item) => `${item.name}, ${item.relativeLabel}, ${item.dateLabel}`).join(". ") ||
      title,
    items,
  };
}

function buildHijriDay(input: BuildWidgetSnapshotInput, day: Date): WidgetHijriDay {
  const timeZone = input.location?.timeZone;
  const dual = formatDualCalendarDate(day, input.calendar, input.locale, timeZone);
  const hijri = formatHijriDate(day, input.locale, timeZone);
  const bcp47 = localeToBcp47(input.locale);
  const gregorian = day.toLocaleDateString(bcp47, {
    month: "long",
    day: "numeric",
    year: "numeric",
    timeZone,
  });
  const weekday = day.toLocaleDateString(bcp47, { weekday: "long", timeZone });
  return {
    summary: dual.primary,
    lockScreenLine: dual.primary,
    lockScreenDetail: dual.secondary,
    accessibilityLabel: `${weekday}. ${hijri}. ${gregorian}`,
    hijriDate: hijri,
    gregorianDate: gregorian,
    weekday,
  };
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
  | "progress"
  | "streak"
  | "qaza"
  | "khatm"
  | "dailyHadith"
  | "hijriDate"
  | "tasbeeh"
  | "friday"
  | "afterSalahTasbeeh"
  | "adhkar"
  | "events"
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
      resetDetail: input.t(
        "tracker.summaryLogged",
        "{{completed}} of {{total}} obligatory prayers logged today.",
        { completed: 0, total: input.salahTotal },
      ),
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
      tomorrow: buildHijriDay(input, shiftDays(now, 1)),
    },
    tasbeeh: buildTasbeehSection(input),
    friday: buildFridaySection(input, now),
    afterSalahTasbeeh: buildAfterSalahTasbeeh(input),
    adhkar: buildAdhkarSection(input, now),
    events: buildEventsSection(input, now),
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
      date: getLocalDateString(now),
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
    time: formatDuration(payload.minutesUntil, input.t),
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
        time: formatDuration(ramadanMinutes, input.t),
      })
    : beforeIftar
      ? input.t("ramadan.countdownIftar", "Iftar in {{time}}", {
          time: formatDuration(ramadanMinutes, input.t),
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
    date: getLocalDateString(now),
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
      tomorrowDate: getLocalDateString(shiftDays(now, 1)),
      tomorrowRows: buildDayRows(input, shiftDays(now, 1), {}, ""),
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
