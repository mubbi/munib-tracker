import { fireEvent, screen } from "@testing-library/react-native";

import en from "@/i18n/en.json";
import { renderWithTheme } from "@/test-support/render";

import { moveItem, OrderedListEditor, toggleItem } from "./ordered-list-editor";

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

  it("moves a row with one tap (labels name the row for screen readers)", async () => {
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
    // Ordering-only lists offer no remove button.
    expect(screen.queryByLabelText(`${en.homeCustomize.remove}: READ`)).toBeNull();
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
    fireEvent.press(screen.getByLabelText(`${en.homeCustomize.remove}: A`));
    expect(onChange).toHaveBeenLastCalledWith([]);
    fireEvent.press(screen.getByLabelText(`${en.homeCustomize.add}: B`));
    expect(onChange).toHaveBeenLastCalledWith(["a", "b"]);
  });
});
