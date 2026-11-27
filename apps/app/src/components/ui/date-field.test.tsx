import { fireEvent, screen } from "@testing-library/react-native";

import {
  DateField,
  localeDateOrder,
  parseTypedDate,
  weekStartFor,
} from "@/components/ui/date-field";
import { setPlatform } from "@/test-support/platform";
import { renderWithTheme } from "@/test-support/render";

describe("DateField", () => {
  it("never renders a text input and shows the day in the user's format", async () => {
    await renderWithTheme(<DateField label="Due" value="2026-03-05" onChange={() => {}} />);

    expect(JSON.stringify(screen.toJSON())).not.toContain("TextInput");
    expect(screen.getByText(/Mar/)).toBeTruthy();
  });

  it("opens the calendar and picks a day as YYYY-MM-DD", async () => {
    const onChange = jest.fn();
    await renderWithTheme(<DateField label="Due" value="2026-03-05" onChange={onChange} />);

    await fireEvent.press(screen.getByLabelText(/^Due,/));
    await fireEvent.press(screen.getByLabelText(/March 12, 2026/));

    expect(onChange).toHaveBeenCalledWith("2026-03-12");
  });

  it("disables days outside min/max", async () => {
    const onChange = jest.fn();
    await renderWithTheme(
      <DateField label="Due" value="2026-03-05" onChange={onChange} minDay="2026-03-10" />,
    );

    await fireEvent.press(screen.getByLabelText(/^Due,/));
    await fireEvent.press(screen.getByLabelText(/March 3, 2026/));

    expect(onChange).not.toHaveBeenCalled();
  });

  it("applies a preset chip and can clear", async () => {
    const onChange = jest.fn();
    await renderWithTheme(
      <DateField
        label="Due"
        value="2026-03-05"
        onChange={onChange}
        presets={[{ id: "month", label: "In 1 month", day: "2026-04-05" }]}
      />,
    );

    await fireEvent.press(screen.getByLabelText(/^Due,/));
    await fireEvent.press(screen.getByText("In 1 month"));
    expect(onChange).toHaveBeenLastCalledWith("2026-04-05");

    await fireEvent.press(screen.getByLabelText(/^Due,/));
    await fireEvent.press(screen.getByText("Clear date"));
    expect(onChange).toHaveBeenLastCalledWith("");
  });
});

describe("weekStartFor", () => {
  it.each([
    ["ar", 6],
    ["ar-EG", 6],
    ["fa-IR", 6],
    ["ps-AF", 6],
    ["ku", 6],
    ["en-US", 0],
    ["ur-PK", 0],
    ["hi-IN", 0],
    ["id-ID", 0],
    ["bn-BD", 0],
    ["fr-FR", 1],
    ["tr-TR", 1],
    ["ru-RU", 1],
    ["uz", 1],
    ["en-GB", 1],
  ])("%s starts on weekday %i", (tag, day) => {
    expect(weekStartFor(tag)).toBe(day);
  });
});

describe("DateField week start", () => {
  it("lays the calendar out from the locale's first weekday", async () => {
    // 2026-03-01 is a Sunday: first column for en-US, last column (index 6) for a Monday start.
    await renderWithTheme(<DateField label="Due" value="2026-03-05" onChange={() => {}} />);
    await fireEvent.press(screen.getByLabelText(/^Due,/));
    const days = screen.getAllByLabelText(/, March \d+, 2026$/);
    expect(days[0]?.props.accessibilityLabel).toMatch(/^Sunday, March 1, 2026/);
  });
});

describe("parseTypedDate", () => {
  const dmy = ["day", "month", "year"] as const;
  const mdy = ["month", "day", "year"] as const;

  it("reads the locale's order, any separator and non-Latin digits", () => {
    expect(parseTypedDate("31/12/2026", [...dmy])).toEqual({ ok: true, day: "2026-12-31" });
    expect(parseTypedDate("12.31.2026", [...mdy])).toEqual({ ok: true, day: "2026-12-31" });
    expect(parseTypedDate("٣١/١٢/٢٠٢٦", [...dmy])).toEqual({ ok: true, day: "2026-12-31" });
    expect(parseTypedDate("2026-12-31", [...dmy])).toEqual({ ok: true, day: "2026-12-31" });
  });

  it("rejects impossible dates, short years and empty input", () => {
    expect(parseTypedDate("31/02/2026", [...dmy])).toEqual({ ok: false, reason: "invalid" });
    expect(parseTypedDate("1/2/26", [...dmy])).toEqual({ ok: false, reason: "invalid" });
    expect(parseTypedDate("  ", [...dmy])).toEqual({ ok: false, reason: "empty" });
  });

  it("derives the numeric order from Intl", () => {
    expect(localeDateOrder("en-US")).toEqual(["month", "day", "year"]);
    expect(localeDateOrder("fr-FR")).toEqual(["day", "month", "year"]);
  });
});

describe("DateField typed entry (desktop web)", () => {
  let restore = () => {};
  const originalMatchMedia = window.matchMedia;
  beforeEach(() => {
    restore = setPlatform({ OS: "web" });
    window.matchMedia = ((query: string) => ({
      matches: query.includes("pointer: fine"),
    })) as unknown as typeof window.matchMedia;
  });
  afterEach(() => {
    restore();
    window.matchMedia = originalMatchMedia;
  });

  it("accepts a typed date in the locale format and reports ISO", async () => {
    const onChange = jest.fn();
    await renderWithTheme(<DateField label="Due" value="" onChange={onChange} />);

    await fireEvent.changeText(screen.getByLabelText("Due"), "03/12/2026");

    expect(onChange).toHaveBeenLastCalledWith("2026-03-12");
  });

  it("shows an inline error for an unparseable or out-of-range date on blur", async () => {
    await renderWithTheme(
      <DateField label="Due" value="" onChange={() => {}} minDay="2026-03-10" />,
    );
    const input = screen.getByLabelText("Due");

    await fireEvent.changeText(input, "13/45/2026");
    await fireEvent(input, "blur");
    expect(screen.getByText(/Enter a valid date/)).toBeTruthy();

    await fireEvent.changeText(input, "03/05/2026");
    await fireEvent(input, "blur");
    expect(screen.getByText(/or later/)).toBeTruthy();
  });

  it("still opens the calendar from the trailing button", async () => {
    await renderWithTheme(<DateField label="Due" value="2026-03-05" onChange={() => {}} />);

    await fireEvent.press(screen.getByLabelText("Due, Choose a date"));

    expect(screen.getByLabelText(/March 12, 2026/)).toBeTruthy();
  });
});
