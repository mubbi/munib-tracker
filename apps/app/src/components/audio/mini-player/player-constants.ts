import type { SymbolViewProps } from "expo-symbols";
import { PLAYER_SEEK_STEP_SECONDS } from "@/lib/audio-seek-step";
import type { LoopMode } from "@/providers/audio-player-provider";

export const LOOP_ICON: Record<LoopMode, SymbolViewProps["name"]> = {
  off: { ios: "repeat", android: "repeat", web: "repeat" },
  all: { ios: "repeat", android: "repeat", web: "repeat" },
  one: { ios: "repeat.1", android: "repeat_one", web: "repeat_one" },
};

/** i18n key for the current loop mode's accessibility label. */
export const LOOP_LABEL_KEY: Record<LoopMode, string> = {
  off: "player.loopOff",
  all: "player.loopAll",
  one: "player.loopOne",
};

export const REPLAY_ICON: SymbolViewProps["name"] = {
  ios: "arrow.counterclockwise",
  android: "replay",
  web: "replay",
};

/**
 * How far the skip buttons and a keyboard/AT increment or decrement nudge the
 * position, in seconds. Shared with the OS lock-screen skip buttons.
 */
export const SEEK_STEP = PLAYER_SEEK_STEP_SECONDS;

/** Window width at which the compact player becomes a single desktop row. */
export const DESKTOP_BAR_MIN_WIDTH = 1024;
/** Matches the widest ScreenLayout content column so the bar lines up with it. */
export const DESKTOP_BAR_MAX_WIDTH = 1320;
/** Desktop: content column of the expanded (full-screen) player. */
export const EXPANDED_DESKTOP_MAX_WIDTH = 760;
