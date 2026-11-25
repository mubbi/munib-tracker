import AsyncStorage from "@react-native-async-storage/async-storage";
import { DB_KEYS } from "@/db/keys";
import {
  loadReviewGating,
  peekReviewGating,
  resetReviewGatingCache,
  subscribeReviewGating,
  updateReviewGating,
} from "@/features/reviews/lib/reviewGatingStore";
import { readReviewGating } from "@/features/reviews/lib/reviewStorage";

describe("reviewGatingStore", () => {
  beforeEach(async () => {
    await AsyncStorage.clear();
    resetReviewGatingCache();
  });

  it("loads once and caches", async () => {
    await AsyncStorage.setItem(DB_KEYS.reviewGating, JSON.stringify({ sessionCount: 2 }));
    expect(peekReviewGating()).toBeNull();
    const first = await loadReviewGating();
    await AsyncStorage.setItem(DB_KEYS.reviewGating, JSON.stringify({ sessionCount: 9 }));
    expect(await loadReviewGating()).toBe(first);
    expect(peekReviewGating()?.sessionCount).toBe(2);
  });

  it("applies concurrent updates in order without losing any", async () => {
    const bump = (s: Awaited<ReturnType<typeof loadReviewGating>>) => ({
      ...s,
      meaningfulInteractionCount: s.meaningfulInteractionCount + 1,
    });
    await Promise.all([
      updateReviewGating(bump),
      updateReviewGating((s) => ({ ...s, sessionCount: s.sessionCount + 1 })),
      updateReviewGating(bump),
    ]);
    const stored = await readReviewGating();
    expect(stored.meaningfulInteractionCount).toBe(2);
    expect(stored.sessionCount).toBe(1);
  });

  it("keeps going after a failed update", async () => {
    await expect(
      updateReviewGating(() => {
        throw new Error("boom");
      }),
    ).rejects.toThrow("boom");
    await updateReviewGating((s) => ({ ...s, sessionCount: 5 }));
    expect((await readReviewGating()).sessionCount).toBe(5);
  });

  it("skips the write and notification when nothing changed", async () => {
    const listener = jest.fn();
    const unsubscribe = subscribeReviewGating(listener);
    await updateReviewGating((s) => s);
    expect(listener).not.toHaveBeenCalled();
    await updateReviewGating((s) => ({ ...s, sessionCount: 1 }));
    expect(listener).toHaveBeenCalledWith(expect.objectContaining({ sessionCount: 1 }));
    unsubscribe();
  });
});
