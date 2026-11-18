import { screen } from "@testing-library/react-native";
import { Text } from "react-native";

import {
  SETTINGS_FORM_MAX_WIDTH,
  SettingsColumns,
  useSettingsFormMaxWidth,
  useSettingsTwoColumn,
} from "@/components/settings/settings-layout";
import { resetMockWindowSize, setMockWindowSize } from "@/test-support/mocks/use-window-dimensions";
import { usePlatform } from "@/test-support/platform";
import { renderHookWithTheme, renderWithTheme } from "@/test-support/render";

jest.mock(
  "react-native/Libraries/Utilities/useWindowDimensions",
  () => require("@/test-support/mocks/use-window-dimensions").useWindowDimensionsMock,
);

async function layoutAt(width: number) {
  setMockWindowSize(width);
  const { result } = await renderHookWithTheme(() => ({
    maxWidth: useSettingsFormMaxWidth(),
    twoColumn: useSettingsTwoColumn(),
  }));
  return result.current;
}

describe("settings layout hooks", () => {
  afterEach(resetMockWindowSize);

  it.each([
    [390, undefined, false],
    [800, SETTINGS_FORM_MAX_WIDTH, false],
    [1200, SETTINGS_FORM_MAX_WIDTH, true],
  ])("at %ipx caps forms at %s and two-column=%s", async (width, maxWidth, twoColumn) => {
    expect(await layoutAt(width)).toEqual({ maxWidth, twoColumn });
  });

  describe("on TV", () => {
    usePlatform({ isTV: true });

    it("keeps the default layout", async () => {
      expect(await layoutAt(1920)).toEqual({ maxWidth: undefined, twoColumn: false });
    });
  });
});

describe("SettingsColumns", () => {
  it("renders both columns", async () => {
    await renderWithTheme(<SettingsColumns start={<Text>left</Text>} end={<Text>right</Text>} />);
    expect(screen.getByText("left")).toBeTruthy();
    expect(screen.getByText("right")).toBeTruthy();
  });
});
