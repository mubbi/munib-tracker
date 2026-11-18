import { fireEvent, screen } from "@testing-library/react-native";

import { CurrencyPickerSheet } from "@/components/zakat/currency-picker-sheet";
import { usePlatform } from "@/test-support/platform";
import { renderWithTheme } from "@/test-support/render";

jest.mock("@/components/ui/sheet", () => require("@/test-support/mocks/sheet").sheetMock);

type Props = Parameters<typeof CurrencyPickerSheet>[0];

async function renderPicker(overrides: Partial<Props> = {}) {
  const props: Props = {
    visible: true,
    selectedCode: "EUR",
    onSelect: jest.fn(),
    onClose: jest.fn(),
    ...overrides,
  };
  const utils = await renderWithTheme(<CurrencyPickerSheet {...props} />);
  return { props, utils };
}

const SEARCH = "Search currencies…";

describe("CurrencyPickerSheet", () => {
  it("lists the selected currency first and marks it selected", async () => {
    await renderPicker();
    const rows = screen.getAllByRole("button", { selected: true });
    expect(rows).toHaveLength(1);
    expect(rows[0].props.accessibilityLabel).toBe("EUR Euro");
  });

  it("selects a currency and closes", async () => {
    const { props } = await renderPicker();
    await fireEvent.press(screen.getByLabelText("USD US Dollar"));
    expect(props.onSelect).toHaveBeenCalledWith("USD");
    expect(props.onClose).toHaveBeenCalled();
  });

  it("filters by fuzzy search", async () => {
    await renderPicker();
    await fireEvent.changeText(screen.getByLabelText(SEARCH), "Pound");
    expect(screen.getByLabelText("GBP British Pound")).toBeTruthy();
    expect(screen.queryByLabelText("USD US Dollar")).toBeNull();
  });

  it("shows an empty state when nothing matches", async () => {
    await renderPicker();
    await fireEvent.changeText(screen.getByLabelText(SEARCH), "zzzzqqq");
    expect(screen.getByText("No currencies match your search.")).toBeTruthy();
  });

  it("clears the search when hidden", async () => {
    const { props, utils } = await renderPicker();
    await fireEvent.changeText(screen.getByLabelText(SEARCH), "Pound");
    await utils.rerender(<CurrencyPickerSheet {...props} visible={false} />);
    await utils.rerender(<CurrencyPickerSheet {...props} visible />);
    expect(screen.getByLabelText(SEARCH).props.value).toBe("");
  });

  it("falls back gracefully for an unknown selected code", async () => {
    await renderPicker({ selectedCode: "XXX" });
    expect(screen.queryAllByRole("button", { selected: true })).toHaveLength(0);
  });

  describe("on TV", () => {
    usePlatform({ isTV: true });

    it("focuses the selected currency", async () => {
      await renderPicker({ selectedCode: "AED" });
      expect(screen.getByLabelText("AED UAE Dirham").props.accessibilityState).toEqual(
        expect.objectContaining({ selected: true }),
      );
    });
  });
});
