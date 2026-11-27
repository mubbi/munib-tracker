import { fireEvent, screen } from "@testing-library/react-native";

import en from "@/i18n/en.json";
import { mockToast } from "@/test-support/mocks/toast-provider";
import { usePlatform } from "@/test-support/platform";
import { renderWithTheme } from "@/test-support/render";

import { mergeVisibleOrder, moveItem, OrderedListEditor, toggleItem } from "./ordered-list-editor";

jest.mock(
  "@/providers/toast-provider",
  () => require("@/test-support/mocks/toast-provider").toastProviderMock,
);

describe("moveItem / toggleItem / mergeVisibleOrder", () => {
  it("swaps neighbours and ignores out-of-range moves", () => {
    expect(moveItem(["a", "b", "c"], 1, -1)).toEqual(["b", "a", "c"]);
    expect(moveItem(["a", "b", "c"], 1, 1)).toEqual(["a", "c", "b"]);
    expect(moveItem(["a", "b"], 0, -1)).toEqual(["a", "b"]);
    expect(moveItem(["a", "b"], 1, 1)).toEqual(["a", "b"]);
  });

  it("hides ids and re-adds them at the end", () => {
    expect(toggleItem(["a", "b"], "a", false)).toEqual(["b"]);
    expect(toggleItem(["b"], "a", true)).toEqual(["b", "a"]);
    expect(toggleItem(["a"], "a", true)).toEqual(["a"]);
  });

  it("keeps ids this device can't show at the end of the stored order", () => {
    // `tv-only` is stored but not available here; the visible ids take the new order.
    expect(mergeVisibleOrder(["a", "tv-only", "b"], ["b", "a"], ["a", "b", "c"])).toEqual([
      "b",
      "a",
      "tv-only",
    ]);
  });
});

describe("OrderedListEditor", () => {
  const labelFor = (id: string) => id.toUpperCase();
  beforeEach(() => jest.clearAllMocks());

  const rowFor = (label: string) => screen.getByLabelText(label);

  it("shows a drag handle per row instead of an overflow menu", async () => {
    await renderWithTheme(
      <OrderedListEditor
        order={["read", "learn"]}
        allIds={["read", "learn"]}
        labelFor={labelFor}
        onChange={jest.fn()}
      />,
    );

    expect(
      screen.getByTestId("sortable-handle-read", { includeHiddenElements: true }),
    ).toBeTruthy();
    expect(screen.queryByLabelText("More options for READ")).toBeNull();
    // Ordering-only lists offer no remove.
    expect(screen.queryByLabelText(`${en.homeCustomize.remove}: READ`)).toBeNull();
  });

  it("moves a row with its Move up / Move down actions", async () => {
    const onChange = jest.fn();
    await renderWithTheme(
      <OrderedListEditor
        order={["read", "learn", "listen"]}
        allIds={["read", "learn", "listen"]}
        labelFor={labelFor}
        onChange={onChange}
      />,
    );

    const actions = rowFor("READ").props.accessibilityActions as { name: string; label: string }[];
    expect(actions.map((a) => a.label)).toEqual([en.zikr.moveDown]);

    await fireEvent(rowFor("LISTEN"), "accessibilityAction", {
      nativeEvent: { actionName: "moveEarlier" },
    });
    expect(onChange).toHaveBeenCalledWith(["read", "listen", "learn"]);
  });

  it("removes inline with an Undo toast, and re-adds from Hidden", async () => {
    const onChange = jest.fn();
    await renderWithTheme(
      <OrderedListEditor
        order={["a", "c"]}
        allIds={["a", "b", "c"]}
        labelFor={labelFor}
        removable
        onChange={onChange}
      />,
    );

    await fireEvent.press(screen.getByLabelText(`${en.homeCustomize.remove}: A`));
    expect(onChange).toHaveBeenLastCalledWith(["c"]);
    const [title, options] = mockToast.show.mock.calls.at(-1) ?? [];
    expect(title).toBe("A removed");
    options.action.onPress();
    expect(onChange).toHaveBeenLastCalledWith(["a", "c"]);

    expect(screen.getByText(en.settings.reorder.hidden)).toBeTruthy();
    await fireEvent.press(screen.getByLabelText(`${en.homeCustomize.add}: B`));
    expect(onChange).toHaveBeenLastCalledWith(["a", "c", "b"]);
  });

  it("offers Remove as a row accessibility action when removable", async () => {
    const onChange = jest.fn();
    await renderWithTheme(
      <OrderedListEditor
        order={["a", "b"]}
        allIds={["a", "b"]}
        labelFor={labelFor}
        removable
        onChange={onChange}
      />,
    );

    await fireEvent(rowFor("B"), "accessibilityAction", { nativeEvent: { actionName: "remove" } });

    expect(onChange).toHaveBeenCalledWith(["a"]);
  });

  describe("on TV", () => {
    usePlatform({ isTV: true });

    it("keeps one Up / Down button per row for the D-pad", async () => {
      const onChange = jest.fn();
      await renderWithTheme(
        <OrderedListEditor
          order={["read", "learn"]}
          allIds={["read", "learn"]}
          labelFor={labelFor}
          onChange={onChange}
        />,
      );
      expect(
        screen.queryByTestId("sortable-handle-read", { includeHiddenElements: true }),
      ).toBeNull();
      fireEvent.press(screen.getByLabelText(`${en.zikr.moveDown}: READ`));
      expect(onChange).toHaveBeenCalledWith(["learn", "read"]);
    });

    it("removes and re-adds from the Available list", async () => {
      const onChange = jest.fn();
      await renderWithTheme(
        <OrderedListEditor
          order={["a"]}
          allIds={["a", "b"]}
          labelFor={labelFor}
          removable
          onChange={onChange}
        />,
      );
      fireEvent.press(screen.getByLabelText(`${en.homeCustomize.remove}: A`));
      expect(onChange).toHaveBeenLastCalledWith([]);
      fireEvent.press(screen.getByLabelText(`${en.homeCustomize.add}: B`));
      expect(onChange).toHaveBeenLastCalledWith(["a", "b"]);
    });
  });
});
