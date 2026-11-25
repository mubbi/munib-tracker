import { APP_FEEDBACK_TRIGGER_IDS } from "@munib-tracker/shared/reviews";
import { useEffect, useRef } from "react";
import { emitReviewTrigger } from "@/features/reviews/lib/reviewTriggerBus";
import { useTrackerReady } from "@/stores/tracker-store";

/**
 * Emits qaza_cleared when today's qaza target becomes fully cleared while the
 * person is using the app (not when a target was already met on load).
 */
export function useReviewQazaClearedTrigger(completedToday: number, targetToday: number): void {
  const ready = useTrackerReady();
  const prevRef = useRef<boolean | null>(null);

  useEffect(() => {
    if (!ready) return;
    const cleared = targetToday > 0 && completedToday >= targetToday;
    const prev = prevRef.current;
    prevRef.current = cleared;
    if (prev === false && cleared) {
      emitReviewTrigger(APP_FEEDBACK_TRIGGER_IDS.qaza_cleared, { deferRoute: "tracker" });
    }
  }, [ready, completedToday, targetToday]);
}
