import { fireEvent, render, screen } from "@testing-library/react-native";
import { Text } from "react-native";

import { ContextMenu, type ContextMenuAction } from "@/components/ui/context-menu";
import { triggerHaptic } from "@/lib/haptics";
import { setPlatform } from "@/test-support/platform";

jest.mock("@/lib/haptics", () => require("@/test-support/mocks/haptics").hapticsMock);

jest.mock("@expo/ui/community/menu", () => {
  const React = require("react");
  const { Pressable, View } = require("react-native");
  return {
    MenuView: (props: {
      children: React.ReactNode;
      actions: { id: string; title: string; attributes: { destructive?: boolean } }[];
      title?: string;
      onPressAction: (e: { nativeEvent: { event: string } }) => void;
    }) =>
      React.createElement(
        View,
        { testID: "menu", accessibilityLabel: props.title },
        props.children,
        props.actions.map((action) =>
          React.createElement(Pressable, {
            key: action.id,
            accessibilityLabel: action.attributes.destructive
              ? `${action.title} (destructive)`
              : action.title,
            onPress: () => props.onPressAction({ nativeEvent: { event: action.id } }),
          }),
        ),
      ),
  };
});

const ACTIONS: ContextMenuAction[] = [
  { id: "share", title: "Share", systemIcon: "square.and.arrow.up" },
  { id: "delete", title: "Delete", destructive: true },
];

const renderMenu = (actions = ACTIONS, onAction = jest.fn()) =>
  render(
    <ContextMenu actions={actions} onAction={onAction} title="Options">
      <Text>Card</Text>
    </ContextMenu>,
  );

describe("ContextMenu", () => {
  let restorePlatform = () => {};
  afterEach(() => {
    restorePlatform();
    jest.mocked(triggerHaptic).mockClear();
  });

  it("wraps children in a titled native menu on iOS", async () => {
    await renderMenu();

    expect(screen.getByLabelText("Options")).toBeTruthy();
    expect(screen.getByText("Card")).toBeTruthy();
  });

  it("reports the picked action with a selection haptic", async () => {
    const onAction = jest.fn();
    await renderMenu(ACTIONS, onAction);

    await fireEvent.press(screen.getByLabelText("Delete (destructive)"));

    expect(triggerHaptic).toHaveBeenCalledWith("selection");
    expect(onAction).toHaveBeenCalledWith("delete");
  });

  it.each([
    ["no actions", {}, []],
    ["Android", { OS: "android" as const }, ACTIONS],
    ["web", { OS: "web" as const }, ACTIONS],
    ["TV", { isTV: true }, ACTIONS],
  ])("renders bare children with %s", async (_case, platform, actions) => {
    restorePlatform = setPlatform(platform);
    await renderMenu(actions);

    expect(screen.queryByTestId("menu")).toBeNull();
    expect(screen.getByText("Card")).toBeTruthy();
  });
});
