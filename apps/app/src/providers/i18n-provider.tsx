import { type ReactNode, useEffect } from "react";
import { I18nManager, Platform } from "react-native";

import i18n from "@/i18n";
import { usePreferences } from "@/stores/preferences-store";

/**
 * Keeps the active i18n language in sync with the user's preference and toggles
 * right-to-left layout for Arabic. A full RTL flip only takes effect after the
 * app reloads, so when the direction actually changes we attempt an atomic
 * reload via `expo-updates` (optional dependency). If it's unavailable — dev
 * builds, Expo Go, or web — we fall back to logging that a restart is required
 * rather than leaving the layout in a half-flipped state or crashing.
 */
/** Locales that read right-to-left and require an `I18nManager` layout flip. */
const RTL_LOCALES = new Set(["ar", "ur"]);

const RESTART_HINT =
  "[i18n] Layout direction changed. Restart the app to apply the right-to-left flip.";

function applyWebLayoutDirection(shouldRTL: boolean, locale: string): void {
  if (Platform.OS !== "web" || typeof document === "undefined") return;
  document.documentElement.dir = shouldRTL ? "rtl" : "ltr";
  document.documentElement.lang = locale;
}

async function reloadForRtlFlip(): Promise<void> {
  // Web applies direction via `document.dir` immediately — no reload or warning.
  if (Platform.OS === "web") return;

  try {
    // Optional dependency: not installed in every build. The specifier is held
    // in a variable so bundlers/type-checkers don't hard-require the module;
    // if it's absent the import rejects and we fall back to the restart hint.
    const moduleName = "expo-updates";
    const Updates = (await import(/* @vite-ignore */ moduleName).catch(() => null)) as {
      reloadAsync?: () => Promise<void>;
    } | null;
    if (Updates && typeof Updates.reloadAsync === "function") {
      await Updates.reloadAsync();
      return;
    }
    console.warn(RESTART_HINT);
  } catch {
    // expo-updates missing (dev/Expo Go/web) or reload unsupported — no-op fallback.
    console.warn(RESTART_HINT);
  }
}

export function I18nProvider({ children }: { children: ReactNode }) {
  const { locale } = usePreferences();

  useEffect(() => {
    if (i18n.language !== locale) void i18n.changeLanguage(locale);
    const shouldRTL = RTL_LOCALES.has(locale);
    applyWebLayoutDirection(shouldRTL, locale);
    if (I18nManager.isRTL !== shouldRTL) {
      I18nManager.allowRTL(shouldRTL);
      I18nManager.forceRTL(shouldRTL);
      // Native flip only applies after a reload; do it atomically so the UI
      // never renders half-mirrored. Web uses `document.dir` above.
      void reloadForRtlFlip();
    }
  }, [locale]);

  return <>{children}</>;
}
