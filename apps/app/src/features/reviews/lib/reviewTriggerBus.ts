import {
  REVIEW_TRIGGER_MAX_AGE_MINUTES,
  type ReviewValueMomentId,
} from "@munib-tracker/shared/reviews";
import type { ReviewDeferRoute } from "@/features/reviews/lib/reviewPromptBridge";
import { TRIGGER_PRIORITY } from "@/features/reviews/lib/reviewTriggerPriority";

/**
 * Holds the best pending value moment until the screen it belongs to is in
 * focus (so the OS sheet never lands mid-navigation). A moment that isn't
 * surfaced within REVIEW_TRIGGER_MAX_AGE_MINUTES is dropped — asking later,
 * detached from the moment, is the interruption the HIG warns about.
 */

type PendingTrigger = {
  triggerId: ReviewValueMomentId;
  deferRoute: ReviewDeferRoute;
  emittedAt: number;
};

const MAX_AGE_MS = REVIEW_TRIGGER_MAX_AGE_MINUTES * 60 * 1000;

let pending: PendingTrigger | null = null;
let flushHandler: ((triggerId: ReviewValueMomentId) => void) | null = null;

export function registerReviewTriggerFlush(
  fn: ((triggerId: ReviewValueMomentId) => void) | null,
): void {
  flushHandler = fn;
}

function isExpired(trigger: PendingTrigger, now: number): boolean {
  return now - trigger.emittedAt > MAX_AGE_MS;
}

export function emitReviewTrigger(
  triggerId: ReviewValueMomentId,
  options?: { deferRoute?: ReviewDeferRoute; now?: number },
): void {
  const now = options?.now ?? Date.now();
  const incoming: PendingTrigger = {
    triggerId,
    deferRoute: options?.deferRoute ?? "none",
    emittedAt: now,
  };
  if (
    !pending ||
    isExpired(pending, now) ||
    TRIGGER_PRIORITY[triggerId] < TRIGGER_PRIORITY[pending.triggerId]
  ) {
    pending = incoming;
  }
}

/** Called when `route` gains focus: hands a matching, fresh trigger to the provider. */
export function flushReviewTriggerForRoute(route: ReviewDeferRoute, now = Date.now()): void {
  if (!pending || !flushHandler) return;
  if (isExpired(pending, now)) {
    pending = null;
    return;
  }
  if (pending.deferRoute !== "none" && pending.deferRoute !== route) return;
  const { triggerId } = pending;
  pending = null;
  flushHandler(triggerId);
}

export function clearPendingReviewTrigger(): void {
  pending = null;
}
