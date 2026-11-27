import { fireEvent, screen } from "@testing-library/react-native";

import { Chip, ToggleChip } from "@/components/ui/chip";
import { type ThemeTokens, useThemeTokens } from "@/hooks/use-theme-tokens";
import { usePlatformSwitch } from "@/test-support/platform";
import { renderWithTheme } from "@/test-support/render";
import { flattenStyle } from "@/test-support/style";

let seen: ThemeTokens;
function Probe() {
  seen = useThemeTokens().tokens;
  return null;
}

describe("Chip", () => {
  const setPlatform = usePlatformSwitch();

  it("is a selected button by default and calls onPress", async () => {
    const onPress = jest.fn();
    await renderWithTheme(<Chip label="Meccan" selected onPress={onPress} />);

    const chip = screen.getByRole("button", { name: "Meccan" });
    expect(chip.props.accessibilityState).toMatchObject({ selected: true });
    await fireEvent.press(chip);
    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it.each(["switch", "checkbox", "radio"] as const)(
    "%s role reports checked state",
    async (role) => {
      await renderWithTheme(<Chip label="Sat" role={role} selected={false} onPress={jest.fn()} />);

      expect(screen.getByRole(role, { name: "Sat" }).props.accessibilityState).toMatchObject({
        checked: false,
      });
    },
  );

  it("speaks and shows the count", async () => {
    await renderWithTheme(<Chip label="Duas" count={12} selected={false} onPress={jest.fn()} />);

    expect(screen.getByText("12")).toBeTruthy();
    expect(screen.getByLabelText("Duas, 12")).toBeTruthy();
  });

  it("does not fire while disabled", async () => {
    const onPress = jest.fn();
    await renderWithTheme(<Chip label="Full" selected={false} disabled onPress={onPress} />);

    await fireEvent.press(screen.getByLabelText("Full"));
    expect(onPress).not.toHaveBeenCalled();
  });

  it("extends the phone touch target to 44pt but not on TV", async () => {
    const { rerender } = await renderWithTheme(
      <Chip label="All" selected={false} onPress={jest.fn()} />,
    );
    expect(screen.getByLabelText("All").props.hitSlop).toMatchObject({ top: 6, bottom: 6 });

    setPlatform({ isTV: true });
    await rerender(<Chip label="All TV" selected={false} onPress={jest.fn()} />);
    expect(screen.getByLabelText("All TV").props.hitSlop).toBeUndefined();
  });
});

describe("ToggleChip", () => {
  it("is a switch labelled for screen readers", async () => {
    const onPress = jest.fn();
    await renderWithTheme(
      <ToggleChip
        icon="textformat"
        label="Translit."
        enabled
        accessibilityLabel="Show transliteration"
        onPress={onPress}
      />,
    );

    const chip = screen.getByRole("switch", { name: "Show transliteration" });
    expect(chip.props.accessibilityState).toMatchObject({ checked: true });
    await fireEvent.press(chip);
    expect(onPress).toHaveBeenCalledTimes(1);
  });
});

describe("Chip colours", () => {
  it("selected soft chip label is accentOnSoft", async () => {
    await renderWithTheme(
      <>
        <Probe />
        <Chip label="Soft" selected onPress={jest.fn()} />
      </>,
    );
    expect(flattenStyle(screen.getByText("Soft").props.style).color).toBe(seen.accentOnSoft);
  });
});
