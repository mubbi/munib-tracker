import { fireEvent, screen } from "@testing-library/react-native";

import { DeleteAccountModal } from "@/components/auth/delete-account-modal";
import { usePlatform } from "@/test-support/platform";
import { queryHostsByRole } from "@/test-support/queries";
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

async function confirmAndDelete(confirmLabel = "Delete account") {
  await fireEvent.changeText(screen.getByLabelText("Type DELETE to confirm"), " DELETE ");
  await fireEvent.press(screen.getByRole("checkbox"));
  await fireEvent.press(screen.getByRole("button", { name: confirmLabel }));
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
    const confirm = () => screen.getByRole("button", { name: "Delete account" });
    expect(confirm().props.accessibilityState).toEqual(expect.objectContaining({ disabled: true }));
    await fireEvent.changeText(screen.getByLabelText("Type DELETE to confirm"), "DELETE");
    expect(confirm().props.accessibilityState).toEqual(expect.objectContaining({ disabled: true }));
    await fireEvent.press(confirm());
    expect(props.deleteAccount).not.toHaveBeenCalled();
    await fireEvent.press(screen.getByRole("checkbox"));
    expect(confirm().props.accessibilityState).toEqual(
      expect.objectContaining({ disabled: false }),
    );
  });

  it("labels the typed-confirmation field and the reason group (D-44)", async () => {
    await renderModal();
    await pickReason();
    const groups = queryHostsByRole("radiogroup");
    expect(groups).toHaveLength(1);
    expect(groups[0]?.props.accessibilityLabel).toBe("Why are you leaving?");
    expect(screen.getByRole("radio", { name: "Privacy concerns", checked: true })).toBeTruthy();
    expect(screen.getByLabelText("Anything else? (optional)")).toBeTruthy();
    await fireEvent.press(screen.getByText("Continue"));
    expect(screen.getByLabelText("Type DELETE to confirm")).toBeTruthy();
    expect(
      screen.getByRole("checkbox", {
        name: "I understand this permanently deletes my account and all synced data.",
      }),
    ).toBeTruthy();
  });

  it("uses the erase copy for a guest (F-22)", async () => {
    const { props } = await renderModal({ guest: true });
    expect(screen.getByText("Erase all data on this device?")).toBeTruthy();
    expect(screen.queryByText("Delete account?")).toBeNull();
    await goToConfirmStep();
    expect(screen.getByText("Confirm erase")).toBeTruthy();
    await confirmAndDelete("Erase data");
    expect(props.deleteAccount).toHaveBeenCalledWith({
      confirmation: "DELETE",
      primaryReason: "privacy_concerns",
    });
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
    expect(screen.getByRole("alert")).toBeTruthy();
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
