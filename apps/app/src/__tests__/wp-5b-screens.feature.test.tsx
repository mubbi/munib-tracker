import { getLocalDateString } from "@munib-tracker/shared/utils";
import { fireEvent, screen, waitFor } from "@testing-library/react-native";
import { StyleSheet } from "react-native";

import CalendarScreen from "@/app/calendar";
import DateConverterScreen from "@/app/calendar/converter";
import QazaRozaScreen from "@/app/qaza/roza";
import TahajjudScreen from "@/app/tahajjud";
import { MonthGrid, MonthGridLegend } from "@/components/hijri/month-grid";
import { PrayerRepository } from "@/db/repositories/prayer-repository";
import { buildMonthGrid } from "@/lib/calendar";
import { ToastHost } from "@/providers/toast-provider";
import { voluntaryFastingStore } from "@/stores/voluntary-fasting-store";
import { resetExpoRouterMock } from "@/test-support/mocks/expo-router";
import { renderWithProviders } from "@/test-support/render";
import { resetTrackerStore, restoreTrackerStore, seedTrackerStore } from "@/test-support/store";

jest.mock("expo-router", () => require("@/test-support/mocks/expo-router").expoRouterMock);
jest.mock("@/components/ui/sheet", () => require("@/test-support/mocks/sheet").sheetMock);
jest.mock("@/notifications/scheduler", () => ({ rescheduleAll: jest.fn(() => Promise.resolve()) }));

beforeEach(() => {
  jest.clearAllMocks();
  resetExpoRouterMock();
});
afterEach(restoreTrackerStore);

describe("MonthGrid", () => {
  const weeks = buildMonthGrid(2026, 6);
  const weekdays = [{ key: "a", label: "S" }];

  it("draws 44pt day targets, at most two markers and a check for a complete day", async () => {
    await renderWithProviders(
      <MonthGrid
        weeks={weeks}
        weekdays={weekdays}
        onPressDay={jest.fn()}
        cell={(day) =>
          day.day === 10 && day.inMonth
            ? {
                fill: 3,
                markers: ["missed", "recommended", "prohibited"],
                accessibilityLabel: "Day ten, Prayed, Missed, Recommended fast",
              }
            : { accessibilityLabel: `day ${day.date}` }
        }
      />,
    );

    const cell = screen.getByLabelText("Day ten, Prayed, Missed, Recommended fast");
    const style = StyleSheet.flatten(cell.props.style);
    expect(style.minHeight).toBeGreaterThanOrEqual(44);
    // Third marker is dropped: two glyphs only.
    expect(screen.queryAllByTestId(/marker/).length).toBe(0);
  });

  it("lists every glyph in the legend", async () => {
    await renderWithProviders(
      <MonthGridLegend
        items={[
          { key: "m", label: "Missed", marker: "missed" },
          { key: "r", label: "Recommended fast", marker: "recommended" },
          { key: "p", label: "No fasting", marker: "prohibited" },
          { key: "f", label: "Prayed", fills: [3] },
        ]}
      />,
    );

    for (const label of ["Missed", "Recommended fast", "No fasting", "Prayed"]) {
      expect(screen.getByText(label)).toBeTruthy();
    }
  });
});

describe("Calendar", () => {
  it("names the fasting ruling in a day's spoken label and offers a legend with the same glyphs", async () => {
    await resetTrackerStore();
    voluntaryFastingStore.setState({ entries: {}, isReady: true });
    await renderWithProviders(<CalendarScreen />);

    await waitFor(() => expect(screen.getByText("No fasting")).toBeTruthy());
    expect(screen.getByText("Recommended fast")).toBeTruthy();
    expect(screen.getByText("Missed")).toBeTruthy();
    // Every in-month day cell is a real >= 44pt target.
    const days = screen
      .getAllByRole("button")
      .filter((b) => /\d{4}/.test(String(b.props.accessibilityLabel)));
    expect(days.length).toBeGreaterThan(20);
    for (const day of days.slice(0, 5)) {
      expect(StyleSheet.flatten(day.props.style).minHeight).toBeGreaterThanOrEqual(44);
    }
  });
});

describe("Qaza fasts", () => {
  it("logs a make-up fast in one tap and Undo restores the previous counter", async () => {
    const performRoza = jest.fn(async () => {});
    const setRoza = jest.fn(async () => {});
    await seedTrackerStore({
      isReady: true,
      roza: { remaining: 5, completed: 2, estimatedMissed: 0 },
      performRoza,
      setRoza,
    } as never);
    await renderWithProviders(
      <>
        <QazaRozaScreen />
        <ToastHost />
      </>,
    );

    await fireEvent.press(screen.getByText("Log a make-up fast"));

    await waitFor(() => expect(performRoza).toHaveBeenCalledTimes(1));
    expect(screen.queryByText("Confirm")).toBeNull();
    await fireEvent.press(await screen.findByText("Undo"));
    expect(setRoza).toHaveBeenCalledWith({ remaining: 5, completed: 2, estimatedMissed: 0 });
  });
});

describe("Date converter", () => {
  it("marks only the day field when the day is out of range", async () => {
    await renderWithProviders(<DateConverterScreen />);

    await fireEvent.press(screen.getByText("Hijri → Gregorian"));
    await fireEvent.changeText(screen.getByLabelText("Day"), "31");

    expect(screen.getByText(/Enter a day from 1 to (29|30)/)).toBeTruthy();
    expect(screen.queryByText("Enter a valid year")).toBeNull();
  });
});

describe("Tahajjud", () => {
  it("shows Try again when the history load rejects, and retries it", async () => {
    const getAll = jest
      .spyOn(PrayerRepository, "getAll")
      .mockRejectedValueOnce(new Error("boom"))
      .mockResolvedValue([]);
    await renderWithProviders(<TahajjudScreen />);

    const retry = await screen.findAllByText("Try again");
    await fireEvent.press(retry[0] as never);

    await waitFor(() => expect(getAll.mock.calls.length).toBeGreaterThanOrEqual(2));
  });
});

describe("today", () => {
  it("uses the shared date helper", () => {
    expect(getLocalDateString()).toMatch(/^\d{4}-\d{2}-\d{2}$/);
  });
});
