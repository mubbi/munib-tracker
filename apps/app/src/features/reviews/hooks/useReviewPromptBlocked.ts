import { useSegments } from "expo-router";
import { usePinLock } from "@/features/pin-lock";
import { useAppVersion } from "@/providers/app-version-provider";
import { useAuth } from "@/providers/auth-provider";
import { usePreferences, usePreferencesReady } from "@/stores/preferences-store";

/** True when global modals block the review funnel (onboarding/PIN/sync/update). */
export function useReviewPromptBlocked(): boolean {
  const { isLocked } = usePinLock();
  const ready = usePreferencesReady();
  const prefs = usePreferences();
  const segments = useSegments();
  const { isSyncing } = useAuth();
  const { isHardUpdateBlocking } = useAppVersion();

  const inOnboarding = segments[0] === "(onboarding)";

  return (
    isLocked ||
    !ready ||
    !prefs.hasCompletedOnboarding ||
    inOnboarding ||
    isHardUpdateBlocking ||
    isSyncing
  );
}
