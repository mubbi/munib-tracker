import { getLocalDateString } from "@munib-tracker/shared/utils";
import { fireEvent, screen } from "@testing-library/react-native";

import { RamadanCard } from "@/components/ramadan-card";
import { getRamadanInfo, type RamadanInfo } from "@/lib/ramadan";
import { fastingStore } from "@/stores/fasting-store";
import { mockRouter, resetExpoRouterMock } from "@/test-support/mocks/expo-router";
import { renderWithTheme } from "@/test-support/render";

jest.mock("expo-router", () => require("@/test-support/mocks/expo-router").expoRouterMock);
jest.mock("@/lib/ramadan", () => ({
  ...jest.requireActual("@/lib/ramadan"),
  getRamadanInfo: jest.fn(),
}));

const TODAY = getLocalDateString();
const realSetStatus = fastingStore.getState().setStatus;
const setStatus = jest.fn(async () => {});

const ramadan = (overrides: Partial<RamadanInfo> = {}) =>
  jest.mocked(getRamadanInfo).mockReturnValue({
    isRamadan: true,
    day: 12,
    totalDays: 30,
    hijriYear: 1447,
    fastingLogHijriYear: 1447,
    fastingLogTotalDays: 30,
    suhoorEnds: new Date(2026, 2, 1, 4, 50),
    iftar: new Date(2026, 2, 1, 18, 20),
    ...overrides,
  } as RamadanInfo);

const fastedToggle = () => screen.getByLabelText("Mark today fasted");

beforeEach(() => {
  resetExpoRouterMock();
  setStatus.mockClear();
  fastingStore.setState({ days: {}, isReady: true, setStatus });
});
afterEach(() => fastingStore.setState({ days: {}, setStatus: realSetStatus }));

describe("RamadanCard", () => {
  it("is hidden outside Ramadan", async () => {
    ramadan({ isRamadan: false });
    await renderWithTheme(<RamadanCard />);

    expect(screen.toJSON()).toBeNull();
  });

  it("shows the fasting day with suhoor and iftar times", async () => {
    ramadan();
    await renderWithTheme(<RamadanCard />);

    expect(screen.getByText("Day 12 of 30")).toBeTruthy();
    expect(screen.getByText(/Suhoor ends/)).toBeTruthy();
    expect(screen.getByText(/Iftar/)).toBeTruthy();
  });

  it("marks today fasted", async () => {
    ramadan();
    await renderWithTheme(<RamadanCard />);

    await fireEvent.press(fastedToggle());

    expect(setStatus).toHaveBeenCalledWith(TODAY, "fasted");
  });

  it("clears a fast already marked today", async () => {
    ramadan();
    fastingStore.setState({ days: { [TODAY]: "fasted" } });
    await renderWithTheme(<RamadanCard />);

    await fireEvent.press(fastedToggle());

    expect(setStatus).toHaveBeenCalledWith(TODAY, null);
  });

  it("opens the Ramadan screen", async () => {
    ramadan();
    await renderWithTheme(<RamadanCard />);

    await fireEvent.press(screen.getByRole("button", { name: "Ramadan" }));

    expect(mockRouter.push).toHaveBeenCalledWith("/ramadan");
  });
});
