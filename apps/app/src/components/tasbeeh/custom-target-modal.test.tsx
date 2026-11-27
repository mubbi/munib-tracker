import { fireEvent, screen } from "@testing-library/react-native";

import { CustomTargetModal } from "@/components/tasbeeh/custom-target-modal";
import { renderWithTheme } from "@/test-support/render";

jest.mock("@/components/ui/sheet", () => require("@/test-support/mocks/sheet").sheetMock);
// Imported transitively (reading typography → audio provider); never played here.

// The first render warms the theme + i18n graph, which is slow on a busy machine.

type Props = Parameters<typeof CustomTargetModal>[0];

async function renderModal(overrides: Partial<Props> = {}) {
  const props: Props = { visible: true, onSubmit: jest.fn(), onClose: jest.fn(), ...overrides };
  const view = await renderWithTheme(<CustomTargetModal {...props} />);
  return { props, view };
}

const input = () => screen.getByLabelText("e.g. 313");
const submit = async () => await fireEvent.press(screen.getByRole("button", { name: "Set" }));

describe("CustomTargetModal", () => {
  it("shows the prompt", async () => {
    await renderModal();
    expect(screen.getByText("Custom target")).toBeTruthy();
    expect(screen.getByText("How many times would you like to repeat?")).toBeTruthy();
  });

  it.each([
    { initial: 313, value: "313" },
    { initial: undefined, value: "" },
  ])("prefills $initial as '$value'", async ({ initial, value }) => {
    await renderModal({ initial });
    expect(input().props.value).toBe(value);
  });

  it("keeps only up to five digits", async () => {
    await renderModal();
    await fireEvent.changeText(input(), "1a2b34567");
    expect(input().props.value).toBe("12345");
  });

  it("submits the parsed target and closes", async () => {
    const { props } = await renderModal();
    await fireEvent.changeText(input(), "99");
    await submit();
    expect(props.onSubmit).toHaveBeenCalledWith(99);
    expect(props.onClose).toHaveBeenCalledTimes(1);
  });

  it.each(["", "0"])("ignores a target of %j", async (value) => {
    const { props } = await renderModal();
    await fireEvent.changeText(input(), value);
    await submit();
    expect(props.onSubmit).not.toHaveBeenCalled();
    expect(props.onClose).not.toHaveBeenCalled();
  });

  it("closes on cancel", async () => {
    const { props } = await renderModal();
    await fireEvent.press(screen.getByRole("button", { name: "Cancel" }));
    expect(props.onClose).toHaveBeenCalledTimes(1);
  });

  it("resets the draft when reopened", async () => {
    const { props, view } = await renderModal({ initial: 50 });
    await fireEvent.changeText(input(), "7");
    await view.rerender(<CustomTargetModal {...props} visible={false} />);
    await view.rerender(<CustomTargetModal {...props} visible initial={21} />);
    expect(input().props.value).toBe("21");
  });
});
