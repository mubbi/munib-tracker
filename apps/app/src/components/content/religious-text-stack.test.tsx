import { screen } from "@testing-library/react-native";

import { ReligiousTextStack } from "@/components/content/religious-text-stack";
import { renderWithTheme } from "@/test-support/render";

jest.mock(
  "@/providers/audio-player-provider",
  () => require("@/test-support/mocks/audio-player-provider").audioPlayerProviderMock,
);

describe("ReligiousTextStack", () => {
  it("renders nothing without text", async () => {
    const { toJSON } = await renderWithTheme(<ReligiousTextStack />);
    expect(toJSON()).toBeNull();
  });

  it("renders Arabic, transliteration and translation", async () => {
    await renderWithTheme(
      <ReligiousTextStack
        arabic="سُبْحَانَ اللَّهِ"
        transliteration="Subhan Allah"
        translation="Glory be to Allah"
        surface="dua_zikr"
      />,
    );
    expect(screen.getByText("سُبْحَانَ اللَّهِ")).toBeTruthy();
    expect(screen.getByText("Subhan Allah")).toBeTruthy();
    expect(screen.getByText("Glory be to Allah")).toBeTruthy();
  });

  it("renders a compact translation-only stack", async () => {
    await renderWithTheme(<ReligiousTextStack translation="Glory be to Allah" compact />);
    expect(screen.getByText("Glory be to Allah")).toBeTruthy();
    expect(screen.queryByText("Subhan Allah")).toBeNull();
  });
});
