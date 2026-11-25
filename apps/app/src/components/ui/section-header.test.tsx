import { fireEvent, screen } from "@testing-library/react-native";
import { Text } from "react-native";

import { SectionHeader } from "@/components/ui/section-header";
import { renderWithTheme } from "@/test-support/render";

type Props = Parameters<typeof SectionHeader>[0];

const renderHeader = (props: Partial<Props> = {}) =>
  renderWithTheme(<SectionHeader title="Adhkar" {...props} />);

describe("SectionHeader", () => {
  it("renders a bare title without an action", async () => {
    await renderHeader();

    expect(screen.getByText("Adhkar")).toBeTruthy();
    expect(screen.queryByRole("button")).toBeNull();
  });

  it("renders the subtitle and badge", async () => {
    await renderHeader({ icon: "sun.max", subtitle: "Morning", badge: <Text>NEW</Text> });

    expect(screen.getByText("Morning")).toBeTruthy();
    expect(screen.getByText("NEW")).toBeTruthy();
  });

  it("fires the action", async () => {
    const onActionPress = jest.fn();
    await renderHeader({
      actionLabel: "See all",
      actionIcon: "chevron.right",
      actionAccessibilityLabel: "See all adhkar",
      onActionPress,
    });

    await fireEvent.press(screen.getByLabelText("See all adhkar"));

    expect(onActionPress).toHaveBeenCalledTimes(1);
  });

  it("falls back to the action label for accessibility", async () => {
    await renderHeader({ actionLabel: "Edit" });

    expect(screen.getByRole("button", { name: "Edit" })).toBeTruthy();
  });
});

describe("SectionHeader casing", () => {
  it("does not rewrite the translator's casing", async () => {
    const { flattenStyle } = require("@/test-support/style");
    await renderHeader({ title: "pRayer tIMES" });
    expect(
      flattenStyle(screen.getByText("pRayer tIMES").props.style).textTransform,
    ).toBeUndefined();
  });
});
