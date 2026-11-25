import { fireEvent, screen } from "@testing-library/react-native";

import { ThemedSwitch } from "@/components/ui/themed-switch";
import { type ThemeTokens, useThemeTokens } from "@/hooks/use-theme-tokens";
import { renderWithTheme } from "@/test-support/render";

let seen: ThemeTokens;
function Probe() {
  seen = useThemeTokens().tokens;
  return null;
}

describe("ThemedSwitch", () => {
  it("forwards value changes to the caller", async () => {
    const onValueChange = jest.fn();
    await renderWithTheme(
      <ThemedSwitch value={false} onValueChange={onValueChange} accessibilityLabel="Haptics" />,
    );

    await fireEvent(screen.getByLabelText("Haptics"), "valueChange", true);

    expect(onValueChange).toHaveBeenCalledWith(true);
  });

  it("draws the off track with tokens.switchTrackOff", async () => {
    await renderWithTheme(
      <>
        <Probe />
        <ThemedSwitch value={false} onValueChange={jest.fn()} accessibilityLabel="Haptics" />
      </>,
    );
    expect(JSON.stringify(screen.getByLabelText("Haptics").props)).toContain(seen.switchTrackOff);
  });
});
