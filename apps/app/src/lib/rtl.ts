import type { SymbolViewProps } from "expo-symbols";
import { I18nManager, Platform } from "react-native";

type IconName = SymbolViewProps["name"];

/**
 * True when the UI is currently laid out right-to-left.
 *
 * Native and web resolve RTL through different mechanisms:
 * - **Native:** `I18nManager.isRTL` is the source of truth. A layout flip only
 *   takes effect after an app reload (see `i18n-provider.tsx`), so the value is
 *   stable for the session.
 * - **Web:** `react-native-web` hard-codes `I18nManager.isRTL` to `false` and
 *   makes `forceRTL()` a no-op. The real direction lives on
 *   `document.documentElement.dir`, which the i18n provider toggles for Arabic
 *   and Urdu. We must read that instead, otherwise glyphs point the wrong way
 *   while the CSS flex layout is already flipped.
 *
 * Read this per render (never cache at module load) — on web the direction is
 * applied in an effect after the first paint, and a freshly navigated screen
 * must reflect the current `dir`.
 */
export function isRTL(): boolean {
  if (Platform.OS === "web" && typeof document !== "undefined") {
    return document.documentElement.dir === "rtl";
  }
  return I18nManager.isRTL;
}

/**
 * Disclosure / "forward" chevron pointing toward the reading direction — right
 * in LTR, left in RTL. Use for nav rows, list items, and "open" affordances.
 *
 * Concept icons (clock, calendar, mosque, moon, search, …) must NOT be mirrored
 * and are intentionally absent here — only glyphs that encode reading direction
 * belong in this module.
 */
export function chevronForward(): IconName {
  return isRTL()
    ? { ios: "chevron.left", android: "chevron_left", web: "chevron_left" }
    : { ios: "chevron.right", android: "chevron_right", web: "chevron_right" };
}

/**
 * "Back" chevron pointing against the reading direction — left in LTR, right in
 * RTL. Use for back buttons and dismiss-to-previous affordances.
 */
export function chevronBack(): IconName {
  return isRTL()
    ? { ios: "chevron.right", android: "arrow_forward", web: "arrow_forward" }
    : { ios: "chevron.left", android: "arrow_back", web: "arrow_back" };
}

/**
 * "Forward" arrow (e.g. an onboarding Next button) — right in LTR, left in RTL.
 */
export function arrowForward(): IconName {
  return isRTL()
    ? { ios: "arrow.left", android: "arrow_back", web: "arrow_back" }
    : { ios: "arrow.right", android: "arrow_forward", web: "arrow_forward" };
}

/**
 * "Previous" chevron for paginators (e.g. month steppers) — points backward in
 * reading order (left in LTR, right in RTL) but stays a chevron on every
 * platform, unlike {@link chevronBack} which uses platform back-arrows. Pair
 * with {@link chevronForward} for the "next" control.
 */
export function chevronBackward(): IconName {
  return isRTL()
    ? { ios: "chevron.right", android: "chevron_right", web: "chevron_right" }
    : { ios: "chevron.left", android: "chevron_left", web: "chevron_left" };
}

/** True when the string contains Arabic script (U+0600–U+06FF). */
export function containsArabicScript(text: string): boolean {
  return /[\u0600-\u06FF]/.test(text);
}
