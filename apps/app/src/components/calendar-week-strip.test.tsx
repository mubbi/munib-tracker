import { addDays, getLocalDateString } from "@munib-tracker/shared/utils";
import { fireEvent, screen } from "@testing-library/react-native";

import { CalendarWeekStrip } from "@/components/calendar-week-strip";
import { buildDayActivity } from "@/test-support/fixtures/prayer";
import { usePlatform } from "@/test-support/platform";
import { renderWithTheme } from "@/test-support/render";
import { flattenStyle } from "@/test-support/style";

type Props = Parameters<typeof CalendarWeekStrip>[0];

/** Wednesday 4 March 2020 — a fully past week (Sun 1 … Sat 7). */
const PAST = "2020-03-04";

const renderStrip = async (props: Partial<Props> = {}) => {
  const onSelectDate = jest.fn();
  await renderWithTheme(
    <CalendarWeekStrip
      date={PAST}
      calendarMode="gregorian"
      locale="en"
      activity={new Map()}
      onSelectDate={onSelectDate}
      {...props}
    />,
  );
  return onSelectDate;
};

const activity = (entries: [string, Partial<Parameters<typeof buildDayActivity>[0]>][]) =>
  new Map(entries.map(([date, overrides]) => [date, buildDayActivity({ date, ...overrides })]));

const dayButtons = () =>
  screen.getAllByRole("button").filter((b) => b.props.accessibilityState?.disabled !== undefined);

describe("CalendarWeekStrip", () => {
  it("shows seven days with the selected one announced", async () => {
    await renderStrip();

    expect(dayButtons()).toHaveLength(7);
    expect(screen.getByLabelText(/^Selected, .*4/)).toBeTruthy();
  });

  it("titles the strip with the selected week", async () => {
    await renderStrip();

    expect(screen.getByText(/^Week of /)).toBeTruthy();
  });

  it.each([
    [{ level: 1, completed: 5 }, "Prayed"],
    [{ level: 0.4, completed: 2 }, "Partial"],
    [{ missed: 2 }, "Missed"],
  ])("describes a day with %o as %s", async (overrides, status) => {
    await renderStrip({ activity: activity([["2020-03-02", overrides]]) });

    expect(screen.getByLabelText(new RegExp(`2.*, ${status}$`))).toBeTruthy();
  });

  it("selects a tapped day", async () => {
    const onSelectDate = await renderStrip();

    await fireEvent.press(dayButtons()[0]!);

    expect(onSelectDate).toHaveBeenCalledWith("2020-03-01");
  });

  it.each([
    ["Previous week", "2020-02-26"],
    ["Next week", "2020-03-11"],
  ])("%s shifts by seven days", async (label, expected) => {
    const onSelectDate = await renderStrip();

    await fireEvent.press(screen.getByLabelText(label));

    expect(onSelectDate).toHaveBeenCalledWith(expected);
  });

  it("shows Hijri day numbers in Hijri mode", async () => {
    await renderStrip({ calendarMode: "hijri" });

    expect(screen.queryByText("4")).toBeNull();
  });
});

describe("CalendarWeekStrip around today", () => {
  const today = getLocalDateString();

  it("marks today and disables future days", async () => {
    await renderStrip({ date: today });

    expect(screen.getByLabelText(/^Selected, Today, /)).toBeTruthy();
    const future = dayButtons().filter((b) => b.props.accessibilityState.disabled);
    expect(future.every((b) => /hasn't happened yet$/.test(b.props.accessibilityLabel))).toBe(true);
  });

  it("highlights today without selecting it", async () => {
    await renderStrip({ date: addDays(today, -1) });

    const todayButton = screen.getByLabelText(/^Today, /);
    expect(flattenStyle(todayButton.props.style).borderWidth).toBe(2);
  });
});

describe("CalendarWeekStrip on TV", () => {
  usePlatform({ isTV: true });
  const today = getLocalDateString();

  it.each([
    ["today selected", today, /^Selected, Today, /, 2],
    ["another day selected", PAST, /^Selected, /, expect.any(Number)],
  ])("uses the soft TV selection chrome with %s", async (_case, date, label, border) => {
    await renderStrip({ date, activity: activity([[date, { level: 1 }]]) });

    expect(flattenStyle(screen.getByLabelText(label).props.style).borderWidth).toEqual(border);
  });

  it("outlines an unselected today", async () => {
    await renderStrip({ date: addDays(today, -1) });

    expect(flattenStyle(screen.getByLabelText(/^Today, /).props.style).borderWidth).toBe(2);
  });
});
