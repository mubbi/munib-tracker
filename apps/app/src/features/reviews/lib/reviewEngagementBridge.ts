import type { ReviewErrorSeverity } from "@/features/reviews/lib/reviewGating";
import {
  recordMeaningfulInteraction,
  recordReviewError,
} from "@/features/reviews/lib/reviewGating";
import { updateReviewGating } from "@/features/reviews/lib/reviewGatingStore";
import type { ReviewInteractionKind } from "@/features/reviews/lib/reviewInteractionKinds";

/**
 * Fire-and-forget engagement signals for the review gate. They write straight
 * to the gating store, so they work from anywhere — including an error
 * boundary that sits above the review providers.
 */

/** A meaningful interaction (counted once per kind per session). */
export function trackReviewInteraction(kind: ReviewInteractionKind): void {
  void updateReviewGating((state) => recordMeaningfulInteraction(state, kind)).catch(() => {
    // Storage failure only loses one count.
  });
}

/** `crash` blocks automatic review asks for a week; `session` for this session only. */
export function recordReviewErrorMarker(severity: ReviewErrorSeverity = "crash"): void {
  void updateReviewGating((state) => recordReviewError(state, severity)).catch(() => {
    // Best-effort.
  });
}
