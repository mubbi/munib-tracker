import { FRIDAY_CHECKLIST } from "@munib-tracker/shared/content/friday-checklist";
import { getLocalDateString } from "@munib-tracker/shared/utils";
import { fireEvent, screen } from "@testing-library/react-native";

import { FridayGoalReminder } from "@/components/friday-goal-reminder";
import { fridayChecklistHref, isFriday } from "@/lib/friday";
import { fridayCheckKey, fridayChecklistStore } from "@/stores/friday-checklist-store";
import { mockRouter, resetExpoRouterMock } from "@/test-support/mocks/expo-router";
import { usePlatform } from "@/test-support/platform";
import { renderWithTheme } from "@/test-support/render";

jest.mock("expo-router", () => require("@/test-support/mocks/expo-router").expoRouterMock);
jest.mock("@/lib/friday", () => ({
  ...jest.requireActual("@/lib/friday"),
  isFriday: jest.fn(() => true),
}));

const TOTAL = FRIDAY_CHECKLIST.length;
const markAllDone = () =>
  Object.fromEntries(
    FRIDAY_CHECKLIST.map((item) => [fridayCheckKey(item.id, getLocalDateString()), true]),
  );

beforeEach(() => {
  resetExpoRouterMock();
  jest.mocked(isFriday).mockReturnValue(true);
  fridayChecklistStore.setState({ done: {}, isReady: true });
});

describe("FridayGoalReminder", () => {
  it("is hidden on other days", async () => {
    jest.mocked(isFriday).mockReturnValue(false);
    await renderWithTheme(<FridayGoalReminder />);

    expect(screen.toJSON()).toBeNull();
  });

  it("nudges toward Friday sunnah with progress", async () => {
    await renderWithTheme(<FridayGoalReminder />);

    expect(screen.getByText("Jumu'ah Mubarak")).toBeTruthy();
    expect(screen.getByText(`Open Jumu'ah checklist · 0/${TOTAL}`)).toBeTruthy();
  });

  it("celebrates when every practice is logged", async () => {
    fridayChecklistStore.setState({ done: markAllDone() });
    await renderWithTheme(<FridayGoalReminder />);

    expect(screen.getByText("All Friday practices logged — may Allah accept them.")).toBeTruthy();
    expect(screen.getByText(`${TOTAL}/${TOTAL}`)).toBeTruthy();
  });

  it("opens the checklist", async () => {
    await renderWithTheme(<FridayGoalReminder />);

    await fireEvent.press(screen.getByRole("button", { name: "Open Jumu'ah checklist" }));

    expect(mockRouter.push).toHaveBeenCalledWith(fridayChecklistHref());
  });
});

describe("FridayGoalReminder on TV", () => {
  usePlatform({ isTV: true });

  it("still offers the checklist", async () => {
    await renderWithTheme(<FridayGoalReminder />);

    expect(screen.getByRole("button", { name: "Open Jumu'ah checklist" })).toBeTruthy();
  });
});
