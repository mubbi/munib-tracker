import { Platform } from "react-native";

import { type AppIconPreference, isAppIconPreference } from "./icons";

/**
 * First-run app icon mode per platform (NF-2.23b).
 *
 * - **iOS: seasonal.** The swap is instant and in place; the system shows one
 *   "icon changed" alert at each season boundary. (App Review Guideline 4.6, which
 *   required every icon change to be user-initiated, was withdrawn in June 2024.)
 * - **Android: classic (opt-in).** The swap goes through launcher activity-aliases;
 *   Launcher3-based launchers move the home-screen icon to the new alias, but some
 *   OEM launchers drop it and the user has to re-add it from the app drawer — so
 *   automatic changes wait for the user to turn them on.
 */
export function defaultAppIconPreference(os: string = Platform.OS): AppIconPreference {
  return os === "ios" ? "seasonal" : "classic";
}

/** The stored device value when valid, otherwise the platform default. */
export function resolveAppIconPreference(
  stored: unknown,
  os: string = Platform.OS,
): AppIconPreference {
  return isAppIconPreference(stored) ? stored : defaultAppIconPreference(os);
}
