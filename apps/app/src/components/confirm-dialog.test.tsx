import { act, fireEvent, screen } from "@testing-library/react-native";

import { ConfirmDialog } from "@/components/confirm-dialog";
import { useThemeTokens } from "@/hooks/use-theme-tokens";
import { deferred } from "@/test-support/async";
import { pressableProps } from "@/test-support/fiber";
import { usePlatform } from "@/test-support/platform";
import { renderHookWithTheme, renderWithTheme } from "@/test-support/render";
import { flattenStyle } from "@/test-support/style";

jest.mock("@/components/ui/sheet", () => require("@/test-support/mocks/sheet").sheetMock);

type Props = Parameters<typeof ConfirmDialog>[0];

const renderDialog = async (props: Partial<Props> = {}) => {
  const handlers = { onConfirm: jest.fn(), onClose: jest.fn() };
  await renderWithTheme(<ConfirmDialog visible title="Delete?" {...handlers} {...props} />);
  return handlers;
};

const button = (name: string) => screen.getByRole("button", { name });
const restingStyle = (name: string) =>
  flattenStyle(
    pressableProps<{ style: (state: { pressed: boolean }) => object }>(button(name)).style({
      pressed: false,
    }),
  );
const isDisabled = (name: string) => button(name).props.accessibilityState?.disabled === true;
const isBusy = (name: string) => button(name).props.accessibilityState?.busy === true;

describe("ConfirmDialog", () => {
  it("shows the title as a heading and the optional message with default labels", async () => {
    await renderDialog({ message: "This cannot be undone" });

    expect(screen.getByRole("header", { name: "Delete?" })).toBeTruthy();
    expect(screen.getByText("This cannot be undone")).toBeTruthy();
    expect(screen.getByText("Cancel")).toBeTruthy();
    expect(screen.getByText("Confirm")).toBeTruthy();
  });

  it("confirms and then closes", async () => {
    const { onConfirm, onClose } = await renderDialog({ confirmLabel: "Delete" });

    await fireEvent.press(screen.getByText("Delete"));

    expect(onConfirm).toHaveBeenCalled();
    expect(onClose).toHaveBeenCalled();
  });

  it("cancels through onClose by default", async () => {
    const { onConfirm, onClose } = await renderDialog();

    await fireEvent.press(screen.getByText("Cancel"));

    expect(onClose).toHaveBeenCalled();
    expect(onConfirm).not.toHaveBeenCalled();
  });

  it("uses a dedicated cancel handler when given", async () => {
    const onCancel = jest.fn();
    const { onClose } = await renderDialog({ onCancel, cancelLabel: "Keep" });

    await fireEvent.press(screen.getByText("Keep"));

    expect(onCancel).toHaveBeenCalled();
    expect(onClose).not.toHaveBeenCalled();
  });

  it("paints a destructive confirm with the AA danger tokens", async () => {
    const { tokens } = (await renderHookWithTheme(() => useThemeTokens())).result.current;
    await renderDialog({ destructive: true });

    expect(restingStyle("Confirm").backgroundColor).toBe(tokens.status.danger.fill);
    expect(flattenStyle(screen.getByText("Confirm").props.style).color).toBe(
      tokens.status.danger.onFill,
    );
  });
});

