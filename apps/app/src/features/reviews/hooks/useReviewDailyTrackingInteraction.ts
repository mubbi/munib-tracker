import { useEffect, useRef } from "react";
import { trackReviewInteraction } from "@/features/reviews/lib/reviewEngagementBridge";

/** Tracks daily_tracking when the first obligatory prayer is logged today. */
export function useReviewDailyTrackingInteraction(obligatoryCompleted: number): void {
  const prevRef = useRef(0);

  useEffect(() => {
    if (prevRef.current === 0 && obligatoryCompleted > 0) {
      trackReviewInteraction("daily_tracking");
    }
    prevRef.current = obligatoryCompleted;
  }, [obligatoryCompleted]);
}
