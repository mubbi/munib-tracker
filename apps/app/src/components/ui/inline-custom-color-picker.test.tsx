import { act, screen } from "@testing-library/react-native";

import { InlineCustomColorPicker } from "@/components/ui/inline-custom-color-picker";
import { ancestorProps } from "@/test-support/fiber";
import { renderWithTheme } from "@/test-support/render";

type PickerProps = { value: string; onChangeJS: (color: { hex: string }) => void };

/** The global `reanimated-color-picker` mock renders a View; read the props it was given. */
const pickerProps = () =>
  ancestorProps<PickerProps>(
    screen.getByTestId("color-picker-mock"),
    (props) => "onChangeJS" in props,
  );

const renderPicker = async (value: string) => {
  const onChange = jest.fn();
  const ui = (next: string) => <InlineCustomColorPicker value={next} onChange={onChange} />;
  const { rerender } = await renderWithTheme(ui(value));
  return {
    onChange,
    setValue: (next: string) => rerender(ui(next)),
    pick: (hex: string) => act(async () => pickerProps().onChangeJS({ hex })),
  };
};

describe("InlineCustomColorPicker", () => {
  it("seeds the picker and label from the value", async () => {
    await renderPicker("#12ab34");

    expect(screen.getByText("#12AB34")).toBeTruthy();
    expect(pickerProps().value.toLowerCase()).toBe("#12ab34");
  });

  it("reports picked colours and updates the label", async () => {
    const { onChange, pick } = await renderPicker("#12ab34");

    await pick("#ff0000");

    expect(onChange).toHaveBeenCalledWith("#ff0000");
    expect(screen.getByText("#FF0000")).toBeTruthy();
  });

  it("does not re-seed the picker for the echo of its own colour", async () => {
    const { pick, setValue } = await renderPicker("#12ab34");

    await pick("#ff0000");
    await setValue("#ff0000");

    expect(pickerProps().value.toLowerCase()).toBe("#12ab34");
  });

  it("re-seeds the picker for genuine external changes", async () => {
    const { setValue } = await renderPicker("#12ab34");

    await setValue("#0000ff");

    expect(pickerProps().value.toLowerCase()).toBe("#0000ff");
    expect(screen.getByText("#0000FF")).toBeTruthy();
  });
});
