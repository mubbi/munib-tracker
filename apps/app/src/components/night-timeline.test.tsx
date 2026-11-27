import { screen } from "@testing-library/react-native";

import { NightTimeline } from "@/components/night-timeline";
import { renderWithTheme } from "@/test-support/render";

const at = (hours: number) => new Date(2026, 6, 6, hours, 0);
/** Maghrib 18:00 → Fajr 06:00 next day. */
const NIGHT = {
  maghribAt: at(18),
  midNight: at(24),
  lastThird: at(26),
  fajrAt: at(30),
  format: (date: Date) => `${date.getHours()}h`,
};

type Props = Parameters<typeof NightTimeline>[0];
const renderTimeline = (props: Partial<Props> = {}) =>
  renderWithTheme(<NightTimeline {...NIGHT} now={at(27)} {...props} />);

const nowMarkers = () =>
  screen.container.queryAll((node) => {
    const style = node.props.style;
    return Array.isArray(style) && style.some((s) => s && typeof s.start === "string");
  });

describe("NightTimeline", () => {
  it("labels Maghrib, mid-night, the last third and Fajr", async () => {
    await renderTimeline();

    expect(["18h", "0h", "2h", "6h"].map((time) => screen.getByText(time))).toHaveLength(4);
  });

  it("only labels the ends when compact", async () => {
    await renderTimeline({ compact: true });

    expect(screen.getByText("18h")).toBeTruthy();
    expect(screen.queryByText("0h")).toBeNull();
    expect(screen.getByText("6h")).toBeTruthy();
  });

  it("marks now within the night", async () => {
    await renderTimeline();

    expect(nowMarkers()).toHaveLength(1);
  });

  it.each([
    ["before Maghrib", { now: at(12) }],
    ["after Fajr", { now: at(31) }],
    ["on an empty span", { fajrAt: at(18), now: at(18) }],
  ])("hides the now marker %s", async (_case, props) => {
    await renderTimeline(props);

    expect(nowMarkers()).toHaveLength(0);
  });

  it("speaks every boundary as one label (the bar is decorative)", async () => {
    await renderTimeline();

    const node = screen.getByLabelText(/18h.*0h.*2h.*6h/);
    expect(node.props.accessibilityLabel).toContain("18h");
  });
});
