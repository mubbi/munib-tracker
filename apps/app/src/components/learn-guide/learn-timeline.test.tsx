import { fireEvent, screen } from "@testing-library/react-native";
import { Text } from "react-native";

import {
  LearnTimeline,
  type LearnTimelineEvent,
  LearnTwoColumnTimeline,
  useLearnTimelineTwoColumn,
} from "@/components/learn-guide/learn-timeline";
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

describe("LearnTimeline", () => {
  afterEach(resetMockWindowSize);

  const onPress = jest.fn();
  const events: LearnTimelineEvent[] = [
    {
      id: "hijrah",
      badges: ["622 CE", "1 AH"],
      location: "Madinah",
      title: "Hijrah",
      body: "The migration.",
      link: { label: "Read the lesson", onPress },
    },
    { id: "treaty", badges: ["628 CE"], title: "Hudaybiyyah", body: "The treaty." },
  ];

  beforeEach(() => onPress.mockClear());

  it("renders linked events as one link and opens the lesson", async () => {
    await renderWithTheme(<LearnTimeline events={events} />);
    const link = screen.getByRole("link", { name: "Hijrah. Read the lesson" });
    await fireEvent.press(link);
    expect(onPress).toHaveBeenCalledTimes(1);
    expect(screen.getByText("Madinah")).toBeTruthy();
    expect(screen.getByText("622 CE")).toBeTruthy();
  });

  it("does not make events without a link pressable off TV (G-40, G-76)", async () => {
    await renderWithTheme(<LearnTimeline events={events} />);
    expect(screen.getByText("Hudaybiyyah")).toBeTruthy();
    expect(screen.queryAllByRole("button")).toHaveLength(0);
    expect(screen.getAllByRole("link")).toHaveLength(1);
  });

  it("uses the staggered layout on wide web", async () => {
    setMockWindowSize(1300);
    await renderWithTheme(<LearnTimeline events={events} />);
    expect(screen.getByText("Hijrah")).toBeTruthy();
    expect(screen.getByText("Hudaybiyyah")).toBeTruthy();
  });

  describe("on TV", () => {
    usePlatform({ isTV: true });

    it("keeps link-less events as reading stops, not buttons", async () => {
      await renderWithTheme(<LearnTimeline events={events} />);
      expect(screen.queryAllByRole("button")).toHaveLength(0);
      expect(screen.getAllByRole("text").length).toBeGreaterThan(0);
    });
  });
});
