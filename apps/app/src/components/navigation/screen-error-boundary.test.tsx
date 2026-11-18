import { fireEvent, screen } from "@testing-library/react-native";

import { ScreenErrorBoundary } from "@/components/navigation/screen-error-boundary";
import { renderWithTheme } from "@/test-support/render";

const mockCapture = jest.fn();

jest.mock("@/lib/sentry", () => ({
  captureAppException: (...args: unknown[]) => mockCapture(...args),
}));
jest.mock("@/components/error-boundary", () => {
  const { Pressable } = require("react-native");
  return {
    ErrorFallback: ({ onReset }: { onReset: () => void }) => (
      <Pressable accessibilityLabel="retry" onPress={onReset} />
    ),
  };
});

describe("ScreenErrorBoundary", () => {
  it("reports the error and retries the screen", async () => {
    const error = new Error("boom");
    const retry = jest.fn(async () => undefined);
    await renderWithTheme(<ScreenErrorBoundary error={error} retry={retry} />);
    expect(mockCapture).toHaveBeenCalledWith(error, { tags: { boundary: "screen" } });
    await fireEvent.press(screen.getByLabelText("retry"));
    expect(retry).toHaveBeenCalled();
  });
});
