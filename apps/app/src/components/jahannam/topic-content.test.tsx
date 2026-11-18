import { fireEvent, screen } from "@testing-library/react-native";

import { JahannamTopicContent } from "@/components/jahannam/topic-content";
import { getJahannamTopics } from "@/lib/jahannam";
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
const topics = getJahannamTopics();
const linked = topics.find((topic) => topic.appLinks?.length);

describe("JahannamTopicContent", () => {
  beforeEach(resetExpoRouterMock);

  it.each(topics.map((topic) => [topic.id, topic] as const))(
    "renders the %s topic summary",
    async (_id, topic) => {
      await renderWithTheme(<JahannamTopicContent topic={topic} />);
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
    await renderWithTheme(<JahannamTopicContent topic={bare} />);
    expect(screen.getByText(bare.summary)).toBeTruthy();
    expect(screen.queryByText("Practical steps")).toBeNull();
  });

  it("opens in-app links", async () => {
    if (!linked?.appLinks?.[0]) throw new Error("expected a topic with app links");
    await renderWithTheme(<JahannamTopicContent topic={linked} />);
    await fireEvent.press(screen.getByText(linked.appLinks[0].label));
    expect(mockRouter.push).toHaveBeenCalledWith(linked.appLinks[0].route);
  });
});
