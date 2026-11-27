import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  recordReviewErrorMarker,
  trackReviewInteraction,
} from "@/features/reviews/lib/reviewEngagementBridge";
import {
  loadReviewGating,
  resetReviewGatingCache,
  updateReviewGating,
} from "@/features/reviews/lib/reviewGatingStore";

/** Waits for queued store updates to finish. */
const drain = () => updateReviewGating((s) => s);

describe("reviewEngagementBridge", () => {
  beforeEach(async () => {
    await AsyncStorage.clear();
    resetReviewGatingCache();
  });

  it("counts an interaction kind once per session", async () => {
    trackReviewInteraction("mark_prayer");
    trackReviewInteraction("mark_prayer");
    trackReviewInteraction("view_statistics");
    await drain();
    expect((await loadReviewGating()).meaningfulInteractionCount).toBe(2);
  });

  it("records a crash by default", async () => {
    recordReviewErrorMarker();
    await drain();
    const state = await loadReviewGating();
    expect(state.lastErrorAt).not.toBeNull();
    expect(state.sessionErrorAt).not.toBeNull();
  });

  it("records a session-only error", async () => {
    recordReviewErrorMarker("session");
    await drain();
    const state = await loadReviewGating();
    expect(state.lastErrorAt).toBeNull();
    expect(state.sessionErrorAt).not.toBeNull();
  });
});
