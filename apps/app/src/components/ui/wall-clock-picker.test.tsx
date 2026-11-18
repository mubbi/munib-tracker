import { fireEvent, screen } from "@testing-library/react-native";

import { WallClockPicker } from "@/components/ui/wall-clock-picker";
import { useTimeFormat } from "@/hooks/use-time-format";
import { renderWithTheme } from "@/test-support/render";

jest.mock("@/hooks/use-time-format", () => ({ useTimeFormat: jest.fn(() => "12") }));

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
