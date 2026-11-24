import { act, fireEvent, screen } from "@testing-library/react-native";

import {
  LIVE_ACTIVITY_DISCOVERY_TOUR_ID,
  LiveActivityDiscoveryBanner,
} from "@/components/notifications/live-activity-discovery-banner";
import { usePlatform } from "@/test-support/platform";
import { renderWithTheme } from "@/test-support/render";

let mockSupported = true;
let mockSeen = false;
const mockUpdate = jest.fn(async (_patch: unknown) => undefined);
const mockMarkSeen = jest.fn(async (_id: string) => undefined);
let mockLiveActivityEnabled = false;

jest.mock("@/lib/live-activity", () => ({ isLiveActivitySupported: () => mockSupported }));
jest.mock("@/stores/tours-store", () => ({
  useHasSeenTour: () => mockSeen,
  useToursActions: () => ({ markSeen: mockMarkSeen }),
}));
// The banner is a shortcut to the registered Live Activity setting (§4.5.4).
jest.mock("@/lib/settings/use-setting", () => ({
  useSetting: () => ({
    value: mockLiveActivityEnabled,
    setValue: (value: boolean) => mockUpdate({ liveActivityEnabled: value }),
  }),
}));

const TITLE = "Try the live countdown";

describe("LiveActivityDiscoveryBanner", () => {
  beforeEach(() => {
    mockSupported = true;
    mockSeen = false;
    mockLiveActivityEnabled = false;
    mockUpdate.mockClear();
    mockMarkSeen.mockClear();
  });

  it("introduces the Lock Screen countdown on iOS", async () => {
    await renderWithTheme(<LiveActivityDiscoveryBanner />);
    expect(screen.getByText(TITLE)).toBeTruthy();
    expect(screen.getByText(/Dynamic Island/)).toBeTruthy();
  });

  it("turns the feature on and dismisses itself", async () => {
    await renderWithTheme(<LiveActivityDiscoveryBanner />);
    await fireEvent.press(screen.getByText("Turn on"));
    await act(async () => {});
    expect(mockUpdate).toHaveBeenCalledWith({ liveActivityEnabled: true });
    expect(mockMarkSeen).toHaveBeenCalledWith(LIVE_ACTIVITY_DISCOVERY_TOUR_ID);
  });

  it("can be dismissed", async () => {
    await renderWithTheme(<LiveActivityDiscoveryBanner />);
    await fireEvent.press(screen.getByLabelText("Dismiss the live countdown tip"));
    expect(mockMarkSeen).toHaveBeenCalledWith(LIVE_ACTIVITY_DISCOVERY_TOUR_ID);
    expect(mockUpdate).not.toHaveBeenCalled();
  });

  it.each([
    ["unsupported", () => (mockSupported = false)],
    ["already on", () => (mockLiveActivityEnabled = true)],
    ["already seen", () => (mockSeen = true)],
  ])("hides when %s", async (_label, arrange) => {
    arrange();
    await renderWithTheme(<LiveActivityDiscoveryBanner />);
    expect(screen.queryByText(TITLE)).toBeNull();
  });

  describe("on Android", () => {
    usePlatform({ OS: "android" });

    it("describes the ongoing notification", async () => {
      mockSupported = false;
      await renderWithTheme(<LiveActivityDiscoveryBanner />);
      expect(screen.getByText(/ongoing notification/)).toBeTruthy();
    });
  });

  describe("on web", () => {
    usePlatform({ OS: "web" });

    it("never shows", async () => {
      await renderWithTheme(<LiveActivityDiscoveryBanner />);
      expect(screen.queryByText(TITLE)).toBeNull();
    });
  });
});
