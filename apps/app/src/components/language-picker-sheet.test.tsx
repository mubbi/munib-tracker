import { fireEvent, screen } from "@testing-library/react-native";

import { LanguagePickerSheet, LanguageSelectRow } from "@/components/language-picker-sheet";
import { APP_LOCALES } from "@/lib/locale-display";
import { resetMockWindowSize, setMockWindowSize } from "@/test-support/mocks/use-window-dimensions";
import { usePlatform } from "@/test-support/platform";
import { renderWithTheme } from "@/test-support/render";

jest.mock("@/components/ui/sheet", () => require("@/test-support/mocks/sheet").sheetMock);
jest.mock(
  "react-native/Libraries/Utilities/useWindowDimensions",
  () => require("@/test-support/mocks/use-window-dimensions").useWindowDimensionsMock,
);

type Props = Parameters<typeof LanguagePickerSheet>[0];

const TOTAL = APP_LOCALES.length;
const ENGLISH = APP_LOCALES.find((entry) => entry.code === "en")!;
const ARABIC = APP_LOCALES.find((entry) => entry.code === "ar")!;

const renderSheet = async (props: Partial<Props> = {}) => {
  const handlers = { onSelect: jest.fn(), onClose: jest.fn() };
  const view = await renderWithTheme(
    <LanguagePickerSheet visible value="en" {...handlers} {...props} />,
  );
  return { ...handlers, ...view };
};

const search = (query: string) =>
  fireEvent.changeText(screen.getByPlaceholderText("Search languages…"), query);

/** The pressable row (role=button) that contains a language's name. */
const row = (name: string) => {
  let node = screen.getByText(name).parent;
  while (node && node.props.accessibilityRole !== "button") node = node.parent;
  return node!;
};

afterEach(resetMockWindowSize);

describe("LanguagePickerSheet", () => {
  it("titles the sheet with every language", async () => {
    await renderSheet();

    expect(screen.getByText(`Choose a language (${TOTAL} of ${TOTAL})`)).toBeTruthy();
  });

  it("marks the current language as selected", async () => {
    await renderSheet();
    await search("english");

    expect(row(ENGLISH.name).props.accessibilityState).toEqual({ selected: true });
  });

  it("filters languages and counts the matches", async () => {
    await renderSheet();

    await search("arab");

    expect(screen.getByText(ARABIC.name)).toBeTruthy();
    expect(screen.getByText(`Choose a language (1 of ${TOTAL})`)).toBeTruthy();
  });

  it("explains when nothing matches", async () => {
    await renderSheet();

    await search("zzzz");

    expect(screen.getByText("No languages match your search.")).toBeTruthy();
  });

  it("clears the search", async () => {
    await renderSheet();
    await search("arab");

    await fireEvent.press(screen.getByLabelText("Clear search"));

    expect(screen.getByText(`Choose a language (${TOTAL} of ${TOTAL})`)).toBeTruthy();
  });

  it("selects a language and closes", async () => {
    const { onSelect, onClose } = await renderSheet();
    await search("arab");

    await fireEvent.press(row(ARABIC.name));

    expect(onSelect).toHaveBeenCalledWith("ar");
    expect(onClose).toHaveBeenCalled();
  });

  it("annotates scripture availability when asked", async () => {
    await renderSheet({ showScriptureStatus: true });
    await search("english");

    expect(screen.getByText(/Qur'an translation available|UI only/)).toBeTruthy();
  });

  it("forgets the search when hidden", async () => {
    const { rerender, onSelect, onClose } = await renderSheet();
    await search("arab");
    const ui = (visible: boolean) => (
      <LanguagePickerSheet visible={visible} value="en" onSelect={onSelect} onClose={onClose} />
    );

    await rerender(ui(false));
    await rerender(ui(true));

    expect(screen.getByPlaceholderText("Search languages…").props.value).toBe("");
  });

  it("lays languages out in two columns on wide windows", async () => {
    setMockWindowSize(1024);
    await renderSheet();

    expect(screen.getByText(`Choose a language (${TOTAL} of ${TOTAL})`)).toBeTruthy();
  });
});

describe("LanguagePickerSheet on TV", () => {
  usePlatform({ isTV: true });

  it("drops the search field and focuses the current language", async () => {
    await renderSheet();

    expect(screen.queryByPlaceholderText("Search languages…")).toBeNull();
    expect(row(ENGLISH.name).props.hasTVPreferredFocus).toBe(true);
  });
});

describe("LanguageSelectRow", () => {
  it("shows the language's native name and opens the picker", async () => {
    const onPress = jest.fn();
    await renderWithTheme(
      <LanguageSelectRow locale="ar" accessibilityLabel="App language" onPress={onPress} />,
    );

    await fireEvent.press(screen.getByLabelText("App language"));

    expect(screen.getByText(ARABIC.name)).toBeTruthy();
    expect(onPress).toHaveBeenCalled();
  });
});
