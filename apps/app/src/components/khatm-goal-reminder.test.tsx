import { fireEvent, screen } from "@testing-library/react-native";

import { KhatmGoalReminder } from "@/components/khatm-goal-reminder";
import { buildKhatmPlan } from "@/test-support/fixtures/khatm";
import { seedKhatm } from "@/test-support/khatm-store";
import { mockRouter, resetExpoRouterMock } from "@/test-support/mocks/expo-router";
import { renderWithTheme } from "@/test-support/render";

jest.mock("expo-router", () => require("@/test-support/mocks/expo-router").expoRouterMock);

beforeEach(resetExpoRouterMock);
afterEach(() => seedKhatm({ plan: null }));

describe("KhatmGoalReminder", () => {
  it("is hidden without an active plan", async () => {
    await seedKhatm({ plan: null });
    await renderWithTheme(<KhatmGoalReminder />);

    expect(screen.toJSON()).toBeNull();
  });

  it.each([
    ["ayah", 0, "Khatm catch-up", "Log 0/208 ayahs toward today's khatm goal."],
    ["page", 0, "Khatm catch-up", "Log 0/21 pages toward today's khatm goal."],
    ["ayah", 6236, "Today's khatm reading is on track — keep going.", "208/208"],
  ] as const)("%s plan with %i read: %s", async (unit, ayahsRead, title, body) => {
    await seedKhatm({ plan: buildKhatmPlan({ unit }), ayahsRead });
    await renderWithTheme(<KhatmGoalReminder />);

    expect(screen.getByText(title)).toBeTruthy();
    expect(screen.getByText(body)).toBeTruthy();
  });

  it("adds the plan shortcut with today's progress while unfinished", async () => {
    await seedKhatm({ plan: buildKhatmPlan({ day: 2 }), ayahsRead: 300 });
    await renderWithTheme(<KhatmGoalReminder />);

    expect(screen.getByText(/Open khatm plan · 92\/208/)).toBeTruthy();
  });

  it("opens the plan", async () => {
    await seedKhatm({ plan: buildKhatmPlan(), ayahsRead: 0 });
    await renderWithTheme(<KhatmGoalReminder />);

    await fireEvent.press(screen.getByRole("button", { name: "Open khatm plan" }));

    expect(mockRouter.push).toHaveBeenCalledWith("/quran/khatm");
  });
});
