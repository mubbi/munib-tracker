import { fireEvent, screen } from "@testing-library/react-native";

import { HifzActionButton } from "@/components/quran/hifz-action-button";
import { renderWithTheme } from "@/test-support/render";

describe("HifzActionButton", () => {
  it.each([
    [undefined, "Mark needs review", false],
    ["review" as const, "Mark memorized", true],
    ["memorized" as const, "Clear memorization", true],
  ])("status %s → %s", async (status, label, selected) => {
    const onPress = jest.fn();
    await renderWithTheme(<HifzActionButton status={status} onPress={onPress} />);
    const button = screen.getByLabelText(label);
    expect(button.props.accessibilityState).toMatchObject({ selected });
    await fireEvent.press(button);
    expect(onPress).toHaveBeenCalledTimes(1);
  });
});
