import { fireEvent, screen } from "@testing-library/react-native";
import { Text } from "react-native";

import { ContentState } from "@/components/ui/content-state";
import { renderWithTheme } from "@/test-support/render";

type Props = Parameters<typeof ContentState>[0];

const renderState = (props: Props) =>
  renderWithTheme(
    <ContentState {...props}>
      <Text>Loaded duas</Text>
    </ContentState>,
  );

describe("ContentState", () => {
  it("renders skeleton rows marked busy while loading", async () => {
    await renderState({ status: "loading", loadingLabel: "Loading duas…" });

    const loading = screen.getByRole("progressbar", { name: "Loading duas…" });
    expect(loading.props.accessibilityState).toEqual({ busy: true });
    expect(screen.queryByText("Loaded duas")).toBeNull();
  });

  it("renders a RetryCard on error and retries", async () => {
    const onRetry = jest.fn();
    await renderState({ status: "error", errorMessage: "Couldn't load duas.", onRetry });

    expect(screen.getByText("Couldn't load duas.")).toBeTruthy();
    await fireEvent.press(screen.getByRole("button", { name: "Try again" }));
    expect(onRetry).toHaveBeenCalledTimes(1);
    expect(screen.queryByText("Loaded duas")).toBeNull();
  });

  it("shows the offline card above cached content", async () => {
    await renderState({ status: "offline", onRetry: jest.fn(), cached: true });

    expect(screen.getByText("Showing saved copy")).toBeTruthy();
    expect(screen.getByText("Loaded duas")).toBeTruthy();
  });

  it("hides content when offline with nothing cached", async () => {
    await renderState({ status: "offline", onRetry: jest.fn() });

    expect(screen.getByText("You're offline. Check your connection and try again.")).toBeTruthy();
    expect(screen.queryByText("Loaded duas")).toBeNull();
  });

  it("renders the EmptyState with its one action", async () => {
    const onAction = jest.fn();
    await renderState({
      status: "empty",
      empty: { icon: "tray", title: "No saved duas yet", actionLabel: "Browse duas", onAction },
    });

    expect(screen.getByText("No saved duas yet")).toBeTruthy();
    await fireEvent.press(screen.getByRole("button", { name: "Browse duas" }));
    expect(onAction).toHaveBeenCalledTimes(1);
  });

  it("renders its children when ready", async () => {
    await renderState({ status: "ready" });

    expect(screen.getByText("Loaded duas")).toBeTruthy();
  });
});
