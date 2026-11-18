import { fireEvent, screen } from "@testing-library/react-native";
import { Text } from "react-native";

import { CollapsibleSection } from "@/components/ui/collapsible-section";
import { renderWithTheme } from "@/test-support/render";

type Props = Omit<Parameters<typeof CollapsibleSection>[0], "children" | "title">;

const renderSection = (props: Props = {}) =>
  renderWithTheme(
    <CollapsibleSection title="Details" icon="info.circle" {...props}>
      <Text>Body</Text>
    </CollapsibleSection>,
  );

const header = () => screen.getByRole("button", { name: "Details" });

describe("CollapsibleSection", () => {
  it("starts collapsed", async () => {
    await renderSection();

    expect(screen.queryByText("Body")).toBeNull();
    expect(header().props.accessibilityState).toEqual({ expanded: false });
  });

  it("expands and collapses itself when uncontrolled", async () => {
    const onOpenChange = jest.fn();
    await renderSection({ onOpenChange });

    await fireEvent.press(header());
    expect(screen.getByText("Body")).toBeTruthy();

    await fireEvent.press(header());
    expect(screen.queryByText("Body")).toBeNull();
    expect(onOpenChange.mock.calls).toEqual([[true], [false]]);
  });

  it("leaves the open state to the parent when controlled", async () => {
    const onOpenChange = jest.fn();
    await renderSection({ open: true, onOpenChange });

    await fireEvent.press(header());

    expect(onOpenChange).toHaveBeenCalledWith(false);
    expect(screen.getByText("Body")).toBeTruthy();
  });

  it("renders a static header when the parent owns the press area", async () => {
    await renderSection({ pressableArea: "none", defaultOpen: true });

    expect(screen.queryByRole("button")).toBeNull();
    expect(screen.getByText("Body")).toBeTruthy();
  });
});
