import { screen } from "@testing-library/react-native";
import { Text } from "react-native";

import {
  LearnTwoColumnTimeline,
  useLearnTimelineTwoColumn,
} from "@/components/learn-guide/learn-timeline";
import { resetMockWindowSize, setMockWindowSize } from "@/test-support/mocks/use-window-dimensions";
import { renderHookWithTheme, renderWithTheme } from "@/test-support/render";

jest.mock(
  "react-native/Libraries/Utilities/useWindowDimensions",
  () => require("@/test-support/mocks/use-window-dimensions").useWindowDimensionsMock,
);
jest.mock(
  "@/providers/audio-player-provider",
  () => require("@/test-support/mocks/audio-player-provider").audioPlayerProviderMock,
);

describe("LearnTwoColumnTimeline", () => {
  afterEach(resetMockWindowSize);

  it.each([
    [390, false],
    [1300, true],
  ])("uses two columns at %ipx: %s", async (width, expected) => {
    setMockWindowSize(width);
    const { result } = await renderHookWithTheme(() => useLearnTimelineTwoColumn());
    expect(result.current).toBe(expected);
  });

  it("alternates events between the start and end columns", async () => {
    await renderWithTheme(
      <LearnTwoColumnTimeline
        items={["Hijrah", "Badr", "Uhud"]}
        keyOf={(item) => item}
        renderCard={(item, index) => <Text>{`${index}:${item}`}</Text>}
      />,
    );
    expect(screen.getByText("0:Hijrah")).toBeTruthy();
    expect(screen.getByText("1:Badr")).toBeTruthy();
    expect(screen.getByText("2:Uhud")).toBeTruthy();
  });
});
