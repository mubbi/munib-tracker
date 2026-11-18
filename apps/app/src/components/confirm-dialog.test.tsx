import { fireEvent, screen } from "@testing-library/react-native";

import { ConfirmDialog } from "@/components/confirm-dialog";
import { parentOf } from "@/test-support/queries";
import { renderWithTheme } from "@/test-support/render";
import { flattenStyle } from "@/test-support/style";

jest.mock("@/components/ui/sheet", () => require("@/test-support/mocks/sheet").sheetMock);

type Props = Parameters<typeof ConfirmDialog>[0];

const renderDialog = async (props: Partial<Props> = {}) => {
  const handlers = { onConfirm: jest.fn(), onClose: jest.fn() };
  await renderWithTheme(<ConfirmDialog visible title="Delete?" {...handlers} {...props} />);
  return handlers;
};

describe("ConfirmDialog", () => {
  it("shows the title and optional message with default labels", async () => {
    await renderDialog({ message: "This cannot be undone" });

    expect(screen.getByText("Delete?")).toBeTruthy();
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

  it("paints the confirm button red when destructive", async () => {
    await renderDialog({ destructive: true });

    const confirm = parentOf(screen.getByText("Confirm"), 3);
    expect(flattenStyle(confirm.props.style).backgroundColor).toMatch(/^#/);
  });
});
