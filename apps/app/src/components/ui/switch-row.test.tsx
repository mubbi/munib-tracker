import { fireEvent, screen } from "@testing-library/react-native";

import { Text } from "react-native";

import { SwitchRow } from "@/components/ui/switch-row";
import { usePlatform } from "@/test-support/platform";
import { renderWithTheme } from "@/test-support/render";

const renderRow = async (props: Partial<Parameters<typeof SwitchRow>[0]> = {}) => {
  const onValueChange = jest.fn();
  await renderWithTheme(
    <SwitchRow
      title="Daily reminder"
      subtitle="After Fajr"
      value={false}
      onValueChange={onValueChange}
      {...props}
    />,
  );
  return onValueChange;
};

describe("SwitchRow", () => {
  it("toggles when the row (label) is pressed", async () => {
    const onValueChange = await renderRow();

    await fireEvent.press(screen.getByText("Daily reminder"));
    expect(onValueChange).toHaveBeenCalledWith(true);
  });

  it("draws a custom leading visual, hidden from assistive tech, and the row still toggles", async () => {
    const onValueChange = await renderRow({ leading: <Text>well</Text>, icon: "bell" });

    expect(screen.queryByText("well")).toBeNull();
    expect(screen.getByText("well", { includeHiddenElements: true })).toBeTruthy();
    expect(screen.getAllByRole("switch")).toHaveLength(1);
    await fireEvent.press(screen.getByRole("switch"));
    expect(onValueChange).toHaveBeenCalledWith(true);
  });

  it("exposes exactly one switch with the checked state and hint", async () => {
    await renderRow({ value: true });

    const switches = screen.getAllByRole("switch");
    expect(switches).toHaveLength(1);
    expect(switches[0].props.accessibilityState).toMatchObject({ checked: true });
    expect(switches[0].props.accessibilityHint).toBe("After Fajr");
    expect(screen.getByText("After Fajr")).toBeTruthy();
  });

  it("accepts hint as an alias of subtitle", async () => {
    await renderRow({ subtitle: undefined, hint: "Hint text" });
    expect(screen.getByText("Hint text")).toBeTruthy();
  });

  it("does not toggle while disabled or read-only", async () => {
    const onValueChange = await renderRow({ disabled: true });
    await fireEvent.press(screen.getByText("Daily reminder"));
    expect(onValueChange).not.toHaveBeenCalled();
  });

  it("read-only shows the state without a press handler", async () => {
    const onValueChange = await renderRow({ readOnly: true, value: true });
    await fireEvent.press(screen.getByText("Daily reminder"));
    expect(onValueChange).not.toHaveBeenCalled();
    expect(screen.getByRole("switch").props.accessibilityState).toMatchObject({ checked: true });
  });

  describe("on TV", () => {
    usePlatform({ isTV: true });

    it("makes the whole row a switch that Select toggles", async () => {
      const onValueChange = await renderRow({ value: true });

      const row = screen.getByRole("switch", { name: "Daily reminder" });
      expect(row.props.accessibilityState).toMatchObject({ checked: true });
      await fireEvent.press(row);
      expect(onValueChange).toHaveBeenCalledWith(false);
    });

    it("ignores Select while disabled", async () => {
      const onValueChange = await renderRow({ disabled: true });

      await fireEvent.press(screen.getByRole("switch", { name: "Daily reminder" }));
      expect(onValueChange).not.toHaveBeenCalled();
    });
  });
});
