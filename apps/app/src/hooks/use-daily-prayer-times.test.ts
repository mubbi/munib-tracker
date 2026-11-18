import { renderHook } from "@testing-library/react-native";

import i18n from "@/i18n";
import { buildPrayerTimeMap } from "@/lib/prayer-times";
import { buildStoredLocation } from "@/test-support/fixtures/location";
import { resetPreferences, setPreferences } from "@/test-support/preferences";

import { useDailyPrayerTimes } from "./use-daily-prayer-times";

jest.mock("@/lib/prayer-times", () => ({
  buildPrayerTimeMap: jest.fn(() => ({ fajr: "05:00" })),
}));
jest.mock("@/stores/location-store", () => ({ useLocation: () => mockLocation }));
jest.mock("@/hooks/use-now", () => ({ useNow: () => mockNow }));

const mockLocation = buildStoredLocation({ timeZone: "Europe/London" });
const mockNow = new Date("2026-11-18T09:30:00Z");
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

describe("useDailyPrayerTimes", () => {
  it("computes today's times for the saved location", async () => {
    const { result } = await renderHook(() => useDailyPrayerTimes());
    expect(result.current).toEqual({ fajr: "05:00" });
    expectBuiltFor(mockNow);
  });
});
