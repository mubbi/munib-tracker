import { fireEvent, screen } from "@testing-library/react-native";

import { QuickActionGrid, type QuickActionItem } from "@/components/ui/quick-action";
import { NAMES_OF_ALLAH_ICON } from "@/lib/names-of-allah-ui";
import { resetMockWindowSize, setMockWindowSize } from "@/test-support/mocks/use-window-dimensions";
import { usePlatform } from "@/test-support/platform";
import { parentOf, queryHostsByType } from "@/test-support/queries";
import { renderWithTheme } from "@/test-support/render";
import { flattenStyle } from "@/test-support/style";

jest.mock(
  "react-native/Libraries/Utilities/useWindowDimensions",
  () => require("@/test-support/mocks/use-window-dimensions").useWindowDimensionsMock,
);

type GridProps = Parameters<typeof QuickActionGrid>[0];

const makeItems = (count: number, onPress = jest.fn()): QuickActionItem[] =>
  Array.from({ length: count }, (_, index) => ({
    id: `item-${index}`,
    label: `Item ${index}`,
    icon: index === 0 ? NAMES_OF_ALLAH_ICON : "star",
    tint: index === 1 ? "#ff0000" : undefined,
    onPress,
    isNew: index === 0,
    newLabel: index === 0 ? "New" : undefined,
  }));

const renderGrid = (count: number, props: Partial<GridProps> = {}) =>
  renderWithTheme(
    <QuickActionGrid items={makeItems(count, props.items?.[0]?.onPress)} {...props} />,
  );

const scrollRows = () => queryHostsByType("RCTScrollView");
const labelLines = (label: string) => screen.getByText(label).props.numberOfLines;

describe("QuickActionGrid", () => {
  afterEach(() => resetMockWindowSize());

  it("announces the New badge with the label", async () => {
    await renderGrid(4);

    expect(screen.getByLabelText("Item 0, New")).toBeTruthy();
  });

  it("fires the tile's onPress", async () => {
    const onPress = jest.fn();
    await renderWithTheme(<QuickActionGrid items={makeItems(4, onPress)} />);

    await fireEvent.press(screen.getByLabelText("Item 2"));

    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it("fits a compact single row when there is room", async () => {
    await renderGrid(3, { singleRow: true });

    expect(labelLines("Item 1")).toBe(1);
  });

  it("falls back to the wrapping grid when a single row does not fit", async () => {
    await renderGrid(8, { singleRow: true, columns: 4 });

    expect(labelLines("Item 7")).toBe(2);
    expect(scrollRows()).toHaveLength(0);
  });

  it("scrolls an overflowing single row sideways", async () => {
    await renderGrid(8, { singleRow: true, overflow: "scroll" });

    expect(scrollRows()).toHaveLength(1);
  });

  it.each([
    [390, 3],
    [700, 5],
    [1000, 6],
  ])("at width %i uses %i responsive columns", async (width, columns) => {
    setMockWindowSize(width);
    await renderGrid(2);

    const slot = parentOf(screen.getByLabelText("Item 1"));
    expect(flattenStyle(slot.props.style).width).toBe(`${100 / columns}%`);
  });
});

describe("QuickActionGrid on TV", () => {
  usePlatform({ isTV: true });

  it("always wraps instead of scrolling", async () => {
    await renderGrid(8, { singleRow: true, overflow: "scroll" });

    expect(scrollRows()).toHaveLength(0);
  });
});
