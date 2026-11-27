import { getLocalDateString } from "@munib-tracker/shared/utils";
import { fireEvent, screen, waitFor } from "@testing-library/react-native";

import VoluntaryFastingScreen from "@/app/fasting";
import { hijriToGregorian } from "@/lib/hijri";
import { voluntaryFastingStore } from "@/stores/voluntary-fasting-store";
import { resetExpoRouterMock, setMockSearchParams } from "@/test-support/mocks/expo-router";
import { renderWithProviders } from "@/test-support/render";
import { resetTrackerStore } from "@/test-support/store";

jest.mock("expo-router", () => require("@/test-support/mocks/expo-router").expoRouterMock);
jest.mock("@/components/ui/sheet", () => require("@/test-support/mocks/sheet").sheetMock);
jest.mock("@/notifications/scheduler", () => ({
  rescheduleAll: jest.fn(() => Promise.resolve()),
}));

const key = (y: number, m: number, d: number) => getLocalDateString(hijriToGregorian(y, m, d));

beforeEach(async () => {
  resetExpoRouterMock();
  await resetTrackerStore();
  voluntaryFastingStore.setState({ entries: {}, isReady: false });
});

describe("Voluntary fasting hub", () => {
  it("renders the hub sections", async () => {
    await renderWithProviders(<VoluntaryFastingScreen />);
    await waitFor(() => expect(screen.getByText("Next 30 days")).toBeTruthy(), {
      timeout: 15_000,
    });
    expect(screen.getByText("Days not to fast")).toBeTruthy();
    expect(screen.getByText("Why these days")).toBeTruthy();
    expect(screen.getByText("No voluntary fasts logged yet.")).toBeTruthy();
  });

  it("opens Eid from a deep link and blocks logging it as fasted", async () => {
    const eid = key(1448, 10, 1);
    setMockSearchParams({ date: eid });
    await renderWithProviders(<VoluntaryFastingScreen />);
    await waitFor(
      () =>
        expect(
          screen.getByText(
            "This day can't be logged as a fast: fasting on Eid and the days of Tashriq is not allowed.",
          ),
        ).toBeTruthy(),
      { timeout: 15_000 },
    );
    // In the day sheet; the "Days not to fast" reference card stays collapsed until opened.
    expect(screen.getAllByText("Fasting on the day of Eid is not allowed.")).toHaveLength(1);
    await fireEvent.press(screen.getByRole("button", { name: "Days not to fast" }));
    expect(screen.getAllByText("Fasting on the day of Eid is not allowed.")).toHaveLength(2);
    fireEvent.press(screen.getByLabelText("Fasted"));
    expect(voluntaryFastingStore.getState().entries[eid]).toBeUndefined();
  });

  it("logs a recommended day from its sheet", async () => {
    const arafah = key(1448, 12, 9);
    setMockSearchParams({ date: arafah });
    await renderWithProviders(<VoluntaryFastingScreen />);
    await waitFor(() => expect(screen.getByLabelText("Intend")).toBeTruthy(), {
      timeout: 15_000,
    });
    fireEvent.press(screen.getByLabelText("Intend"));
    await waitFor(() =>
      expect(voluntaryFastingStore.getState().entries[arafah]?.status).toBe("intended"),
    );
  });
});
