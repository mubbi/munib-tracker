import { renderHook, screen } from "@testing-library/react-native";
import { Text } from "react-native";

import { LearnContentGate, useLearnBodyReady } from "@/components/learn-content-loading";
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
