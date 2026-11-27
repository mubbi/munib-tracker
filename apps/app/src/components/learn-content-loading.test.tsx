import { fireEvent, renderHook, screen } from "@testing-library/react-native";
import { Text } from "react-native";

import { LearnContentGate, useLearnBodyReady } from "@/components/learn-content-loading";
import i18n from "@/i18n";
import { renderWithTheme } from "@/test-support/render";

describe("LearnContentGate", () => {
  it("shows a loading placeholder until the corpus is ready", async () => {
    await renderWithTheme(
      <LearnContentGate ready={false}>
        <Text>Body</Text>
      </LearnContentGate>,
    );

    expect(screen.queryByText("Body")).toBeNull();
    expect(
      screen.container.queryAll((n) => n.props.accessibilityRole === "progressbar"),
    ).toHaveLength(1);
  });

  it("never shows 'still loading' copy — a skeleton only (G-36)", async () => {
    await renderWithTheme(
      <LearnContentGate ready={false}>
        <Text>Body</Text>
      </LearnContentGate>,
    );

    expect(screen.queryByText(i18n.t("common.loadingContentHint"))).toBeNull();
  });

  it("shows a retry card when the load failed, and retries (G-35)", async () => {
    const onRetry = jest.fn();
    await renderWithTheme(
      <LearnContentGate ready={false} error={new Error("chunk")} onRetry={onRetry}>
        <Text>Body</Text>
      </LearnContentGate>,
    );

    expect(screen.queryByText("Body")).toBeNull();
    expect(screen.getByText(i18n.t("learnKit.loadFailed"))).toBeTruthy();
    await fireEvent.press(screen.getByRole("button", { name: i18n.t("common.tryAgain") }));
    expect(onRetry).toHaveBeenCalledTimes(1);
  });

  it("renders the body once ready", async () => {
    await renderWithTheme(
      <LearnContentGate ready>
        <Text>Body</Text>
      </LearnContentGate>,
    );

    expect(screen.getByText("Body")).toBeTruthy();
  });
});

describe("useLearnBodyReady", () => {
  it("is false outside a gate", async () => {
    const { result } = await renderHook(() => useLearnBodyReady());

    expect(result.current).toBe(false);
  });

  it("is true inside a ready gate", async () => {
    const { result } = await renderHook(() => useLearnBodyReady(), {
      wrapper: ({ children }) => <LearnContentGate ready>{children}</LearnContentGate>,
    });

    expect(result.current).toBe(true);
  });
});
