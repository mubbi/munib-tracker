import { fireEvent, screen } from "@testing-library/react-native";

import en from "@/i18n/en.json";
import { usePlatform } from "@/test-support/platform";
import { renderWithTheme } from "@/test-support/render";

import { moveItem, OrderedListEditor, toggleItem } from "./ordered-list-editor";

jest.mock("@/components/ui/sheet", () => require("@/test-support/mocks/sheet").sheetMock);

describe("moveItem / toggleItem", () => {
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
});

describe("OrderedListEditor", () => {
  const labelFor = (id: string) => id.toUpperCase();

  it("moves a row from its overflow menu (G-95; labels name the row)", async () => {
    const onChange = jest.fn();
    await renderWithTheme(
      <OrderedListEditor
        order={["read", "learn"]}
        allIds={["read", "learn"]}
        labelFor={labelFor}
        onChange={onChange}
      />,
    );
    // One "More options" button per row instead of three cramped icon buttons.
    expect(screen.queryByLabelText(`${en.zikr.moveDown}: READ`)).toBeNull();
    await fireEvent.press(screen.getByLabelText("More options for READ"));
    expect(screen.getByRole("button", { name: en.zikr.moveUp }).props.accessibilityState).toEqual(
      expect.objectContaining({ disabled: true }),
    );
    // Ordering-only lists offer no remove action.
    expect(screen.queryByRole("button", { name: en.homeCustomize.remove })).toBeNull();
    await fireEvent.press(screen.getByRole("button", { name: en.zikr.moveDown }));
    expect(onChange).toHaveBeenCalledWith(["learn", "read"]);
    // The menu closes after an action.
    expect(screen.queryByRole("button", { name: en.zikr.moveDown })).toBeNull();
  });

  it("removable lists hide rows and offer the hidden ones under Available", async () => {
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
    await fireEvent.press(screen.getByLabelText("More options for A"));
    await fireEvent.press(screen.getByRole("button", { name: en.homeCustomize.remove }));
    expect(onChange).toHaveBeenLastCalledWith([]);
    fireEvent.press(screen.getByLabelText(`${en.homeCustomize.add}: B`));
    expect(onChange).toHaveBeenLastCalledWith(["a", "b"]);
  });

  it("moves a row to the top from the menu", async () => {
    const onChange = jest.fn();
    await renderWithTheme(
      <OrderedListEditor
        order={["a", "b", "c"]}
        allIds={["a", "b", "c"]}
        labelFor={labelFor}
        onChange={onChange}
      />,
    );
    await fireEvent.press(screen.getByLabelText("More options for C"));
    await fireEvent.press(screen.getByRole("button", { name: "Move to top" }));
    expect(onChange).toHaveBeenCalledWith(["c", "a", "b"]);
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
      fireEvent.press(screen.getByLabelText(`${en.zikr.moveDown}: READ`));
      expect(onChange).toHaveBeenCalledWith(["learn", "read"]);
    });
  });
});
