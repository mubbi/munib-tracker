import type { ReviewPromptRuntime } from "@/features/reviews/lib/reviewGating";
import type { ReviewInteractionKind } from "@/features/reviews/lib/reviewInteractionKinds";

type ReviewEngagementHandlers = {
  trackInteraction: (kind: ReviewInteractionKind) => void;
  recordError: () => void;
  getRuntime: () => ReviewPromptRuntime;
};

let handlers: ReviewEngagementHandlers | null = null;

export function registerReviewEngagement(next: ReviewEngagementHandlers | null): void {
  handlers = next;
}

export function trackReviewInteraction(kind: ReviewInteractionKind): void {
  handlers?.trackInteraction(kind);
}

export function recordReviewErrorMarker(): void {
  handlers?.recordError();
}

export function getReviewPromptRuntime(): ReviewPromptRuntime {
  return (
    handlers?.getRuntime() ?? {
      isSyncing: false,
      prayersLogged: 0,
      currentStreak: 0,
      achievementsUnlocked: 0,
      hasCompletedOnboarding: false,
    }
  );
}
