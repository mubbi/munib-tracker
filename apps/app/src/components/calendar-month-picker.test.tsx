import { fireEvent, screen } from "@testing-library/react-native";

import { CalendarMonthPicker } from "@/components/calendar-month-picker";
import { hijriMonthName } from "@/lib/hijri";
import { usePlatform } from "@/test-support/platform";
import { renderWithTheme } from "@/test-support/render";

jest.mock("@/components/ui/sheet", () => require("@/test-support/mocks/sheet").sheetMock);

type Props = Parameters<typeof CalendarMonthPicker>[0];

const renderPicker = async (props: Partial<Props> = {}) => {
  const handlers = { onClose: jest.fn(), onSelect: jest.fn() };
  const view = await renderWithTheme(
    <CalendarMonthPicker
      visible
      mode="gregorian"
      year={2026}
      month={6}
      locale="en"
      language="en"
      anchorYear={2026}
      {...handlers}
      {...props}
    />,
  );
  return { ...handlers, ...view };
};

const press = (label: string) => fireEvent.press(screen.getByLabelText(label));
const selected = (label: string) => screen.getByLabelText(label).props.accessibilityState?.selected;

describe("CalendarMonthPicker months view", () => {
  it("shows the year and every month, selecting the current one", async () => {
    await renderPicker();

    expect(screen.getByText("2026")).toBeTruthy();
    expect(screen.getAllByText(/^(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)$/)).toHaveLength(
      12,
    );
    expect(selected("Jul")).toBe(true);
    expect(selected("Jun")).toBe(false);
  });

  it("selects a Gregorian month (0-based) and closes", async () => {
    const { onSelect, onClose } = await renderPicker();

    await press("Mar");

    expect(onSelect).toHaveBeenCalledWith(2026, 2);
    expect(onClose).toHaveBeenCalled();
  });

  it("steps back a year and drops the month highlight", async () => {
    const { onSelect } = await renderPicker();

    await press("Previous year");

    expect(screen.getByText("2025")).toBeTruthy();
    expect(selected("Jul")).toBe(false);
    await press("May");
    expect(onSelect).toHaveBeenCalledWith(2025, 4);
  });

  it("stops at the look-ahead year", async () => {
    await renderPicker({ year: 2027 });

    await press("Next year");

    expect(screen.getByText("2027")).toBeTruthy();
    expect(screen.getByLabelText("Next year").props.accessibilityState).toMatchObject({
      disabled: true,
    });
  });

  it("disables stepping before the look-back year", async () => {
    await renderPicker({ year: 1976 });

    expect(screen.getByLabelText("Previous year").props.accessibilityState).toMatchObject({
      disabled: true,
    });
  });

  it("lists Hijri months with 1-based values", async () => {
    const muharram = hijriMonthName(1, "en");
    const { onSelect } = await renderPicker({
      mode: "hijri",
      year: 1447,
      month: 1,
      anchorYear: 1447,
    });

    expect(selected(muharram)).toBe(true);
    await press(muharram);
    expect(onSelect).toHaveBeenCalledWith(1447, 1);
  });

  it("resets to the months view when reopened", async () => {
    const { rerender, onClose, onSelect } = await renderPicker();
    await press("Select year");
    const ui = (visible: boolean) => (
      <CalendarMonthPicker
        visible={visible}
        mode="gregorian"
        year={2026}
        month={6}
        locale="en"
        language="en"
        anchorYear={2026}
        onClose={onClose}
        onSelect={onSelect}
      />
    );

    await rerender(ui(false));
    await rerender(ui(true));

    expect(screen.getByText("Pick month and year")).toBeTruthy();
  });
});

describe("CalendarMonthPicker years view", () => {
  it("lists the look-back range with the current year selected", async () => {
    await renderPicker();

    await press("Select year");

    expect(selected("2026")).toBe(true);
    expect(screen.getByLabelText("1976")).toBeTruthy();
    expect(screen.getByLabelText("2027")).toBeTruthy();
  });

  it("returns to months for a picked year", async () => {
    await renderPicker();
    await press("Select year");

    await press("2000");

    expect(screen.getByText("2000")).toBeTruthy();
    expect(screen.getByText("Pick month and year")).toBeTruthy();
  });

  it("goes back to months without changing the year", async () => {
    await renderPicker();
    await press("Select year");

    await press("Back");

    expect(screen.getByText("2026")).toBeTruthy();
  });
});

describe("CalendarMonthPicker on TV", () => {
  usePlatform({ isTV: true });

  it("gives the selected month initial D-pad focus", async () => {
    await renderPicker();

    expect(screen.getByLabelText("Jul").props.hasTVPreferredFocus).toBe(true);
  });

  it("gives the selected year initial D-pad focus", async () => {
    await renderPicker();
    await press("Select year");

    expect(screen.getByLabelText("2026").props.hasTVPreferredFocus).toBe(true);
  });
});
