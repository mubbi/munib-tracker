import { useRouter, useSegments } from "expo-router";
import { useEffect } from "react";
import { Platform } from "react-native";

import { isIndexingBot } from "@/lib/seo/is-indexing-bot";
import { usePreferences, usePreferencesReady } from "@/stores/preferences-store";

/**
 * Redirects first-time users to onboarding once preferences have loaded.
 * Renders nothing; lives inside the navigator so routing is available.
 *
 * On web, search crawlers and Lighthouse keep the requested URL so they do
 * not inherit `/intro`'s `noindex` robots meta (which fails "Indexing allowed?").
 */
export function OnboardingGate() {
  const router = useRouter();
  const segments = useSegments();
  const ready = usePreferencesReady();
  const prefs = usePreferences();

  useEffect(() => {
    if (!ready) return;
    if (Platform.OS === "web" && isIndexingBot()) return;
    const inOnboarding = segments[0] === "(onboarding)";
    if (!prefs.hasCompletedOnboarding && !inOnboarding) {
      router.replace("/intro");
    }
  }, [ready, prefs.hasCompletedOnboarding, segments, router]);

  return null;
}
