import { render, screen } from "@testing-library/react-native";
import { Text } from "react-native";

import { WebLayoutDirectionBridge } from "@/providers/web-layout-direction";
import { usePlatform } from "@/test-support/platform";

const mockPrefs = { locale: "en" };

jest.mock("@/stores/preferences-store", () => ({
  usePreferences: () => mockPrefs,
}));

async function renderBridge(locale: string) {
  mockPrefs.locale = locale;
  await render(
    <WebLayoutDirectionBridge>
      <Text testID="child">child</Text>
    </WebLayoutDirectionBridge>,
  );
  expect(screen.getByTestId("child")).toBeTruthy();
  const wrapper = screen.container.queryAll((node) => node.props.dir !== undefined)[0];
  return wrapper?.props.dir as string | undefined;
}

describe("WebLayoutDirectionBridge", () => {
  it("renders children without a direction wrapper on native", async () => {
    expect(await renderBridge("ar")).toBeUndefined();
  });

  describe("on web", () => {
    usePlatform({ OS: "web" });

    it.each([
      ["en", "ltr"],
      ["ar", "rtl"],
      ["ur", "rtl"],
    ])("sets dir for %s to %s", async (locale, dir) => {
      expect(await renderBridge(locale)).toBe(dir);
    });
  });
});
