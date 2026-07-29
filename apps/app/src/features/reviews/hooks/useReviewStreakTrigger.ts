import { APP_FEEDBACK_TRIGGER_IDS, STREAK_MILESTONE_DAYS } from "@munib-tracker/shared/reviews";
import { useEffect, useRef } from "react";
import { useReviewPrompt } from "@/features/reviews/context/ReviewPromptContext";

/** Emits streak_milestone when streak hits 3 / 7 / 14 / 30 days. */
export function useReviewStreakTrigger(streakDays: number): void {
  const { emitReviewTrigger } = useReviewPrompt();
  const seenRef = useRef(new Set<number>());

  useEffect(() => {
    for (const milestone of STREAK_MILESTONE_DAYS) {
      if (streakDays >= milestone && !seenRef.current.has(milestone)) {
        seenRef.current.add(milestone);
        emitReviewTrigger(APP_FEEDBACK_TRIGGER_IDS.streak_milestone, { deferRoute: "home" });
      }
    }
  }, [streakDays, emitReviewTrigger]);
}
