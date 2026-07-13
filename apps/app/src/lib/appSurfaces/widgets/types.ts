import i18n from "@/i18n";
import { buildAppUrl } from "@/lib/app-links";

export type WidgetHexColor = `#${string}`;

export type WidgetThemeSnapshot = {
  isDark: boolean;
  primary: WidgetHexColor;
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
};

export type WidgetSectionBase = {
  title: string;
  summary: string;
  deepLink: string;
  lockScreenLine: string;
  lockScreenDetail: string;
  ctaLabel: string;
};

export type WidgetSnapshot = {
  version: 1;
  updatedAt: string;
  updatedAgoLabel: string;
  locationDenied: boolean;
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
    displayDate: string;
    location: string;
  };
  schedule: WidgetSectionBase & {
    rows: WidgetScheduleRow[];
  };
  progress: WidgetSectionBase & {
    progressLabel: string;
    progressPercent: number;
    completed: number;
    total: number;
  };
};

const DEFAULT_THEME: WidgetThemeSnapshot = {
  isDark: false,
  primary: "#059669",
  background: "#F5F0E6",
  cardBackground: "#FFFCF7",
  textPrimary: "#152921",
  textSecondary: "#5C7268",
  border: "#C9C0AE",
  success: "#059669",
  warning: "#D97706",
};

function emptySection(
  overrides: Partial<WidgetSectionBase> & Pick<WidgetSectionBase, "title">,
): WidgetSectionBase {
  return {
    summary: "",
    deepLink: buildAppUrl("/"),
    lockScreenLine: overrides.title,
    lockScreenDetail: "",
    ctaLabel: "",
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
    updatedAgoLabel: "",
    locationDenied: false,
    theme: DEFAULT_THEME,
    nextPrayer: {
      ...emptySection({
        title: i18n.t("widgets.nextPrayer", "Next prayer"),
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
      displayDate: "",
      location: "",
    },
    schedule: {
      ...emptySection({
        title: i18n.t("widgets.schedule", "Today's schedule"),
        deepLink: buildAppUrl("/tracker"),
      }),
      summary: openAppToSync,
      lockScreenDetail: openAppToSync,
      rows: [],
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
    },
  };
}
