import {
  APP_FEEDBACK_TRIGGER_IDS,
  REVIEW_PROMPT_SETTLE_MS,
  type ReviewValueMomentId,
} from "@munib-tracker/shared/reviews";
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
import { useTranslation } from "react-i18next";
import { AppState, type AppStateStatus } from "react-native";
import { AppFeedbackSheet } from "@/features/reviews/components/AppFeedbackSheet";
import { useReviewPromptBlocked } from "@/features/reviews/hooks/useReviewPromptBlocked";
import {
  canRequestAutomaticReview,
  type ReviewPromptRuntime,
  recordAutomaticReviewRequested,
  recordFeedbackSent,
  recordForegroundHeartbeat,
  recordSessionForeground,
  recordWriteReviewOpened,
} from "@/features/reviews/lib/reviewGating";
import { loadReviewGating, updateReviewGating } from "@/features/reviews/lib/reviewGatingStore";
import {
  deferRouteForTrigger,
  registerWriteReviewOpener,
} from "@/features/reviews/lib/reviewPromptBridge";
import {
  emitReviewTrigger,
  registerReviewTriggerFlush,
} from "@/features/reviews/lib/reviewTriggerBus";
import { submitReviewFeedback } from "@/features/reviews/lib/submitAppFeedback";
import { useIsOnline } from "@/hooks/use-is-online";
import { readPersistedAchievementIds } from "@/lib/achievements-persistence";
import { resolveAppVersion } from "@/lib/app/resolve-app-version";
import {
  canOpenStoreWriteReview,
  isStoreReviewAvailable,
  openStoreWriteReview,
  requestNativeStoreReview,
} from "@/lib/platform/storeReview";
import { useAuth } from "@/providers/auth-provider";
import { useToast } from "@/providers/toast-provider";
import { useStore } from "@/stores/create-store";
import { usePreferences, usePreferencesReady } from "@/stores/preferences-store";
import { trackerStore } from "@/stores/tracker-store";

/**
 * Ratings & feedback (D76):
 *
 * - **Automatic** — a value moment (perfect day, achievement, streak milestone,
 *   qaza target cleared, weekly report opened) flushes from the trigger bus on
 *   its screen; after a short settle delay, if the gate passes, the OS review
 *   sheet is requested directly. No custom pre-prompt and no question first
 *   (App Review 5.6.1, Play In-App Review guidelines).
 * - **Rate row / `open-review` deep link** — opens the store's write-review page.
 * - **Send feedback row** — a private 1–5 rating + note to the team; never
 *   routes anyone to (or away from) the store.
 */
type ReviewPromptContextValue = {
  /** Rate row available (phone / tablet store build). */
  canWriteReview: boolean;
  openWriteReview: () => Promise<void>;
  openFeedback: () => void;
};

const ReviewPromptContext = createContext<ReviewPromptContextValue | null>(null);

