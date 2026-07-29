import { APP_FEEDBACK_TRIGGER_IDS } from "@munib-tracker/shared/reviews";
import type {
  ReviewDeferRoute,
  ReviewFunnelTriggerId,
} from "@/features/reviews/lib/reviewPromptBridge";
import { TRIGGER_PRIORITY } from "@/features/reviews/lib/reviewTriggerPriority";

type PendingTrigger = {
  triggerId: ReviewFunnelTriggerId;
  deferRoute: ReviewDeferRoute;
};

let pending: PendingTrigger | null = null;
let flushHandler: ((triggerId: ReviewFunnelTriggerId) => void) | null = null;

export function registerReviewTriggerFlush(
  fn: ((triggerId: ReviewFunnelTriggerId) => void) | null,
): void {
  flushHandler = fn;
}

function shouldReplacePending(current: PendingTrigger, incoming: ReviewFunnelTriggerId): boolean {
  return TRIGGER_PRIORITY[incoming] < TRIGGER_PRIORITY[current.triggerId];
}

export function emitReviewTrigger(
  triggerId: ReviewFunnelTriggerId,
  options?: { deferRoute?: ReviewDeferRoute },
): void {
  const deferRoute = options?.deferRoute ?? "none";
  if (triggerId === APP_FEEDBACK_TRIGGER_IDS.manual) {
    pending = { triggerId, deferRoute };
    return;
  }
  if (!pending) {
    pending = { triggerId, deferRoute };
    return;
  }
  if (shouldReplacePending(pending, triggerId)) {
    pending = { triggerId, deferRoute };
  }
}

export function flushReviewTriggerForRoute(route: ReviewDeferRoute): void {
  if (!pending || !flushHandler) return;
  if (pending.deferRoute !== "none" && pending.deferRoute !== route) return;
  const { triggerId } = pending;
  pending = null;
  flushHandler(triggerId);
}

export function flushReviewTriggerImmediate(): void {
  if (!pending || !flushHandler) return;
  const { triggerId, deferRoute } = pending;
  if (deferRoute !== "none") return;
  pending = null;
  flushHandler(triggerId);
}

export function clearPendingReviewTrigger(): void {
  pending = null;
}
