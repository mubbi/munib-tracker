import { fireEvent, screen } from "@testing-library/react-native";

import { ExcusedGuideContent } from "@/components/excused/excused-guide-content";
import { mockTrackerExcused, resetTrackerExcusedMock } from "@/test-support/mocks/tracker-store";
import { resetMockWindowSize, setMockWindowSize } from "@/test-support/mocks/use-window-dimensions";
import { renderWithTheme } from "@/test-support/render";

jest.mock("@/components/ui/sheet", () => require("@/test-support/mocks/sheet").sheetMock);
jest.mock("@/stores/tracker-store", () =>
  require("@/test-support/mocks/tracker-store").trackerStoreExcusedMock(),
);
jest.mock(
  "@/providers/audio-player-provider",
  () => require("@/test-support/mocks/audio-player-provider").audioPlayerProviderMock,
);
jest.mock(
  "react-native/Libraries/Utilities/useWindowDimensions",
  () => require("@/test-support/mocks/use-window-dimensions").useWindowDimensionsMock,
);

describe("ExcusedGuideContent", () => {
  beforeEach(resetTrackerExcusedMock);
  afterEach(resetMockWindowSize);

  it.each([
    ["hayd", "hayd"],
    ["sick", "illness"],
    ["travel", "travel"],
  ] as const)("renders the %s guide", async (reason, label) => {
    await renderWithTheme(<ExcusedGuideContent reason={reason} />);
    expect(screen.getByText(`Start excused period (${label})`)).toBeTruthy();
  });

  it("shows hadith evidence for hayd", async () => {
    await renderWithTheme(<ExcusedGuideContent reason="hayd" />);
    expect(screen.getByText("From the Sunnah")).toBeTruthy();
  });

  it("marks the day excused after confirmation", async () => {
    await renderWithTheme(<ExcusedGuideContent reason="sick" />);
    await fireEvent.press(screen.getByText("Start excused period (illness)"));
    await fireEvent.press(screen.getByText("Mark excused"));
    expect(mockTrackerExcused.setDayExcused).toHaveBeenCalledWith("sick");
  });

  it("starts a nifas period from the hayd guide", async () => {
    await renderWithTheme(<ExcusedGuideContent reason="hayd" />);
    await fireEvent.press(screen.getByText("Start excused period (nifas)"));
    await fireEvent.press(screen.getByText("Mark excused"));
    expect(mockTrackerExcused.setDayExcused).toHaveBeenCalledWith("nifas");
  });

  it("shows resume on the hayd guide while nifas is active", async () => {
    mockTrackerExcused.reason = "nifas";
    await renderWithTheme(<ExcusedGuideContent reason="hayd" />);
    await fireEvent.press(screen.getByText("Resume obligatory tracking"));
    expect(mockTrackerExcused.setDayExcused).toHaveBeenCalledWith(null);
  });

  it("closes the confirmation without marking", async () => {
    await renderWithTheme(<ExcusedGuideContent reason="sick" />);
    await fireEvent.press(screen.getByText("Start excused period (illness)"));
    await fireEvent.press(screen.getByText("Cancel"));
    expect(mockTrackerExcused.setDayExcused).not.toHaveBeenCalled();
  });

  it("resumes tracking when the reason is active", async () => {
    mockTrackerExcused.reason = "hayd";
    await renderWithTheme(<ExcusedGuideContent reason="hayd" />);
    await fireEvent.press(screen.getByText("Resume obligatory tracking"));
    expect(mockTrackerExcused.setDayExcused).toHaveBeenCalledWith(null);
  });

  it("uses the two-pane layout on wide screens", async () => {
    setMockWindowSize(1400);
    await renderWithTheme(<ExcusedGuideContent reason="hayd" />);
    expect(screen.getByText("Start excused period (hayd)")).toBeTruthy();
  });
});
