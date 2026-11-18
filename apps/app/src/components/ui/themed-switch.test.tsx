import { fireEvent, screen } from "@testing-library/react-native";

import { ThemedSwitch } from "@/components/ui/themed-switch";
import { renderWithTheme } from "@/test-support/render";

describe("ThemedSwitch", () => {
  it("forwards value changes to the caller", async () => {
    const onValueChange = jest.fn();
    await renderWithTheme(
      <ThemedSwitch value={false} onValueChange={onValueChange} accessibilityLabel="Haptics" />,
    );

    await fireEvent(screen.getByLabelText("Haptics"), "valueChange", true);

    expect(onValueChange).toHaveBeenCalledWith(true);
  });
});
