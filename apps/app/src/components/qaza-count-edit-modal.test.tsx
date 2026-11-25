import { fireEvent, screen } from "@testing-library/react-native";

import { QazaCountEditModal } from "@/components/qaza-count-edit-modal";
import { usePlatform } from "@/test-support/platform";
import { parentOf } from "@/test-support/queries";
import { renderWithTheme } from "@/test-support/render";

jest.mock("@/components/ui/sheet", () => require("@/test-support/mocks/sheet").sheetMock);

type Props = Parameters<typeof QazaCountEditModal>[0];

const renderModal = async (props: Partial<Props> = {}) => {
  const handlers = {
    onStep: jest.fn(),
    onSubmit: jest.fn(),
    onReset: jest.fn(),
    onClose: jest.fn(),
  };
  const view = await renderWithTheme(
    <QazaCountEditModal visible initialValue={12} prayerLabel="Fajr" {...handlers} {...props} />,
  );
  return { ...handlers, ...view };
};

const field = () => screen.getByLabelText("Set remaining to");
const save = () => fireEvent.press(screen.getByText("Save"));

describe("QazaCountEditModal", () => {
  it("steps the count instantly with no confirmation", async () => {
    const { onStep } = await renderModal();

    await fireEvent.press(screen.getByLabelText("Increase Fajr remaining"));

    expect(onStep).toHaveBeenCalledWith(13);
    expect(screen.queryByText("Confirm")).toBeNull();
  });

  it("counts every quick tap even before the store has caught up (B-07)", async () => {
    const { onStep, rerender } = await renderModal();
    const plus = () => fireEvent.press(screen.getByLabelText("Increase Fajr remaining"));

    // The parent's write has not landed yet: initialValue is still 12.
    await plus();
    await plus();
    expect(onStep.mock.calls.map(([n]) => n)).toEqual([13, 14]);
    expect(screen.getByText("14")).toBeTruthy();

    // The store catches up through 13, then 14; the next tap builds on it.
    const props = { onStep, onSubmit: jest.fn(), onClose: jest.fn(), prayerLabel: "Fajr" };
    await rerender(<QazaCountEditModal visible initialValue={13} {...props} />);
    expect(screen.getByText("14")).toBeTruthy();
    await rerender(<QazaCountEditModal visible initialValue={14} {...props} />);
    await fireEvent.press(screen.getByLabelText("Decrease Fajr remaining"));
    expect(onStep).toHaveBeenLastCalledWith(13);
  });

  it("never saves an exact value above the maximum (B-03)", async () => {
    const { onSubmit } = await renderModal();

    await fireEvent.changeText(field(), "100000");
    await save();

    expect(onSubmit).not.toHaveBeenCalled();
    expect(field().props.value).toBe("100,000");
    expect(screen.getByText("Enter a number from 0 to 99,999")).toBeTruthy();
  });

  it("saves 0 as a real exact value", async () => {
    const { onSubmit } = await renderModal();

    await fireEvent.changeText(field(), "0");
    await save();

    expect(onSubmit).toHaveBeenCalledWith(0);
  });

  it("saves an exact number typed into the field", async () => {
    const { onSubmit } = await renderModal();

    await fireEvent.changeText(field(), "40");
    await save();

    expect(onSubmit).toHaveBeenCalledWith(40);
  });

  it("keeps Save off until the value differs from the current count", async () => {
    const { onSubmit } = await renderModal();

    await fireEvent.changeText(field(), "12");
    await save();

    expect(onSubmit).not.toHaveBeenCalled();
  });

  it("hands the reset to the parent (which confirms it)", async () => {
    const { onReset } = await renderModal({ resetLabel: "Reset Fajr qaza counter" });

    await fireEvent.press(screen.getByText("Reset Fajr qaza counter"));

    expect(onReset).toHaveBeenCalled();
  });

  it("closes with Done", async () => {
    const { onClose } = await renderModal();

    await fireEvent.press(screen.getByText("Done"));

    expect(onClose).toHaveBeenCalled();
  });
});

describe("QazaCountEditModal on TV", () => {
  usePlatform({ isTV: true });

  it("swaps the keyboard for a D-pad stepper that applies at once", async () => {
    const { onStep } = await renderModal();

    await fireEvent.press(parentOf(screen.getByText("+100"), 2));

    expect(onStep).toHaveBeenCalledWith(112);
    expect(screen.queryByLabelText("Set remaining to")).toBeNull();
  });

  it("adds up repeated D-pad presses before the store updates (B-07)", async () => {
    const { onStep } = await renderModal();
    const plus100 = () => fireEvent.press(parentOf(screen.getByText("+100"), 2));

    await plus100();
    await plus100();

    expect(onStep.mock.calls.map(([n]) => n)).toEqual([112, 212]);
  });
});
