import { render, screen } from "@testing-library/react-native";
import { Platform, Text } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { MunibThemeProvider } from "@/providers/theme-provider";

describe("ThemedText arabic sanitization", () => {
  const originalOS = Platform.OS;

  afterEach(() => {
    Platform.OS = originalOS;
  });

  it("strips U+06DD from a scripture string on iOS", () => {
    Platform.OS = "ios";
    render(
      <MunibThemeProvider>
        <ThemedText type="arabic">{"ءَامَنَ\u06DD"}</ThemedText>
      </MunibThemeProvider>,
    );

    expect(screen.getByText("ءَامَنَ")).toBeTruthy();
    expect(screen.queryByText("\u06DD")).toBeNull();
  });

  it("walks mixed children so `{arabic}{marker}` still sanitizes", () => {
    Platform.OS = "ios";
    render(
      <MunibThemeProvider>
        <ThemedText type="arabic">
          {"ءَامَنَ\u06DD"}
          <Text testID="marker">x</Text>
        </ThemedText>
      </MunibThemeProvider>,
    );

    expect(JSON.stringify(screen.toJSON())).toContain("ءَامَنَ");
    expect(screen.getByTestId("marker")).toBeTruthy();
    expect(JSON.stringify(screen.toJSON())).not.toContain("\u06DD");
  });

  it("leaves non-scripture copy unsanitized", () => {
    Platform.OS = "ios";
    render(
      <MunibThemeProvider>
        <ThemedText>{"ءَامَنَ\u06DD"}</ThemedText>
      </MunibThemeProvider>,
    );

    expect(screen.getByText("ءَامَنَ\u06DD")).toBeTruthy();
  });
});
