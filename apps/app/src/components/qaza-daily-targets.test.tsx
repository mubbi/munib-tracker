import { fireEvent, screen } from "@testing-library/react-native";

import { QazaDailyTargets } from "@/components/qaza-daily-targets";
import { buildQazaDailyProgress, buildQazaSchedule } from "@/test-support/fixtures/qaza";
import { resetMockWindowSize, setMockWindowSize } from "@/test-support/mocks/use-window-dimensions";
import { usePlatform } from "@/test-support/platform";
import { renderWithTheme } from "@/test-support/render";
import { restoreTrackerStore, seedTrackerStore } from "@/test-support/store";

jest.mock(
  "react-native/Libraries/Utilities/useWindowDimensions",
  () => require("@/test-support/mocks/use-window-dimensions").useWindowDimensionsMock,
);

const setQazaSchedule = jest.fn(async () => {});

const seed = (targets = { fajr: 2, isha: 1 }) =>
  seedTrackerStore({
    qazaSchedule: buildQazaSchedule({ targets }),
    qazaDailyProgress: buildQazaDailyProgress({ completed: { fajr: 1 } }),
    setQazaSchedule,
  });

beforeEach(() => setQazaSchedule.mockClear());
afterEach(() => {
  restoreTrackerStore();
  resetMockWindowSize();
});

describe("QazaDailyTargets", () => {
  it("frames the schedule with the daily total", async () => {
    await seed();
    await renderWithTheme(<QazaDailyTargets />);

    expect(screen.getByText("Daily schedule")).toBeTruthy();
    expect(screen.getByText("3 Qaza / day")).toBeTruthy();
  });

  it("shows today's progress for prayers with a target", async () => {
    await seed();
    await renderWithTheme(<QazaDailyTargets />);

    expect(screen.getByText("1 / 2 today")).toBeTruthy();
    expect(screen.getAllByText("Set a daily target")).toHaveLength(4);
  });

  it("hides progress when asked", async () => {
    await seed();
    await renderWithTheme(<QazaDailyTargets showProgress={false} />);

    expect(screen.queryByText("1 / 2 today")).toBeNull();
  });

  it("omits the total without any target", async () => {
    await seed({} as never);
    await renderWithTheme(<QazaDailyTargets />);

    expect(screen.queryByText(/qaza \/ day/)).toBeNull();
  });

  it.each([
    [/^Increase Fajr/, 3],
    [/^Decrease Fajr/, 1],
  ])("%s saves the new target", async (label, fajr) => {
    await seed();
    await renderWithTheme(<QazaDailyTargets />);

    await fireEvent.press(screen.getByLabelText(label));

    expect(setQazaSchedule).toHaveBeenCalledWith({ targets: { fajr, isha: 1 } });
  });

  it("renders bare rows when unframed on wide windows", async () => {
    await seed();
    setMockWindowSize(1024);
    await renderWithTheme(<QazaDailyTargets framed={false} />);

    expect(screen.queryByText("Daily schedule")).toBeNull();
    expect(screen.getByText("Isha")).toBeTruthy();
  });
});

describe("QazaDailyTargets on TV", () => {
  usePlatform({ isTV: true });

  it("uses larger steppers in a grid", async () => {
    await seed();
    await renderWithTheme(<QazaDailyTargets />);

    expect(screen.getByLabelText(/^Increase Isha/)).toBeTruthy();
  });
});
