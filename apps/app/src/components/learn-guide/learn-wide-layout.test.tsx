import { fireEvent, screen } from "@testing-library/react-native";
import { Text, View } from "react-native";

import {
  LEARN_SPLIT_MAX_WIDTH,
  LearnGrid,
  LearnSplitLayout,
  LearnTopicGrid,
  type LearnTopicGridItem,
  useLearnColumns,
  useLearnWideLayout,
} from "@/components/learn-guide/learn-wide-layout";
import { resetMockWindowSize, setMockWindowSize } from "@/test-support/mocks/use-window-dimensions";
import { usePlatform } from "@/test-support/platform";
import { renderHookWithTheme, renderWithTheme } from "@/test-support/render";

jest.mock(
  "react-native/Libraries/Utilities/useWindowDimensions",
  () => require("@/test-support/mocks/use-window-dimensions").useWindowDimensionsMock,
);
jest.mock(
  "@/providers/audio-player-provider",
  () => require("@/test-support/mocks/audio-player-provider").audioPlayerProviderMock,
);

const icon = { ios: "star", android: "star", web: "star" } as const;

function topic(overrides: Partial<LearnTopicGridItem> = {}): LearnTopicGridItem {
  return {
    id: "t1",
    icon,
    title: "Wudu",
    subtitle: "Steps",
    badge: "New",
    onPress: jest.fn(),
    ...overrides,
  };
}

describe("useLearnWideLayout", () => {
  afterEach(resetMockWindowSize);

  it.each([
    [390, false, false, undefined],
    [900, true, false, undefined],
    [1300, true, true, LEARN_SPLIT_MAX_WIDTH],
  ])("at %ipx reports wide=%s split=%s", async (width, wide, split, maxContentWidth) => {
    setMockWindowSize(width);
    const { result } = await renderHookWithTheme(() => useLearnWideLayout());
    expect(result.current).toEqual(expect.objectContaining({ wide, split, maxContentWidth }));
  });

  describe("on TV", () => {
    usePlatform({ isTV: true });

    it("never goes wide and uses one column", async () => {
      setMockWindowSize(1920);
      const { result } = await renderHookWithTheme(() => ({
        layout: useLearnWideLayout(),
        cols: useLearnColumns(),
      }));
      expect(result.current.layout.split).toBe(false);
      expect(result.current.cols).toBe(1);
    });
  });
});

describe("LearnGrid", () => {
  afterEach(resetMockWindowSize);

  it.each([
    [390, true],
    [390, false],
    [1300, true],
  ])("renders every child at %ipx (passthrough=%s)", async (width, passthrough) => {
    setMockWindowSize(width);
    await renderWithTheme(
      <LearnGrid passthrough={passthrough} style={{ gap: 4 }}>
        <Text>a</Text>
        <Text>b</Text>
      </LearnGrid>,
    );
    expect(screen.getByText("a")).toBeTruthy();
    expect(screen.getByText("b")).toBeTruthy();
  });
});

describe("LearnSplitLayout", () => {
  afterEach(resetMockWindowSize);

  it("renders the fallback below the breakpoint", async () => {
    await renderWithTheme(
      <LearnSplitLayout aside={<Text>aside</Text>} fallback={<Text>fallback</Text>}>
        <Text>main</Text>
      </LearnSplitLayout>,
    );
    expect(screen.getByText("fallback")).toBeTruthy();
    expect(screen.queryByText("aside")).toBeNull();
  });

  it("renders children without a fallback below the breakpoint", async () => {
    await renderWithTheme(
      <LearnSplitLayout aside={<Text>aside</Text>}>
        <Text>main</Text>
      </LearnSplitLayout>,
    );
    expect(screen.getByText("main")).toBeTruthy();
  });

  it("lays out main and aside side by side when split", async () => {
    setMockWindowSize(1300, 900);
    await renderWithTheme(
      <LearnSplitLayout aside={<View testID="aside" />} asideWidth={280}>
        <Text>main</Text>
      </LearnSplitLayout>,
    );
    const asideWrap = screen.getByTestId("aside").parent;
    if (!asideWrap) throw new Error("aside wrapper missing");
    await fireEvent(asideWrap, "layout", { nativeEvent: { layout: { height: 300 } } });
    expect(screen.getByText("main")).toBeTruthy();
    expect(JSON.stringify(asideWrap.props.style)).toContain("280");
  });
});

describe("LearnTopicGrid", () => {
  afterEach(resetMockWindowSize);

  it("renders stacked nav rows on phones", async () => {
    const item = topic();
    await renderWithTheme(<LearnTopicGrid items={[item]} />);
    await fireEvent.press(screen.getByLabelText("Wudu. Steps. New"));
    expect(item.onPress).toHaveBeenCalled();
  });

  it("renders equal-height tiles on wide screens", async () => {
    setMockWindowSize(1300);
    const full = topic();
    const bare = topic({
      id: "t2",
      title: "Ghusl",
      subtitle: undefined,
      badge: undefined,
      tint: "#f00",
    });
    await renderWithTheme(<LearnTopicGrid items={[full, bare]} />);
    await fireEvent.press(screen.getByLabelText("Ghusl"));
    expect(bare.onPress).toHaveBeenCalled();
    expect(screen.getByText("New")).toBeTruthy();
  });
});
