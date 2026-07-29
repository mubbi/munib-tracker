import {
  createContext,
  type ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { registerReviewEngagement } from "@/features/reviews/lib/reviewEngagementBridge";
import {
  type ReviewPromptRuntime,
  recordMeaningfulInteraction,
  recordReviewError,
} from "@/features/reviews/lib/reviewGating";
import type { ReviewInteractionKind } from "@/features/reviews/lib/reviewInteractionKinds";
import { readReviewGating, writeReviewGating } from "@/features/reviews/lib/reviewStorage";
import { readPersistedAchievementIds } from "@/lib/achievements-persistence";
import { useAuth } from "@/providers/auth-provider";
import { useStore } from "@/stores/create-store";
import { usePreferences, usePreferencesReady } from "@/stores/preferences-store";
import { trackerStore } from "@/stores/tracker-store";

type ReviewEngagementContextValue = {
  trackInteraction: (kind: ReviewInteractionKind) => void;
  recordError: () => void;
};

const ReviewEngagementContext = createContext<ReviewEngagementContextValue | null>(null);

export function ReviewEngagementProvider({ children }: { children: ReactNode }) {
  const { isSyncing } = useAuth();
  const prefsReady = usePreferencesReady();
  const prefs = usePreferences();
  const achievementStats = useStore(trackerStore, (s) => s.achievementStats);
  const sessionKindsRef = useRef(new Set<ReviewInteractionKind>());
  const [achievementsUnlocked, setAchievementsUnlocked] = useState(0);

  useEffect(() => {
    let cancelled = false;
    void readPersistedAchievementIds().then((ids) => {
      if (!cancelled) setAchievementsUnlocked(ids.length);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  const getRuntime = useCallback((): ReviewPromptRuntime => {
    return {
      isSyncing,
      prayersLogged: achievementStats.prayersCompleted,
      currentStreak: achievementStats.streak,
      achievementsUnlocked,
      hasCompletedOnboarding: prefsReady ? prefs.hasCompletedOnboarding : false,
    };
  }, [isSyncing, achievementStats, achievementsUnlocked, prefsReady, prefs.hasCompletedOnboarding]);

  const trackInteraction = useCallback((kind: ReviewInteractionKind) => {
    if (sessionKindsRef.current.has(kind)) return;
    sessionKindsRef.current.add(kind);
    void (async () => {
      const state = await readReviewGating();
      await writeReviewGating(recordMeaningfulInteraction(state));
    })();
  }, []);

  const recordError = useCallback(() => {
    void (async () => {
      const state = await readReviewGating();
      await writeReviewGating(recordReviewError(state));
    })();
  }, []);

  useEffect(() => {
    registerReviewEngagement({ trackInteraction, recordError, getRuntime });
    return () => registerReviewEngagement(null);
  }, [trackInteraction, recordError, getRuntime]);

  const value = useMemo(() => ({ trackInteraction, recordError }), [trackInteraction, recordError]);

  return (
    <ReviewEngagementContext.Provider value={value}>{children}</ReviewEngagementContext.Provider>
  );
}

export function useReviewEngagement(): ReviewEngagementContextValue {
  const ctx = useContext(ReviewEngagementContext);
  if (!ctx) {
    throw new Error("useReviewEngagement must be used within ReviewEngagementProvider");
  }
  return ctx;
}
