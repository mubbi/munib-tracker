import { screen } from "@testing-library/react-native";

import { ThemedView } from "@/components/themed-view";
import { renderWithTheme } from "@/test-support/render";
import { flattenStyle } from "@/test-support/style";

describe("ThemedView", () => {
  it.each([
    [undefined, "background"],
    ["card", "card"],
  ] as const)("paints type=%s with the %s colour", async (type) => {
    await renderWithTheme(<ThemedView testID="view" type={type} style={{ padding: 4 }} />);

    expect(flattenStyle(screen.getByTestId("view").props.style)).toMatchObject({
      backgroundColor: expect.stringMatching(/^#/),
      padding: 4,
    });
  });
});
