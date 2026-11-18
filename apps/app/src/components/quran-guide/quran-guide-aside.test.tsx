import { fireEvent, screen } from "@testing-library/react-native";

import { QuranGuideTopicAside } from "@/components/quran-guide/quran-guide-aside";
import i18n from "@/i18n";
import {
  getQuranGuideJourneyOrder,
  getQuranGuideTopicRoute,
  getQuranGuideTopicsByJourney,
} from "@/lib/quran-guide";
import { mockRouter, resetExpoRouterMock } from "@/test-support/mocks/expo-router";
import { renderWithTheme } from "@/test-support/render";

jest.mock("expo-router", () => require("@/test-support/mocks/expo-router").expoRouterMock);
jest.mock(
  "@/providers/audio-player-provider",
  () => require("@/test-support/mocks/audio-player-provider").audioPlayerProviderMock,
);

const byJourney = getQuranGuideTopicsByJourney();
const all = getQuranGuideJourneyOrder().flatMap((phase) => byJourney[phase] ?? []);
const first = all.find((topic) => !topic.comingSoon);
const comingSoon = all.find((topic) => topic.comingSoon);

describe("QuranGuideTopicAside", () => {
  beforeEach(resetExpoRouterMock);

  it("links the heading back to the Learn Qur'an hub", async () => {
    await renderWithTheme(<QuranGuideTopicAside />);
    await fireEvent.press(screen.getByLabelText(i18n.t("learnQuran.title")));
    expect(mockRouter.push).toHaveBeenCalledWith("/learn-quran");
  });

  it("links available topics to their route", async () => {
    if (!first) throw new Error("expected an available Qur'an guide topic");
    await renderWithTheme(<QuranGuideTopicAside currentId="none" />);
    await fireEvent.press(screen.getByLabelText(first.title));
    expect(mockRouter.push).toHaveBeenCalledWith(getQuranGuideTopicRoute(first.id));
  });

  it("hides coming-soon topics", async () => {
    await renderWithTheme(<QuranGuideTopicAside />);
    if (comingSoon) expect(screen.queryByLabelText(comingSoon.title)).toBeNull();
    expect(screen.getAllByRole("link").length).toBeGreaterThan(1);
  });
});
