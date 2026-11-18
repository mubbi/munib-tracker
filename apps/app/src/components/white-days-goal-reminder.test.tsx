import { WHITE_DAYS_CHECKLIST } from "@munib-tracker/shared/content/white-days-checklist";
import { fireEvent, screen } from "@testing-library/react-native";

import { WhiteDaysGoalReminder } from "@/components/white-days-goal-reminder";
import { isWhiteDay, whiteDaysChecklistHref, whiteDaysHijriMonthKey } from "@/lib/white-days";
import { whiteDaysCheckKey, whiteDaysChecklistStore } from "@/stores/white-days-checklist-store";
import { mockRouter, resetExpoRouterMock } from "@/test-support/mocks/expo-router";
import { usePlatform } from "@/test-support/platform";
import { renderWithTheme } from "@/test-support/render";

jest.mock("expo-router", () => require("@/test-support/mocks/expo-router").expoRouterMock);
jest.mock("@/lib/white-days", () => ({
  ...jest.requireActual("@/lib/white-days"),
  isWhiteDay: jest.fn(() => true),
}));

const TOTAL = WHITE_DAYS_CHECKLIST.length;
const markAllDone = () =>
  Object.fromEntries(
    WHITE_DAYS_CHECKLIST.map((item) => [
      whiteDaysCheckKey(item.id, whiteDaysHijriMonthKey()),
      true,
    ]),
  );

beforeEach(() => {
  resetExpoRouterMock();
  jest.mocked(isWhiteDay).mockReturnValue(true);
  whiteDaysChecklistStore.setState({ done: {}, isReady: true });
});

describe("WhiteDaysGoalReminder", () => {
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
    whiteDaysChecklistStore.setState({ done: markAllDone() });
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
