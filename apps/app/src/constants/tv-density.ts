import { Platform } from "react-native";

/**
 * TV density bridge.
 *
 * - Android TV / Fire TV lay out at **960×540 dp** (xhdpi 1080p panels).
 * - Apple TV (tvOS) lays out at **1920×1080 pt** — twice as many layout units
 *   for the same physical screen.
 *
 * Every phone-sized number (Spacing, Radius, type ramp, icon sizes) is authored
 * in Android-TV dp. Multiply by {@link TV_DENSITY} so tvOS renders the same
 * physical size instead of a half-size UI. Evaluated once at module load —
 * `Platform.isTV` never changes at runtime.
 *
 * Phone / tablet / web / Android TV: `1` (no-op).
 */
const isTvRuntime = Boolean((Platform as { isTV?: boolean }).isTV);

export const TV_DENSITY: number = isTvRuntime && Platform.OS === "ios" ? 2 : 1;

/** Scale a dp/pt literal for the current TV density (identity off tvOS). */
export function tvDp(value: number): number {
  return value * TV_DENSITY;
}