export function ReviewPromptProvider({ children }: { children: ReactNode }) {
  const { t, i18n } = useTranslation();
  const toast = useToast();
  const isOnline = useIsOnline();
  const { isSyncing } = useAuth();
  const prefsReady = usePreferencesReady();
  const prefs = usePreferences();
  const achievementStats = useStore(trackerStore, (s) => s.achievementStats);
  const blockedByApp = useReviewPromptBlocked();
  const [feedbackVisible, setFeedbackVisible] = useState(false);
  const [feedbackError, setFeedbackError] = useState<string | null>(null);

  // The settle timer reads these after a delay — keep them current in refs.
  const blocked = blockedByApp || feedbackVisible;
  const blockedRef = useRef(true);
  const runtimeRef = useRef<Omit<ReviewPromptRuntime, "achievementsUnlocked"> | null>(null);
  const settleTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const hasCompletedOnboarding = prefsReady && prefs.hasCompletedOnboarding;
  const { prayersCompleted, streak } = achievementStats;
  useEffect(() => {
    blockedRef.current = blocked;
    runtimeRef.current = {
      isSyncing,
      prayersLogged: prayersCompleted,
      currentStreak: streak,
      hasCompletedOnboarding,
      appVersion: resolveAppVersion(),
    };
  }, [blocked, isSyncing, prayersCompleted, streak, hasCompletedOnboarding]);

  // Session tracking.
  useEffect(() => {
    void updateReviewGating(recordSessionForeground).catch(() => undefined);
    const onChange = (status: AppStateStatus) => {
      if (status === "active") {
        void updateReviewGating(recordSessionForeground).catch(() => undefined);
        return;
      }
      // Leaving the app ends any pending ask — never request on return.
      if (settleTimerRef.current) {
        clearTimeout(settleTimerRef.current);
        settleTimerRef.current = null;
      }
      if (status === "background") {
        void updateReviewGating(recordForegroundHeartbeat).catch(() => undefined);
      }
    };
    const sub = AppState.addEventListener("change", onChange);
    return () => {
      sub.remove();
      if (settleTimerRef.current) clearTimeout(settleTimerRef.current);
    };
  }, []);

  const attemptAutomaticReview = useCallback(async () => {
    const base = runtimeRef.current;
    if (!base || AppState.currentState !== "active" || blockedRef.current) return;
    if (!(await isStoreReviewAvailable())) return;
    const [state, achievementIds] = await Promise.all([
      loadReviewGating(),
      readPersistedAchievementIds().catch(() => [] as string[]),
    ]);
    const runtime: ReviewPromptRuntime = { ...base, achievementsUnlocked: achievementIds.length };
    const gate = canRequestAutomaticReview(state, runtime);
    if (!gate.allowed) {
      if (__DEV__) console.info("[reviews] automatic review skipped:", gate.reason);
      return;
    }
    // Re-check: the gate reads storage, and the person may have moved on meanwhile.
    if (AppState.currentState !== "active" || blockedRef.current) return;
    if (!(await requestNativeStoreReview())) return;
    await updateReviewGating((s) => recordAutomaticReviewRequested(s, runtime.appVersion));
  }, []);

  const handleValueMoment = useCallback(
    (triggerId: ReviewValueMomentId) => {
      if (blockedRef.current) {
        // PIN / onboarding / sync / a sheet is up: keep the moment for the next
        // focus of its screen (it still expires with the bus's max age).
        emitReviewTrigger(triggerId, { deferRoute: deferRouteForTrigger(triggerId) });
        return;
      }
      if (settleTimerRef.current) return;
      // Let the celebration / haptics finish before the OS sheet appears.
      settleTimerRef.current = setTimeout(() => {
        settleTimerRef.current = null;
        void attemptAutomaticReview().catch(() => undefined);
      }, REVIEW_PROMPT_SETTLE_MS);
    },
    [attemptAutomaticReview],
  );

  const openWriteReview = useCallback(async () => {
    const opened = await openStoreWriteReview({ locale: i18n.language });
    if (!opened) {
      toast.error(t("reviews.storeOpenError"));
      return;
    }
    await updateReviewGating(recordWriteReviewOpened).catch(() => undefined);
  }, [i18n.language, t, toast]);

  const openFeedback = useCallback(() => {
    setFeedbackError(null);
    setFeedbackVisible(true);
  }, []);

  useEffect(() => {
    registerReviewTriggerFlush(handleValueMoment);
    registerWriteReviewOpener(() => void openWriteReview());
    return () => {
      registerReviewTriggerFlush(null);
      registerWriteReviewOpener(null);
    };
  }, [handleValueMoment, openWriteReview]);

  const value = useMemo<ReviewPromptContextValue>(
    () => ({ canWriteReview: canOpenStoreWriteReview(), openWriteReview, openFeedback }),
    [openWriteReview, openFeedback],
  );

  return (
    <ReviewPromptContext.Provider value={value}>
      {children}
      <AppFeedbackSheet
        visible={feedbackVisible}
        onClose={() => setFeedbackVisible(false)}
        offline={!isOnline}
        error={feedbackError}
        onSubmit={async (rating, message) => {
          setFeedbackError(null);
          try {
            await submitReviewFeedback({
              rating,
              message,
              triggerId: APP_FEEDBACK_TRIGGER_IDS.manual,
              locale: i18n.language,
            });
          } catch (error) {
            setFeedbackError(t("reviews.feedbackError"));
            throw error;
          }
          await updateReviewGating(recordFeedbackSent).catch(() => undefined);
          toast.success(t("reviews.feedbackThanksTitle"), t("reviews.feedbackThanksBody"));
        }}
      />
    </ReviewPromptContext.Provider>
  );
}

export function useReviewPrompt(): ReviewPromptContextValue {
  const ctx = useContext(ReviewPromptContext);
  if (!ctx) {
    throw new Error("useReviewPrompt must be used within ReviewPromptProvider");
  }
  return ctx;
}
