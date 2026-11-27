import { fireEvent, screen } from "@testing-library/react-native";

import { BarChart, type BarDatum } from "@/components/charts/bar-chart";
import { renderWithTheme } from "@/test-support/render";

const week: BarDatum[] = [
  { label: "M", value: 0.5 },
  { label: "T", value: 0.01 },
  { label: "W", value: 1.4 },
  { label: "T", value: -1 },
];

describe("BarChart", () => {
  it("labels each bar with its clamped percentage", async () => {
    await renderWithTheme(<BarChart data={week} color="#00f" height={80} />);
    expect(screen.getByLabelText("M: 50%")).toBeTruthy();
    expect(screen.getByLabelText("W: 100%")).toBeTruthy();
    expect(screen.getByLabelText("T: 0%")).toBeTruthy();
  });

  it("shows the empty label when every bar is empty", async () => {
    await renderWithTheme(<BarChart data={[{ label: "", value: 0 }]} emptyLabel="No data yet" />);
    expect(screen.getByText("No data yet")).toBeTruthy();
    expect(screen.getByLabelText("Bar 1: 0%")).toBeTruthy();
  });

  it("uses a sparse axis for dense charts", async () => {
    const month = Array.from({ length: 30 }, (_, i) => ({
      label: i % 7 === 0 ? `D${i + 1}` : " ",
      value: i / 30,
    }));
    await renderWithTheme(<BarChart data={month} />);
    expect(screen.getByText("D1")).toBeTruthy();
    expect(screen.getByText("D29")).toBeTruthy();
    expect(screen.queryByText("D2")).toBeNull();
  });
});

describe("BarChart interaction", () => {
  it("uses localized labels and reports the pressed bar", async () => {
    const onSelect = jest.fn();
    await renderWithTheme(
      <BarChart
        data={[
          { label: "Mon", value: 0.4, accessibilityLabel: "Monday, 2 of 5 on time" },
          { label: "Tue", value: 0, tone: "excused", accessibilityLabel: "Tuesday, excused" },
        ]}
        average={0.4}
        selectedIndex={null}
        onSelect={onSelect}
      />,
    );
    await fireEvent.press(screen.getByLabelText("Tuesday, excused"));
    expect(onSelect).toHaveBeenCalledWith(1);
    expect(screen.getByLabelText("Monday, 2 of 5 on time")).toBeTruthy();
  });
});

describe("BarChart dense mode", () => {
  const month = Array.from({ length: 30 }, (_, i) => ({
    label: i % 7 === 0 ? `D${i + 1}` : " ",
    value: i / 30,
    accessibilityLabel: `Day ${i + 1}`,
  }));

  it("announces the selected bar's value in the stepper", async () => {
    await renderWithTheme(<BarChart data={month} onSelect={jest.fn()} selectedIndex={4} />);
    expect(screen.getByText("Day 5")).toBeTruthy();
  });

  it("steps through bars with two buttons instead of ~10pt per-bar targets", async () => {
    const onSelect = jest.fn();
    await renderWithTheme(
      <BarChart
        data={month}
        onSelect={onSelect}
        summaryLabel="Last 30 days. Average 50% on time."
      />,
    );
    // Exactly the two steppers are operable; the 30 bars are not buttons.
    expect(screen.getAllByRole("button")).toHaveLength(2);
    expect(screen.getByLabelText("Last 30 days. Average 50% on time.")).toBeTruthy();
    await fireEvent.press(screen.getByLabelText("Next day"));
    expect(onSelect).toHaveBeenCalledWith(0);
    await fireEvent.press(screen.getByLabelText("Previous day"));
    expect(onSelect).toHaveBeenCalledWith(29);
  });
});
