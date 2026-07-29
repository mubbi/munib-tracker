import { render, screen, waitFor } from "@testing-library/react-native";
import { Text } from "react-native";
import { MunibThemeProvider } from "./theme-provider";

describe("MunibThemeProvider", () => {
  it("renders children with default theme after preferences load", async () => {
    render(
      <MunibThemeProvider>
        <Text testID="child">Hello</Text>
      </MunibThemeProvider>,
    );

    await waitFor(() => {
      expect(screen.getByTestId("child")).toBeTruthy();
    });
  });
});
