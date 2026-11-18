import AsyncStorage from "@react-native-async-storage/async-storage";
import { DB_KEYS } from "@/db/keys";
import {
  EMPTY_REVIEW_GATING,
  readPendingReviewTrigger,
  readReviewGating,
  readReviewReactivationDedupe,
  writePendingReviewTrigger,
  writeReviewGating,
  writeReviewReactivationDedupe,
} from "@/features/reviews/lib/reviewStorage";

describe("reviewStorage", () => {
  beforeEach(async () => {
    await AsyncStorage.clear();
  });

  describe("gating state", () => {
    it("reads a fresh copy of the empty state when nothing is stored", async () => {
      const state = await readReviewGating();
      expect(state).toEqual(EMPTY_REVIEW_GATING);
      expect(state).not.toBe(EMPTY_REVIEW_GATING);
    });

    it("merges a stored partial state over the defaults", async () => {
      await AsyncStorage.setItem(DB_KEYS.reviewGating, JSON.stringify({ sessionCount: 4 }));
      await expect(readReviewGating()).resolves.toEqual({
        ...EMPTY_REVIEW_GATING,
        sessionCount: 4,
      });
    });

    it("round-trips a full state", async () => {
      const next = { ...EMPTY_REVIEW_GATING, dismissStreak: 2, firstOpenAt: "2026-01-01" };
      await writeReviewGating(next);
      await expect(readReviewGating()).resolves.toEqual(next);
    });
  });

  describe("reactivation dedupe", () => {
    it("is null when unset", async () => {
      await expect(readReviewReactivationDedupe()).resolves.toBeNull();
    });

    it("round-trips the dedupe key", async () => {
      await writeReviewReactivationDedupe("device:window");
      await expect(readReviewReactivationDedupe()).resolves.toBe("device:window");
    });
  });

  describe("pending trigger", () => {
    it("is null when unset", async () => {
      await expect(readPendingReviewTrigger()).resolves.toBeNull();
    });

    it("round-trips a trigger id", async () => {
      await writePendingReviewTrigger("perfect_day");
      await expect(readPendingReviewTrigger()).resolves.toBe("perfect_day");
    });

    it.each([
      ["an empty string", ""],
      ["null", null],
    ])("clears the trigger when written %s", async (_label, value) => {
      await writePendingReviewTrigger("manual");
      await writePendingReviewTrigger(value);
      await expect(readPendingReviewTrigger()).resolves.toBeNull();
    });
  });
});
