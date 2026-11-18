import type { LearnDuaTopic } from "@munib-tracker/shared/types";
import { fireEvent, screen, waitFor } from "@testing-library/react-native";

import { LearnDuaTopicContent } from "@/components/learn-dua/topic-content";
import { getLearnDuaTopics } from "@/lib/learn-dua";
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
const topics = getLearnDuaTopics();
const linked = topics.find((topic) => topic.appLinks?.length);

const topicWithVariants: LearnDuaTopic = {
  id: "wake-sleep",
  section: "daily",
  title: "After waking and before sleep",
  summary: "Frame the day with remembrance.",
  body: ["Sleep is a minor death, and waking a small resurrection."],
  phrases: [
    {
      id: "sleep-bismika",
      title: "Dua before sleep",
      when: "When lying down to sleep",
      arabic: "بِاسْمِكَ اللَّهُمَّ أَمُوتُ وَأَحْيَا",
      transliteration: "Bismika Allahumma amutu wa ahya",
      translation: "In Your name, O Allah, I die and I live.",
      reference: "Sahih al-Bukhari 6324",
      variants: [
        {
          arabic: "اللَّهُمَّ بِاسْمِكَ أَمُوتُ وَأَحْيَا",
          transliteration: "Allahumma bismika amutu wa ahya",
          translation: "O Allah, in Your name I die and I live.",
          reference: "Sahih al-Bukhari 6314",
        },
        { arabic: "اللَّهُمَّ بِاسْمِكَ أَحْيَا" },
      ],
    },
  ],
};

describe("LearnDuaTopicContent", () => {
  beforeEach(resetExpoRouterMock);

  it.each(topics.map((topic) => [topic.id, topic] as const))(
    "renders the %s topic summary",
    async (_id, topic) => {
      await renderWithTheme(<LearnDuaTopicContent topic={topic} />);
      expect(screen.getByText(topic.summary)).toBeTruthy();
    },
  );

  it("renders alternate authentic wordings for a phrase", async () => {
    await renderWithTheme(<LearnDuaTopicContent topic={topicWithVariants} />);
    expect(screen.getByText("Dua before sleep — When lying down to sleep")).toBeTruthy();
    expect(screen.getAllByText("Alternate authentic wording")).toHaveLength(2);
    expect(screen.getByText("Sahih al-Bukhari 6314")).toBeTruthy();
    // A variant without its own translation falls back to the primary phrase.
    expect(screen.getAllByText("In Your name, O Allah, I die and I live.")).toHaveLength(2);
  });

  it("skips the variants list when a phrase has none", async () => {
    const [phrase] = topicWithVariants.phrases ?? [];
    await renderWithTheme(
      <LearnDuaTopicContent
        topic={{ ...topicWithVariants, phrases: [{ ...phrase, variants: undefined }] }}
      />,
    );
    expect(screen.queryByText("Alternate authentic wording")).toBeNull();
  });

  it("opens in-app links", async () => {
    if (!linked?.appLinks?.[0]) throw new Error("expected a topic with app links");
    await renderWithTheme(<LearnDuaTopicContent topic={linked} />);
    await fireEvent.press(screen.getByText(linked.appLinks[0].label));
    expect(mockRouter.push).toHaveBeenCalledWith(linked.appLinks[0].route);
  });

  it("toggles lesson completion from the footer", async () => {
    await renderWithTheme(<LearnDuaTopicContent topic={topicWithVariants} />);
    await fireEvent.press(screen.getByTestId("guide-topic-footer"));
    await waitFor(() =>
      expect(screen.getByTestId("guide-topic-footer").props.accessibilityState).toEqual({
        checked: true,
      }),
    );
  });
});
