import { APP_FEEDBACK_TRIGGER_IDS } from "@munib-tracker/shared/reviews";
import { useEffect, useRef } from "react";
import { emitReviewTrigger } from "@/features/reviews/lib/reviewTriggerBus";
import { useTrackerReady } from "@/stores/tracker-store";

/**
 * Emits perfect_day when the obligatory ring crosses to 100% while the person
 * is using the app — never for a day that was already complete when the
 * tracker loaded.
 */
export function useReviewPerfectDayTrigger(isComplete: boolean): void {
  const ready = useTrackerReady();
  const prevRef = useRef<boolean | null>(null);

  useEffect(() => {
    if (!ready) return;
    const prev = prevRef.current;
    prevRef.current = isComplete;
    if (prev === false && isComplete) {
      emitReviewTrigger(APP_FEEDBACK_TRIGGER_IDS.perfect_day, { deferRoute: "tracker" });
    }
  }, [ready, isComplete]);
}
