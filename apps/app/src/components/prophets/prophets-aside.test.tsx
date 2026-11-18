import { fireEvent, screen } from "@testing-library/react-native";

import { ProphetsTopicAside } from "@/components/prophets/prophets-aside";
import i18n from "@/i18n";
import { getProphetsTopicsBySection } from "@/lib/prophets";
import { mockRouter, resetExpoRouterMock } from "@/test-support/mocks/expo-router";
import { renderWithTheme } from "@/test-support/render";

jest.mock("expo-router", () => require("@/test-support/mocks/expo-router").expoRouterMock);
jest.mock(
  "@/providers/audio-player-provider",
  () => require("@/test-support/mocks/audio-player-provider").audioPlayerProviderMock,
);

const first = Object.values(getProphetsTopicsBySection()).flat()[0];

describe("ProphetsTopicAside", () => {
  beforeEach(resetExpoRouterMock);

  it("links the heading back to the hub", async () => {
    await renderWithTheme(<ProphetsTopicAside />);
    await fireEvent.press(screen.getByLabelText(i18n.t("prophets.title")));
    expect(mockRouter.push).toHaveBeenCalledWith("/prophets");
  });

  it("links each topic to its page", async () => {
    await renderWithTheme(<ProphetsTopicAside currentId="none" />);
    await fireEvent.press(screen.getByLabelText(first.title));
    expect(mockRouter.push).toHaveBeenCalledWith(`/prophets/${first.id}`);
  });
});
