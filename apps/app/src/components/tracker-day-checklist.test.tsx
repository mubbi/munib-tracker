import { act, fireEvent, screen } from "@testing-library/react-native";

import { ExcusedDayPicker } from "@/components/excused-day-picker";
import { PrayerTrackerRow } from "@/components/prayer-tracker-row";
import {
  TrackerDayChecklist,
  type TrackerDayChecklistProps,
} from "@/components/tracker-day-checklist";
import { scrollChildIntoView } from "@/hooks/use-scroll-to-active";
import { afterSalahAdhkarRoute } from "@/lib/after-salah-adhkar-reminder";
import { FRIDAY_CHECKLIST_FOCUS, isFridayDateString } from "@/lib/friday";
import { isWhiteDayDateString, WHITE_DAYS_CHECKLIST_FOCUS } from "@/lib/white-days";
import { defined } from "@/test-support/assert";
import { firstDateWhere } from "@/test-support/dates";
import { buildPrayerTimes } from "@/test-support/fixtures/prayer";
import { lastProps } from "@/test-support/mock-calls";
import { mockRouter, resetExpoRouterMock } from "@/test-support/mocks/expo-router";
import { usePlatform } from "@/test-support/platform";
import { renderWithTheme } from "@/test-support/render";

jest.mock("expo-router", () => require("@/test-support/mocks/expo-router").expoRouterMock);
jest.mock("@/hooks/use-scroll-to-active", () => ({ scrollChildIntoView: jest.fn() }));
jest.mock("@/components/qaza-daily-checklist", () => ({ QazaDailyChecklist: () => null }));
jest.mock("@/components/khatm-daily-checklist", () => ({ KhatmDailyChecklist: () => null }));
jest.mock("@/components/friday-tracker-section", () => ({
  FridayTrackerSection: require("@/test-support/mocks/stub-component").stubComponent(
    "friday-section",
  ),
}));
jest.mock("@/components/white-days-tracker-section", () => ({
  WhiteDaysTrackerSection: require("@/test-support/mocks/stub-component").stubComponent(
    "white-days-section",
  ),
}));
jest.mock("@/components/excused-day-picker", () => ({ ExcusedDayPicker: jest.fn(() => null) }));
const mockHighlight = jest.fn();
jest.mock("@/components/ui/focus-highlight", () => {
  const React = require("react");
  const { View } = require("react-native");
  return {
    FocusHighlight: React.forwardRef(
      (props: { active: boolean; children: unknown }, ref: unknown) => {
        mockHighlight(props);
        return React.createElement(View, { ref }, props.children);
      },
    ),
  };
});
jest.mock("@/components/prayer-tracker-row", () => ({
  PrayerTrackerRow: jest.fn(({ prayerId, onPress }: { prayerId: string; onPress: () => void }) =>
    require("react").createElement(require("react-native").Pressable, {
      accessibilityLabel: `row:${prayerId}`,
      onPress,
    }),
  ),
}));

const PLAIN_DAY = firstDateWhere((d) => !isFridayDateString(d) && !isWhiteDayDateString(d));
const FRIDAY = firstDateWhere((d) => isFridayDateString(d) && !isWhiteDayDateString(d));
const WHITE_DAY = firstDateWhere((d) => isWhiteDayDateString(d) && !isFridayDateString(d));

const renderChecklist = async (props: Partial<TrackerDayChecklistProps> = {}) => {
  const onPrayerPress = jest.fn();
  await renderWithTheme(
    <TrackerDayChecklist
      date={PLAIN_DAY}
      isToday
      status={{}}
      notes={{}}
      jama={{}}
      zikrCounts={{}}
      prayerTimes={buildPrayerTimes()}
      onPrayerPress={onPrayerPress}
      {...props}
    />,
  );
  return onPrayerPress;
};

const rowProps = (prayerId: string) =>
  defined(
    jest.mocked(PrayerTrackerRow).mock.calls.findLast(([props]) => props.prayerId === prayerId),
    `a ${prayerId} row render`,
  )[0];
