import { fireEvent, screen } from "@testing-library/react-native";

import { VoiceInputButton } from "@/components/stt/voice-input-button";
import { usePlatform } from "@/test-support/platform";
import { renderWithTheme } from "@/test-support/render";

jest.mock(
  "react-native-reanimated",
  () => require("@/test-support/mocks/reanimated").reanimatedWorkletMock,
);

type Props = Parameters<typeof VoiceInputButton>[0];

async function renderButton(overrides: Partial<Props> = {}) {
  const onPress = jest.fn();
  await renderWithTheme(
    <VoiceInputButton
      listening={false}
      level={{ value: 0.6 } as Props["level"]}
      onPress={onPress}
      accessibilityLabel="Dictate"
      {...overrides}
    />,
  );
  return onPress;
}

describe("VoiceInputButton", () => {
  it.each([
    [false, "md"],
    [true, "sm"],
  ] as const)("reflects listening=%s at size %s", async (listening, size) => {
    await renderButton({ listening, size });
    expect(screen.getByLabelText("Dictate").props.accessibilityState).toEqual(
      expect.objectContaining({ selected: listening }),
    );
  });

  it("presses through", async () => {
    const onPress = await renderButton({ accessibilityHint: "Speak to fill" });
    await fireEvent.press(screen.getByLabelText("Dictate"));
    expect(onPress).toHaveBeenCalled();
  });

  it("ignores presses when disabled", async () => {
    const onPress = await renderButton({ disabled: true });
    await fireEvent.press(screen.getByLabelText("Dictate"));
    expect(onPress).not.toHaveBeenCalled();
  });

  it("draws quiet bars for a silent level", async () => {
    await renderButton({ listening: true, level: { value: 0 } as Props["level"] });
    expect(screen.getByLabelText("Dictate")).toBeTruthy();
  });

  describe("on TV", () => {
    usePlatform({ isTV: true });

    it("renders no microphone", async () => {
      await renderButton();
      expect(screen.queryByLabelText("Dictate")).toBeNull();
    });
  });
});
