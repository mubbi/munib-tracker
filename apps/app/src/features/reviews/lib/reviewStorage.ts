import { DB_KEYS } from "@/db/keys";
import { readJSON, writeJSON } from "@/db/store";
import type { ReviewInteractionKind } from "@/features/reviews/lib/reviewInteractionKinds";

/** Device-local review gating state (D76). Read/write through `reviewGatingStore`. */
export type ReviewGatingState = {
  firstOpenAt: string | null;
  sessionCount: number;
  lastForegroundAt: string | null;
  currentSessionStartedAt: string | null;
  /** Interaction kinds already counted in the current session (one count per kind per session). */
  sessionInteractionKinds: ReviewInteractionKind[];
  meaningfulInteractionCount: number;
  /** Crash (error boundary) — blocks automatic asks for REVIEW_ERROR_COOLDOWN_DAYS. */
  lastErrorAt: string | null;
  /** Any error this session (crash or failed sync) — blocks asks until the next session. */
  sessionErrorAt: string | null;
  /** Last automatic OS review request (the OS never says whether the sheet showed). */
  lastPromptedAt: string | null;
  lastPromptedVersion: string | null;
  promptCountLifetime: number;
  /** User opened the store's write-review page from the Rate row. */
  lastWriteReviewOpenedAt: string | null;
  lastFeedbackSentAt: string | null;
};

export const EMPTY_REVIEW_GATING: ReviewGatingState = {
  firstOpenAt: null,
  sessionCount: 0,
  lastForegroundAt: null,
  currentSessionStartedAt: null,
  sessionInteractionKinds: [],
  meaningfulInteractionCount: 0,
  lastErrorAt: null,
  sessionErrorAt: null,
  lastPromptedAt: null,
  lastPromptedVersion: null,
  promptCountLifetime: 0,
  lastWriteReviewOpenedAt: null,
  lastFeedbackSentAt: null,
};

/** Shape written by the retired star-rating funnel (pre-D76) — migrated on read. */
type LegacyReviewGating = {
  lastStoreReviewRequestAt?: string | null;
};

function str(value: unknown): string | null {
  return typeof value === "string" && value.length > 0 ? value : null;
}

function count(value: unknown): number {
  return typeof value === "number" && Number.isFinite(value) && value > 0 ? Math.floor(value) : 0;
}

/** Keeps only known, well-typed fields; drops anything the retired funnel left behind. */
export function normalizeReviewGating(raw: unknown): ReviewGatingState {
  if (!raw || typeof raw !== "object") return { ...EMPTY_REVIEW_GATING };
  const r = raw as Partial<Record<keyof ReviewGatingState, unknown>> & LegacyReviewGating;
  return {
    firstOpenAt: str(r.firstOpenAt),
    sessionCount: count(r.sessionCount),
    lastForegroundAt: str(r.lastForegroundAt),
    currentSessionStartedAt: str(r.currentSessionStartedAt),
    sessionInteractionKinds: Array.isArray(r.sessionInteractionKinds)
      ? (r.sessionInteractionKinds.filter((k) => typeof k === "string") as ReviewInteractionKind[])
      : [],
    meaningfulInteractionCount: count(r.meaningfulInteractionCount),
    lastErrorAt: str(r.lastErrorAt),
    sessionErrorAt: str(r.sessionErrorAt),
    lastPromptedAt: str(r.lastPromptedAt),
    lastPromptedVersion: str(r.lastPromptedVersion),
    promptCountLifetime: count(r.promptCountLifetime),
    // The old funnel's "Rate on the store" button sent the user to the store — treat it
    // like an opened write-review page so they aren't asked again for a year.
    lastWriteReviewOpenedAt: str(r.lastWriteReviewOpenedAt) ?? str(r.lastStoreReviewRequestAt),
    lastFeedbackSentAt: str(r.lastFeedbackSentAt),
  };
}

export async function readReviewGating(): Promise<ReviewGatingState> {
  const parsed = await readJSON<unknown>(DB_KEYS.reviewGating, undefined);
  return normalizeReviewGating(parsed);
}

export async function writeReviewGating(state: ReviewGatingState): Promise<void> {
  await writeJSON(DB_KEYS.reviewGating, state);
}
