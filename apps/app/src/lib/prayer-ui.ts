import type { PrayerId, PrayerStatus } from "@munib-tracker/shared/types";
import type { SymbolViewProps } from "expo-symbols";

export type StatusTone = "success" | "danger" | "warning" | "info" | "muted";

type SymbolName = SymbolViewProps["name"];

/** Selectable statuses (excludes the implicit "pending" default). */
export const PRAYER_STATUS_ORDER: PrayerStatus[] = ["completed", "missed", "delayed", "qaza"];

export const PRAYER_STATUS_META: Record<
  PrayerStatus,
  { label: string; icon: SymbolName; tone: StatusTone }
> = {
  pending: {
    label: "Pending",
    icon: { ios: "circle", android: "radio_button_unchecked", web: "radio_button_unchecked" },
    tone: "muted",
  },
  completed: {
    label: "Completed",
    icon: { ios: "checkmark.circle.fill", android: "check_circle", web: "check_circle" },
    tone: "success",
  },
  missed: {
    label: "Missed",
    icon: { ios: "xmark.circle.fill", android: "cancel", web: "cancel" },
    tone: "danger",
  },
  delayed: {
    label: "Delayed",
    icon: { ios: "clock.fill", android: "schedule", web: "schedule" },
    tone: "warning",
  },
  qaza: {
    label: "Qaza",
    icon: { ios: "arrow.clockwise.circle.fill", android: "history", web: "history" },
    tone: "info",
  },
};

export const PRAYER_ICONS: Record<PrayerId, SymbolName> = {
  fajr: { ios: "sunrise.fill", android: "wb_twilight", web: "wb_twilight" },
  dhuhr: { ios: "sun.max.fill", android: "light_mode", web: "light_mode" },
  asr: { ios: "cloud.sun.fill", android: "wb_cloudy", web: "wb_cloudy" },
  maghrib: { ios: "sunset.fill", android: "wb_twilight", web: "wb_twilight" },
  isha: { ios: "moon.stars.fill", android: "nightlight", web: "nightlight" },
  witr: { ios: "moon.fill", android: "dark_mode", web: "dark_mode" },
  tahajjud: { ios: "moon.zzz.fill", android: "bedtime", web: "bedtime" },
  ishraq: { ios: "sun.horizon.fill", android: "wb_sunny", web: "wb_sunny" },
  duha: { ios: "sun.max.fill", android: "light_mode", web: "light_mode" },
  tahiyyatul_masjid: { ios: "building.columns.fill", android: "mosque", web: "mosque" },
  hajat_istikhara: {
    ios: "hands.and.sparkles.fill",
    android: "volunteer_activism",
    web: "volunteer_activism",
  },
};

/** Approximate times shown as hints only (real prayer times land in Phase 9). */
export const PRAYER_TIME_HINTS: Partial<Record<PrayerId, string>> = {
  fajr: "4:50",
  dhuhr: "11:48",
  asr: "15:05",
  maghrib: "17:06",
  isha: "18:28",
  witr: "20:00",
};
