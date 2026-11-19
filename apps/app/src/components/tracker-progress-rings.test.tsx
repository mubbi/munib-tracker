import { fireEvent, screen } from "@testing-library/react-native";

import {
  type TrackerProgressRingItem,
  TrackerProgressRings,
} from "@/components/tracker-progress-rings";
import { Spacing } from "@/constants/theme";
import { captureAnimationFrames } from "@/test-support/animation-frames";
import { resetMockWindowSize, setMockWindowSize } from "@/test-support/mocks/use-window-dimensions";
import { usePlatform } from "@/test-support/platform";
import { parentOf } from "@/test-support/queries";
import { renderWithTheme } from "@/test-support/render";
import { flattenStyle } from "@/test-support/style";

jest.mock(
  "react-native/Libraries/Utilities/useWindowDimensions",
  () => require("@/test-support/mocks/use-window-dimensions").useWindowDimensionsMock,
);

const buildItems = (count: number, overrides: Partial<TrackerProgressRingItem> = {}) =>
  Array.from({ length: count }, (_, index) => ({
    id: `ring-${index}`,
    label: `Group ${index}`,
    progress: 0.5,
    detail: `${index}/6`,
    accessibilityLabel: `Group ${index}, ${index} of 6`,
    ...overrides,
  }));

const renderRings = (items: TrackerProgressRingItem[]) =>
  renderWithTheme(<TrackerProgressRings items={items} />);

const cellWidth = (index = 0) =>
  flattenStyle(screen.getByLabelText(`Group ${index}, ${index} of 6`).props.style).width as number;

/** Row width after screen + card padding (two `Spacing.four` insets per side). */
const rowFor = (viewport: number) => viewport - Spacing.four * 4;
const ROW = rowFor(390);
const GAP = Spacing.two;
const widthFor = (columns: number, row = ROW) => Math.floor((row - GAP * (columns - 1)) / columns);

// Freeze the rings' count-up animation; these tests are about layout.
beforeEach(() => captureAnimationFrames());
afterEach(() => {
  resetMockWindowSize();
  jest.restoreAllMocks();
});

describe("TrackerProgressRings", () => {
  it("renders nothing without groups", async () => {
    await renderRings([]);

    expect(screen.toJSON()).toBeNull();
  });

  it("labels each ring with its detail line", async () => {
    await renderRings(buildItems(2));

    expect(screen.getByText("Group 1")).toBeTruthy();
    expect(screen.getByText("1/6")).toBeTruthy();
  });

  it.each([
    [1, 1],
    [3, 3],
    [4, 2],
    [5, 3],
  ])("lays %i groups out in %i columns on phones", async (count, columns) => {
    await renderRings(buildItems(count));

    expect(cellWidth()).toBe(widthFor(columns));
  });

  it("fits every group on one row once the measured row is wide", async () => {
    await renderRings(buildItems(4));

    await fireEvent(parentOf(screen.getByLabelText("Group 0, 0 of 6")), "layout", {
      nativeEvent: { layout: { width: 700 } },
    });

    expect(cellWidth()).toBe(widthFor(4, 700));
  });

  it("ignores sub-pixel layout jitter", async () => {
    await renderRings(buildItems(2));

    await fireEvent(parentOf(screen.getByLabelText("Group 0, 0 of 6")), "layout", {
      nativeEvent: { layout: { width: ROW + 0.2 } },
    });

    expect(cellWidth()).toBe(widthFor(2));
  });

  it("re-estimates the row when the window resizes", async () => {
    setMockWindowSize(1200);
    await renderRings(buildItems(5));

    expect(cellWidth()).toBe(widthFor(5, rowFor(800)));
  });

  it("makes tappable groups buttons", async () => {
    const onPress = jest.fn();
    await renderRings(buildItems(1, { onPress, color: "#ff0000" }));

    await fireEvent.press(screen.getByRole("button", { name: "Group 0, 0 of 6" }));

    expect(onPress).toHaveBeenCalled();
  });
});

describe("TrackerProgressRings on TV", () => {
  usePlatform({ isTV: true });

  it("puts up to five groups on one row", async () => {
    await renderRings(buildItems(4));

    expect(cellWidth()).toBe(widthFor(4));
  });
});
