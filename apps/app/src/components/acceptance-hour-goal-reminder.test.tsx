import { fireEvent, renderHook, screen } from "@testing-library/react-native";

import {
  AcceptanceHourGoalReminder,
  useAcceptanceHourActive,
} from "@/components/acceptance-hour-goal-reminder";
import { useNow } from "@/hooks/use-now";
import { ACCEPTANCE_HOUR_ROUTE, isAcceptanceHourWindow } from "@/lib/acceptance-hour";
import { isFridayDateString } from "@/lib/friday";
import { locationStore } from "@/stores/location-store";
import { firstDateWhere } from "@/test-support/dates";
import { buildStoredLocation } from "@/test-support/fixtures/location";
import { mockRouter, resetExpoRouterMock } from "@/test-support/mocks/expo-router";
import { usePlatform } from "@/test-support/platform";
import { renderWithTheme } from "@/test-support/render";

jest.mock("expo-router", () => require("@/test-support/mocks/expo-router").expoRouterMock);
jest.mock("@/hooks/use-now", () => ({ useNow: jest.fn() }));
jest.mock("@/lib/acceptance-hour", () => ({
  ...jest.requireActual("@/lib/acceptance-hour"),
  isAcceptanceHourWindow: jest.fn(() => true),
}));

const FRIDAY = firstDateWhere(isFridayDateString);
const THURSDAY = firstDateWhere((d) => !isFridayDateString(d));
const initialLocation = locationStore.getState().location;

const at = (date: string, hour: number) => {
  const [y, m, d] = date.split("-").map(Number);
  jest.mocked(useNow).mockReturnValue(new Date(y!, m! - 1, d!, hour, 0));
};
const useFallbackLocation = () =>
  locationStore.setState({ location: buildStoredLocation({ source: "default" }) });

beforeEach(resetExpoRouterMock);
afterEach(() => locationStore.setState({ location: initialLocation }));

describe("useAcceptanceHourActive", () => {
  it("is closed on other days", async () => {
    at(THURSDAY, 16);
    const { result } = await renderHook(() => useAcceptanceHourActive());

    expect(result.current).toBe(false);
  });

  it.each([
    [16, true],
    [10, false],
  ])("uses the late-afternoon fallback without a location (%i:00 → %s)", async (hour, open) => {
    useFallbackLocation();
    at(FRIDAY, hour);
    const { result } = await renderHook(() => useAcceptanceHourActive());

    expect(result.current).toBe(open);
  });

  it("uses Asr → Maghrib for a known location", async () => {
    locationStore.setState({ location: buildStoredLocation() });
    at(FRIDAY, 16);
    const { result } = await renderHook(() => useAcceptanceHourActive());

    expect(result.current).toBe(true);
    expect(isAcceptanceHourWindow).toHaveBeenCalledWith(
      expect.any(Date),
      expect.any(Date),
      expect.any(Date),
    );
  });
});

describe("AcceptanceHourGoalReminder", () => {
  it("is hidden outside the window", async () => {
    at(THURSDAY, 16);
    await renderWithTheme(<AcceptanceHourGoalReminder />);

    expect(screen.toJSON()).toBeNull();
  });

  it("opens the hour-of-acceptance guide during the window", async () => {
    useFallbackLocation();
    at(FRIDAY, 16);
    await renderWithTheme(<AcceptanceHourGoalReminder />);

    await fireEvent.press(screen.getByRole("button", { name: "Open hour of acceptance" }));

    expect(screen.getByText("The hour of acceptance")).toBeTruthy();
    expect(mockRouter.push).toHaveBeenCalledWith(ACCEPTANCE_HOUR_ROUTE);
  });
});

describe("AcceptanceHourGoalReminder on TV", () => {
  usePlatform({ isTV: true });

  it("shows the banner during the window", async () => {
    useFallbackLocation();
    at(FRIDAY, 16);
    await renderWithTheme(<AcceptanceHourGoalReminder />);

    expect(screen.getByRole("button", { name: "Open hour of acceptance" })).toBeTruthy();
  });
});
