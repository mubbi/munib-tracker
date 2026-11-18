import type { SalahGuideTopic } from "@munib-tracker/shared/types";
import { fireEvent, screen } from "@testing-library/react-native";

import {
  type SalahGuideStepsAudioProps,
  SalahGuideTopicContent,
} from "@/components/salah-guide/topic-content";
import { buildJannahHadithRef, buildJannahQuranRef } from "@/test-support/fixtures/jannah";
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

const topic: SalahGuideTopic = {
  id: "wudu",
  journey: "prepare",
  title: "Wudu",
  summary: "Purity before prayer.",
  body: ["Wash in order."],
  importance: "obligatory",
  quran: [buildJannahQuranRef()],
  hadith: [buildJannahHadithRef()],
  actions: ["Learn the steps"],
  appLinks: [{ label: "Open tracker", route: "/tracker" }],
  disclaimer: "Follow your school.",
  steps: [
    {
      title: "Intention",
      body: "Make intention",
      ruling: "fard",
      arabic: "بِسْمِ اللَّهِ",
      translation: "In the name of Allah",
      tip: "Silently",
    },
    { title: "Hands", body: "Wash hands three times", ruling: "sunnah" },
  ],
};

async function renderTopic(
  stepsAudio?: SalahGuideStepsAudioProps,
  overrides: Partial<SalahGuideTopic> = {},
) {
  await renderWithTheme(
    <SalahGuideTopicContent topic={{ ...topic, ...overrides }} stepsAudio={stepsAudio} />,
  );
}

describe("SalahGuideTopicContent", () => {
  beforeEach(resetExpoRouterMock);

  it.each([
    "Obligatory",
    "Purity before prayer.",
    "Step by step",
    "Fard · pillar",
    "Sunnah · optional",
    "Silently",
    "Learn the steps",
    "Follow your school.",
  ])("shows %s", async (text) => {
    await renderTopic();
    expect(screen.getByText(text)).toBeTruthy();
  });

  it("opens app links", async () => {
    await renderTopic();
    await fireEvent.press(screen.getByText("Open tracker"));
    expect(mockRouter.push).toHaveBeenCalledWith("/tracker");
  });

  it("plays a step's phrase and the whole queue", async () => {
    const audio = {
      onPressStep: jest.fn(),
      onPressPlayAll: jest.fn(),
      registerStep: () => () => {},
    };
    await renderTopic(audio);
    await fireEvent.press(screen.getByLabelText("Play phrase 1: Intention"));
    expect(audio.onPressStep).toHaveBeenCalledWith(0);
    await fireEvent.press(screen.getByText("Play all phrases"));
    expect(audio.onPressPlayAll).toHaveBeenCalled();
  });

  it("offers pause while the phrase queue is playing", async () => {
    await renderTopic({
      onPressStep: jest.fn(),
      onPressPlayAll: jest.fn(),
      phrasesActive: true,
      isPlaying: true,
      activeStepIndex: 0,
    });
    expect(screen.getByText("Pause phrases")).toBeTruthy();
  });

  it("only makes steps with audio pressable", async () => {
    await renderTopic({ onPressStep: jest.fn(), hasAudioAtStep: (index) => index === 0 });
    expect(screen.getByLabelText("Play phrase 1: Intention")).toBeTruthy();
    expect(screen.queryByLabelText("Play phrase 2: Hands")).toBeNull();
    expect(screen.queryByText("Play all phrases")).toBeNull();
  });

  it("omits optional sections", async () => {
    await renderTopic(undefined, {
      importance: undefined,
      steps: [],
      quran: undefined,
      hadith: [],
      actions: [],
      appLinks: undefined,
      disclaimer: undefined,
    });
    expect(screen.queryByText("Step by step")).toBeNull();
    expect(screen.queryByText("Obligatory")).toBeNull();
    expect(screen.queryByText("Follow your school.")).toBeNull();
  });
});
