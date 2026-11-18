import { fireEvent, screen } from "@testing-library/react-native";

import { SalahGuideTopicAside } from "@/components/salah-guide/salah-guide-aside";
import { mockRouter, resetExpoRouterMock } from "@/test-support/mocks/expo-router";
import { renderWithTheme } from "@/test-support/render";

jest.mock("expo-router", () => require("@/test-support/mocks/expo-router").expoRouterMock);
jest.mock(
  "@/providers/audio-player-provider",
  () => require("@/test-support/mocks/audio-player-provider").audioPlayerProviderMock,
);

describe("SalahGuideTopicAside", () => {
  beforeEach(resetExpoRouterMock);

  it("links regular topics under /salah-guide", async () => {
    await renderWithTheme(<SalahGuideTopicAside />);
    await fireEvent.press(screen.getByLabelText("Wudu — ablution"));
    expect(mockRouter.push).toHaveBeenCalledWith("/salah-guide/wudu");
  });

  it("links the adhan topic to its dedicated page", async () => {
    await renderWithTheme(<SalahGuideTopicAside currentId="wudu" />);
    await fireEvent.press(screen.getByLabelText("Adhan — the call to prayer"));
    expect(mockRouter.push).toHaveBeenCalledWith("/salah-guide/adhan");
  });

  it("links the heading back to the hub", async () => {
    await renderWithTheme(<SalahGuideTopicAside />);
    await fireEvent.press(screen.getByLabelText("Learn Salah"));
    expect(mockRouter.push).toHaveBeenCalledWith("/salah-guide");
  });
});
