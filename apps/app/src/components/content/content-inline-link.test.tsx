import { fireEvent, screen } from "@testing-library/react-native";
import { Text } from "react-native";

import {
  ContentInlineLink,
  ContentInlineLinkGroup,
  ContentLinkList,
} from "@/components/content/content-inline-link";
import { renderWithTheme } from "@/test-support/render";

describe("ContentInlineLink", () => {
  it.each(["inline", "list"] as const)("presses through in %s layout", async (layout) => {
    const onPress = jest.fn();
    await renderWithTheme(
      <ContentInlineLink label="Open" onPress={onPress} layout={layout} textType="small" />,
    );
    await fireEvent.press(screen.getByLabelText("Open"));
    expect(onPress).toHaveBeenCalled();
  });

  it("uses a custom accessibility label", async () => {
    await renderWithTheme(
      <ContentInlineLink label="2:255" accessibilityLabel="Open ayah" onPress={jest.fn()} />,
    );
    expect(screen.getByLabelText("Open ayah")).toBeTruthy();
  });
});

describe("ContentLinkList and ContentInlineLinkGroup", () => {
  it("renders every link as a list row", async () => {
    const first = jest.fn();
    await renderWithTheme(
      <ContentLinkList
        links={[
          { label: "Duas", onPress: first },
          { label: "Adhkar", onPress: jest.fn(), accessibilityLabel: "Open adhkar" },
        ]}
      />,
    );
    await fireEvent.press(screen.getByLabelText("Duas"));
    expect(first).toHaveBeenCalled();
    expect(screen.getByLabelText("Open adhkar")).toBeTruthy();
  });

  it("wraps children in a group", async () => {
    await renderWithTheme(
      <ContentInlineLinkGroup>
        <Text>child</Text>
      </ContentInlineLinkGroup>,
    );
    expect(screen.getByText("child")).toBeTruthy();
  });
});
