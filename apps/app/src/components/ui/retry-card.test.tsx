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

  it("defaults its copy and marks an offline failure", async () => {
    const onRetry = jest.fn();
    await renderWithTheme(<RetryCard onRetry={onRetry} offline showingSavedCopy />);

    expect(
      screen.getByText("You're offline. Check your connection and try again.").props
        .accessibilityLiveRegion,
    ).toBe("polite");
    expect(screen.getByText("Showing saved copy")).toBeTruthy();
    await fireEvent.press(screen.getByRole("button", { name: "Try again" }));
    expect(onRetry).toHaveBeenCalledTimes(1);
  });

  it("uses a generic load-failure line by default", async () => {
    await renderWithTheme(<RetryCard onRetry={jest.fn()} />);

    expect(screen.getByText("Couldn't load this. Try again.")).toBeTruthy();
    expect(screen.queryByText("Showing saved copy")).toBeNull();
  });
});
