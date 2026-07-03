import { useRouter, useSegments } from "expo-router";
import { useEffect } from "react";

import { usePreferences, usePreferencesReady } from "@/stores/preferences-store";

/**
 * Redirects first-time users to onboarding once preferences have loaded.
 * Renders nothing; lives inside the navigator so routing is available.
 */
export function OnboardingGate() {
  const router = useRouter();
  const segments = useSegments();
  const ready = usePreferencesReady();
  const prefs = usePreferences();

  useEffect(() => {
    if (!ready) return;
    const inOnboarding = segments[0] === "(onboarding)";
    if (!prefs.hasCompletedOnboarding && !inOnboarding) {
      router.replace("/intro");
    }
  }, [ready, prefs.hasCompletedOnboarding, segments, router]);

  return null;
}
