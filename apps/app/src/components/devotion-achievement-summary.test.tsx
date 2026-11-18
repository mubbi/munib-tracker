import { screen } from "@testing-library/react-native";

import { DevotionAchievementSummary } from "@/components/devotion-achievement-summary";
import { renderWithTheme } from "@/test-support/render";
import { restoreTrackerStore, seedTrackerStore } from "@/test-support/store";

afterEach(restoreTrackerStore);

const seedDevotion = () =>
  seedTrackerStore({
    devotionProgress: {
      level: 4,
      noor: 1250,
      noorForCurrentLevel: 1000,
      noorForNextLevel: 1600,
      progress: 0.42,
    },
  });

describe("DevotionAchievementSummary", () => {
  it("shows the devotion level, Noor and milestone pills", async () => {
    await seedDevotion();
    await renderWithTheme(<DevotionAchievementSummary milestonePillBackground="#eeeeee" />);

    expect(screen.getByText("4")).toBeTruthy();
    expect(screen.getByText("1,250 Noor")).toBeTruthy();
    expect(screen.getByText(/\d+ unlocked/)).toBeTruthy();
  });

  it("reports progress within the current level", async () => {
    await seedDevotion();
    await renderWithTheme(<DevotionAchievementSummary compact milestonePillBackground="#eeeeee" />);

    expect(screen.getByText(/250.*600/)).toBeTruthy();
  });
});
