import { fireEvent, screen } from "@testing-library/react-native";

import { NumberFormatPickerSheet } from "@/components/zakat/number-format-picker-sheet";
import { usePlatform } from "@/test-support/platform";
import { renderWithTheme } from "@/test-support/render";

jest.mock("@/components/ui/sheet", () => require("@/test-support/mocks/sheet").sheetMock);

type Props = Parameters<typeof NumberFormatPickerSheet>[0];

async function renderPicker(overrides: Partial<Props> = {}) {
  const props: Props = {
    visible: true,
    selected: "comma_dot",
    onSelect: jest.fn(),
    onClose: jest.fn(),
    ...overrides,
  };
  await renderWithTheme(<NumberFormatPickerSheet {...props} />);
  return props;
}

describe("NumberFormatPickerSheet", () => {
  it("marks the selected style", async () => {
    await renderPicker({ selected: "dot_comma" });
    expect(screen.getByLabelText("1.000,00 22.000,03").props.accessibilityState).toEqual({
      selected: true,
    });
  });

  it("selects a style and closes", async () => {
    const props = await renderPicker();
    await fireEvent.press(screen.getByLabelText("1 000,00 22 000,03"));
    expect(props.onSelect).toHaveBeenCalledWith("space_comma");
    expect(props.onClose).toHaveBeenCalled();
  });

  it("prefixes examples with the currency symbol", async () => {
    await renderPicker({ currencySymbol: "$" });
    expect(screen.getAllByText("$")).toHaveLength(4);
  });

  it("uses the currency glyph instead of a symbol when given", async () => {
    await renderPicker({ currencySymbol: "$", currencyGlyph: "AED" });
    expect(screen.queryByText("$")).toBeNull();
  });

  it("renders nothing while hidden", async () => {
    await renderPicker({ visible: false });
    expect(screen.queryByText("Number format")).toBeNull();
  });

  describe("on TV", () => {
    usePlatform({ isTV: true });

    it("still lists every style", async () => {
      await renderPicker();
      expect(screen.getAllByRole("button")).toHaveLength(5);
    });
  });
});
