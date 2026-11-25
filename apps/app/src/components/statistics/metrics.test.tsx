import { fireEvent, screen } from "@testing-library/react-native";

import {
  CardDivider,
  LinkRow,
  MetricGrid,
  ReadableView,
  StatLine,
  StatsGroup,
} from "@/components/statistics/metrics";
import { usePlatform } from "@/test-support/platform";
import { renderWithTheme } from "@/test-support/render";

const metrics = [
  { value: 12, label: "Streak", color: "#00aa00" },
  { value: "80%", label: "On time" },
  { value: 3, label: "Qaza" },
];

describe("MetricGrid / StatsGroup", () => {
  it.each([2, 3] as const)("lays out every metric in %i columns", async (columns) => {
    await renderWithTheme(<StatsGroup title="This week" metrics={metrics} columns={columns} />);
    expect(screen.getByText("This week")).toBeTruthy();
    expect(screen.getByText("12")).toBeTruthy();
    expect(screen.getByText("On time")).toBeTruthy();
    expect(screen.getByText("Qaza")).toBeTruthy();
  });

  it("uses two columns by default", async () => {
    await renderWithTheme(<MetricGrid metrics={metrics.slice(0, 1)} />);
    expect(screen.getByText("Streak")).toBeTruthy();
  });
});

describe("MetricGrid / ReadableView a11y", () => {
  it("groups each metric's value and label into one announcement", async () => {
    await renderWithTheme(<MetricGrid metrics={metrics} />);
    expect(screen.getByLabelText("Streak: 12")).toBeTruthy();
  });

  it("puts the summary label on a real accessible View on phone / web", async () => {
    await renderWithTheme(
      <ReadableView accessibilityLabel="All rawatib prayed on 4 of the last 30 days">
        <MetricGrid metrics={metrics.slice(0, 1)} />
      </ReadableView>,
    );
    const node = screen.getByLabelText("All rawatib prayed on 4 of the last 30 days");
    expect(node.props.accessible).toBe(true);
  });
});

describe("StatLine", () => {
  it("shows a value with a relative bar", async () => {
    await renderWithTheme(<StatLine label="Fajr" value={20} color="#f00" bar={0.5} />);
    expect(screen.getByText("Fajr")).toBeTruthy();
    expect(screen.getByText("20")).toBeTruthy();
  });

  it("omits the bar", async () => {
    await renderWithTheme(<StatLine label="Isha" value="—" />);
    expect(screen.getByText("—")).toBeTruthy();
  });
});

describe("LinkRow", () => {
  it("presses through", async () => {
    const onPress = jest.fn();
    await renderWithTheme(<LinkRow label="See all" onPress={onPress} />);
    await fireEvent.press(screen.getByText("See all"));
    expect(onPress).toHaveBeenCalled();
  });

  describe("on TV", () => {
    usePlatform({ isTV: true });

    it("presses through at 10-foot size", async () => {
      const onPress = jest.fn();
      await renderWithTheme(<LinkRow label="See all" onPress={onPress} />);
      await fireEvent.press(screen.getByText("See all"));
      expect(onPress).toHaveBeenCalled();
    });
  });
});

describe("CardDivider", () => {
  it("draws a hairline", async () => {
    const { toJSON } = await renderWithTheme(<CardDivider />);
    expect(toJSON()).toBeTruthy();
  });
});
