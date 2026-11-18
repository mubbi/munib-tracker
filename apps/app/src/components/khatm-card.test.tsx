import { fireEvent, screen } from "@testing-library/react-native";

import { KhatmCard } from "@/components/khatm-card";
import { buildKhatmPlan } from "@/test-support/fixtures/khatm";
import { seedKhatm } from "@/test-support/khatm-store";
import { mockRouter, resetExpoRouterMock } from "@/test-support/mocks/expo-router";
import { renderWithTheme } from "@/test-support/render";

jest.mock("expo-router", () => require("@/test-support/mocks/expo-router").expoRouterMock);

/** 30-day plan: 208 ayahs / 21 pages a day. */
const AYAH_TARGET = 208;
const PAGE_TARGET = 21;

beforeEach(resetExpoRouterMock);
afterEach(() => seedKhatm({ plan: null }));

describe("KhatmCard", () => {
  it("renders nothing without an active plan", async () => {
    await seedKhatm({ plan: null });
    await renderWithTheme(<KhatmCard />);

    expect(screen.toJSON()).toBeNull();
  });

  it("summarises the plan day, target and progress", async () => {
    await seedKhatm({ plan: buildKhatmPlan({ day: 2 }), ayahsRead: AYAH_TARGET });
    await renderWithTheme(<KhatmCard />);

    expect(screen.getByText(new RegExp(`Day 2 of 30.*${AYAH_TARGET}`))).toBeTruthy();
    expect(screen.getByText(/^3% complete$/)).toBeTruthy();
  });

  it.each([
    [0, "Behind"],
    [AYAH_TARGET, "On track"],
    [AYAH_TARGET + 50, "Ahead"],
    [6236, "Completed"],
  ])("with %i ayahs read reports %s", async (ayahsRead, pace) => {
    await seedKhatm({ plan: buildKhatmPlan(), ayahsRead });
    await renderWithTheme(<KhatmCard />);

    expect(screen.getByText(pace)).toBeTruthy();
  });

  it.each([
    ["ayah", "208 ayahs behind"],
    ["page", "21 pages behind"],
  ] as const)("nudges a %s reader who is behind to catch up", async (unit, copy) => {
    await seedKhatm({ plan: buildKhatmPlan({ unit }), ayahsRead: 0 });
    await renderWithTheme(<KhatmCard />);

    expect(screen.getByText(new RegExp(copy))).toBeTruthy();
  });

  it("counts remaining pages for page plans", async () => {
    await seedKhatm({ plan: buildKhatmPlan({ unit: "page" }), ayahsRead: PAGE_TARGET });
    await renderWithTheme(<KhatmCard />);

    expect(screen.getByText("Remaining pages")).toBeTruthy();
    expect(screen.queryByText(/behind/)).toBeNull();
  });

  it("opens the khatm planner", async () => {
    await seedKhatm({ plan: buildKhatmPlan(), ayahsRead: 10 });
    await renderWithTheme(<KhatmCard />);

    await fireEvent.press(screen.getByRole("button", { name: /^Khatm plan day 1 of 30/ }));

    expect(mockRouter.push).toHaveBeenCalledWith("/quran/khatm");
  });
});
