import { fireEvent, screen } from "@testing-library/react-native";

import { QazaCountEditModal } from "@/components/qaza-count-edit-modal";
import { usePlatform } from "@/test-support/platform";
import { renderWithTheme } from "@/test-support/render";

jest.mock("@/components/ui/sheet", () => require("@/test-support/mocks/sheet").sheetMock);

type Props = Parameters<typeof QazaCountEditModal>[0];

const renderModal = async (props: Partial<Props> = {}) => {
  const handlers = { onSubmit: jest.fn(), onClose: jest.fn() };
  const view = await renderWithTheme(
    <QazaCountEditModal visible initialValue={12} prayerLabel="Fajr" {...handlers} {...props} />,
  );
  return { ...handlers, ...view };
};

const input = () => screen.getByLabelText("Edit Fajr remaining qaza count");
const save = () => fireEvent.press(screen.getByText("Save"));

describe("QazaCountEditModal", () => {
  it("prefills the current count with prayer-specific copy", async () => {
    await renderModal();

    expect(screen.getByText("Fajr remaining")).toBeTruthy();
    expect(input().props.value).toBe("12");
  });

  it("uses custom copy when given", async () => {
    await renderModal({
      title: "Roza",
      hint: "Days owed",
      placeholder: "Days",
      accessibilityLabel: "Roza days",
    });

    expect(screen.getByText("Roza")).toBeTruthy();
    expect(screen.getByLabelText("Roza days").props.placeholder).toBe("Days");
  });

  it("keeps only up to five digits", async () => {
    await renderModal();

    await fireEvent.changeText(input(), "12a34567");

    expect(input().props.value).toBe("12345");
  });

  it("saves the parsed count", async () => {
    const { onSubmit } = await renderModal();

    await fireEvent.changeText(input(), "40");
    await save();

    expect(onSubmit).toHaveBeenCalledWith(40);
  });

  it("refuses to save an empty count", async () => {
    const { onSubmit } = await renderModal();

    await fireEvent.changeText(input(), "");
    await save();

    expect(onSubmit).not.toHaveBeenCalled();
  });

  it("cancels", async () => {
    const { onClose } = await renderModal();

    await fireEvent.press(screen.getByText("Cancel"));

    expect(onClose).toHaveBeenCalled();
  });

  it("resets to the initial value when reopened", async () => {
    const { rerender, onSubmit, onClose } = await renderModal();
    await fireEvent.changeText(input(), "99");
    const ui = (visible: boolean) => (
      <QazaCountEditModal
        visible={visible}
        initialValue={12}
        prayerLabel="Fajr"
        onSubmit={onSubmit}
        onClose={onClose}
      />
    );

    await rerender(ui(false));
    await rerender(ui(true));

    expect(input().props.value).toBe("12");
  });
});

describe("QazaCountEditModal on web", () => {
  usePlatform({ OS: "web" });

  it("saves on Enter", async () => {
    const { onSubmit } = await renderModal();

    await fireEvent(input(), "submitEditing");

    expect(onSubmit).toHaveBeenCalledWith(12);
  });
});

describe("QazaCountEditModal on TV", () => {
  usePlatform({ isTV: true });

  it("swaps the keyboard for a D-pad stepper", async () => {
    const { onSubmit } = await renderModal({ prayerLabel: undefined });

    await fireEvent.press(screen.getByText("+100").parent!.parent!);
    await save();

    expect(onSubmit).toHaveBeenCalledWith(112);
  });
});
