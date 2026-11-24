import { fireEvent, screen } from "@testing-library/react-native";

import { TravelGuideContent } from "@/components/travel/travel-guide-content";
import { mockRouter, resetExpoRouterMock } from "@/test-support/mocks/expo-router";
import { mockTrackerExcused, resetTrackerExcusedMock } from "@/test-support/mocks/tracker-store";
import { resetMockWindowSize, setMockWindowSize } from "@/test-support/mocks/use-window-dimensions";
import { renderWithTheme } from "@/test-support/render";

jest.mock("expo-router", () => require("@/test-support/mocks/expo-router").expoRouterMock);
jest.mock("@/components/ui/sheet", () => require("@/test-support/mocks/sheet").sheetMock);
jest.mock("@/stores/tracker-store", () =>
  require("@/test-support/mocks/tracker-store").trackerStoreExcusedMock(),
);
jest.mock(
  "@/providers/audio-player-provider",
  () => require("@/test-support/mocks/audio-player-provider").audioPlayerProviderMock,
);
jest.mock(
  "@/hooks/use-quran-ayah-range",
  () => require("@/test-support/mocks/use-quran-ayah-range").quranAyahRangeMock,
);
jest.mock(
  "react-native/Libraries/Utilities/useWindowDimensions",
  () => require("@/test-support/mocks/use-window-dimensions").useWindowDimensionsMock,
);

const MARK = "Start excused period (travel)";

describe("TravelGuideContent", () => {
  beforeEach(() => {
    resetTrackerExcusedMock();
    resetExpoRouterMock();
  });
  afterEach(resetMockWindowSize);

  it("shows the rakah table", async () => {
    await renderWithTheme(<TravelGuideContent />);
    expect(screen.getByText("Rakahs at a glance")).toBeTruthy();
  });

  it("asks the qasr questions, then marks the day excused", async () => {
    await renderWithTheme(<TravelGuideContent />);
    await fireEvent.press(screen.getByText(MARK));
    expect(screen.getByText("Trip distance (one way)")).toBeTruthy();
    expect(screen.getByText("Days you intend to stay")).toBeTruthy();
    await fireEvent.press(screen.getByText("Turn on travel mode"));
    expect(mockTrackerExcused.setDayExcused).toHaveBeenCalledWith("travel");
  });

  it("closes the confirmation without marking", async () => {
    await renderWithTheme(<TravelGuideContent />);
    await fireEvent.press(screen.getByText(MARK));
    await fireEvent.press(screen.getByText("Cancel"));
    expect(mockTrackerExcused.setDayExcused).not.toHaveBeenCalled();
  });

  it("resumes tracking when travel is already active", async () => {
    mockTrackerExcused.reason = "travel";
    await renderWithTheme(<TravelGuideContent />);
    await fireEvent.press(screen.getByText("Resume obligatory tracking"));
    expect(mockTrackerExcused.setDayExcused).toHaveBeenCalledWith(null);
  });

  it("links to the travel duas", async () => {
    await renderWithTheme(<TravelGuideContent />);
    await fireEvent.press(screen.getByText("Travel duas & supplications"));
    expect(mockRouter.push).toHaveBeenCalledWith("/dua/travel");
  });

  it("uses the two-pane layout on wide screens", async () => {
    setMockWindowSize(1400);
    await renderWithTheme(<TravelGuideContent />);
    expect(screen.getByText(MARK)).toBeTruthy();
    expect(screen.getByText("Rakahs at a glance")).toBeTruthy();
  });
});
