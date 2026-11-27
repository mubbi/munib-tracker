import { fireEvent, screen } from "@testing-library/react-native";
import { createRef } from "react";
import { Text, type TextInputInstance } from "react-native";

import { SearchField } from "@/components/ui/search-field";
import { renderWithTheme } from "@/test-support/render";

describe("SearchField", () => {
  it("emits text, clears, submits and forwards the ref", async () => {
    const onChangeText = jest.fn();
    const onSubmit = jest.fn();
    const ref = createRef<TextInputInstance>();
    await renderWithTheme(
      <SearchField
        ref={ref}
        value="fajr"
        onChangeText={onChangeText}
        onSubmit={onSubmit}
        placeholder="Search"
        trailing={<Text>T</Text>}
      />,
    );

    await fireEvent.changeText(screen.getByLabelText("Search"), "x");
    expect(onChangeText).toHaveBeenCalledWith("x");
    await fireEvent(screen.getByLabelText("Search"), "submitEditing", {
      nativeEvent: { text: "fajr" },
    });
    expect(onSubmit).toHaveBeenCalledWith("fajr");
    await fireEvent.press(screen.getByLabelText(/clear/i));
    expect(onChangeText).toHaveBeenLastCalledWith("");
    expect(ref.current).toBeTruthy();
    expect(screen.getByText("T")).toBeTruthy();
  });

  it("hides clear when empty and applies autofocus", async () => {
    await renderWithTheme(
      <SearchField
        value=""
        onChangeText={() => {}}
        placeholder="Search"
        direction="rtl"
        autoFocus
      />,
    );

    expect(screen.queryByLabelText(/clear/i)).toBeNull();
    expect(screen.getByLabelText("Search").props.autoFocus).toBe(true);
  });
});
