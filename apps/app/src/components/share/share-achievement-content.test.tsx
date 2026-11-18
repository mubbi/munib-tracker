import { screen } from "@testing-library/react-native";

import { ShareAchievementContent } from "@/components/share/share-achievement-content";
import { renderWithTheme } from "@/test-support/render";

describe("ShareAchievementContent", () => {
  it("shows the track, level, title and description", async () => {
    await renderWithTheme(
      <ShareAchievementContent
        title="Steadfast"
        description="30 days of Fajr"
        trackLabel="Salah"
        level={3}
      />,
    );
    expect(screen.getByText("Salah · L3")).toBeTruthy();
    expect(screen.getByText("Steadfast")).toBeTruthy();
    expect(screen.getByText("30 days of Fajr")).toBeTruthy();
  });
});
