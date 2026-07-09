import { DB_KEYS } from "@/db/keys";
import { readJSON, writeJSON } from "@/db/store";

export type ReviewGatingState = {
  firstOpenAt: string | null;
  sessionCount: number;
  meaningfulInteractionCount: number;
  lastSessionValueAt: string | null;
  lastPromptedAt: string | null;
  lastDismissedAt: string | null;
  lastStoreReviewRequestAt: string | null;
  lastFeedbackSentAt: string | null;
  lastErrorAt: string | null;
  lastForegroundAt: string | null;
  currentSessionStartedAt: string | null;
  sessionPromptShown: boolean;
  sessionErrorAt: string | null;
  lastTriggerCoalesceAt: string | null;
  promptCountLifetime: number;
  dismissStreak: number;
};

export const EMPTY_REVIEW_GATING: ReviewGatingState = {
  firstOpenAt: null,
  sessionCount: 0,
  meaningfulInteractionCount: 0,
  lastSessionValueAt: null,
  lastPromptedAt: null,
  lastDismissedAt: null,
  lastStoreReviewRequestAt: null,
  lastFeedbackSentAt: null,
  lastErrorAt: null,
  lastForegroundAt: null,
  currentSessionStartedAt: null,
  sessionPromptShown: false,
  sessionErrorAt: null,
  lastTriggerCoalesceAt: null,
  promptCountLifetime: 0,
  dismissStreak: 0,
};

export async function readReviewGating(): Promise<ReviewGatingState> {
  const parsed = await readJSON<Partial<ReviewGatingState> | undefined>(
    DB_KEYS.reviewGating,
    undefined,
  );
  if (!parsed) return { ...EMPTY_REVIEW_GATING };
  return { ...EMPTY_REVIEW_GATING, ...parsed };
}

export async function writeReviewGating(state: ReviewGatingState): Promise<void> {
  await writeJSON(DB_KEYS.reviewGating, state);
}

export async function readReviewReactivationDedupe(): Promise<string | null> {
  return readJSON<string | null>(DB_KEYS.reviewReactivationDedupe, null);
}

export async function writeReviewReactivationDedupe(value: string): Promise<void> {
  await writeJSON(DB_KEYS.reviewReactivationDedupe, value);
}

export async function readPendingReviewTrigger(): Promise<string | null> {
  return readJSON<string | null>(DB_KEYS.reviewPendingTrigger, null);
}

export async function writePendingReviewTrigger(value: string | null): Promise<void> {
  if (value == null || value === "") {
    await writeJSON(DB_KEYS.reviewPendingTrigger, null);
    return;
  }
  await writeJSON(DB_KEYS.reviewPendingTrigger, value);
}
