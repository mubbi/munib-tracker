import { fireEvent, screen } from "@testing-library/react-native";

import { ModuleTopicAside } from "@/components/jannah/module-topic-aside";
import { mockRouter, resetExpoRouterMock } from "@/test-support/mocks/expo-router";
import { renderWithTheme } from "@/test-support/render";

jest.mock("expo-router", () => require("@/test-support/mocks/expo-router").expoRouterMock);
jest.mock(
  "@/providers/audio-player-provider",
  () => require("@/test-support/mocks/audio-player-provider").audioPlayerProviderMock,
);

describe("ModuleTopicAside", () => {
  beforeEach(resetExpoRouterMock);

  it("builds topic links from the module base path", async () => {
    await renderWithTheme(
      <ModuleTopicAside
        title="Jannah"
        basePath="/jannah"
        topics={[
          { id: "gates", title: "Gates" },
          { id: "rivers", title: "Rivers" },
        ]}
        currentId="gates"
        completedIds={["gates"]}
      />,
    );
    expect(screen.getByText("1/2")).toBeTruthy();
    await fireEvent.press(screen.getByLabelText("Rivers"));
    expect(mockRouter.push).toHaveBeenCalledWith("/jannah/rivers");
  });
});
