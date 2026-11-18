import { render, screen } from "@testing-library/react-native";
import { createElement } from "react";
import { Text, View } from "react-native";

import { TvFocusGuide } from "@/components/ui/tv-focus-guide";
import { usePlatform } from "@/test-support/platform";

type Props = Parameters<typeof TvFocusGuide>[0];

/** Stand-in for react-native-tvos' `TVFocusGuideView`. */
function NativeGuide(props: Record<string, unknown>) {
  return createElement(View, { ...props, testID: "native-guide" });
}

const renderGuide = (props: Partial<Props> = {}) =>
  render(
    <TvFocusGuide testID="guide" {...props}>
      <Text>Child</Text>
    </TvFocusGuide>,
  );

describe("TvFocusGuide off TV", () => {
  it("is a plain view that drops focus props", async () => {
    await renderGuide({ autoFocus: true, trapFocusUp: true });

    expect(screen.getByText("Child")).toBeTruthy();
    expect(screen.getByTestId("guide").props.autoFocus).toBeUndefined();
  });
});

describe("TvFocusGuide on TV", () => {
  usePlatform({ isTV: true });

  it("falls back to View with focus props when TVFocusGuideView is missing", async () => {
    await renderGuide({ autoFocus: true, trapFocusDown: true });

    expect(screen.getByTestId("guide").props).toMatchObject({
      autoFocus: true,
      trapFocusDown: true,
    });
  });

  it("uses TVFocusGuideView when the TV fork provides it", async () => {
    const ReactNative = require("react-native") as Record<string, unknown>;
    Object.defineProperty(ReactNative, "TVFocusGuideView", {
      configurable: true,
      value: NativeGuide,
    });
    try {
      await renderGuide({ trapFocusLeft: true, trapFocusRight: true });

      expect(screen.getByTestId("native-guide").props).toMatchObject({
        trapFocusLeft: true,
        trapFocusRight: true,
      });
    } finally {
      delete ReactNative.TVFocusGuideView;
    }
  });
});
