import { screen } from "@testing-library/react-native";
import type { ReactTestInstance } from "react-test-renderer";

import TrackerScreen from "@/app/(tabs)/tracker";
import { renderWithProviders } from "@/test-support/render";
import { resetTrackerStore, restoreTrackerStore, seedTrackerStore } from "@/test-support/store";

jest.mock("expo-router", () => require("@/test-support/mocks/expo-router").expoRouterMock);
// The checklist's own suite covers its rows; here only its position matters.
jest.mock("@/components/tracker-day-checklist", () => {
  const { View } = require("react-native");
  return {
    TrackerDayChecklist: () =>
      require("react").createElement(View, { testID: "tracker-obligatory" }),
  };
});
jest.mock("@/components/prayer-schedule-card", () => ({ PrayerScheduleCard: () => null }));
jest.mock("@/components/devotion-achievement-summary", () => ({
  DevotionAchievementSummary: () => null,
}));

/** Ids of the screen's sections in render order. */
function sectionOrder(): string[] {
  const ids: string[] = [];
  const walk = (node: ReactTestInstance) => {
    const id = node.props?.testID;
    if (typeof id === "string" && id.startsWith("tracker-") && !ids.includes(id)) ids.push(id);
    for (const child of node.children) if (typeof child !== "string") walk(child);
  };
  walk(screen.root);
  return ids;
}

afterEach(restoreTrackerStore);

describe("Tracker tab layout (P5-01)", () => {
  it("leads with the summary strip, then the Obligatory card", async () => {
    await resetTrackerStore();
    await renderWithProviders(<TrackerScreen />);

    expect(sectionOrder().slice(0, 2)).toEqual(["tracker-summary", "tracker-obligatory"]);
    expect(screen.queryByTestId("tracker-loading")).toBeNull();
  });

  it("shows a skeleton, not empty rows, until the tracker store is ready", async () => {
    await resetTrackerStore();
    await seedTrackerStore({ isReady: false });
    await renderWithProviders(<TrackerScreen />);

    expect(screen.getByTestId("tracker-loading")).toBeTruthy();
    expect(screen.queryByTestId("tracker-obligatory")).toBeNull();
  });
});