describe("ConfirmDialog async confirm", () => {
  it("stays open and busy until the promise resolves, then closes", async () => {
    const work = deferred<void>();
    const onConfirm = jest.fn(() => work.promise);
    const { onClose } = await renderDialog({
      onConfirm,
      destructive: true,
      confirmLabel: "Reset",
    });

    await fireEvent.press(button("Reset"));

    expect(isBusy("Reset")).toBe(true);
    expect(isDisabled("Cancel")).toBe(true);
    expect(onClose).not.toHaveBeenCalled();

    // A second press while busy does nothing.
    await fireEvent.press(button("Reset"));
    expect(onConfirm).toHaveBeenCalledTimes(1);

    await act(async () => work.resolve());

    expect(onClose).toHaveBeenCalledTimes(1);
    expect(isBusy("Reset")).toBe(false);
  });

  it("keeps the dialog open with an inline alert when the promise rejects", async () => {
    const work = deferred<void>();
    const onConfirm = jest.fn(() => work.promise);
    const { onClose } = await renderDialog({
      onConfirm,
      errorMessage: "Couldn't reset. Try again",
    });

    await fireEvent.press(button("Confirm"));
    await act(async () => work.reject(new Error("boom")));

    expect(onClose).not.toHaveBeenCalled();
    expect(screen.getByRole("alert")).toBeTruthy();
    expect(screen.getByText("Couldn't reset. Try again")).toBeTruthy();
    expect(isBusy("Confirm")).toBe(false);
    expect(onConfirm).toHaveBeenCalledTimes(1);
  });

  it("falls back to a generic error line", async () => {
    await renderDialog({ onConfirm: () => Promise.reject(new Error("offline")) });

    await fireEvent.press(button("Confirm"));
    await act(async () => {});

    expect(screen.getByRole("alert")).toBeTruthy();
  });

  it("blocks scrim dismissal while busy", async () => {
    const { onClose } = await renderDialog({ busy: true });

    await fireEvent.press(screen.getByTestId("sheet-close"));

    expect(onClose).not.toHaveBeenCalled();
    expect(isBusy("Confirm")).toBe(true);
  });
});

describe("ConfirmDialog guards", () => {
  it("keeps confirm disabled until the acknowledgement is ticked", async () => {
    const { onConfirm } = await renderDialog({
      acknowledgeLabel: "I understand this erases all data on this device",
    });

    expect(isDisabled("Confirm")).toBe(true);
    await fireEvent.press(button("Confirm"));
    expect(onConfirm).not.toHaveBeenCalled();

    const box = screen.getByRole("checkbox", {
      name: "I understand this erases all data on this device",
    });
    expect(box.props.accessibilityState).toMatchObject({ checked: false });
    await fireEvent.press(box);

    expect(isDisabled("Confirm")).toBe(false);
    await fireEvent.press(button("Confirm"));
    expect(onConfirm).toHaveBeenCalledTimes(1);
  });

  it("keeps confirm disabled until the typed word matches", async () => {
    const { onConfirm } = await renderDialog({ confirmWord: "DELETE" });

    const field = screen.getByLabelText("Type DELETE to confirm");
    await fireEvent.changeText(field, "DEL");
    expect(isDisabled("Confirm")).toBe(true);

    await fireEvent.changeText(field, " DELETE ");
    expect(isDisabled("Confirm")).toBe(false);
    await fireEvent.press(button("Confirm"));
    expect(onConfirm).toHaveBeenCalledTimes(1);
  });
});

describe("ConfirmDialog on TV", () => {
  usePlatform({ OS: "android", isTV: true });

  it("gives Cancel the initial D-pad focus, never the confirm", async () => {
    await renderDialog({ destructive: true });

    expect(button("Cancel").props.hasTVPreferredFocus).toBe(true);
    expect(button("Confirm").props.hasTVPreferredFocus).toBeFalsy();
  });

  it("keeps Cancel focusable while busy but ignores presses (focus is never dropped)", async () => {
    const { onClose } = await renderDialog({ busy: true });

    expect(isDisabled("Cancel")).toBe(false);
    expect(isBusy("Confirm")).toBe(true);
    await fireEvent.press(button("Cancel"));
    expect(onClose).not.toHaveBeenCalled();
  });

  it("reaches the acknowledgement, then an enabled confirm, with the D-pad", async () => {
    const { onConfirm } = await renderDialog({ acknowledgeLabel: "I understand" });

    const box = screen.getByRole("checkbox", { name: "I understand" });
    expect(box.props.focusable).not.toBe(false);
    expect(isDisabled("Confirm")).toBe(true);
    await fireEvent.press(box);
    expect(isDisabled("Confirm")).toBe(false);
    await fireEvent.press(button("Confirm"));
    expect(onConfirm).toHaveBeenCalledTimes(1);
  });
});
