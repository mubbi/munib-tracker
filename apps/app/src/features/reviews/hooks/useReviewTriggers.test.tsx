import { APP_FEEDBACK_TRIGGER_IDS } from "@munib-tracker/shared/reviews";
import { renderHook } from "@testing-library/react-native";
import { useReviewDailyTrackingInteraction } from "@/features/reviews/hooks/useReviewDailyTrackingInteraction";
import { useReviewPerfectDayTrigger } from "@/features/reviews/hooks/useReviewPerfectDayTrigger";
import { useReviewQazaClearedTrigger } from "@/features/reviews/hooks/useReviewQazaClearedTrigger";
import { useReviewRouteTrigger } from "@/features/reviews/hooks/useReviewRouteTrigger";
import { useReviewStreakTrigger } from "@/features/reviews/hooks/useReviewStreakTrigger";
import { registerReviewEngagement } from "@/features/reviews/lib/reviewEngagementBridge";
import {
  clearPendingReviewTrigger,
  emitReviewTrigger,
  registerReviewTriggerFlush,
} from "@/features/reviews/lib/reviewTriggerBus";

const mockEmit = jest.fn();
const mockDeliver = jest.fn(async (..._args: unknown[]) => false);

jest.mock("expo-router", () => require("@/test-support/mocks/expo-router").expoRouterMock);

jest.mock("@/features/reviews/context/ReviewPromptContext", () => ({
  useReviewPrompt: () => ({
    emitReviewTrigger: mockEmit,
    maybePromptReview: jest.fn(),
    canRateApp: false,
  }),
}));

jest.mock("@/features/reviews/lib/maybeDeliverReviewReactivation", () => ({
  maybeDeliverReviewReactivation: (...args: unknown[]) => mockDeliver(...args),
}));

/** Renders `hook` with the first props, then re-renders with each following one. */
async function renderWithSequence<P>(hook: (props: P) => void, [first, ...rest]: P[]) {
  const utils = await renderHook(hook, { initialProps: first });
  for (const props of rest) await utils.rerender(props);
  return utils;
}

beforeEach(() => {
  mockEmit.mockClear();
  mockDeliver.mockClear();
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

  it("requests a reactivation nudge when the ring completes", async () => {
    await run([false, true]);
    expect(mockDeliver).toHaveBeenCalledWith(APP_FEEDBACK_TRIGGER_IDS.perfect_day);
  });

  it.each([
    ["already complete on mount", [true]],
    ["still incomplete", [false, false]],
  ])("does not emit when %s", async (_label, sequence) => {
    await run(sequence);
    expect(mockEmit).not.toHaveBeenCalled();
  });

  it("emits only once per mount", async () => {
    await run([false, true, false, true]);
    expect(mockEmit).toHaveBeenCalledTimes(1);
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

  it("emits only once per mount", async () => {
    await run([
      [3, 3],
      [4, 3],
    ]);
    expect(mockEmit).toHaveBeenCalledTimes(1);
  });
});

describe("useReviewStreakTrigger", () => {
  const run = (sequence: number[]) =>
    renderWithSequence((days: number) => useReviewStreakTrigger(days), sequence);

  it.each([
    ["below the first milestone", [1], 0],
    ["the first milestone", [1, 3], 1],
    ["a repeated milestone", [3, 3], 1],
    ["each newly reached milestone", [1, 3, 8], 2],
  ])("emits once per milestone for %s", async (_label, sequence, count) => {
    await run(sequence);
    expect(mockEmit).toHaveBeenCalledTimes(count);
  });

  it("defers streak milestones to home", async () => {
    await run([3]);
    expect(mockEmit).toHaveBeenCalledWith(APP_FEEDBACK_TRIGGER_IDS.streak_milestone, {
      deferRoute: "home",
    });
  });
});

describe("useReviewDailyTrackingInteraction", () => {
  const trackInteraction = jest.fn();

  beforeEach(() => {
    trackInteraction.mockClear();
    registerReviewEngagement({
      trackInteraction,
      recordError: jest.fn(),
      getRuntime: jest.fn(),
    } as never);
  });

  afterEach(() => {
    registerReviewEngagement(null);
  });

  it.each([
    ["nothing is logged", [0], 0],
    ["the first obligatory Salah is logged", [0, 1], 1],
    ["more Salah follow", [0, 1, 2], 1],
  ])("tracks daily_tracking once when %s", async (_label, sequence, count) => {
    await renderWithSequence((n: number) => useReviewDailyTrackingInteraction(n), sequence);
    expect(trackInteraction).toHaveBeenCalledTimes(count);
  });
});

describe("useReviewRouteTrigger", () => {
  afterEach(() => {
    registerReviewTriggerFlush(null);
    clearPendingReviewTrigger();
  });

  it("flushes a pending trigger deferred to the focused route", async () => {
    const flush = jest.fn();
    registerReviewTriggerFlush(flush);
    emitReviewTrigger(APP_FEEDBACK_TRIGGER_IDS.weekly_report, { deferRoute: "home" });

    await renderHook(() => useReviewRouteTrigger("home"));
    expect(flush).toHaveBeenCalledWith(APP_FEEDBACK_TRIGGER_IDS.weekly_report);
  });
});
