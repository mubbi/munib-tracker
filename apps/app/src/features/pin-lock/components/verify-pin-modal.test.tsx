import { act, fireEvent, screen } from "@testing-library/react-native";

import { VerifyPinModal } from "@/features/pin-lock/components/verify-pin-modal";
import { deferred } from "@/test-support/async";
import { pressPinBackspace, pressPinDigits, requestModalClose } from "@/test-support/pin-lock";
import { renderWithTheme } from "@/test-support/render";

type Props = Parameters<typeof VerifyPinModal>[0];

const WRONG_PIN = "Wrong PIN — please try again.";

async function renderModal(props: Partial<Props> = {}) {
  const onClose = jest.fn();
  const { onVerify = jest.fn(async (_pin: string) => true), ...rest } = props;
  await renderWithTheme(<VerifyPinModal visible onClose={onClose} onVerify={onVerify} {...rest} />);
  return { onClose, onVerify };
}

/** Renders, enters a full PIN, and leaves verification pending until `settle`. */
async function renderVerifying() {
  const pending = deferred<boolean>();
  const handles = await renderModal({ onVerify: jest.fn(() => pending.promise) });
  await pressPinDigits("000000");
  const settle = async (outcome: boolean | Error) => {
    await act(async () => {
      if (outcome instanceof Error) pending.reject(outcome);
      else pending.resolve(outcome);
      await pending.promise.catch(() => {});
    });
  };
  return { ...handles, settle };
}

describe("VerifyPinModal", () => {
  it("renders nothing when hidden", async () => {
    await renderModal({ visible: false });
    expect(screen.queryByText("Enter PIN")).toBeNull();
  });

  it("uses the default title and subtitle", async () => {
    await renderModal();
    expect(screen.getByText("Enter PIN")).toBeTruthy();
    expect(screen.getByText("Enter your 6-digit PIN to unlock")).toBeTruthy();
  });

  it("uses a custom title and subtitle", async () => {
    await renderModal({ title: "Confirm", subtitle: "Verify it" });
    expect(screen.getByText("Confirm")).toBeTruthy();
    expect(screen.getByText("Verify it")).toBeTruthy();
  });

  it("verifies the entered PIN, honouring backspace", async () => {
    const { onVerify } = await renderModal();
    await pressPinDigits("12345");
    await pressPinBackspace();
    await pressPinDigits("56");
    expect(onVerify).toHaveBeenCalledWith("123456");
  });

  it("closes after a correct PIN", async () => {
    const { onClose } = await renderModal();
    await pressPinDigits("123456");
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("shows progress while verifying", async () => {
    await renderVerifying();
    expect(screen.getByText("Verifying…")).toBeTruthy();
  });

  it("ignores close requests while verifying", async () => {
    const { onClose } = await renderVerifying();
    await requestModalClose();
    expect(onClose).not.toHaveBeenCalled();
  });

  it.each([
    ["a wrong PIN", false],
    ["a rejected verification", new Error("boom")],
  ])("shows the wrong-PIN error after %s", async (_case, outcome) => {
    const { settle } = await renderVerifying();
    await settle(outcome);
    expect(screen.getByText(WRONG_PIN)).toBeTruthy();
  });

  it("clears the error when typing again", async () => {
    const { settle } = await renderVerifying();
    await settle(false);
    await pressPinDigits("1");
    expect(screen.queryByText(WRONG_PIN)).toBeNull();
  });

  it("closes from the close button", async () => {
    const { onClose } = await renderModal();
    await fireEvent.press(screen.getByLabelText("Close"));
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("closes on a hardware back request", async () => {
    const { onClose } = await renderModal();
    await requestModalClose();
    expect(onClose).toHaveBeenCalledTimes(1);
  });
});
