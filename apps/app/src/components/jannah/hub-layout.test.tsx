import { fireEvent, screen } from "@testing-library/react-native";
import { Text, View } from "react-native";

import {
  HUB_ASIDE_WIDTH,
  LearnColumnsGrid,
  LearnTile,
  LearnTwoPane,
  learnColumnsFor,
  useLearnHubLayout,
} from "@/components/jannah/hub-layout";
import { resetMockWindowSize, setMockWindowSize } from "@/test-support/mocks/use-window-dimensions";
import { setPlatform, usePlatform } from "@/test-support/platform";
import { renderHookWithTheme, renderWithTheme } from "@/test-support/render";

jest.mock(
  "react-native/Libraries/Utilities/useWindowDimensions",
  () => require("@/test-support/mocks/use-window-dimensions").useWindowDimensionsMock,
);

async function layoutAt(width: number, asideWidth?: number) {
  setMockWindowSize(width);
  const { result } = await renderHookWithTheme(() => useLearnHubLayout(asideWidth));
  return result.current;
}

describe("useLearnHubLayout", () => {
  afterEach(resetMockWindowSize);

  it("returns the phone layout below 768px", async () => {
    expect(await layoutAt(390)).toEqual({
      isWide: false,
      maxContentWidth: undefined,
      contentWidth: 0,
      twoPane: false,
      mainWidth: 0,
    });
  });

  it("keeps the default content cap on tablets", async () => {
    const layout = await layoutAt(800);
    expect(layout.isWide).toBe(true);
    expect(layout.maxContentWidth).toBeUndefined();
    expect(layout.twoPane).toBe(false);
    expect(layout.mainWidth).toBe(layout.contentWidth);
  });

  it.each([
    [1200, 1120],
    [1800, 1320],
  ])("splits into two panes at %ipx with cap %i", async (width, cap) => {
    const layout = await layoutAt(width);
    expect(layout.maxContentWidth).toBe(cap);
    expect(layout.twoPane).toBe(true);
    expect(layout.mainWidth).toBeLessThan(layout.contentWidth - HUB_ASIDE_WIDTH);
  });

  describe("on TV", () => {
    usePlatform({ isTV: true });

    it("never takes the wide path", async () => {
      expect((await layoutAt(1920)).isWide).toBe(false);
    });
  });
});

describe("learnColumnsFor", () => {
  it.each([
    [0, {}, 1],
    [700, {}, 2],
    [2000, {}, 3],
    [2000, { max: 2 }, 2],
    [900, { minCell: 420, gap: 24 }, 2],
  ])("fits %ipx with %o into %i columns", (available, opts, expected) => {
    expect(learnColumnsFor(available, opts)).toBe(expected);
  });

  it("is always 1 on TV", () => {
    const restore = setPlatform({ isTV: true });
    expect(learnColumnsFor(2000)).toBe(1);
    restore();
  });
});

describe("LearnColumnsGrid", () => {
  it.each([1, 3])("renders every child with %i column(s)", async (columns) => {
    await renderWithTheme(
      <LearnColumnsGrid columns={columns} stackGap={0}>
        <Text>one</Text>
        <Text>two</Text>
      </LearnColumnsGrid>,
    );
    expect(screen.getByText("one")).toBeTruthy();
    expect(screen.getByText("two")).toBeTruthy();
  });
});

describe("LearnTile", () => {
  it.each([true, false])("renders its child when tiled=%s", async (tiled) => {
    await renderWithTheme(
      <LearnTile tiled={tiled}>
        <Text>row</Text>
      </LearnTile>,
    );
    expect(screen.getByText("row")).toBeTruthy();
  });
});

describe("LearnTwoPane", () => {
  async function renderPane() {
    await renderWithTheme(
      <LearnTwoPane main={<Text>main</Text>} aside={<View testID="aside-child" />} />,
    );
    return screen.getByTestId("aside-child").parent as unknown as { props: { style: unknown } };
  }

  async function layoutAside(height: number) {
    const aside = screen.getByTestId("aside-child").parent;
    if (!aside) throw new Error("aside wrapper missing");
    await fireEvent(aside, "layout", { nativeEvent: { layout: { height } } });
    return JSON.stringify(screen.getByTestId("aside-child").parent?.props.style);
  }

  it("renders main and aside columns without sticking on native", async () => {
    await renderPane();
    expect(screen.getByText("main")).toBeTruthy();
    expect(await layoutAside(200)).not.toContain("sticky");
  });

  describe("on web", () => {
    usePlatform({ OS: "web" });

    it("sticks a short aside", async () => {
      await renderPane();
      expect(await layoutAside(200)).toContain("sticky");
    });

    it("does not stick an aside taller than the viewport", async () => {
      await renderPane();
      expect(await layoutAside(5000)).not.toContain("sticky");
    });
  });
});
