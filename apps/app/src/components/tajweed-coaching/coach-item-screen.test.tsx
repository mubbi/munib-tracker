import { act, fireEvent, screen } from "@testing-library/react-native";

import TajweedCoachItemScreen from "@/app/learn-quran/tajweed/coach/[item]";
import { recordCoachingListen } from "@/lib/tajweed-coaching/actions";
import { resetAudioPlayerMock } from "@/test-support/mocks/audio-player-provider";
import { resetExpoRouterMock, setMockSearchParams } from "@/test-support/mocks/expo-router";
import { mockToast } from "@/test-support/mocks/toast-provider";
import { usePlatform } from "@/test-support/platform";
import { renderWithTheme } from "@/test-support/render";

jest.mock("expo-router", () => require("@/test-support/mocks/expo-router").expoRouterMock);
jest.mock(
  "@/providers/audio-player-provider",
  () => require("@/test-support/mocks/audio-player-provider").audioPlayerProviderMock,
);
jest.mock(
  "@/providers/toast-provider",
  () => require("@/test-support/mocks/toast-provider").toastProviderMock,
);
jest.mock("@/lib/tajweed-coaching/actions", () => ({
  recordCoachingListen: jest.fn(async () => {}),
  recordCoachingDrill: jest.fn(async () => {}),
}));
jest.mock("@/lib/quran-companion/availability", () => ({
  isPracticeAvailable: jest.fn(() => true),
}));
jest.mock("@/components/tajweed-coaching/drill-take-card", () => ({
  DrillTakeCard: () => null,
}));

const { isPracticeAvailable } = jest.requireMock("@/lib/quran-companion/availability") as {
  isPracticeAvailable: jest.Mock;
};

beforeEach(() => {
  jest.clearAllMocks();
  resetExpoRouterMock();
  resetAudioPlayerMock();
  isPracticeAvailable.mockReturnValue(true);
  setMockSearchParams({ item: "madd" });
});

describe("tajweed coach item screen", () => {
  it("leads with the practice action and keeps the rule explanation collapsed", async () => {
    await renderWithTheme(<TajweedCoachItemScreen />);
    expect(screen.getByText("I listened and repeated")).toBeTruthy();
    const about = screen.getByText(/^About /);
    expect(about).toBeTruthy();
    // Collapsed: its header is a button reporting expanded=false.
    const header = screen
      .getAllByRole("button")
      .find((b) => b.props.accessibilityState?.expanded === false);
    expect(header).toBeTruthy();
  });

  it("logs one listen per visit (a double tap can't count twice)", async () => {
    await renderWithTheme(<TajweedCoachItemScreen />);
    const button = screen.getByText("I listened and repeated");
    await fireEvent.press(button);
    await fireEvent.press(button);
    await act(async () => {});
    expect(recordCoachingListen).toHaveBeenCalledTimes(1);
    expect(mockToast.success).toHaveBeenCalledWith(
      "Noted — this sound will come back in your plan later.",
    );
  });

  describe("read-only (TV / no microphone)", () => {
    usePlatform({ isTV: true });

    it("hides practice and opens the rule explanation", async () => {
      isPracticeAvailable.mockReturnValue(false);
      await renderWithTheme(<TajweedCoachItemScreen />);
      expect(screen.queryByText("I listened and repeated")).toBeNull();
      expect(
        screen.getAllByRole("button").some((b) => b.props.accessibilityState?.expanded === true),
      ).toBe(true);
    });
  });
});
