import { APP_FEEDBACK_TRIGGER_IDS } from "@munib-tracker/shared/reviews";
import { useEffect, useRef } from "react";
import { useReviewPrompt } from "@/features/reviews/context/ReviewPromptContext";

/** Emits qaza_cleared when the daily qaza target is fully cleared. */
export function useReviewQazaClearedTrigger(completedToday: number, targetToday: number): void {
  const { emitReviewTrigger } = useReviewPrompt();
  const firedRef = useRef(false);

  useEffect(() => {
    if (firedRef.current || targetToday <= 0) return;
    if (completedToday >= targetToday) {
      firedRef.current = true;
      emitReviewTrigger(APP_FEEDBACK_TRIGGER_IDS.qaza_cleared, { deferRoute: "tracker" });
    }
  }, [completedToday, targetToday, emitReviewTrigger]);
}
