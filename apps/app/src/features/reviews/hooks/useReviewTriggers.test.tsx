import { APP_FEEDBACK_TRIGGER_IDS } from "@munib-tracker/shared/reviews";
import { renderHook } from "@testing-library/react-native";
import { useReviewDailyTrackingInteraction } from "@/features/reviews/hooks/useReviewDailyTrackingInteraction";
import { useReviewPerfectDayTrigger } from "@/features/reviews/hooks/useReviewPerfectDayTrigger";
import { useReviewQazaClearedTrigger } from "@/features/reviews/hooks/useReviewQazaClearedTrigger";
import { useReviewRouteTrigger } from "@/features/reviews/hooks/useReviewRouteTrigger";
import { useReviewStreakTrigger } from "@/features/reviews/hooks/useReviewStreakTrigger";

const mockEmit = jest.fn();
const mockFlush = jest.fn();
const mockTrack = jest.fn();
const mockTracker = { ready: true };

jest.mock("expo-router", () => require("@/test-support/mocks/expo-router").expoRouterMock);

jest.mock("@/features/reviews/lib/reviewTriggerBus", () => ({
  emitReviewTrigger: (...args: unknown[]) => mockEmit(...args),
  flushReviewTriggerForRoute: (...args: unknown[]) => mockFlush(...args),
}));

jest.mock("@/features/reviews/lib/reviewEngagementBridge", () => ({
  trackReviewInteraction: (...args: unknown[]) => mockTrack(...args),
}));

jest.mock("@/stores/tracker-store", () => ({
  useTrackerReady: () => mockTracker.ready,
}));

/** Renders `hook` with the first props, then re-renders with each following one. */
async function renderWithSequence<P>(hook: (props: P) => void, [first, ...rest]: P[]) {
  const utils = await renderHook(hook, { initialProps: first });
  for (const props of rest) await utils.rerender(props);
  return utils;
}

beforeEach(() => {
  mockEmit.mockClear();
  mockFlush.mockClear();
  mockTrack.mockClear();
  mockTracker.ready = true;
});

describe("useReviewPerfectDayTrigger", () => {
  const run = (sequence: boolean[]) =>
    renderWithSequence((done: boolean) => useReviewPerfectDayTrigger(done), sequence);

  it("emits perfect_day deferred to the tracker when the ring completes", async () => {
    await run([false, true]);
    expect(mockEmit).toHaveBeenCalledWith(APP_FEEDBACK_TRIGGER_IDS.perfect_day, {
      deferRoute: "tracker",
    });
  });

  it.each([
    ["already complete on load", [true]],
    ["still incomplete", [false, false]],
  ])("does not emit when %s", async (_label, sequence) => {
    await run(sequence);
    expect(mockEmit).not.toHaveBeenCalled();
  });

  it("ignores changes before the tracker has loaded", async () => {
    mockTracker.ready = false;
    const utils = await renderHook((done: boolean) => useReviewPerfectDayTrigger(done), {
      initialProps: false,
    });
    mockTracker.ready = true;
    await utils.rerender(true);
    expect(mockEmit).not.toHaveBeenCalled();
  });
});

describe("useReviewQazaClearedTrigger", () => {
  const run = (sequence: [number, number][]) =>
    renderWithSequence(
      ([done, target]: [number, number]) => useReviewQazaClearedTrigger(done, target),
      sequence,
    );

  it.each<[string, [number, number][]]>([
    ["the target is zero", [[0, 0]]],
    ["the target is not yet met", [[1, 3]]],
    ["the target was already met on load", [[3, 3]]],
    [
      "more is logged after the target was met",
      [
        [3, 3],
        [4, 3],
      ],
    ],
  ])("does not emit when %s", async (_label, sequence) => {
    await run(sequence);
    expect(mockEmit).not.toHaveBeenCalled();
  });

  it("emits qaza_cleared deferred to the tracker once the target is met", async () => {
    await run([
      [1, 3],
      [3, 3],
    ]);
    expect(mockEmit).toHaveBeenCalledWith(APP_FEEDBACK_TRIGGER_IDS.qaza_cleared, {
      deferRoute: "tracker",
    });
  });
});

describe("useReviewStreakTrigger", () => {
  const run = (sequence: number[]) =>
    renderWithSequence((days: number) => useReviewStreakTrigger(days), sequence);

  it.each([
    ["below the first milestone", [1, 2], 0],
    ["stepping onto a milestone", [2, 3], 1],
    ["a streak already past a milestone on load", [8], 0],
    ["the load jump from 0 to a milestone", [0, 7], 0],
    ["a repeated value", [3, 3], 0],
    ["each milestone stepped onto", [2, 3, 4, 5, 6, 7], 2],
  ])("handles %s", async (_label, sequence, count) => {
    await run(sequence);
    expect(mockEmit).toHaveBeenCalledTimes(count);
  });

  it("defers to Home", async () => {
    await run([6, 7]);
    expect(mockEmit).toHaveBeenCalledWith(APP_FEEDBACK_TRIGGER_IDS.streak_milestone, {
      deferRoute: "home",
    });
  });
});

describe("useReviewDailyTrackingInteraction", () => {
  it("tracks daily_tracking when the first obligatory Salah is logged", async () => {
    await renderWithSequence((n: number) => useReviewDailyTrackingInteraction(n), [0, 1, 2]);
    expect(mockTrack).toHaveBeenCalledTimes(1);
    expect(mockTrack).toHaveBeenCalledWith("daily_tracking");
  });
});

describe("useReviewRouteTrigger", () => {
  it("flushes pending triggers for its route on focus", async () => {
    await renderHook(() => useReviewRouteTrigger("home"));
    expect(mockFlush).toHaveBeenCalledWith("home");
  });
});
