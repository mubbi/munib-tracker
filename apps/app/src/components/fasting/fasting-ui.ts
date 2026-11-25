import type { FastDayRuling, VoluntaryFastStatus } from "@munib-tracker/shared/types";
import type { SymbolViewProps } from "expo-symbols";

import type { StatusKey } from "@/constants/theme";

/** Ruling → semantic status tone (colours come from `tokens.status`, never hardcoded). */
export const RULING_TONE: Record<FastDayRuling, StatusKey | "muted"> = {
  recommended: "success",
  permitted: "muted",
  disliked: "warning",
  prohibited: "danger",
};

export const RULING_ICON: Record<FastDayRuling, SymbolViewProps["name"]> = {
  recommended: { ios: "star.circle.fill", android: "stars", web: "stars" },
  permitted: { ios: "circle", android: "radio_button_unchecked", web: "radio_button_unchecked" },
  disliked: { ios: "exclamationmark.circle", android: "error_outline", web: "error_outline" },
  prohibited: { ios: "nosign", android: "block", web: "block" },
};

export const STATUS_ICON: Record<VoluntaryFastStatus, SymbolViewProps["name"]> = {
  intended: { ios: "moon.stars", android: "bedtime", web: "bedtime" },
  fasted: { ios: "checkmark.circle.fill", android: "check_circle", web: "check_circle" },
  broken: { ios: "xmark.circle", android: "cancel", web: "cancel" },
};

export const STATUS_TONE: Record<VoluntaryFastStatus, StatusKey> = {
  intended: "info",
  fasted: "success",
  broken: "warning",
};

/** Hub icon (library / tours / search). */
export const FASTING_ICON: SymbolViewProps["name"] = {
  ios: "moon.haze.fill",
  android: "nights_stay",
  web: "nights_stay",
};

/** Calendar day markers: glyph + tone, drawn on the month grid and in its legend (tones follow the ruling palette above). */
export type MonthGridMarker = "missed" | "recommended" | "prohibited";

export const MARKER_GLYPH: Record<
  MonthGridMarker,
  { icon: SymbolViewProps["name"]; tone: StatusKey }
> = {
  missed: { icon: { ios: "circle.fill", android: "circle", web: "circle" }, tone: "danger" },
  recommended: {
    icon: { ios: "star.fill", android: "star", web: "star" },
    tone: RULING_TONE.recommended === "muted" ? "success" : RULING_TONE.recommended,
  },
  prohibited: {
    icon: { ios: "nosign", android: "block", web: "block" },
    tone: RULING_TONE.prohibited === "muted" ? "danger" : RULING_TONE.prohibited,
  },
};
