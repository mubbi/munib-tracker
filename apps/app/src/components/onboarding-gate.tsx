import { Redirect, useSegments } from "expo-router";
import { Platform } from "react-native";

import { isIndexingBot } from "@/lib/seo/is-indexing-bot";
import { usePreferences, usePreferencesReady } from "@/stores/preferences-store";

/**
 * Keeps first-time users out of deep-linked app routes until onboarding finishes.
 * Default `/` is already steered to intro via Stack.Protected in AppStack; this
 * catches other URLs (e.g. /quran) that remain registered outside that guard.
 *
 * On web, search crawlers and Lighthouse keep the requested URL so they do
 * not inherit `/intro`'s `noindex` robots meta (which fails "Indexing allowed?").
 */
export function OnboardingGate() {
  const segments = useSegments();
  const ready = usePreferencesReady();
  const prefs = usePreferences();

  if (!ready) return null;
  if (Platform.OS === "web" && isIndexingBot()) return null;
  const inOnboarding = segments[0] === "(onboarding)";
  if (!prefs.hasCompletedOnboarding && !inOnboarding) {
    return <Redirect href="/intro" />;
  }

  return null;
}
