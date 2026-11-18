import { fireEvent, screen } from "@testing-library/react-native";

import { LearnGuideTopicContent } from "@/components/learn-guide/learn-guide-topic-content";
import { buildLearnGuideTopic } from "@/test-support/fixtures/learn-guide";
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
jest.mock("@/components/learn-guide/linked-dua-card", () => {
  const { Text } = require("react-native");
  return {
    LinkedDuaCard: ({ duaId, sourceHref }: { duaId: string; sourceHref: string }) => (
      <Text>{`dua:${duaId}:${sourceHref}`}</Text>
    ),
  };
});

async function renderTopic(overrides: Parameters<typeof buildLearnGuideTopic>[0] = {}) {
  await renderWithTheme(
    <LearnGuideTopicContent
      topic={buildLearnGuideTopic(overrides)}
      ns="laylatAlQadr"
      sectionTitle="Laylat al-Qadr"
    />,
  );
}

describe("LearnGuideTopicContent", () => {
  beforeEach(resetExpoRouterMock);

  it.each([
    "Better than a thousand months.",
    "Seek it in the last ten nights.",
    "Schools differ on details.",
    "Make dua",
    "Educational summary.",
  ])("shows %s", async (text) => {
    await renderTopic();
    expect(screen.getByText(text)).toBeTruthy();
  });

  it("renders the footer for the topic", async () => {
    await renderTopic();
    expect(screen.getByLabelText("night-of-power")).toBeTruthy();
  });

  it("links into the app", async () => {
    await renderTopic();
    await fireEvent.press(screen.getByText("Open Qur'an"));
    expect(mockRouter.push).toHaveBeenCalledWith("/quran");
  });

  it("embeds the linked dua", async () => {
    await renderTopic({ duaId: "dua-42" });
    expect(screen.getByText("dua:dua-42:/dua/detail/dua-42")).toBeTruthy();
  });

  it("omits optional sections", async () => {
    await renderTopic({
      quran: [],
      hadith: undefined,
      actions: undefined,
      appLinks: [],
      madhhabNote: undefined,
      disclaimer: undefined,
    });
    expect(screen.queryByText("Open Qur'an")).toBeNull();
    expect(screen.queryByText("Educational summary.")).toBeNull();
    expect(screen.queryByText("Practical steps")).toBeNull();
  });
});
