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
    countdownLabel: string;
    minutesUntil: number;
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

export const EMPTY_WIDGET_SNAPSHOT: WidgetSnapshot = {
  version: 1,
  updatedAt: new Date(0).toISOString(),
  updatedAgoLabel: "",
  locationDenied: false,
  theme: DEFAULT_THEME,
  nextPrayer: {
    ...emptySection({ title: "Next prayer", deepLink: buildAppUrl("/") }),
    summary: "Open the app to sync",
    lockScreenDetail: "Open the app to sync",
    prayerId: "",
    prayerName: "—",
    prayerTime: "—",
    countdownLabel: "—",
    minutesUntil: 15,
    displayDate: "",
    location: "",
  },
  schedule: {
    ...emptySection({ title: "Today's schedule", deepLink: buildAppUrl("/tracker") }),
    summary: "Open the app to sync",
    lockScreenDetail: "Open the app to sync",
    rows: [],
  },
  progress: {
    ...emptySection({ title: "Today's progress", deepLink: buildAppUrl("/tracker") }),
    summary: "0/5",
    lockScreenDetail: "0/5",
    progressLabel: "0/5",
    progressPercent: 0,
    completed: 0,
    total: 5,
  },
};
