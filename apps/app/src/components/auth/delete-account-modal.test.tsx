import { fireEvent, screen } from "@testing-library/react-native";

import { DeleteAccountModal } from "@/components/auth/delete-account-modal";
import { usePlatform } from "@/test-support/platform";
import { renderWithTheme } from "@/test-support/render";

type Props = Parameters<typeof DeleteAccountModal>[0];

async function renderModal(overrides: Partial<Props> = {}) {
  const props: Props = {
    visible: true,
    onClose: jest.fn(),
    onDeleted: jest.fn(),
    deleteAccount: jest.fn(async () => undefined),
    ...overrides,
  };
  const utils = await renderWithTheme(<DeleteAccountModal {...props} />);
  return { props, utils };
}

async function pickReason(reason = "Privacy concerns") {
  await fireEvent.press(screen.getByText("Continue"));
  await fireEvent.press(screen.getByText(reason));
}

async function goToConfirmStep(reason?: string) {
  await pickReason(reason);
  await fireEvent.press(screen.getByText("Continue"));
}

async function confirmAndDelete() {
  await fireEvent.changeText(screen.getByPlaceholderText("Type DELETE"), " DELETE ");
  await fireEvent.press(screen.getByRole("checkbox"));
  await fireEvent.press(screen.getByText("Delete everything"));
}

describe("DeleteAccountModal", () => {
  it("starts on the warning step", async () => {
    await renderModal();
    expect(screen.getByText("Before you go")).toBeTruthy();
  });

  it("requires a reason before continuing", async () => {
    await renderModal();
    await fireEvent.press(screen.getByText("Continue"));
    await fireEvent.press(screen.getByText("Continue"));
    expect(screen.getByText("Please select a reason to continue.")).toBeTruthy();
  });

  it("clears the reason error when details are typed", async () => {
    await renderModal();
    await fireEvent.press(screen.getByText("Continue"));
    await fireEvent.press(screen.getByText("Continue"));
    await fireEvent.changeText(screen.getByPlaceholderText("Tell us more…"), "x");
    expect(screen.queryByText("Please select a reason to continue.")).toBeNull();
  });

  it("goes back from the survey to the warning step", async () => {
    await renderModal();
    await fireEvent.press(screen.getByText("Continue"));
    await fireEvent.press(screen.getByText("Back"));
    expect(screen.getByText("Before you go")).toBeTruthy();
  });

  it("marks the chosen reason as selected", async () => {
    await renderModal();
    await pickReason("Other");
    expect(screen.getByRole("radio", { selected: true })).toBeTruthy();
  });

  it("keeps delete disabled until DELETE is typed and acknowledged", async () => {
    const { props } = await renderModal();
    await goToConfirmStep();
    await fireEvent.press(screen.getByText("Delete everything"));
    expect(props.deleteAccount).not.toHaveBeenCalled();
  });

  it("deletes with trimmed details, then closes", async () => {
    const { props } = await renderModal();
    await pickReason("Other");
    await fireEvent.changeText(screen.getByPlaceholderText("Tell us more…"), "  too noisy  ");
    await fireEvent.press(screen.getByText("Continue"));
    await confirmAndDelete();
    expect(props.deleteAccount).toHaveBeenCalledWith({
      confirmation: "DELETE",
      primaryReason: "other",
      details: "too noisy",
    });
    expect(props.onDeleted).toHaveBeenCalled();
    expect(props.onClose).toHaveBeenCalled();
  });

  it("shows an error when deletion fails", async () => {
    const deleteAccount = jest.fn(async () => {
      throw new Error("offline");
    });
    const { props } = await renderModal({ deleteAccount });
    await goToConfirmStep();
    await confirmAndDelete();
    expect(deleteAccount).toHaveBeenCalledWith({
      confirmation: "DELETE",
      primaryReason: "privacy_concerns",
    });
    expect(screen.getByText(/Couldn't delete your account/)).toBeTruthy();
    expect(props.onDeleted).not.toHaveBeenCalled();
  });

  it("goes back from confirmation to the survey", async () => {
    await renderModal();
    await goToConfirmStep();
    await fireEvent.press(screen.getByText("Back"));
    expect(screen.getByText("Why are you leaving?")).toBeTruthy();
  });

  it("resets to the first step after being hidden", async () => {
    const { utils, props } = await renderModal();
    await goToConfirmStep();
    await utils.rerender(<DeleteAccountModal {...props} visible={false} />);
    await utils.rerender(<DeleteAccountModal {...props} visible />);
    expect(screen.getByText("Before you go")).toBeTruthy();
  });

  describe("on TV", () => {
    usePlatform({ isTV: true });

    it("still lets a reason be selected", async () => {
      await renderModal();
      await pickReason();
      expect(screen.getByRole("radio", { selected: true })).toBeTruthy();
    });
  });
});
