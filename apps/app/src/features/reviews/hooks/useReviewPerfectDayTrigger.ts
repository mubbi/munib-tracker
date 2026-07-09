import { APP_FEEDBACK_TRIGGER_IDS } from "@munib-tracker/shared/reviews";
import { useEffect, useRef } from "react";
import { useReviewPrompt } from "@/features/reviews/context/ReviewPromptContext";
import { maybeDeliverReviewReactivation } from "@/features/reviews/lib/maybeDeliverReviewReactivation";

/** Emits perfect_day when the obligatory ring crosses to 100%. */
export function useReviewPerfectDayTrigger(isComplete: boolean): void {
  const { emitReviewTrigger } = useReviewPrompt();
  const prevRef = useRef<boolean | null>(null);
  const firedRef = useRef(false);

  useEffect(() => {
    const prev = prevRef.current;
    if (!firedRef.current && prev === false && isComplete) {
      firedRef.current = true;
      emitReviewTrigger(APP_FEEDBACK_TRIGGER_IDS.perfect_day, { deferRoute: "tracker" });
      void maybeDeliverReviewReactivation(APP_FEEDBACK_TRIGGER_IDS.perfect_day);
    }
    prevRef.current = isComplete;
  }, [isComplete, emitReviewTrigger]);
}
