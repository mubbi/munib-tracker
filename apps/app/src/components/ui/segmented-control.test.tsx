import { fireEvent, screen } from "@testing-library/react-native";

import { SegmentedControl } from "@/components/ui/segmented-control";
import { usePlatform } from "@/test-support/platform";
import { parentOf } from "@/test-support/queries";
import { renderWithTheme } from "@/test-support/render";
import { flattenStyle } from "@/test-support/style";

type Period = "day" | "week";

const OPTIONS: { id: Period; label: string }[] = [
  { id: "day", label: "Day" },
  { id: "week", label: "Week" },
];

const renderControl = (value: Period, onChange = jest.fn()) =>
  renderWithTheme(<SegmentedControl options={OPTIONS} value={value} onChange={onChange} />);

const track = () => parentOf(screen.getByText("Day"), 3);

describe("SegmentedControl", () => {
  it("marks the selected segment", async () => {
    await renderControl("day");

    expect(screen.getAllByRole("button").map((b) => b.props.accessibilityState)).toEqual([
      { selected: true },
      { selected: false },
    ]);
  });

  it("reports a newly selected segment", async () => {
    const onChange = jest.fn();
    await renderControl("day", onChange);

    await fireEvent.press(screen.getByText("Week"));

    expect(onChange).toHaveBeenCalledWith("week");
  });

  it("ignores presses on the selected segment", async () => {
    const onChange = jest.fn();
    await renderControl("day", onChange);

    await fireEvent.press(screen.getByText("Day"));

    expect(onChange).not.toHaveBeenCalled();
  });

  it("reports a re-press of the selected segment when allowReselect is set", async () => {
    const onChange = jest.fn();
    await renderWithTheme(
      <SegmentedControl options={OPTIONS} value="day" onChange={onChange} allowReselect tabs />,
    );

    await fireEvent.press(screen.getByRole("tab", { name: "Day" }));

    expect(onChange).toHaveBeenCalledWith("day");
  });

  it("uses an option's screen-reader label", async () => {
    await renderWithTheme(
      <SegmentedControl
        options={[{ id: "day", label: "D", accessibilityLabel: "Daily view" }]}
        value="day"
        onChange={jest.fn()}
      />,
    );

    expect(screen.getByRole("button", { name: "Daily view" })).toBeSelected();
  });

  it("adds the sliding thumb once the track is measured", async () => {
    await renderControl("missing" as Period);
    const before = track().children.length;

    await fireEvent(track(), "layout", { nativeEvent: { layout: { width: 300, height: 40 } } });

    expect(track().children).toHaveLength(before + 1);
  });
});

describe("SegmentedControl on TV", () => {
  usePlatform({ isTV: true });

  it("uses the TV body font size", async () => {
    await renderControl("week");

    expect(flattenStyle(screen.getByText("Day").props.style).fontSize).toBeGreaterThan(14);
  });
});
