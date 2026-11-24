import { fireEvent, screen } from "@testing-library/react-native";

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
  it("shows the title and hint and labels the switch", async () => {
    const onValueChange = await renderRow();

    expect(screen.getByText("After Fajr")).toBeTruthy();
    await fireEvent(screen.getByLabelText("Daily reminder"), "valueChange", true);
    expect(onValueChange).toHaveBeenCalledWith(true);
  });

  it("reads the hint to screen readers", async () => {
    await renderRow();

    expect(screen.getByLabelText("Daily reminder").props.accessibilityHint).toBe("After Fajr");
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
