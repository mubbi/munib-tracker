import { act, fireEvent, screen } from "@testing-library/react-native";

/** Presses each digit of `digits` on the rendered `PinKeypad` (keys are labelled by digit). */
export async function pressPinDigits(digits: string): Promise<void> {
  for (const digit of digits) {
    await fireEvent.press(screen.getByLabelText(digit));
  }
}

/** Presses the keypad's backspace key. */
export async function pressPinBackspace(): Promise<void> {
  await fireEvent.press(screen.getByLabelText("Backspace"));
}

/** Fires the rendered `<Modal>`'s `onRequestClose` (Android back / iOS swipe-down). */
export async function requestModalClose(): Promise<void> {
  const [modal] = screen.container.queryAll(
    (node) => typeof node.props.onRequestClose === "function",
  );
  if (!modal) throw new Error("No <Modal> with onRequestClose is rendered");
  await act(async () => {
    modal.props.onRequestClose();
  });
}
