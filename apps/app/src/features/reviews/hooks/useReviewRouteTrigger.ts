import { useFocusEffect } from "expo-router";
import { useCallback } from "react";
import type { ReviewDeferRoute } from "@/features/reviews/lib/reviewPromptBridge";
import { flushReviewTriggerForRoute } from "@/features/reviews/lib/reviewTriggerBus";

export function useReviewRouteTrigger(route: ReviewDeferRoute): void {
  useFocusEffect(
    useCallback(() => {
      flushReviewTriggerForRoute(route);
    }, [route]),
  );
}
