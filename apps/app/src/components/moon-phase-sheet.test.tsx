import { fireEvent, screen } from "@testing-library/react-native";

import { MoonPhaseSheet } from "@/components/moon-phase-sheet";
import { gregorianToHijri, hijriMonthLength, hijriMonthName } from "@/lib/hijri";
import { moonPhase } from "@/lib/moon";
import { locationStore } from "@/stores/location-store";
import { buildStoredLocation } from "@/test-support/fixtures/location";
import { mockRouter, resetExpoRouterMock } from "@/test-support/mocks/expo-router";
import { usePlatform } from "@/test-support/platform";
import { renderWithTheme } from "@/test-support/render";

jest.mock("expo-router", () => require("@/test-support/mocks/expo-router").expoRouterMock);
jest.mock("@/components/ui/sheet", () => require("@/test-support/mocks/sheet").sheetMock);
jest.mock("@/lib/hijri", () => ({
  ...jest.requireActual("@/lib/hijri"),
  gregorianToHijri: jest.fn(),
}));
jest.mock("@/lib/moon", () => ({ ...jest.requireActual("@/lib/moon"), moonPhase: jest.fn() }));

const YEAR = 1447;
const MONTH = 3;
const LENGTH = hijriMonthLength(YEAR, MONTH);
const THIS_MONTH = hijriMonthName(MONTH, "en");
const NEXT_MONTH = hijriMonthName(MONTH + 1, "en");
const initialLocation = locationStore.getState().location;

const renderSheet = async (day: number, phase: Partial<ReturnType<typeof moonPhase>> = {}) => {
  jest.mocked(gregorianToHijri).mockReturnValue({ year: YEAR, month: MONTH, day } as never);
  jest.mocked(moonPhase).mockReturnValue({
    fraction: 0.3,
    illumination: 0.6,
    waxing: true,
    name: "waxingGibbous",
    ...phase,
  });
  const onClose = jest.fn();
  await renderWithTheme(<MoonPhaseSheet visible date={new Date(2026, 6, 6)} onClose={onClose} />);
  return onClose;
};

beforeEach(resetExpoRouterMock);
afterEach(() => locationStore.setState({ location: initialLocation }));

describe("MoonPhaseSheet", () => {
  it("names the phase with its illumination and direction", async () => {
    await renderSheet(10);

    expect(screen.getByText("60%")).toBeTruthy();
    expect(screen.getByText("Waxing — growing brighter each night")).toBeTruthy();
    expect(screen.getByText(`Day 10 of ${LENGTH} · ${THIS_MONTH}`)).toBeTruthy();
  });

  it("describes a waning moon", async () => {
    await renderSheet(20, { waxing: false, name: "waningGibbous" });

    expect(screen.getByText("Waning — the lit portion is shrinking")).toBeTruthy();
  });

  it.each([
    [10, `~${LENGTH - 10} days · begins ${NEXT_MONTH}`],
    [LENGTH - 1, `~1 day · begins ${NEXT_MONTH}`],
    [LENGTH, `Tonight after Maghrib · begins ${NEXT_MONTH}`],
  ])("on day %i counts down to the next month: %s", async (day, value) => {
    await renderSheet(day);

    expect(screen.getByText(value)).toBeTruthy();
  });

  it.each([
    [1, {}, "A new month begins", THIS_MONTH],
    [LENGTH, {}, "Look for the crescent", NEXT_MONTH],
    [10, { name: "full" as const }, "Full moon tonight", THIS_MONTH],
    [10, {}, "A calendar of the moon", null],
  ])("day %i shows the %s note", async (day, phase, title, month) => {
    await renderSheet(day, phase);

    expect(screen.getByText(title)).toBeTruthy();
    if (month)
      expect(screen.getByText(new RegExp(`(start of|hilāl of|middle of) ${month}`))).toBeTruthy();
  });

  it("links the White Days note to the fasting guide", async () => {
    const onClose = await renderSheet(14, { name: "full" });

    await fireEvent.press(screen.getByLabelText("Learn about White Days fasting"));

    expect(onClose).toHaveBeenCalled();
    expect(mockRouter.push).toHaveBeenCalledWith("/white-days");
  });

  it("mirrors the moon for southern-hemisphere users", async () => {
    locationStore.setState({ location: buildStoredLocation({ latitude: -33.9 }) });
    await renderSheet(10);

    expect(screen.getByText("60%")).toBeTruthy();
  });
});

describe("MoonPhaseSheet on TV", () => {
  usePlatform({ isTV: true });

  it("keeps the White Days link reachable", async () => {
    await renderSheet(13);

    expect(screen.getByLabelText("Learn about White Days fasting")).toBeTruthy();
  });
});
