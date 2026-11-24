import { buildWeeklyReport, shouldDeliverWeeklyReport } from "@munib-tracker/shared/utils";
import { act, renderHook } from "@testing-library/react-native";

import { readJSON, writeJSON } from "@/db/store";
import { maybeDeliverReviewReactivation } from "@/features/reviews/lib/maybeDeliverReviewReactivation";
import { scheduleReviewTriggerFromWake } from "@/features/reviews/lib/reviewPendingTrigger";
import i18n from "@/i18n";
import { deferred } from "@/test-support/async";

import { useWeeklyReport } from "./use-weekly-report";

jest.mock("@munib-tracker/shared/utils", () => ({
  ...jest.requireActual("@munib-tracker/shared/utils"),
  buildWeeklyReport: jest.fn(),
  getLocalDateString: () => "2026-11-18",
  shouldDeliverWeeklyReport: jest.fn(() => true),
}));
jest.mock("@/db", () => ({
  PrayerRepository: { getAll: jest.fn(async () => []) },
  QazaRepository: { getAllDailyProgress: jest.fn(async () => []) },
  ZikrRepository: { getAll: jest.fn(async () => []) },
}));
jest.mock("@/db/store", () => ({
  readJSON: jest.fn(async () => undefined),
  writeJSON: jest.fn(async () => undefined),
}));
jest.mock("@/features/reviews/lib/maybeDeliverReviewReactivation", () => ({
  maybeDeliverReviewReactivation: jest.fn(async () => undefined),
}));
jest.mock("@/features/reviews/lib/reviewPendingTrigger", () => ({
  scheduleReviewTriggerFromWake: jest.fn(async () => undefined),
}));
jest.mock("@/providers/in-app-notifications-provider", () => ({
  useInAppNotifications: () => ({ deliver: mockDeliver }),
}));

const mockDeliver = jest.fn(async () => undefined);
const buildMock = buildWeeklyReport as jest.Mock;
const shouldDeliverMock = shouldDeliverWeeklyReport as jest.Mock;

const ACTIVE_WEEK = { prayersCompleted: 20, perfectDays: 2, qazaCleared: 3, zikrSessions: 4 };
const EMPTY_WEEK = { prayersCompleted: 0, perfectDays: 0, qazaCleared: 0, zikrSessions: 0 };

async function setup() {
  const hook = await renderHook(() => useWeeklyReport());
  await act(async () => {
    await Promise.resolve();
  });
  return hook;
}

beforeEach(() => {
  jest.clearAllMocks();
  shouldDeliverMock.mockReturnValue(true);
  buildMock.mockReturnValue(ACTIVE_WEEK);
});

describe("useWeeklyReport", () => {
  it("delivers the weekly report linking to the weekly reflection", async () => {
    await setup();
    expect(readJSON).toHaveBeenCalledWith(expect.any(String), undefined);
    expect(writeJSON).toHaveBeenCalledWith(expect.any(String), expect.any(String));
    expect(mockDeliver).toHaveBeenCalledWith({
      kind: "system",
      id: "weekly-2026-11-18",
      title: i18n.t("weeklyReport.title"),
      body: i18n.t("weeklyReport.body", { prayers: 20, perfect: 2, qaza: 3, zikr: 4 }),
      route: "/coach",
    });
    expect(scheduleReviewTriggerFromWake).toHaveBeenCalled();
    expect(maybeDeliverReviewReactivation).toHaveBeenCalled();
  });

  it("skips when the last report is recent", async () => {
    shouldDeliverMock.mockReturnValue(false);
    await setup();
    expect(buildMock).not.toHaveBeenCalled();
    expect(writeJSON).not.toHaveBeenCalled();
  });

  it.each([
    ["Salah", { ...EMPTY_WEEK, prayersCompleted: 1 }],
    ["zikr", { ...EMPTY_WEEK, zikrSessions: 1 }],
    ["qaza", { ...EMPTY_WEEK, qazaCleared: 1 }],
  ])("delivers for a week with only %s activity", async (_label, week) => {
    buildMock.mockReturnValue(week);
    await setup();
    expect(mockDeliver).toHaveBeenCalled();
  });

  it("marks an empty week handled without notifying", async () => {
    buildMock.mockReturnValue(EMPTY_WEEK);
    await setup();
    expect(writeJSON).toHaveBeenCalled();
    expect(mockDeliver).not.toHaveBeenCalled();
  });

  it("does not deliver after unmount", async () => {
    const lastReport = deferred<string | undefined>();
    (readJSON as jest.Mock).mockReturnValueOnce(lastReport.promise);
    const hook = await renderHook(() => useWeeklyReport());
    await hook.unmount();
    await act(async () => lastReport.resolve(undefined));
    expect(writeJSON).toHaveBeenCalled();
    expect(mockDeliver).not.toHaveBeenCalled();
  });
});
