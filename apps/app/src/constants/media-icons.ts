import type { SymbolViewProps } from "expo-symbols";

type SymbolName = SymbolViewProps["name"];

/** Circled play — matches Qur'an ayah / surah play controls. */
export const PLAY_CIRCLE_ICON = {
  ios: "play.circle.fill",
  android: "play_circle",
  web: "play_circle",
} as const satisfies SymbolName;

/** Circled pause — matches Qur'an ayah pause control. */
export const PAUSE_CIRCLE_ICON = {
  ios: "pause.circle.fill",
  android: "pause_circle",
  web: "pause_circle",
} as const satisfies SymbolName;
