import { fireEvent, screen } from "@testing-library/react-native";

import {
  LearnGuideHubScreen,
  LearnGuideTopicScreen,
} from "@/components/learn-guide/learn-guide-screens";
import i18n from "@/i18n";
import { eidGuideConfig } from "@/lib/eid-guide";
import { getJanazahGuideTopics, janazahGuideConfig } from "@/lib/janazah-guide";
import {
  mockRouter,
  resetExpoRouterMock,
  setMockSearchParams,
} from "@/test-support/mocks/expo-router";
import { renderWithProviders } from "@/test-support/render";

jest.mock("expo-router", () => require("@/test-support/mocks/expo-router").expoRouterMock);
jest.mock("expo-audio", () => require("@/test-support/mocks/expo-audio").expoAudioMock);
jest.mock(
  "@/providers/audio-player-provider",
  () => require("@/test-support/mocks/audio-player-provider").audioPlayerProviderMock,
);
jest.mock(
  "@/components/guide-topic-footer",
  () => require("@/test-support/mocks/guide-topic-footer").guideTopicFooterMock,
);
jest.mock(
  "@/hooks/use-quran-ayah-range",
  () => require("@/test-support/mocks/use-quran-ayah-range").quranAyahRangeMock,
);

beforeEach(resetExpoRouterMock);

describe("LearnGuideHubScreen", () => {
  it("renders every non-empty section and opens a topic", async () => {
    await renderWithProviders(
      <LearnGuideHubScreen config={janazahGuideConfig} sectionIcons={{}} />,
    );

    expect(screen.getByText(i18n.t("janazah.intro"))).toBeTruthy();
    expect(screen.getByText(i18n.t("janazah.section.burial"))).toBeTruthy();
    expect(screen.queryByText(i18n.t("common.learnQuiz.title"))).toBeNull();

    const [first] = getJanazahGuideTopics();
    if (!first) throw new Error("janazah corpus is empty");
    await fireEvent.press(screen.getByText(first.title));
    expect(mockRouter.push).toHaveBeenCalledWith({
      pathname: "/janazah/[topic]",
      params: { topic: first.id },
    });
  });

  it("adds the quiz row when asked", async () => {
    await renderWithProviders(
      <LearnGuideHubScreen config={eidGuideConfig} sectionIcons={{}} showQuiz />,
    );

    expect(screen.getByText(i18n.t("common.learnQuiz.title"))).toBeTruthy();
  });
});

describe("LearnGuideTopicScreen", () => {
  it("renders the requested topic", async () => {
    const [first] = getJanazahGuideTopics();
    if (!first) throw new Error("janazah corpus is empty");
    setMockSearchParams({ topic: first.id });
    await renderWithProviders(<LearnGuideTopicScreen config={janazahGuideConfig} />);

    expect(screen.getAllByText(first.title).length).toBeGreaterThan(0);
    // The article body (not just the header) rendered.
    expect(screen.getByText(i18n.t("janazah.disclaimer"))).toBeTruthy();
    const [firstParagraph] = first.body;
    if (firstParagraph) expect(screen.getByText(firstParagraph)).toBeTruthy();
    expect(screen.queryByText(i18n.t("janazah.notFound"))).toBeNull();
  });

  it("offers a way back to the hub for an unknown topic", async () => {
    setMockSearchParams({ topic: "no-such-topic" });
    await renderWithProviders(<LearnGuideTopicScreen config={janazahGuideConfig} />);

    expect(screen.getByText(i18n.t("janazah.notFound"))).toBeTruthy();
    await fireEvent.press(screen.getByRole("button", { name: i18n.t("janazah.title") }));
    expect(mockRouter.replace).toHaveBeenCalledWith("/janazah");
  });
});
