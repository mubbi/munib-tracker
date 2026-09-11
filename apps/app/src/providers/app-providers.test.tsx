import { act, render, screen } from "@testing-library/react-native";
import { AppState, Text } from "react-native";

const mockStores = {
  trackerDate: "2026-07-03",
  trackerLoad: jest.fn(),
  trackerRefresh: jest.fn(),
  locationLoad: jest.fn(),
  locationRefresh: jest.fn(),
  locationCoords: { latitude: 24.86, longitude: 67.0 },
  locationListeners: new Set<() => void>(),
  weatherLoad: jest.fn(),
  weatherSync: jest.fn(),
  quranLoad: jest.fn(),
  continueLoad: jest.fn(),
};

const mockPrefs = {
  isReady: true,
  hasCompletedOnboarding: true,
  listeners: new Set<() => void>(),
};

jest.mock("@munib-tracker/shared/utils", () => {
  const actual = jest.requireActual(
    "@munib-tracker/shared/utils",
  ) as typeof import("@munib-tracker/shared/utils");
  return {
    ...actual,
    msUntilNextLocalMidnight: jest.fn(() => 25),
    getLocalDateString: jest.fn(() => "2026-07-03"),
  };
});

jest.mock("@/stores/tracker-store", () => ({
  trackerStore: {
    getState: () => ({
      date: mockStores.trackerDate,
      load: mockStores.trackerLoad,
      refresh: mockStores.trackerRefresh,
    }),
  },
}));

jest.mock("@/stores/location-store", () => ({
  locationStore: {
    getState: () => ({
      location: mockStores.locationCoords,
      load: mockStores.locationLoad,
      refresh: mockStores.locationRefresh,
    }),
    subscribe: (listener: () => void) => {
      mockStores.locationListeners.add(listener);
      return () => mockStores.locationListeners.delete(listener);
    },
  },
}));

jest.mock("@/stores/weather-store", () => ({
  weatherStore: {
    getState: () => ({
      load: mockStores.weatherLoad,
      sync: mockStores.weatherSync,
    }),
  },
}));

jest.mock("@/stores/quran-store", () => ({
  quranStore: {
    getState: () => ({ load: mockStores.quranLoad }),
  },
}));

jest.mock("@/stores/continue-store", () => ({
  continueStore: {
    getState: () => ({ load: mockStores.continueLoad }),
  },
}));

jest.mock("@/stores/preferences-store", () => ({
  preferencesStore: {
    getState: () => ({
      isReady: mockPrefs.isReady,
      prefs: { hasCompletedOnboarding: mockPrefs.hasCompletedOnboarding },
    }),
    subscribe: (listener: () => void) => {
      mockPrefs.listeners.add(listener);
      return () => mockPrefs.listeners.delete(listener);
    },
  },
}));

import { getLocalDateString } from "@munib-tracker/shared/utils";
import { AppProviders } from "./app-providers";

describe("AppProviders", () => {
  const getLocalDateStringMock = getLocalDateString as jest.MockedFunction<
    typeof getLocalDateString
  >;
  let appStateHandler: ((status: string) => void) | undefined;
  const removeAppState = jest.fn();

  beforeEach(() => {
    mockStores.trackerDate = "2026-07-03";
    mockStores.locationCoords = { latitude: 24.86, longitude: 67.0 };
    mockStores.locationListeners.clear();
    mockPrefs.isReady = true;
    mockPrefs.hasCompletedOnboarding = true;
    mockPrefs.listeners.clear();
    appStateHandler = undefined;
    getLocalDateStringMock.mockReturnValue("2026-07-03");
    jest.spyOn(AppState, "addEventListener").mockImplementation((_event, handler) => {
      appStateHandler = handler as (status: string) => void;
      return { remove: removeAppState };
    });
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
    jest.restoreAllMocks();
    jest.clearAllMocks();
  });

  it("boots stores, refreshes on resume, and reloads the tracker after midnight", () => {
    const { unmount } = render(
      <AppProviders>
        <Text>ready</Text>
      </AppProviders>,
    );

    expect(screen.getByText("ready")).toBeTruthy();
    expect(mockStores.locationLoad).toHaveBeenCalled();
    expect(mockStores.trackerLoad).toHaveBeenCalled();
    expect(mockStores.quranLoad).toHaveBeenCalled();
    expect(mockStores.continueLoad).toHaveBeenCalled();
    expect(mockStores.weatherLoad).toHaveBeenCalled();

    for (const listener of mockStores.locationListeners) listener();
    expect(mockStores.weatherSync).toHaveBeenCalledTimes(1);
    for (const listener of mockStores.locationListeners) listener();
    expect(mockStores.weatherSync).toHaveBeenCalledTimes(1);

    mockStores.locationCoords = { latitude: 21.42, longitude: 39.83 };
    for (const listener of mockStores.locationListeners) listener();
    expect(mockStores.weatherSync).toHaveBeenCalledTimes(2);

    mockStores.trackerLoad.mockClear();
    mockStores.trackerRefresh.mockClear();
    act(() => {
      appStateHandler?.("background");
    });
    expect(mockStores.trackerRefresh).not.toHaveBeenCalled();

    act(() => {
      appStateHandler?.("active");
    });
    expect(mockStores.locationRefresh).toHaveBeenCalled();
    expect(mockStores.trackerRefresh).toHaveBeenCalled();
    expect(mockStores.trackerLoad).not.toHaveBeenCalled();

    getLocalDateStringMock.mockReturnValue("2026-07-04");
    act(() => {
      appStateHandler?.("active");
    });
    expect(mockStores.trackerLoad).toHaveBeenCalled();

    mockStores.trackerLoad.mockClear();
    act(() => {
      jest.advanceTimersByTime(25);
    });
    expect(mockStores.trackerLoad).toHaveBeenCalled();

    unmount();
    expect(removeAppState).toHaveBeenCalled();
  });

  it("does not warm home stores before preferences hydrate", () => {
    mockPrefs.isReady = false;

    const { unmount } = render(
      <AppProviders>
        <Text>ready</Text>
      </AppProviders>,
    );

    expect(mockStores.locationLoad).not.toHaveBeenCalled();
    expect(mockStores.weatherLoad).not.toHaveBeenCalled();
    unmount();
  });

  it("does not warm home stores during onboarding, then boots when it completes", () => {
    mockPrefs.hasCompletedOnboarding = false;

    const { unmount } = render(
      <AppProviders>
        <Text>ready</Text>
      </AppProviders>,
    );

    expect(mockStores.locationLoad).not.toHaveBeenCalled();
    expect(mockStores.trackerLoad).not.toHaveBeenCalled();
    expect(mockStores.quranLoad).not.toHaveBeenCalled();
    expect(mockStores.continueLoad).not.toHaveBeenCalled();
    expect(mockStores.weatherLoad).not.toHaveBeenCalled();
    expect(mockStores.weatherSync).not.toHaveBeenCalled();

    mockPrefs.hasCompletedOnboarding = true;
    act(() => {
      for (const listener of mockPrefs.listeners) listener();
    });

    expect(mockStores.locationLoad).toHaveBeenCalled();
    expect(mockStores.trackerLoad).toHaveBeenCalled();
    expect(mockStores.quranLoad).toHaveBeenCalled();
    expect(mockStores.continueLoad).toHaveBeenCalled();
    expect(mockStores.weatherLoad).toHaveBeenCalled();

    unmount();
  });
});
