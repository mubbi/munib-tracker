import { fireEvent, screen } from "@testing-library/react-native";
import { Text } from "react-native";

import { ContextMenu, type ContextMenuAction } from "@/components/ui/context-menu";
import { triggerHaptic } from "@/lib/haptics";
import { setPlatform } from "@/test-support/platform";
import { renderWithTheme } from "@/test-support/render";

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

const renderMenu = (
  actions = ACTIONS,
  onAction = jest.fn(),
  trigger?: "auto" | "always" | "never",
) =>
  renderWithTheme(
    <ContextMenu actions={actions} onAction={onAction} title="Options" trigger={trigger}>
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
    ["TV", { isTV: true }, ACTIONS],
  ])("renders bare children with %s", async (_case, platform, actions) => {
    restorePlatform = setPlatform(platform);
    await renderMenu(actions);

    expect(screen.queryByTestId("menu")).toBeNull();
    expect(screen.queryByText("Share")).toBeNull();
    expect(screen.getByText("Card")).toBeTruthy();
  });

  it.each([
    ["Android", { OS: "android" as const }],
    ["web", { OS: "web" as const }],
  ])("opens the same actions in a sheet on long-press (%s)", async (_case, platform) => {
    restorePlatform = setPlatform(platform);
    const onAction = jest.fn();
    await renderMenu(ACTIONS, onAction);

    expect(screen.queryByTestId("menu")).toBeNull();
    expect(screen.queryByText("Delete")).toBeNull();

    await fireEvent(screen.getByText("Card"), "longPress");
    expect(screen.getByText("Share")).toBeTruthy();
    expect(screen.getByText("Delete")).toBeTruthy();

    await fireEvent.press(screen.getByLabelText("Delete"));
    expect(onAction).toHaveBeenCalledWith("delete");
    expect(triggerHaptic).toHaveBeenCalledWith("selection");
  });

  it("opens the sheet from a secondary click on web", async () => {
    restorePlatform = setPlatform({ OS: "web" });
    await renderMenu();

    const preventDefault = jest.fn();
    await fireEvent(screen.getByText("Card"), "contextMenu", { preventDefault });

    expect(preventDefault).toHaveBeenCalled();
    expect(screen.getByLabelText("Share")).toBeTruthy();
  });

  it("opens the sheet from the Menu key on web", async () => {
    restorePlatform = setPlatform({ OS: "web" });
    await renderMenu();

    await fireEvent(screen.getByText("Card"), "keyDown", { key: "ContextMenu" });

    expect(screen.getByLabelText("Share")).toBeTruthy();
  });

  it("offers a visible More-actions button without any gesture when asked", async () => {
    restorePlatform = setPlatform({ OS: "android" });
    const onAction = jest.fn();
    await renderMenu(ACTIONS, onAction, "always");

    await fireEvent.press(screen.getByLabelText("Options"));
    await fireEvent.press(screen.getByLabelText("Share"));

    expect(onAction).toHaveBeenCalledWith("share");
  });

  it("hides the More-actions button by default and when trigger is never", async () => {
    restorePlatform = setPlatform({ OS: "android" });
    await renderMenu(ACTIONS, jest.fn(), "never");

    expect(screen.queryByLabelText("Options")).toBeNull();
  });
});
