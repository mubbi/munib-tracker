import AsyncStorage from "@react-native-async-storage/async-storage";
import { DB_KEYS } from "@/db/keys";
import {
  EMPTY_REVIEW_GATING,
  normalizeReviewGating,
  readReviewGating,
  writeReviewGating,
} from "@/features/reviews/lib/reviewStorage";

describe("reviewStorage", () => {
  beforeEach(async () => {
    await AsyncStorage.clear();
  });

  it("reads a fresh copy of the empty state when nothing is stored", async () => {
    const state = await readReviewGating();
    expect(state).toEqual(EMPTY_REVIEW_GATING);
    expect(state).not.toBe(EMPTY_REVIEW_GATING);
  });

  it("merges a stored partial state over the defaults", async () => {
    await AsyncStorage.setItem(DB_KEYS.reviewGating, JSON.stringify({ sessionCount: 4 }));
    await expect(readReviewGating()).resolves.toEqual({ ...EMPTY_REVIEW_GATING, sessionCount: 4 });
  });

  it("round-trips a full state", async () => {
    const next = {
      ...EMPTY_REVIEW_GATING,
      firstOpenAt: "2026-01-01T00:00:00.000Z",
      sessionInteractionKinds: ["mark_prayer" as const],
      lastPromptedVersion: "2.4.0",
    };
    await writeReviewGating(next);
    await expect(readReviewGating()).resolves.toEqual(next);
  });

  describe("normalizeReviewGating", () => {
    it.each([null, undefined, "x", 3])("returns the empty state for %j", (raw) => {
      expect(normalizeReviewGating(raw)).toEqual(EMPTY_REVIEW_GATING);
    });

    it("drops fields the retired star-rating funnel left behind", () => {
      const state = normalizeReviewGating({
        sessionCount: 2,
        dismissStreak: 3,
        lastDismissedAt: "2026-01-01T00:00:00.000Z",
        sessionPromptShown: true,
        lastTriggerCoalesceAt: "2026-01-01T00:00:00.000Z",
        lastSessionValueAt: "2026-01-01T00:00:00.000Z",
      });
      expect(state).toEqual({ ...EMPTY_REVIEW_GATING, sessionCount: 2 });
    });

    it("treats the old 'rate on the store' tap as an opened write-review page", () => {
      const at = "2026-10-01T00:00:00.000Z";
      expect(normalizeReviewGating({ lastStoreReviewRequestAt: at }).lastWriteReviewOpenedAt).toBe(
        at,
      );
    });

    it("rejects malformed values", () => {
      expect(
        normalizeReviewGating({
          sessionCount: -2,
          promptCountLifetime: "3",
          firstOpenAt: 42,
          sessionInteractionKinds: ["mark_prayer", 7],
        }),
      ).toEqual({ ...EMPTY_REVIEW_GATING, sessionInteractionKinds: ["mark_prayer"] });
    });
  });
});
