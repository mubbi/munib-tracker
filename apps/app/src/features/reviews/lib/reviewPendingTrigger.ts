import { recordValueMoment } from "@/features/reviews/lib/reviewGating";
import type { ReviewFunnelTriggerId } from "@/features/reviews/lib/reviewPromptBridge";
import {
  readPendingReviewTrigger,
  readReviewGating,
  writePendingReviewTrigger,
  writeReviewGating,
} from "@/features/reviews/lib/reviewStorage";
import {
  isReviewFunnelTriggerId,
  TRIGGER_PRIORITY,
} from "@/features/reviews/lib/reviewTriggerPriority";

export async function enqueuePersistedReviewTrigger(
  triggerId: ReviewFunnelTriggerId,
): Promise<void> {
  const raw = await readPendingReviewTrigger();
  if (raw && isReviewFunnelTriggerId(raw)) {
    if (TRIGGER_PRIORITY[triggerId] >= TRIGGER_PRIORITY[raw]) return;
  }
  await writePendingReviewTrigger(triggerId);
}

export async function dequeuePersistedReviewTrigger(): Promise<ReviewFunnelTriggerId | null> {
  const raw = await readPendingReviewTrigger();
  await writePendingReviewTrigger(null);
  if (!raw || !isReviewFunnelTriggerId(raw)) return null;
  return raw;
}

export async function scheduleReviewTriggerFromWake(
  triggerId: ReviewFunnelTriggerId,
): Promise<void> {
  const gating = await readReviewGating();
  await writeReviewGating(recordValueMoment(gating));
  await enqueuePersistedReviewTrigger(triggerId);
}