const highlightActive = () => lastProps(mockHighlight).active;

beforeEach(() => {
  jest.clearAllMocks();
  resetExpoRouterMock();
});

describe("TrackerDayChecklist", () => {
  it("shows remaining salah-adhkar progress on category rows", async () => {
    await renderChecklist();

    expect(screen.getByText("Salah adhkar")).toBeTruthy();
    expect(screen.getByLabelText(/After Adhan/)).toBeTruthy();
    expect(screen.getByLabelText(/Before Salah/)).toBeTruthy();
    expect(screen.getByLabelText(/After Salah/)).toBeTruthy();
  });

  it("counts completed prayers per section", async () => {
    await renderChecklist({
      status: { fajr: "completed", dhuhr: "completed", witr: "completed", duha: "completed" },
    });

    expect(screen.getByText("2/5")).toBeTruthy();
    expect(screen.getByText("1/1")).toBeTruthy();
  });

  it("passes each prayer's records to its row", async () => {
    await renderChecklist({
      status: { asr: "missed" },
      notes: { asr: "late" },
      jama: { asr: true },
    });

    expect(rowProps("asr")).toMatchObject({
      status: "missed",
      hasNotes: true,
      isJama: true,
      time: "16:00",
    });
    expect(rowProps("isha")).toMatchObject({ status: "pending", hasNotes: false, isJama: false });
  });

  it("opens the status sheet for a pressed prayer", async () => {
    const onPrayerPress = await renderChecklist();

    await fireEvent.press(screen.getByLabelText("row:maghrib"));
    await fireEvent.press(screen.getByLabelText("row:duha"));
    await fireEvent.press(screen.getByLabelText("row:witr"));

    expect(onPrayerPress.mock.calls).toEqual([["maghrib"], ["duha"], ["witr"]]);
  });

  it("links today's rows to after-salah adhkar", async () => {
    await renderChecklist();

    await act(async () => {
      rowProps("fajr").onPressAfterSalah?.();
      rowProps("witr").onPressAfterSalah?.();
    });

    expect(mockRouter.push).toHaveBeenCalledWith(afterSalahAdhkarRoute("fajr"));
    expect(mockRouter.push).toHaveBeenCalledWith(afterSalahAdhkarRoute("witr"));
  });

  it("does not link past days to after-salah adhkar", async () => {
    await renderChecklist({ isToday: false });

    expect(rowProps("fajr").onPressAfterSalah).toBeUndefined();
    expect(rowProps("witr").onPressAfterSalah).toBeUndefined();
  });

  it.each([
    ["After Adhan", { pathname: "/zikr/[category]", params: { category: "after_azan" } }],
    ["Tahajjud streak", "/tahajjud"],
    ["Reflect on a prayer", "/journal"],
  ])("navigates from %s", async (label, href) => {
    await renderChecklist();

    await fireEvent.press(screen.getByLabelText(new RegExp(`^${label}`)));

    expect(mockRouter.push).toHaveBeenCalledWith(href);
  });

  it("folds Excused day into the Obligatory card; the store owns it by default", async () => {
    await renderChecklist();
    expect(ExcusedDayPicker).not.toHaveBeenCalled();

    await fireEvent.press(screen.getByRole("button", { name: "Excused day" }));

    expect(lastProps(ExcusedDayPicker)).toEqual({ variant: "inline" });
  });

  it("keeps an active excuse open and hands its state to the picker", async () => {
    const onExcusedChange = jest.fn();
    await renderChecklist({ excusedReason: "travel", onExcusedChange });

    expect(lastProps(ExcusedDayPicker)).toEqual({
      variant: "inline",
      excusedReason: "travel",
      onExcusedChange,
    });
  });

  it("forwards the one-tap mark from a row", async () => {
    const onPrayerQuickSelect = jest.fn();
    await renderChecklist({ onPrayerQuickSelect });

    await act(async () => {
      rowProps("isha").onSelect?.("completed");
    });

    expect(onPrayerQuickSelect).toHaveBeenCalledWith("isha", "completed");
  });

  it("leaves rows sheet-only without a quick-select handler (calendar)", async () => {
    await renderChecklist({ isToday: false });

    expect(rowProps("fajr").onSelect).toBeUndefined();
  });

  it("leads with the Obligatory card and groups the rest", async () => {
    await renderChecklist();

    expect(screen.queryByTestId("tracker-day-banner")).toBeNull();
    expect(screen.getByTestId("tracker-obligatory")).toBeTruthy();
    expect(screen.getByRole("button", { name: "Remembrance" })).toBeTruthy();
    expect(screen.getByRole("button", { name: "Voluntary" })).toBeTruthy();
    // No Qaza target / khatm plan today → no empty make-up group.
    expect(screen.queryByRole("button", { name: "Make-up & reading" })).toBeNull();
  });

  it("hides Friday and White Days sections on ordinary days", async () => {
    await renderChecklist();

    expect(screen.queryByText("friday-section")).toBeNull();
    expect(screen.queryByText("white-days-section")).toBeNull();
  });
});

