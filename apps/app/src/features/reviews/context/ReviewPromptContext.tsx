import { APP_FEEDBACK_TRIGGER_IDS } from "@munib-tracker/shared/reviews";
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
import { ReviewPromptSheet } from "@/features/reviews/components/ReviewPromptSheet";
import { useIsOnline } from "@/features/reviews/hooks/useIsOnline";
import { useReviewPromptBlocked } from "@/features/reviews/hooks/useReviewPromptBlocked";
import { getReviewPromptRuntime } from "@/features/reviews/lib/reviewEngagementBridge";
import {
  canShowManualReviewPrompt,
  canShowReviewPrompt,
  isManualReviewPromptAvailable,
  recordDismissed,
  recordFeedbackSent,
  recordPromptShown,
  recordSessionForeground,
  recordStoreReviewRequest,
  recordValueMoment,
} from "@/features/reviews/lib/reviewGating";
import { dequeuePersistedReviewTrigger } from "@/features/reviews/lib/reviewPendingTrigger";
import {
  deferRouteForTrigger,
  type ReviewFunnelTriggerId,
  registerReviewPromptOpener,
} from "@/features/reviews/lib/reviewPromptBridge";
import type { ReviewGatingState } from "@/features/reviews/lib/reviewStorage";
import { readReviewGating, writeReviewGating } from "@/features/reviews/lib/reviewStorage";
import {
  emitReviewTrigger,
  registerReviewTriggerFlush,
} from "@/features/reviews/lib/reviewTriggerBus";
import { submitReviewFeedback } from "@/features/reviews/lib/submitAppFeedback";
import { useToast } from "@/providers/toast-provider";

type ReviewPromptContextValue = {
  emitReviewTrigger: typeof emitReviewTrigger;
  maybePromptReview: () => void;
  canRateApp: boolean;
};

const ReviewPromptContext = createContext<ReviewPromptContextValue | null>(null);

export function ReviewPromptProvider({ children }: { children: ReactNode }) {
  const { t, i18n } = useTranslation();
  const toast = useToast();
  const isOnline = useIsOnline();
  const blocked = useReviewPromptBlocked();
  const [gatingLoaded, setGatingLoaded] = useState(false);
  const [gatingSnapshot, setGatingSnapshot] = useState<ReviewGatingState | null>(null);
  const [visible, setVisible] = useState(false);
  const [feedbackError, setFeedbackError] = useState<string | null>(null);
  const [activeTriggerId, setActiveTriggerId] = useState<ReviewFunnelTriggerId>(
    APP_FEEDBACK_TRIGGER_IDS.manual,
  );
  const stateRef = useRef<ReviewGatingState | null>(null);
  const loadedRef = useRef(false);
  const pendingTriggerRef = useRef<ReviewFunnelTriggerId | null>(null);

  const persist = useCallback(async (next: ReviewGatingState) => {
    stateRef.current = next;
    setGatingSnapshot(next);
    await writeReviewGating(next);
  }, []);

  useEffect(() => {
    let cancelled = false;
    loadedRef.current = false;
    setGatingLoaded(false);
    setGatingSnapshot(null);
    void (async () => {
      const state = await readReviewGating();
      if (cancelled) return;
      const opened = recordSessionForeground(state);
      stateRef.current = opened;
      loadedRef.current = true;
      setGatingSnapshot(opened);
      setGatingLoaded(true);
      await writeReviewGating(opened);
      const persistedTrigger = await dequeuePersistedReviewTrigger();
      if (!cancelled && persistedTrigger) {
        emitReviewTrigger(persistedTrigger, { deferRoute: deferRouteForTrigger(persistedTrigger) });
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    const onChange = (status: AppStateStatus) => {
      if (status !== "active" || !loadedRef.current || !stateRef.current) return;
      const opened = recordSessionForeground(stateRef.current);
      void persist(opened);
    };
    const sub = AppState.addEventListener("change", onChange);
    return () => sub.remove();
  }, [persist]);

  const tryOpenFunnel = useCallback(
    (triggerId: ReviewFunnelTriggerId) => {
      if (blocked || !loadedRef.current || !stateRef.current) {
        pendingTriggerRef.current = triggerId;
        return;
      }
      const runtime = getReviewPromptRuntime();
      let next = recordValueMoment(stateRef.current);
      const gate =
        triggerId === APP_FEEDBACK_TRIGGER_IDS.manual
          ? canShowManualReviewPrompt(next)
          : canShowReviewPrompt(next, runtime);
      if (!gate.allowed) return;
      next = recordPromptShown(next);
      void persist(next);
      setActiveTriggerId(triggerId);
      setFeedbackError(null);
      setVisible(true);
    },
    [blocked, persist],
  );

  const openReviewFunnel = useCallback(
    (triggerId: ReviewFunnelTriggerId) => {
      if (!stateRef.current) return;
      const withValue = recordValueMoment(stateRef.current);
      stateRef.current = withValue;
      void persist(withValue);
      tryOpenFunnel(triggerId);
    },
    [persist, tryOpenFunnel],
  );

  const maybePromptReview = useCallback(() => {
    openReviewFunnel(APP_FEEDBACK_TRIGGER_IDS.manual);
  }, [openReviewFunnel]);

  useEffect(() => {
    registerReviewPromptOpener(openReviewFunnel);
    registerReviewTriggerFlush(openReviewFunnel);
    return () => {
      registerReviewPromptOpener(null);
      registerReviewTriggerFlush(null);
    };
  }, [openReviewFunnel]);

  useEffect(() => {
    if (blocked || !pendingTriggerRef.current) return;
    const triggerId = pendingTriggerRef.current;
    pendingTriggerRef.current = null;
    openReviewFunnel(triggerId);
  }, [blocked, openReviewFunnel]);

  const canRateApp = useMemo(
    () =>
      isManualReviewPromptAvailable(gatingSnapshot, {
        loaded: gatingLoaded,
        blocked,
      }),
    [blocked, gatingLoaded, gatingSnapshot],
  );

  const value = useMemo(
    () => ({
      emitReviewTrigger,
      maybePromptReview,
      canRateApp,
    }),
    [canRateApp, maybePromptReview],
  );

  return (
    <ReviewPromptContext.Provider value={value}>
      {children}
      <ReviewPromptSheet
        visible={visible}
        onClose={() => setVisible(false)}
        feedbackOffline={!isOnline}
        feedbackError={feedbackError}
        onDismissed={() => {
          if (!stateRef.current) return;
          void persist(recordDismissed(stateRef.current));
        }}
        onStoreReviewRequested={() => {
          if (!stateRef.current) return;
          void persist(recordStoreReviewRequest(stateRef.current));
          toast.success(t("reviews.thanksTitle"), t("reviews.thanksBody"));
        }}
        onFeedbackSent={async (rating, message) => {
          setFeedbackError(null);
          try {
            await submitReviewFeedback({
              rating,
              message,
              triggerId: activeTriggerId,
              locale: i18n.language,
            });
            if (!stateRef.current) return;
            void persist(recordFeedbackSent(stateRef.current));
            toast.success(t("reviews.feedbackThanksTitle"), t("reviews.feedbackThanksBody"));
          } catch {
            setFeedbackError(t("reviews.feedbackError"));
            throw new Error("feedback_failed");
          }
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
