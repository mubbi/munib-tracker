import { fireEvent, screen } from "@testing-library/react-native";

import { RetryCard } from "@/components/ui/retry-card";
import { renderWithTheme } from "@/test-support/render";

describe("RetryCard", () => {
  it("announces the failure and retries on press", async () => {
    const onRetry = jest.fn();
    await renderWithTheme(
      <RetryCard message="You're offline." retryLabel="Try again" onRetry={onRetry} />,
    );

    const message = screen.getByText("You're offline.");
    expect(message.props.accessibilityLiveRegion).toBe("polite");
    await fireEvent.press(screen.getByRole("button", { name: "Try again" }));
    expect(onRetry).toHaveBeenCalledTimes(1);
  });
});