describe.each([
  [
    "Friday",
    FRIDAY,
    "friday-section",
    "Go to Jumu'ah checklist on this page",
    FRIDAY_CHECKLIST_FOCUS,
    "fridayFocused",
  ],
  [
    "White Day",
    WHITE_DAY,
    "white-days-section",
    "Go to White Days checklist on this page",
    WHITE_DAYS_CHECKLIST_FOCUS,
    "whiteDaysFocused",
  ],
] as const)(
  "TrackerDayChecklist on a %s",
  (_day, date, section, jumpLabel, focusKey, focusProp) => {
    beforeEach(() => jest.useFakeTimers());
    afterEach(() => jest.useRealTimers());

    it("shows the day's checklist section", async () => {
      await renderChecklist({ date });

      expect(screen.getByText(section)).toBeTruthy();
    });

    it("registers the section for deep-link focus", async () => {
      const register = jest.fn(() => jest.fn());
      await renderChecklist({ date, registerFocus: register });

      expect(register).toHaveBeenCalledWith(focusKey);
    });

    it("jumps to and briefly highlights the section", async () => {
      const scrollRef = { current: null };
      await renderChecklist({ date, scrollRef, getScrollY: () => 120 });

      await fireEvent.press(screen.getByLabelText(jumpLabel));
      expect(highlightActive()).toBe(true);
      expect(scrollChildIntoView).toHaveBeenCalledWith(scrollRef, expect.anything(), 120, 80);

      await act(async () => jest.advanceTimersByTime(2800));
      expect(highlightActive()).toBe(false);
    });

    it("highlights without scrolling when no scroll view is given", async () => {
      await renderChecklist({ date });

      await fireEvent.press(screen.getByLabelText(jumpLabel));

      expect(scrollChildIntoView).not.toHaveBeenCalled();
      expect(highlightActive()).toBe(true);
    });

    it("highlights the section when deep-linked", async () => {
      await renderChecklist({ date, [focusProp]: true });

      expect(highlightActive()).toBe(true);
      await act(async () => jest.advanceTimersByTime(2800));
    });
  },
);

describe("TrackerDayChecklist on TV", () => {
  usePlatform({ isTV: true });

  it("focuses the first obligatory prayer when asked", async () => {
    await renderChecklist({ preferredFocusFirstPrayer: true });

    expect(rowProps("fajr").preferredFocus).toBe(true);
    expect(rowProps("dhuhr").preferredFocus).toBe(false);
  });

  it("drops the scroll-jump shortcuts", async () => {
    await renderChecklist({ date: FRIDAY });

    expect(screen.queryByLabelText("Go to Jumu'ah checklist on this page")).toBeNull();
    expect(screen.getByText("friday-section")).toBeTruthy();
  });
});
