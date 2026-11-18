import { fireEvent, screen } from "@testing-library/react-native";

import { AqeedahTopicAside } from "@/components/aqeedah/aqeedah-aside";
import i18n from "@/i18n";
import { getAqeedahTopicsBySection } from "@/lib/aqeedah";
import { mockRouter, resetExpoRouterMock } from "@/test-support/mocks/expo-router";
import { renderWithTheme } from "@/test-support/render";

jest.mock("expo-router", () => require("@/test-support/mocks/expo-router").expoRouterMock);
jest.mock(
  "@/providers/audio-player-provider",
  () => require("@/test-support/mocks/audio-player-provider").audioPlayerProviderMock,
);

const first = Object.values(getAqeedahTopicsBySection()).flat()[0];

describe("AqeedahTopicAside", () => {
  beforeEach(resetExpoRouterMock);

  it("links the heading back to the hub", async () => {
    await renderWithTheme(<AqeedahTopicAside />);
    await fireEvent.press(screen.getByLabelText(i18n.t("aqeedah.title")));
    expect(mockRouter.push).toHaveBeenCalledWith("/aqeedah");
  });

  it("links each topic to its page", async () => {
    await renderWithTheme(<AqeedahTopicAside currentId="none" />);
    await fireEvent.press(screen.getByLabelText(first.title));
    expect(mockRouter.push).toHaveBeenCalledWith(`/aqeedah/${first.id}`);
  });
});
