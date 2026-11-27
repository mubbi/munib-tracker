import { WHITE_DAYS_CHECKLIST } from "@munib-tracker/shared/content/white-days-checklist";
import { fireEvent, screen } from "@testing-library/react-native";

import { WhiteDaysGoalReminder } from "@/components/white-days-goal-reminder";
import {
  isWhiteDay,
  whiteDayFastsForHijriMonth,
  whiteDaysChecklistHref,
  whiteDaysHijriMonthKey,
} from "@/lib/white-days";
import { voluntaryFastingStore } from "@/stores/voluntary-fasting-store";
import { whiteDaysChecklistStore } from "@/stores/white-days-checklist-store";
import { mockRouter, resetExpoRouterMock } from "@/test-support/mocks/expo-router";
import { usePlatform } from "@/test-support/platform";
import { renderWithTheme } from "@/test-support/render";

jest.mock("expo-router", () => require("@/test-support/mocks/expo-router").expoRouterMock);
jest.mock("@/lib/white-days", () => ({
  ...jest.requireActual("@/lib/white-days"),
  isWhiteDay: jest.fn(() => true),
  // Pin the Hijri month (Safar 1448: all three White Days apply).
  whiteDaysHijriMonthKey: jest.fn(() => "1448-2"),
}));

const FASTS = whiteDayFastsForHijriMonth(1448, 2);
const TOTAL = WHITE_DAYS_CHECKLIST.length;
const markAllDone = () =>
  Object.fromEntries(
    FASTS.map((fast) => [fast.date, { status: "fasted" as const, updatedAt: "2026-01-01T00:00Z" }]),
  );

beforeEach(() => {
  resetExpoRouterMock();
  jest.mocked(isWhiteDay).mockReturnValue(true);
  jest.mocked(whiteDaysHijriMonthKey).mockReturnValue("1448-2");
  whiteDaysChecklistStore.setState({ done: {}, isReady: true });
  voluntaryFastingStore.setState({ entries: {}, isReady: true });
});

describe("WhiteDaysGoalReminder", () => {
  it("counts kept fasts from the voluntary-fasting log, not intended ones", async () => {
    const [first, second] = FASTS;
    voluntaryFastingStore.setState({
      entries: {
        [first?.date as string]: { status: "fasted", updatedAt: "2026-01-01T00:00Z" },
        [second?.date as string]: { status: "intended", updatedAt: "2026-01-01T00:00Z" },
      },
    });
    await renderWithTheme(<WhiteDaysGoalReminder />);

    expect(screen.getByText(`Open White Days checklist · 1/${TOTAL} fasted`)).toBeTruthy();
  });

  it("in Dhul-Hijjah counts only the 14th and 15th", async () => {
    jest.mocked(whiteDaysHijriMonthKey).mockReturnValue("1448-12");
    await renderWithTheme(<WhiteDaysGoalReminder />);

    expect(screen.getByText("Open White Days checklist · 0/2 fasted")).toBeTruthy();
  });

  it("is hidden outside the White Days", async () => {
    jest.mocked(isWhiteDay).mockReturnValue(false);
    await renderWithTheme(<WhiteDaysGoalReminder />);

    expect(screen.toJSON()).toBeNull();
  });

  it("nudges toward fasting with this month's progress", async () => {
    await renderWithTheme(<WhiteDaysGoalReminder />);

    expect(screen.getByText("White Days fasting")).toBeTruthy();
    expect(screen.getByText(`Open White Days checklist · 0/${TOTAL} fasted`)).toBeTruthy();
  });

  it("celebrates all three fasts", async () => {
    voluntaryFastingStore.setState({ entries: markAllDone() });
    await renderWithTheme(<WhiteDaysGoalReminder />);

    expect(
      screen.getByText("All three White Days marked — may Allah accept your fasts."),
    ).toBeTruthy();
  });

  it("opens the checklist", async () => {
    await renderWithTheme(<WhiteDaysGoalReminder />);

    await fireEvent.press(screen.getByRole("button", { name: "Open White Days checklist" }));

    expect(mockRouter.push).toHaveBeenCalledWith(whiteDaysChecklistHref());
  });
});

describe("WhiteDaysGoalReminder on TV", () => {
  usePlatform({ isTV: true });

  it("still offers the checklist", async () => {
    await renderWithTheme(<WhiteDaysGoalReminder />);

    expect(screen.getByRole("button", { name: "Open White Days checklist" })).toBeTruthy();
  });
});
