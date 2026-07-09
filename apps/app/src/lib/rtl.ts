import type { AppLocale } from "@munib-tracker/shared/types";
import type { SymbolViewProps } from "expo-symbols";
import { useTranslation } from "react-i18next";
import type { TextStyle, ViewStyle } from "react-native";
import { I18nManager, Platform } from "react-native";

import i18n from "@/i18n";
import { isRtlLocale } from "@/lib/i18n/rtl-locale";
import { useStore } from "@/stores/create-store";
import { preferencesStore } from "@/stores/preferences-store";

type IconName = SymbolViewProps["name"];

function resolveLocaleCode(raw: string | undefined): AppLocale | null {
  if (!raw) return null;
  const base = raw.split("-")[0] as AppLocale;
  if (isRtlLocale(base)) return base;
  if (isRtlLocale(raw as AppLocale)) return raw as AppLocale;
  return null;
}

function webIsRtlFromI18n(): boolean | null {
  if (!i18n.isInitialized) return null;
  const code = resolveLocaleCode(i18n.resolvedLanguage ?? i18n.language);
  if (code) return true;
  const raw = i18n.resolvedLanguage ?? i18n.language;
  if (!raw) return null;
  return false;
}

/**
 * True when the UI is currently laid out right-to-left.
 *
 * Native and web resolve RTL through different mechanisms:
 * - **Native:** `I18nManager.isRTL` is the source of truth. A layout flip only
 *   takes effect after preferences hydration calls `changeAppLocale` (see
 *   `preferences-store.ts`), so the value is stable for the session.
 * - **Web:** `react-native-web` hard-codes `I18nManager.isRTL` to `false` and
 *   makes `forceRTL()` a no-op. Layout direction is applied on
 *   `document.documentElement.dir`, but that DOM write does not re-render React.
 *   `changeAppLocale` also fires `i18n.changeLanguage`, which *does* re-render
 *   subscribed trees — often before `dir` is updated. Reading `document.dir`
 *   alone therefore leaves chevrons on the wrong glyph until a full refresh.
 *   Prefer the saved locale and i18n language instead (see {@link useIsRTL} for
 *   components that must react to direction changes).
 *
 * Read this per render (never cache at module load).
 */
export function isRTL(): boolean {
  if (Platform.OS === "web") {
    const prefsLocale = preferencesStore.getState().prefs.locale;
    if (isRtlLocale(prefsLocale)) return true;

    const fromI18n = webIsRtlFromI18n();
    if (fromI18n !== null) return fromI18n;

    if (typeof document !== "undefined") {
      return document.documentElement.dir === "rtl";
    }
    return false;
  }
  return I18nManager.isRTL;
}

/**
 * Reactive RTL flag for direction-encoding glyphs. Subscribes to the saved
 * locale and i18n so tab screens that stay mounted (e.g. Settings) re-render
 * when layout direction changes without a full page reload.
 */
export function useIsRTL(): boolean {
  const locale = useStore(preferencesStore, (s) => s.prefs.locale);
  const { i18n: i18nInstance } = useTranslation();

  if (Platform.OS !== "web") {
    return I18nManager.isRTL;
  }

  if (isRtlLocale(locale)) return true;

  const code = resolveLocaleCode(i18nInstance.resolvedLanguage ?? i18nInstance.language);
  return code != null;
}

/** Disclosure chevron for the current layout direction. */
export function forwardChevronIcon(rtl: boolean): IconName {
  return rtl
    ? { ios: "chevron.left", android: "chevron_left", web: "chevron_left" }
    : { ios: "chevron.right", android: "chevron_right", web: "chevron_right" };
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
  return forwardChevronIcon(isRTL());
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

/** Page turn "next" in Arabic mushaf order (higher page) — always points left. */
export function mushafPageForward(): IconName {
  return { ios: "chevron.left", android: "chevron_left", web: "chevron_left" };
}

/** Page turn "previous" in Arabic mushaf order (lower page) — always points right. */
export function mushafPageBackward(): IconName {
  return { ios: "chevron.right", android: "chevron_right", web: "chevron_right" };
}

/** True when the string contains Arabic script (U+0600–U+06FF). */
export function containsArabicScript(text: string): boolean {
  return /[\u0600-\u06FF]/.test(text);
}

/**
 * Keeps symbol/numeric micro-controls (A−/A+, steppers) in a stable visual order
 * inside RTL screens — without this, flex row mirrors and swaps increase/decrease.
 * Also wrap {@link ThemedSwitch} / native `Switch` controls so the thumb stays on
 * the track (RTL flex + Switch mirroring would otherwise double-flip the knob).
 *
 * Use {@link ltrControlViewProps} on web so react-native-web also receives `dir="ltr"`
 * for its locale context — `writingDirection` alone only sets CSS `direction`.
 */
export const ltrControlStyle = { writingDirection: "ltr" as const } satisfies ViewStyle;

/** View props that lock a micro-control to an LTR coordinate plane. */
export function ltrControlViewProps(): {
  style: typeof ltrControlStyle;
  dir?: "ltr";
} {
  if (Platform.OS === "web") {
    return { style: ltrControlStyle, dir: "ltr" };
  }
  return { style: ltrControlStyle };
}

/**
 * Text style for compact filter/value fields opposite a row label (select triggers,
 * toolbar chips). Truncation ellipses stay on the outer edge; script direction
 * follows the value (Latin reciter names stay LTR in Urdu/Arabic UI).
 */
export function filterValueTextStyle(value: string): TextStyle {
  const rtl = isRTL();
  const scriptRtl = containsArabicScript(value);
  return {
    writingDirection: scriptRtl ? "rtl" : "ltr",
    textAlign: rtl ? "right" : "left",
  };
}
