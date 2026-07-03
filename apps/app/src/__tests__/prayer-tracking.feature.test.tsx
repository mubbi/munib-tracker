import { act, screen, waitFor } from "@testing-library/react-native";

import HomeScreen from "@/app/(tabs)/index";
import { trackerStore } from "@/stores/tracker-store";
import { renderWithProviders } from "@/test-support/render";
import { resetTrackerStore } from "@/test-support/store";

beforeEach(async () => {
  await resetTrackerStore();
});

describe("Prayer tracking dashboard", () => {
  it("reflects a completed prayer in the Prayers stat card", async () => {
    renderWithProviders(<HomeScreen />);

    await waitFor(
      () => {
        expect(screen.getByText("0/6")).toBeTruthy();
      },
      { timeout: 5000 },
    );

    await act(async () => {
      await trackerStore.getState().setPrayerStatus("fajr", "completed");
    });

    await waitFor(() => {
      expect(screen.getByText("1/6")).toBeTruthy();
    });
  }, 15_000);
});
