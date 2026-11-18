import { render, renderHook, screen } from "@testing-library/react-native";
import { Text } from "react-native";

import {
  ResponsiveGrid,
  responsiveColumns,
  useResponsiveColumns,
} from "@/components/ui/responsive-grid";
import { resetMockWindowSize, setMockWindowSize } from "@/test-support/mocks/use-window-dimensions";
import { flattenStyle } from "@/test-support/style";

jest.mock(
  "react-native/Libraries/Utilities/useWindowDimensions",
  () => require("@/test-support/mocks/use-window-dimensions").useWindowDimensionsMock,
);

type Props = Omit<Parameters<typeof ResponsiveGrid>[0], "children">;

const renderGrid = (props: Props = {}) =>
  render(
    <ResponsiveGrid {...props}>
      <Text>A</Text>
      {null}
      <Text>B</Text>
      <Text>C</Text>
    </ResponsiveGrid>,
  );

describe("responsiveColumns", () => {
  it.each([
    [400, {}, 1],
    [800, {}, 2],
    [1300, {}, 3],
    [1700, {}, 4],
    [1700, { max: 2 }, 2],
    [300, { min: 2 }, 2],
  ])("width %i with %o → %i columns", (width, bounds, expected) => {
    expect(responsiveColumns(width, bounds)).toBe(expected);
  });
});

describe("ResponsiveGrid", () => {
  afterEach(() => resetMockWindowSize());

  it("derives columns from the window width", async () => {
    setMockWindowSize(1300);
    const { result } = await renderHook(() => useResponsiveColumns());

    expect(result.current).toBe(3);
  });

  it("stacks children in a single column on phones", async () => {
    await renderGrid({ gap: 4 });

    expect(screen.getByText("A").parent!.props.style).toEqual([{ gap: 4 }, undefined]);
  });

  it("wraps children in equal percentage cells for multi-column grids", async () => {
    await renderGrid({ columns: 3, style: { padding: 1 } });

    expect(flattenStyle(screen.getByText("B").parent!.props.style).width).toBe(`${100 / 3}%`);
  });
});
