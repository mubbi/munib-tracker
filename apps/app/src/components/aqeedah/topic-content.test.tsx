import { fireEvent, screen, waitFor } from "@testing-library/react-native";

import { AqeedahTopicContent } from "@/components/aqeedah/topic-content";
import { getAqeedahTopics } from "@/lib/aqeedah";
import { mockRouter, resetExpoRouterMock } from "@/test-support/mocks/expo-router";
import { renderWithTheme } from "@/test-support/render";

jest.mock("expo-router", () => require("@/test-support/mocks/expo-router").expoRouterMock);
jest.mock(
  "@/components/guide-topic-footer",
  () => require("@/test-support/mocks/guide-topic-footer").guideTopicFooterMock,
);
jest.mock(
  "@/providers/audio-player-provider",
  () => require("@/test-support/mocks/audio-player-provider").audioPlayerProviderMock,
);
jest.mock(
  "@/hooks/use-quran-ayah-range",
  () => require("@/test-support/mocks/use-quran-ayah-range").quranAyahRangeMock,
);

/** Real bundled topics — together they exercise every optional section. */
const topics = getAqeedahTopics();
const linked = topics.find((topic) => topic.appLinks?.length);

describe("AqeedahTopicContent", () => {
  beforeEach(resetExpoRouterMock);

  it.each(topics.map((topic) => [topic.id, topic] as const))(
    "renders the %s topic summary",
    async (_id, topic) => {
      await renderWithTheme(<AqeedahTopicContent topic={topic} />);
      expect(screen.getByText(topic.summary)).toBeTruthy();
      expect(screen.getByLabelText(topic.id)).toBeTruthy();
    },
  );

  it("renders a bare topic without optional sections", async () => {
    const bare = {
      ...topics[0],
      importance: undefined,
      quran: undefined,
      hadith: undefined,
      actions: undefined,
      appLinks: undefined,
      disclaimer: undefined,
    };
    await renderWithTheme(<AqeedahTopicContent topic={bare} />);
    expect(screen.getByText(bare.summary)).toBeTruthy();
    expect(screen.queryByText("Practical steps")).toBeNull();
  });

  it("opens in-app links", async () => {
    if (!linked?.appLinks?.[0]) throw new Error("expected a topic with app links");
    await renderWithTheme(<AqeedahTopicContent topic={linked} />);
    await fireEvent.press(screen.getByText(linked.appLinks[0].label));
    expect(mockRouter.push).toHaveBeenCalledWith(linked.appLinks[0].route);
  });

  it("toggles lesson completion from the footer", async () => {
    await renderWithTheme(<AqeedahTopicContent topic={topics[0]} />);
    const footer = screen.getByTestId("guide-topic-footer");
    expect(footer.props.accessibilityState).toEqual({ checked: false });
    await fireEvent.press(footer);
    await waitFor(() =>
      expect(screen.getByTestId("guide-topic-footer").props.accessibilityState).toEqual({
        checked: true,
      }),
    );
  });
});
