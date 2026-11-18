import { renderHook } from "@testing-library/react-native";

import i18n from "@/i18n";
import { buildPrayerTimeMap } from "@/lib/prayer-times";
import { buildStoredLocation } from "@/test-support/fixtures/location";
import { resetPreferences, setPreferences } from "@/test-support/preferences";

import { usePrayerTimesForDate } from "./use-prayer-times-for-date";

jest.mock("@/lib/prayer-times", () => ({
  buildPrayerTimeMap: jest.fn(() => ({ fajr: "05:00" })),
}));
jest.mock("@/stores/location-store", () => ({ useLocation: () => mockLocation }));

const mockLocation = buildStoredLocation({ timeZone: "Europe/London" });
const buildMock = buildPrayerTimeMap as jest.Mock;

beforeEach(async () => {
  buildMock.mockClear();
  await setPreferences({ timeFormat: "12" });
});
afterEach(resetPreferences);

function expectBuiltFor(day: Date) {
  expect(buildMock).toHaveBeenCalledWith(
    { latitude: mockLocation.latitude, longitude: mockLocation.longitude },
    day,
    mockLocation.method,
    mockLocation.madhab,
    i18n.t("home.scheduleAnyTime"),
    "12",
    "Europe/London",
  );
}

describe("usePrayerTimesForDate", () => {
  it("computes the times at local noon on the given date", async () => {
    const { result } = await renderHook(() => usePrayerTimesForDate("2026-12-01"));
    expect(result.current).toEqual({ fajr: "05:00" });
    expectBuiltFor(new Date("2026-12-01T12:00:00"));
  });
});
