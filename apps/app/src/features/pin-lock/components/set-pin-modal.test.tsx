import { act, fireEvent, screen } from "@testing-library/react-native";

import { SetPinModal } from "@/features/pin-lock/components/set-pin-modal";
import { deferred } from "@/test-support/async";
import { pressPinBackspace, pressPinDigits, requestModalClose } from "@/test-support/pin-lock";
import { renderWithTheme } from "@/test-support/render";

type Props = Parameters<typeof SetPinModal>[0];

const MISMATCH = "Those PINs don't match — please try again.";
const FAILED = "Could not save your PIN. Please try again.";

/** Renders the modal; `rerender` re-applies the same handlers with new props. */
async function renderModal(props: Partial<Props> = {}) {
  const onClose = jest.fn();
  const { onSetPin = jest.fn(async (_pin: string) => true), ...rest } = props;
  const ui = (overrides: Partial<Props>) => (
    <SetPinModal visible onClose={onClose} onSetPin={onSetPin} {...rest} {...overrides} />
  );
  const view = await renderWithTheme(ui({}));
  const rerender = (overrides: Partial<Props>) => view.rerender(ui(overrides));
  return { onClose, onSetPin, rerender, unmount: view.unmount };
}

/** Enters and confirms `pin`, leaving the save pending until `settle`. */
async function renderSaving(pin = "123456") {
  const pending = deferred<boolean>();
  const handles = await renderModal({ onSetPin: jest.fn(() => pending.promise) });
  await pressPinDigits(pin);
  await pressPinDigits(pin);
  const settle = async (outcome: boolean | Error) => {
    await act(async () => {
      if (outcome instanceof Error) pending.reject(outcome);
      else pending.resolve(outcome);
      await pending.promise.catch(() => {});
    });
  };
  return { ...handles, settle };
}

describe("SetPinModal", () => {
  afterEach(() => {
    jest.useRealTimers();
  });

  it("renders nothing when hidden", async () => {
    await renderModal({ visible: false });
    expect(screen.queryByText("Set PIN")).toBeNull();
  });

  it("starts on the enter step", async () => {
    await renderModal();
    expect(screen.getByText("Set PIN")).toBeTruthy();
    expect(screen.getByText("Choose a 6-digit PIN to lock the app")).toBeTruthy();
  });

  it("uses a custom title", async () => {
    await renderModal({ title: "New PIN" });
    expect(screen.getByText("New PIN")).toBeTruthy();
  });

  it("moves to the confirm step after six digits, honouring backspace", async () => {
    await renderModal();
    await pressPinDigits("12345");
    await pressPinBackspace();
    expect(screen.getByText("Set PIN")).toBeTruthy();
    await pressPinDigits("56");
    expect(screen.getByText("Confirm PIN")).toBeTruthy();
    expect(screen.getByText("Enter the same PIN again to confirm")).toBeTruthy();
  });

  it("flags a mismatched confirmation", async () => {
    const { onSetPin } = await renderModal();
    await pressPinDigits("111111");
    await pressPinDigits("222222");
    expect(screen.getByText(MISMATCH)).toBeTruthy();
    expect(onSetPin).not.toHaveBeenCalled();
  });

  it("accepts the original PIN after a mismatch", async () => {
    const { onSetPin } = await renderModal();
    await pressPinDigits("111111");
    await pressPinDigits("222222");
    await pressPinDigits("111111");
    expect(screen.queryByText(MISMATCH)).toBeNull();
    expect(onSetPin).toHaveBeenCalledWith("111111");
    // Let the save settle so unmount cancels its dismiss timer.
    expect(await screen.findByText("PIN saved")).toBeTruthy();
  });

  it("shows progress while saving", async () => {
    const { onSetPin } = await renderSaving();
    expect(onSetPin).toHaveBeenCalledWith("123456");
    expect(screen.getByText("Saving PIN…")).toBeTruthy();
  });

  it("ignores close requests while saving", async () => {
    const { onClose } = await renderSaving();
    await requestModalClose();
    expect(onClose).not.toHaveBeenCalled();
  });

  it("shows the saved state on success", async () => {
    const { settle } = await renderSaving();
    await settle(true);
    expect(screen.getByText("PIN saved")).toBeTruthy();
    expect(screen.queryByLabelText("1")).toBeNull();
  });

  it("auto-dismisses after saving", async () => {
    jest.useFakeTimers();
    const { onClose, settle } = await renderSaving();
    await settle(true);
    await act(async () => {
      jest.advanceTimersByTime(550);
    });
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it.each([
    ["returns false", false],
    ["throws", new Error("keychain")],
  ])("returns to the confirm step with an error when saving %s", async (_case, outcome) => {
    const { settle } = await renderSaving();
    await settle(outcome);
    expect(screen.getByText(FAILED)).toBeTruthy();
    expect(screen.getByText("Confirm PIN")).toBeTruthy();
  });

  it("clears the save error on backspace", async () => {
    const { settle } = await renderSaving();
    await settle(false);
    await pressPinBackspace();
    expect(screen.queryByText(FAILED)).toBeNull();
  });

  it("closes from the close button and resets to the enter step", async () => {
    const { onClose } = await renderModal();
    await pressPinDigits("123456");
    await fireEvent.press(screen.getByLabelText("Close"));
    expect(onClose).toHaveBeenCalledTimes(1);
    expect(screen.getByText("Set PIN")).toBeTruthy();
  });

  it("closes on a hardware back request", async () => {
    const { onClose } = await renderModal();
    await requestModalClose();
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("renders embedded without a close button", async () => {
    await renderModal({ embedded: true });
    expect(screen.getByText("Set PIN")).toBeTruthy();
    expect(screen.queryByLabelText("Close")).toBeNull();
  });

  it("cancels the pending dismiss on unmount", async () => {
    jest.useFakeTimers();
    const { onClose, settle, unmount } = await renderSaving();
    await settle(true);
    await unmount();
    jest.advanceTimersByTime(1_000);
    expect(onClose).not.toHaveBeenCalled();
  });

  it("cancels the pending dismiss and resets when hidden and reshown", async () => {
    jest.useFakeTimers();
    const { onClose, settle, rerender } = await renderSaving();
    await settle(true);
    await rerender({ visible: false });
    await rerender({ visible: true });
    expect(screen.getByText("Set PIN")).toBeTruthy();
    await act(async () => {
      jest.advanceTimersByTime(1_000);
    });
    expect(onClose).not.toHaveBeenCalled();
  });
});
