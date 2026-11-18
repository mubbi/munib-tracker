import { screen } from "@testing-library/react-native";
import { Text } from "react-native";

import { TvReadableBlock } from "@/components/ui/tv-readable-block";
import { usePlatform } from "@/test-support/platform";
import { renderWithTheme } from "@/test-support/render";

type Props = Parameters<typeof TvReadableBlock>[0];

const renderBlock = (props: Partial<Props> = {}) =>
  renderWithTheme(
    <TvReadableBlock accessibilityLabel="Para" {...props}>
      <Text>Prose</Text>
    </TvReadableBlock>,
  );

describe("TvReadableBlock off TV", () => {
  it("renders children without a focus wrapper", async () => {
    await renderBlock();

    expect(screen.getByText("Prose")).toBeTruthy();
    expect(screen.queryByLabelText("Para")).toBeNull();
  });
});

describe("TvReadableBlock on TV", () => {
  usePlatform({ isTV: true });

  it("wraps prose in a focusable reading stop", async () => {
    await renderBlock({ style: { marginTop: 4 } });

    expect(screen.getByLabelText("Para").props.accessibilityRole).toBe("text");
  });

  it.each([
    [true, true],
    [false, undefined],
  ])("preferredFocus=%s sets hasTVPreferredFocus=%s", async (preferredFocus, expected) => {
    await renderBlock({ preferredFocus });

    expect(screen.getByLabelText("Para").props.hasTVPreferredFocus).toBe(expected);
  });
});
