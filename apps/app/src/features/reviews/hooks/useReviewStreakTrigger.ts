import { APP_FEEDBACK_TRIGGER_IDS, STREAK_MILESTONE_DAYS } from "@munib-tracker/shared/reviews";
import { useEffect, useRef } from "react";
import { emitReviewTrigger } from "@/features/reviews/lib/reviewTriggerBus";
import { useTrackerReady } from "@/stores/tracker-store";

const MILESTONES: readonly number[] = STREAK_MILESTONE_DAYS;

/**
 * Emits streak_milestone when the streak steps onto 3 / 7 / 14 / 30 days in
 * front of the person (previous value + 1). A streak that is already at or past
 * a milestone when the app opens is not a new moment.
 */
export function useReviewStreakTrigger(streakDays: number): void {
  const ready = useTrackerReady();
  const prevRef = useRef<number | null>(null);

  useEffect(() => {
    if (!ready) return;
    const prev = prevRef.current;
    prevRef.current = streakDays;
    if (prev != null && streakDays === prev + 1 && MILESTONES.includes(streakDays)) {
      emitReviewTrigger(APP_FEEDBACK_TRIGGER_IDS.streak_milestone, { deferRoute: "home" });
    }
  }, [ready, streakDays]);
}
