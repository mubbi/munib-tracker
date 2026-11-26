import { act, fireEvent, screen } from "@testing-library/react-native";

import {
  parseTypedTime,
  REPEAT_DELAY_MS,
  REPEAT_INTERVAL_MS,
  WallClockPicker,
} from "@/components/ui/wall-clock-picker";
import { useTimeFormat } from "@/hooks/use-time-format";
import { useIsRTL } from "@/lib/rtl";
import { usePlatform } from "@/test-support/platform";
import { parentOf } from "@/test-support/queries";
import { renderWithTheme } from "@/test-support/render";
import { flattenStyle } from "@/test-support/style";

jest.mock("@/hooks/use-time-format", () => ({ useTimeFormat: jest.fn(() => "12") }));
jest.mock("@/lib/rtl", () => ({
  ...jest.requireActual("@/lib/rtl"),
  useIsRTL: jest.fn(() => false),
}));
jest.mock("@/lib/haptics", () => require("@/test-support/mocks/haptics").hapticsMock);

const renderPicker = async (hour: number, minute: number, label?: string) => {
  const onChange = jest.fn();
  await renderWithTheme(
    <WallClockPicker label={label} value={{ hour, minute }} onChange={onChange} />,
  );
  return onChange;
};

const press = (label: string) => fireEvent.press(screen.getByLabelText(label));

describe("WallClockPicker (12-hour)", () => {
  it("shows the optional label and 12-hour value", async () => {
    await renderPicker(12, 0, "Bedtime");

    expect(screen.getByText("Bedtime")).toBeTruthy();
    expect(screen.getByText("12")).toBeTruthy();
  });

  it.each([
    [12, "Increase hour", 13],
    [12, "Decrease hour", 23],
    [9, "Increase hour", 10],
    [9, "Decrease hour", 8],
    [1, "Decrease hour", 0],
  ])("from %i, %s → hour %i", async (hour, button, expected) => {
    const onChange = await renderPicker(hour, 0);

    await press(button);

    expect(onChange).toHaveBeenLastCalledWith({ hour: expected, minute: 0 });
  });

  it("switches the period with the AM/PM control", async () => {
    const onChange = await renderPicker(9, 30);

    await fireEvent.press(screen.getByText("PM"));

    expect(onChange).toHaveBeenLastCalledWith({ hour: 21, minute: 30 });
  });
});

describe("WallClockPicker (24-hour)", () => {
  beforeEach(() => jest.mocked(useTimeFormat).mockReturnValue("24"));
  afterEach(() => jest.mocked(useTimeFormat).mockReturnValue("12"));

  it("hides the AM/PM control and pads the hour", async () => {
    await renderPicker(7, 5);

    expect(screen.getByText("07")).toBeTruthy();
    expect(screen.queryByText("AM")).toBeNull();
  });

  it.each([
    ["Increase min", { hour: 23, minute: 0 }],
    ["Decrease min", { hour: 23, minute: 50 }],
    ["Increase hour", { hour: 0, minute: 55 }],
    ["Decrease hour", { hour: 22, minute: 55 }],
  ])("%s wraps around", async (button, expected) => {
    const onChange = await renderPicker(23, 55);

    await press(button);

    expect(onChange).toHaveBeenLastCalledWith(expected);
  });
});

describe("WallClockPicker layout", () => {
  afterEach(() => jest.mocked(useIsRTL).mockReturnValue(false));

  it("keeps each number on one line, tabular, shrinking to fit at large text", async () => {
    await renderPicker(10, 40);

    for (const digits of ["10", "40"]) {
      const text = screen.getByText(digits);
      expect(text.props.numberOfLines).toBe(1);
      expect(text.props.adjustsFontSizeToFit).toBe(true);
      expect(flattenStyle(text.props.style).fontVariant).toEqual(["tabular-nums"]);
    }
    // Both boxes share one min width / height so the columns line up.
    const hourBox = flattenStyle(parentOf(screen.getByText("10")).props.style);
    const minuteBox = flattenStyle(parentOf(screen.getByText("40")).props.style);
    expect(hourBox.minWidth).toBe(minuteBox.minWidth);
    expect(hourBox.height).toBe(minuteBox.height);
  });

  it("names each number box for screen readers", async () => {
    await renderPicker(9, 5);

    expect(screen.getByLabelText("hour, 9")).toBeTruthy();
    expect(screen.getByLabelText("min, 05")).toBeTruthy();
  });

  it("reads hour → minute left to right in RTL locales", async () => {
    jest.mocked(useIsRTL).mockReturnValue(true);
    await renderPicker(9, 5);

    expect(flattenStyle(screen.getByTestId("wall-clock-row").props.style).flexDirection).toBe(
      "row-reverse",
    );
  });
});

describe("WallClockPicker press and hold", () => {
  beforeEach(() => jest.useFakeTimers());
  afterEach(() => jest.useRealTimers());

  it("a tap steps minutes by 5; holding repeats ±1 until release", async () => {
    const onChange = await renderPicker(7, 30);
    const up = screen.getByLabelText("Increase min");

    await fireEvent.press(up);
    expect(onChange).toHaveBeenLastCalledWith({ hour: 7, minute: 35 });

    onChange.mockClear();
    await fireEvent(up, "pressIn");
    await act(async () => jest.advanceTimersByTime(REPEAT_DELAY_MS + REPEAT_INTERVAL_MS * 2));
    await fireEvent(up, "pressOut");
    expect(onChange).toHaveBeenCalledTimes(3);
    expect(onChange).toHaveBeenNthCalledWith(1, { hour: 7, minute: 31 });
    // The release after a hold is not also a tap.
    await fireEvent.press(up);
    expect(onChange).toHaveBeenCalledTimes(3);
    await act(async () => jest.advanceTimersByTime(REPEAT_INTERVAL_MS * 3));
    expect(onChange).toHaveBeenCalledTimes(3);
  });
});

describe("parseTypedTime", () => {
  it.each([
    ["7", "hour", "24", 7],
    ["23", "hour", "24", 23],
    ["24", "hour", "24", null],
    ["0", "hour", "12", null],
    ["12", "hour", "12", 12],
    ["59", "min", "24", 59],
    ["60", "min", "12", null],
    ["", "min", "24", null],
  ] as const)("%s as %s (%sh) → %s", (text, unit, format, expected) => {
    expect(parseTypedTime(text, unit, format)).toBe(expected);
  });
});

describe("WallClockPicker on web", () => {
  usePlatform({ OS: "web" });

  it("accepts typed digits in a number box", async () => {
    const onChange = await renderPicker(7, 30);
    const minute = screen.getByTestId("wall-clock-input-min");

    await fireEvent(minute, "focus");
    await fireEvent.changeText(minute, "4x5");
    await fireEvent(minute, "blur");

    expect(onChange).toHaveBeenLastCalledWith({ hour: 7, minute: 45 });
  });

  it("ignores an out-of-range entry", async () => {
    const onChange = await renderPicker(7, 30);
    const hour = screen.getByTestId("wall-clock-input-hour");

    await fireEvent(hour, "focus");
    await fireEvent.changeText(hour, "13");
    await fireEvent(hour, "submitEditing");

    expect(onChange).not.toHaveBeenCalled();
  });
});
