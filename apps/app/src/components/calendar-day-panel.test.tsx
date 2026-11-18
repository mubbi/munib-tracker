import { getLocalDateString } from "@munib-tracker/shared/utils";
import { act, fireEvent, renderHook, screen, waitFor } from "@testing-library/react-native";

import { CalendarDayPanel, useCalendarDayRecords } from "@/components/calendar-day-panel";
import { PrayerStatusSheet } from "@/components/prayer-status-sheet";
import { TrackerDayChecklist } from "@/components/tracker-day-checklist";
import { PrayerRepository, ZikrRepository } from "@/db";
import { trackerStore } from "@/stores/tracker-store";
import { buildPrayerLog } from "@/test-support/fixtures/prayer";
import { renderWithTheme } from "@/test-support/render";

jest.mock("expo-router", () => require("@/test-support/mocks/expo-router").expoRouterMock);
jest.mock("@/db", () => ({
  PrayerRepository: { getByDate: jest.fn(async () => []), getAll: jest.fn(async () => []) },
  ZikrRepository: { getByDate: jest.fn(async () => []) },
}));
jest.mock("@/stores/tracker-store", () => {
  const actions = {
    refresh: jest.fn(async () => {}),
    setPrayerStatusOnDate: jest.fn(async () => {}),
    setPrayerNotesOnDate: jest.fn(async () => {}),
    setPrayerJamaOnDate: jest.fn(async () => {}),
    setDayExcusedOnDate: jest.fn(async () => {}),
  };
  return { trackerStore: { getState: () => actions } };
});
const mockRemind = jest.fn();
jest.mock("@/hooks/use-after-salah-adhkar-reminder", () => ({
  useAfterSalahAdhkarReminder: () => mockRemind,
}));
jest.mock("@/hooks/use-prayer-times-for-date", () => ({
  usePrayerTimesForDate: () => require("@/test-support/fixtures/prayer").buildPrayerTimes(),
}));
jest.mock("@/components/tracker-day-checklist", () => ({
  TrackerDayChecklist: jest.fn(({ onPrayerPress, onExcusedChange }) => {
    const { Pressable, Text } = require("react-native");
    const React = require("react");
    return React.createElement(
      React.Fragment,
      null,
      React.createElement(Pressable, {
        accessibilityLabel: "open-asr",
        onPress: () => onPrayerPress("asr"),
      }),
      React.createElement(Pressable, {
        accessibilityLabel: "excuse",
        onPress: () => onExcusedChange("travel"),
      }),
      React.createElement(Text, null, "checklist"),
    );
  }),
}));
jest.mock("@/components/prayer-status-sheet", () => ({ PrayerStatusSheet: jest.fn(() => null) }));

const PAST = "2020-03-04";
const FUTURE = "2999-01-01";
const actions = trackerStore.getState();

const checklistProps = () => jest.mocked(TrackerDayChecklist).mock.lastCall![0];
const sheetProps = () => jest.mocked(PrayerStatusSheet).mock.lastCall![0];

beforeEach(() => {
  jest.clearAllMocks();
  jest.mocked(PrayerRepository.getByDate).mockResolvedValue([
    buildPrayerLog({
      date: PAST,
      prayerId: "fajr",
      status: "completed",
      notes: "Masjid",
      isJama: true,
    }),
    buildPrayerLog({ date: PAST, prayerId: "dhuhr", status: "missed", isExcused: true }),
    buildPrayerLog({
      date: PAST,
      prayerId: "asr",
      status: "completed",
      isExcused: true,
      excusedReason: "travel",
    }),
  ]);
  jest.mocked(PrayerRepository.getAll).mockResolvedValue([buildPrayerLog({ date: PAST })]);
  jest
    .mocked(ZikrRepository.getByDate)
    .mockResolvedValue([{ zikrId: "subhanallah", prayerId: "fajr", count: 33 } as never]);
});

const renderRecords = async (date = PAST) => {
  const hook = await renderHook(() => useCalendarDayRecords(date));
  await waitFor(() => expect(hook.result.current.loaded).toBe(true));
  return hook;
};

