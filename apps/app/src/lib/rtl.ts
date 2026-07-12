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
  // Prefer `language` over `resolvedLanguage`: while a catalog is still loading,
  // i18next keeps resolvedLanguage on the fallback (en) even after changeLanguage.
  for (const raw of [i18n.language, i18n.resolvedLanguage]) {
    if (resolveLocaleCode(raw)) return true;
  }
  const raw = i18n.language ?? i18n.resolvedLanguage;
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

/** Default `textAlign` + `writingDirection` for UI chrome text in the active locale. */
export function uiTextStyle(rtl: boolean = isRTL()): TextStyle {
  return {
    writingDirection: rtl ? "rtl" : "ltr",
    textAlign: rtl ? "right" : "left",
  };
}

/**
 * Reactive UI text direction for components. Prefer this over {@link uiTextStyle}
 * inside render — `isRTL()` alone is invisible to React Compiler, which can keep
 * a stale `textAlign: left` after switching to an RTL locale (flex flips via
 * `dir`, but titles stay LTR-aligned).
 */
export function useUiTextStyle(): TextStyle {
  return uiTextStyle(useIsRTL());
}

/** Skip icons for the given layout direction. */
export function skipPreviousIconFor(rtl: boolean): IconName {
  return rtl
    ? { ios: "forward.fill", android: "skip_next", web: "skip_next" }
    : { ios: "backward.fill", android: "skip_previous", web: "skip_previous" };
}

export function skipNextIconFor(rtl: boolean): IconName {
  return rtl
    ? { ios: "backward.fill", android: "skip_previous", web: "skip_previous" }
    : { ios: "forward.fill", android: "skip_next", web: "skip_next" };
}

/** Skip-to-previous icon — mirrors with reading direction in RTL media controls. */
export function skipPreviousIcon(): IconName {
  return skipPreviousIconFor(isRTL());
}

/** Skip-to-next icon — mirrors with reading direction in RTL media controls. */
export function skipNextIcon(): IconName {
  return skipNextIconFor(isRTL());
}

/** Reactive skip icons — safe under React Compiler when locale direction changes. */
export function useSkipPreviousIcon(): IconName {
  return skipPreviousIconFor(useIsRTL());
}

export function useSkipNextIcon(): IconName {
  return skipNextIconFor(useIsRTL());
}

/** Disclosure chevron for the current layout direction. */
export function forwardChevronIcon(rtl: boolean): IconName {
  return rtl
    ? { ios: "chevron.left", android: "chevron_left", web: "chevron_left" }
    : { ios: "chevron.right", android: "chevron_right", web: "chevron_right" };
}

/** Back / dismiss chevron for the current layout direction. */
export function backChevronIcon(rtl: boolean): IconName {
  return rtl
    ? { ios: "chevron.right", android: "arrow_forward", web: "arrow_forward" }
    : { ios: "chevron.left", android: "arrow_back", web: "arrow_back" };
}

export function arrowForwardIcon(rtl: boolean): IconName {
  return rtl
    ? { ios: "arrow.left", android: "arrow_back", web: "arrow_back" }
    : { ios: "arrow.right", android: "arrow_forward", web: "arrow_forward" };
}

export function backwardChevronIcon(rtl: boolean): IconName {
  return rtl
    ? { ios: "chevron.right", android: "chevron_right", web: "chevron_right" }
    : { ios: "chevron.left", android: "chevron_left", web: "chevron_left" };
}

/**
 * Disclosure / "forward" chevron pointing toward the reading direction — right
 * in LTR, left in RTL. Use for nav rows, list items, and "open" affordances.
 *
 * Concept icons (clock, calendar, mosque, moon, search, …) must NOT be mirrored
 * and are intentionally absent here — only glyphs that encode reading direction
 * belong in this module.
 *
 * In React components prefer {@link useChevronForward} — bare `chevronForward()`
 * reads layout direction without a hook, so React Compiler can keep a stale glyph
 * after an LTR↔RTL locale switch.
 */
export function chevronForward(): IconName {
  return forwardChevronIcon(isRTL());
}

/** Reactive forward chevron — safe under React Compiler when locale direction changes. */
export function useChevronForward(): IconName {
  return forwardChevronIcon(useIsRTL());
}

/**
 * "Back" chevron pointing against the reading direction — left in LTR, right in
 * RTL. Use for back buttons and dismiss-to-previous affordances.
 *
 * In React components prefer {@link useChevronBack}.
 */
export function chevronBack(): IconName {
  return backChevronIcon(isRTL());
}

/** Reactive back chevron — safe under React Compiler when locale direction changes. */
export function useChevronBack(): IconName {
  return backChevronIcon(useIsRTL());
}

/**
 * "Forward" arrow (e.g. an onboarding Next button) — right in LTR, left in RTL.
 *
 * In React components prefer {@link useArrowForward}.
 */
export function arrowForward(): IconName {
  return arrowForwardIcon(isRTL());
}

/** Reactive forward arrow — safe under React Compiler when locale direction changes. */
export function useArrowForward(): IconName {
  return arrowForwardIcon(useIsRTL());
}

/**
 * "Previous" chevron for paginators (e.g. month steppers) — points backward in
 * reading order (left in LTR, right in RTL) but stays a chevron on every
 * platform, unlike {@link chevronBack} which uses platform back-arrows. Pair
 * with {@link useChevronForward} for the "next" control.
 *
 * In React components prefer {@link useChevronBackward}.
 */
export function chevronBackward(): IconName {
  return backwardChevronIcon(isRTL());
}

/** Reactive previous chevron — safe under React Compiler when locale direction changes. */
export function useChevronBackward(): IconName {
  return backwardChevronIcon(useIsRTL());
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
