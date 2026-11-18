import { fireEvent, screen } from "@testing-library/react-native";

import { KhatmDailyChecklist } from "@/components/khatm-daily-checklist";
import { buildKhatmPlan } from "@/test-support/fixtures/khatm";
import { seedKhatm } from "@/test-support/khatm-store";
import { mockRouter, resetExpoRouterMock } from "@/test-support/mocks/expo-router";
import { renderWithTheme } from "@/test-support/render";

jest.mock("expo-router", () => require("@/test-support/mocks/expo-router").expoRouterMock);

beforeEach(resetExpoRouterMock);
afterEach(() => seedKhatm({ plan: null }));

describe("KhatmDailyChecklist", () => {
  it("is hidden without an active plan", async () => {
    await seedKhatm({ plan: null });
    await renderWithTheme(<KhatmDailyChecklist />);

    expect(screen.toJSON()).toBeNull();
  });

  it.each([
    ["ayah", 0, "208 ayahs toward today's goal — tap to log", "Behind"],
    ["page", 5, "21 pages toward today's goal — tap to log", "Behind"],
    ["ayah", 208, "Today's portion is done — tap to review your plan", "On track"],
    ["ayah", 400, "Today's portion is done — tap to review your plan", "Ahead"],
  ] as const)("%s plan with %i read shows %s (%s)", async (unit, ayahsRead, hint, pace) => {
    await seedKhatm({ plan: buildKhatmPlan({ unit }), ayahsRead });
    await renderWithTheme(<KhatmDailyChecklist />);

    expect(screen.getByText(hint)).toBeTruthy();
    expect(screen.getByText(pace)).toBeTruthy();
  });

  it("opens the planner from the card", async () => {
    await seedKhatm({ plan: buildKhatmPlan({ day: 3 }), ayahsRead: 500 });
    await renderWithTheme(<KhatmDailyChecklist />);

    await fireEvent.press(screen.getByRole("button", { name: /^Khatm plan day 3 of 30/ }));

    expect(mockRouter.push).toHaveBeenCalledWith("/quran/khatm");
  });
});
