import { fireEvent, screen } from "@testing-library/react-native";

import { LearnDuaTopicAside } from "@/components/learn-dua/learn-dua-aside";
import i18n from "@/i18n";
import { getLearnDuaTopicsBySection } from "@/lib/learn-dua";
import { mockRouter, resetExpoRouterMock } from "@/test-support/mocks/expo-router";
import { renderWithTheme } from "@/test-support/render";

jest.mock("expo-router", () => require("@/test-support/mocks/expo-router").expoRouterMock);
jest.mock(
  "@/providers/audio-player-provider",
  () => require("@/test-support/mocks/audio-player-provider").audioPlayerProviderMock,
);

const first = Object.values(getLearnDuaTopicsBySection()).flat()[0];

describe("LearnDuaTopicAside", () => {
  beforeEach(resetExpoRouterMock);

  it("links the heading back to the hub", async () => {
    await renderWithTheme(<LearnDuaTopicAside />);
    await fireEvent.press(screen.getByLabelText(i18n.t("learnDua.title")));
    expect(mockRouter.push).toHaveBeenCalledWith("/learn-dua");
  });

  it("links each topic to its page", async () => {
    await renderWithTheme(<LearnDuaTopicAside currentId="none" />);
    await fireEvent.press(screen.getByLabelText(first.title));
    expect(mockRouter.push).toHaveBeenCalledWith(`/learn-dua/${first.id}`);
  });
});
