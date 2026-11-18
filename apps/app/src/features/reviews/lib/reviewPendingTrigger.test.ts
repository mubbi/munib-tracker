import { APP_FEEDBACK_TRIGGER_IDS } from "@munib-tracker/shared/reviews";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  dequeuePersistedReviewTrigger,
  enqueuePersistedReviewTrigger,
  scheduleReviewTriggerFromWake,
} from "@/features/reviews/lib/reviewPendingTrigger";
import {
  readPendingReviewTrigger,
  readReviewGating,
  writePendingReviewTrigger,
} from "@/features/reviews/lib/reviewStorage";

const { perfect_day, achievement_unlock, weekly_report, streak_milestone, qaza_cleared, manual } =
  APP_FEEDBACK_TRIGGER_IDS;

/** Seeds the persisted pending trigger (or leaves it empty). */
async function setup(pending: string | null = null) {
  await AsyncStorage.clear();
  if (pending) await writePendingReviewTrigger(pending);
}

describe("enqueuePersistedReviewTrigger", () => {
  it.each([
    ["nothing is pending", null, weekly_report, weekly_report],
    ["the incoming trigger has higher priority", achievement_unlock, perfect_day, perfect_day],
    ["the pending value is unknown", "bogus", manual, manual],
    [
      "the incoming trigger has lower priority",
      achievement_unlock,
      qaza_cleared,
      achievement_unlock,
    ],
  ])("when %s, stores the winner", async (_label, pending, incoming, expected) => {
    await setup(pending);
    await enqueuePersistedReviewTrigger(incoming);
    await expect(readPendingReviewTrigger()).resolves.toBe(expected);
  });
});

describe("dequeuePersistedReviewTrigger", () => {
  it.each([
    ["nothing is pending", null, null],
    ["the pending value is unknown", "bogus", null],
    ["a trigger is pending", streak_milestone, streak_milestone],
  ])("when %s, returns %s", async (_label, pending, expected) => {
    await setup(pending);
    await expect(dequeuePersistedReviewTrigger()).resolves.toBe(expected);
  });

  it("clears the pending trigger", async () => {
    await setup(streak_milestone);
    await dequeuePersistedReviewTrigger();
    await expect(readPendingReviewTrigger()).resolves.toBeNull();
  });
});

describe("scheduleReviewTriggerFromWake", () => {
  beforeEach(() => setup());

  it("records a value moment", async () => {
    await scheduleReviewTriggerFromWake(weekly_report);
    const { lastSessionValueAt } = await readReviewGating();
    expect(Number.isNaN(Date.parse(lastSessionValueAt ?? ""))).toBe(false);
  });

  it("enqueues the trigger", async () => {
    await scheduleReviewTriggerFromWake(weekly_report);
    await expect(readPendingReviewTrigger()).resolves.toBe(weekly_report);
  });
});
