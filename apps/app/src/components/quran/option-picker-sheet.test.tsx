import { fireEvent, screen } from "@testing-library/react-native";

import { OptionPickerSheet, SelectTrigger } from "@/components/quran/option-picker-sheet";
import { usePlatform } from "@/test-support/platform";
import { renderWithTheme } from "@/test-support/render";

jest.mock("@/components/ui/sheet", () => require("@/test-support/mocks/sheet").sheetMock);

const OPTIONS = [
  { id: "alafasy", label: "Mishary Alafasy", subtitle: "Murattal" },
  { id: "husary", label: "Mahmoud Husary" },
];

type TriggerProps = Parameters<typeof SelectTrigger>[0];
type SheetProps = Parameters<typeof OptionPickerSheet>[0];

async function renderTrigger(overrides: Partial<TriggerProps> = {}) {
  const props: TriggerProps = {
    label: "Alafasy",
    accessibilityLabel: "Reciter",
    onPress: jest.fn(),
    ...overrides,
  };
  await renderWithTheme(<SelectTrigger {...props} />);
  return props;
}

async function renderSheet(overrides: Partial<SheetProps> = {}) {
  const props: SheetProps = {
    visible: true,
    title: "Reciter",
    options: OPTIONS,
    selectedId: "alafasy",
    onSelect: jest.fn(),
    onClose: jest.fn(),
    ...overrides,
  };
  await renderWithTheme(<OptionPickerSheet {...props} />);
  return props;
}

describe("SelectTrigger", () => {
  it("shows its label and fires onPress", async () => {
    const props = await renderTrigger();
    expect(screen.getByText("Alafasy")).toBeTruthy();
    await fireEvent.press(screen.getByRole("button", { name: "Reciter" }));
    expect(props.onPress).toHaveBeenCalledTimes(1);
  });

  it.each([
    [false, false],
    [true, true],
  ])("reports active=%p as selected=%p", async (active, selected) => {
    await renderTrigger({ active });
    expect(screen.getByRole("button", { name: "Reciter", selected })).toBeTruthy();
  });

  describe("on TV", () => {
    usePlatform({ isTV: true });

    it("still renders the active trigger", async () => {
      await renderTrigger({ active: true });
      expect(screen.getByRole("button", { name: "Reciter", selected: true })).toBeTruthy();
    });
  });
});

describe("OptionPickerSheet", () => {
  it("renders nothing while hidden", async () => {
    await renderSheet({ visible: false });
    expect(screen.queryByText("Reciter")).toBeNull();
  });

  it("names the choice group by the title and shows option subtitles", async () => {
    await renderSheet();
    expect(screen.getByLabelText("Reciter").props.accessibilityRole).toBe("radiogroup");
    expect(screen.getByText("Murattal")).toBeTruthy();
  });

  it.each([
    ["Mishary Alafasy", true],
    ["Mahmoud Husary", false],
  ])("marks %p selected=%p", async (name, selected) => {
    await renderSheet();
    expect(screen.getByRole("radio", { name, checked: selected })).toBeTruthy();
  });

  it("selects an option and closes", async () => {
    const props = await renderSheet();
    await fireEvent.press(screen.getByLabelText("Mahmoud Husary"));
    expect(props.onSelect).toHaveBeenCalledWith("husary");
    expect(props.onClose).toHaveBeenCalled();
  });

  describe("on TV", () => {
    usePlatform({ isTV: true });

    it("gives the selected row preferred focus", async () => {
      await renderSheet();
      expect(screen.getByLabelText("Mishary Alafasy").props.hasTVPreferredFocus).toBe(true);
    });
  });
});
