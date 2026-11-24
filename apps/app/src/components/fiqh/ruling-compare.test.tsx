import { screen } from "@testing-library/react-native";

import { RULING_COMPARE_COLUMNS_MIN_WIDTH, RulingCompare } from "@/components/fiqh/ruling-compare";
import { resetMockWindowSize, setMockWindowSize } from "@/test-support/mocks/use-window-dimensions";
import { usePlatformSwitch } from "@/test-support/platform";
import { renderWithTheme } from "@/test-support/render";
import { flattenStyle } from "@/test-support/style";

jest.mock(
  "react-native/Libraries/Utilities/useWindowDimensions",
  () => require("@/test-support/mocks/use-window-dimensions").useWindowDimensionsMock,
);

afterEach(resetMockWindowSize);

const cellDirection = () =>
  flattenStyle(screen.getByTestId("ruling-compare-hanafi").parent?.props.style).flexDirection;

describe("RulingCompare", () => {
  const onPlatform = usePlatformSwitch();

  it("lists every school's position with an accessible label", async () => {
    await renderWithTheme(<RulingCompare id="witr.status" />);
    expect(screen.getByText("Ruling of Witr")).toBeTruthy();
    expect(
      screen.getByLabelText("Hanafi: Wajib (necessary): below fard, above sunnah."),
    ).toBeTruthy();
    expect(screen.getAllByText("Sunnah mu'akkadah (a strongly emphasised sunnah).")).toHaveLength(
      3,
    );
    expect(
      screen.getByText("All four schools are recognised positions of Sunni scholarship."),
    ).toBeTruthy();
  });

  it("stacks rows on a phone and uses columns on wide screens", async () => {
    onPlatform({ OS: "ios" });
    await renderWithTheme(<RulingCompare id="hayd.max" />);
    expect(cellDirection()).toBe("column");

    setMockWindowSize(RULING_COMPARE_COLUMNS_MIN_WIDTH);
    await renderWithTheme(<RulingCompare id="hayd.max" />);
    expect(cellDirection()).toBe("row");
  });

  it("uses columns on TV regardless of width", async () => {
    onPlatform({ OS: "android", isTV: true });
    await renderWithTheme(<RulingCompare id="hayd.max" />);
    expect(cellDirection()).toBe("row");
  });

  it("can hide the title and limit the schools", async () => {
    await renderWithTheme(
      <RulingCompare id="qasr.residency" hideTitle schools={["hanafi", "maliki"]} />,
    );
    expect(screen.queryByText("When a traveller becomes resident")).toBeNull();
    expect(screen.queryByTestId("ruling-compare-shafii")).toBeNull();
    expect(screen.getByTestId("ruling-compare-maliki")).toBeTruthy();
  });
});