describe("useCalendarDayRecords", () => {
  it("maps the day's logs into status, notes, jama and excused state", async () => {
    const { result } = await renderRecords();

    expect(result.current.status).toEqual({ fajr: "completed", dhuhr: "missed", asr: "completed" });
    expect(result.current.notes).toEqual({ fajr: "Masjid" });
    expect(result.current.jama).toEqual({ fajr: true });
    expect(result.current.excusedReason).toBe("travel");
    expect(result.current.completed).toBe(2);
  });

  it("defaults an excused day without a reason to sick", async () => {
    jest
      .mocked(PrayerRepository.getByDate)
      .mockResolvedValue([buildPrayerLog({ date: PAST, isExcused: true })]);
    const { result } = await renderRecords();

    expect(result.current.excusedReason).toBe("sick");
  });

  it("keys zikr counts by zikr and prayer", async () => {
    const { result } = await renderRecords();

    expect(Object.values(result.current.zikrCounts)).toEqual([33]);
  });

  it("aggregates activity across every day", async () => {
    const { result } = await renderRecords();

    expect(result.current.activity.has(PAST)).toBe(true);
  });

  it("refreshes today's excused carry-over before reading", async () => {
    await renderRecords(getLocalDateString());

    expect(actions.refresh).toHaveBeenCalled();
  });

  it("does not refresh for past days", async () => {
    await renderRecords();

    expect(actions.refresh).not.toHaveBeenCalled();
  });

  it("saves a status change, reloads and offers the after-salah reminder", async () => {
    const { result } = await renderRecords();

    await act(() => result.current.applyStatus("fajr", "missed", { addToQaza: true }));

    expect(actions.setPrayerStatusOnDate).toHaveBeenCalledWith(PAST, "fajr", "missed", {
      addToQaza: true,
    });
    expect(mockRemind).toHaveBeenCalledWith("fajr", "completed", "missed");
    expect(PrayerRepository.getByDate).toHaveBeenCalledTimes(2);
  });

  it("treats an unlogged prayer as pending for the reminder", async () => {
    const { result } = await renderRecords();

    await act(() => result.current.applyStatus("isha", "completed"));

    expect(mockRemind).toHaveBeenCalledWith("isha", "pending", "completed");
  });

  it.each([
    ["applyNotes", ["fajr", "note"], "setPrayerNotesOnDate", [PAST, "fajr", "note"]],
    ["applyJama", ["fajr", false], "setPrayerJamaOnDate", [PAST, "fajr", false]],
    ["applyExcused", ["hayd"], "setDayExcusedOnDate", [PAST, "hayd"]],
  ] as const)(
    "%s writes through the tracker store",
    async (method, args, storeAction, expected) => {
      const { result } = await renderRecords();

      await act(() => (result.current[method] as (...a: unknown[]) => Promise<void>)(...args));

      expect(actions[storeAction]).toHaveBeenCalledWith(...expected);
    },
  );
});

describe("CalendarDayPanel", () => {
  const renderPanel = (date = PAST, onActivityChange = jest.fn()) =>
    renderWithTheme(
      <CalendarDayPanel
        date={date}
        calendarMode="gregorian"
        locale="en"
        onActivityChange={onActivityChange}
      />,
    );

  it("summarises a past day and shows its checklist", async () => {
    await renderPanel();

    expect(await screen.findByText("2 of 5 obligatory prayers")).toBeTruthy();
    expect(screen.getByText("History")).toBeTruthy();
    expect(checklistProps()).toMatchObject({ date: PAST, isToday: false });
  });

  it("labels today", async () => {
    await renderPanel(getLocalDateString());

    expect(await screen.findByText("Today")).toBeTruthy();
  });

  it("publishes the activity map once loaded", async () => {
    const onActivityChange = jest.fn();
    await renderPanel(PAST, onActivityChange);

    await waitFor(() => expect(onActivityChange).toHaveBeenCalledWith(expect.any(Map)));
  });

  it("shows an empty state for future days instead of a checklist", async () => {
    await renderPanel(FUTURE);

    expect(screen.getByText("Nothing to log yet")).toBeTruthy();
    expect(screen.getByText("This day hasn't happened yet")).toBeTruthy();
    expect(screen.queryByText("checklist")).toBeNull();
  });

  it("saves excused changes from the checklist", async () => {
    await renderPanel();

    await fireEvent.press(screen.getByLabelText("excuse"));

    await waitFor(() => expect(actions.setDayExcusedOnDate).toHaveBeenCalledWith(PAST, "travel"));
  });

  it("opens the status sheet for a pressed prayer with its records", async () => {
    await renderPanel();
    await screen.findByText("2 of 5 obligatory prayers");

    await fireEvent.press(screen.getByLabelText("open-asr"));

    expect(sheetProps()).toMatchObject({
      visible: true,
      prayerId: "asr",
      prayerLabel: "Asr",
      currentStatus: "completed",
      isJama: false,
    });
  });

  it("writes sheet edits for the active prayer", async () => {
    await renderPanel();
    await fireEvent.press(screen.getByLabelText("open-asr"));

    await act(async () => {
      await sheetProps().onSelect("missed");
      await sheetProps().onSaveNotes("late");
      await sheetProps().onToggleJama(true);
    });

    expect(actions.setPrayerStatusOnDate).toHaveBeenCalledWith(PAST, "asr", "missed", undefined);
    expect(actions.setPrayerNotesOnDate).toHaveBeenCalledWith(PAST, "asr", "late");
    expect(actions.setPrayerJamaOnDate).toHaveBeenCalledWith(PAST, "asr", true);
  });

  it("keeps the last prayer mounted while the sheet closes", async () => {
    await renderPanel();
    await fireEvent.press(screen.getByLabelText("open-asr"));

    await act(async () => sheetProps().onClose());

    expect(sheetProps()).toMatchObject({ visible: false, prayerId: "asr" });
  });

  it("closes the sheet when another day is picked", async () => {
    const { rerender } = await renderPanel();
    await fireEvent.press(screen.getByLabelText("open-asr"));

    await rerender(<CalendarDayPanel date="2020-03-05" calendarMode="gregorian" locale="en" />);

    expect(sheetProps().visible).toBe(false);
  });

  it("renders no sheet before any prayer is opened", async () => {
    await renderPanel();

    expect(PrayerStatusSheet).not.toHaveBeenCalled();
  });
});
