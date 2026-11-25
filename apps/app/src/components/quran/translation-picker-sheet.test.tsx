import type { QuranEdition } from "@munib-tracker/shared/types";
import { fireEvent, screen } from "@testing-library/react-native";

import { TranslationPickerSheet } from "@/components/quran/translation-picker-sheet";
import type { TranslationLanguageGroup } from "@/lib/quran-translation-options";
import { renderWithTheme } from "@/test-support/render";

// Shared sheet mock + the visible `title` heading the real Sheet draws.
jest.mock("@/components/ui/sheet", () => {
  const { createElement } = require("react");
  const { Text } = require("react-native");
  const { sheetMock } = require("@/test-support/mocks/sheet");
  return {
    __esModule: true,
    Sheet: ({ title, children, ...props }: { title?: string; children?: unknown }) =>
      createElement(
        sheetMock.Sheet,
        props,
        title ? createElement(Text, null, title) : null,
        children,
      ),
  };
});

jest.mock("@/components/locale-flag", () => {
  const { createElement } = require("react");
  const { View } = require("react-native");
  return {
    LocaleFlag: ({ locale }: { locale: string }) =>
      createElement(View, { testID: `flag-${locale}` }),
  };
});

jest.mock("@/lib/quran-translation-options", () => ({
  getAllQuranTranslations: () => [],
  groupTranslationsByLanguage: () => mockGroups,
  languageForEditionId: (id: string) =>
    mockGroups.flatMap((group) => group.editions).find((edition) => edition.id === id)?.language,
}));

function edition(overrides: Partial<QuranEdition>): QuranEdition {
  return {
    id: "en-pickthall",
    kind: "translation",
    language: "en",
    name: "Pickthall",
    bundled: true,
    direction: "ltr",
    ...overrides,
  };
}

const mockGroups: TranslationLanguageGroup[] = [
  {
    language: "en",
    locale: "en",
    name: "English",
    english: "English",
    editions: [
      edition({}),
      edition({ id: "en-sahih", name: "Sahih International", bundled: false }),
    ],
  },
  {
    language: "ur",
    locale: "ur",
    name: "اردو",
    english: "Urdu",
    editions: [edition({ id: "ur-jalandhry", name: "Jalandhry", language: "ur" })],
  },
  {
    language: "zz",
    locale: null,
    name: "ZZ",
    english: "Zedish",
    editions: [edition({ id: "zz-one", name: "Zed One", language: "zz", bundled: false })],
  },
];

type Props = Parameters<typeof TranslationPickerSheet>[0];

async function renderPicker(overrides: Partial<Props> = {}) {
  const props: Props = {
    visible: true,
    title: "Translation",
    selectedId: "en-sahih",
    onSelect: jest.fn(),
    onClose: jest.fn(),
    ...overrides,
  };
  const utils = await renderWithTheme(<TranslationPickerSheet {...props} />);
  return { ...utils, props };
}

async function openLanguageList() {
  await fireEvent.press(screen.getByLabelText("All languages"));
}

describe("TranslationPickerSheet", () => {
  it("renders nothing while hidden", async () => {
    await renderPicker({ visible: false });
    expect(screen.queryByTestId("sheet")).toBeNull();
  });

  it("lists languages with flags and translation counts", async () => {
    await renderPicker({ selectedId: "missing-id" });
    expect(screen.getByText("Translation")).toBeTruthy();
    expect(screen.getByText("Urdu")).toBeTruthy();
    expect(screen.getByText("2 translations")).toBeTruthy();
    expect(screen.getByTestId("flag-ur")).toBeTruthy();
    expect(screen.queryByTestId("flag-zz")).toBeNull();
  });

  it("omits the None row by default", async () => {
    await renderPicker({ selectedId: "missing-id" });
    expect(screen.queryByText("None")).toBeNull();
  });

  it.each([
    ["", true],
    ["zz-one", false],
  ])("marks the None row selected=%p when selectedId is %p", async (selectedId, selected) => {
    await renderPicker({ allowNone: true, selectedId });
    if (selectedId) await openLanguageList();
    expect(screen.getByRole("button", { name: "None", selected })).toBeTruthy();
  });

  it("selects None", async () => {
    const { props } = await renderPicker({ allowNone: true, selectedId: "" });
    await fireEvent.press(screen.getByText("None"));
    expect(props.onSelect).toHaveBeenCalledWith("");
    expect(props.onClose).toHaveBeenCalled();
  });

  it("filters languages and shows the empty state", async () => {
    await renderPicker({ selectedId: "" });
    const input = screen.getByPlaceholderText("Search languages…");
    await fireEvent.changeText(input, "zed");
    expect(screen.queryByText("English")).toBeNull();
    await fireEvent.changeText(input, "nothing");
    expect(screen.getByText("No languages match your search.")).toBeTruthy();
  });

  it("labels bundled and remote editions", async () => {
    await renderPicker();
    expect(screen.getByText("Choose translator — English")).toBeTruthy();
    expect(screen.getByText("Available offline")).toBeTruthy();
    expect(screen.getByText("Downloads when needed")).toBeTruthy();
  });

  it("filters editions by name", async () => {
    await renderPicker();
    await fireEvent.changeText(screen.getByPlaceholderText("Search translators…"), "sahih");
    expect(screen.queryByText("Pickthall")).toBeNull();
    expect(screen.getByText("Sahih International")).toBeTruthy();
  });

  it("shows the empty state when no edition matches", async () => {
    await renderPicker();
    await fireEvent.changeText(screen.getByPlaceholderText("Search translators…"), "qqq");
    expect(screen.getByText("No languages match your search.")).toBeTruthy();
  });

  it("selects an edition and closes", async () => {
    const { props } = await renderPicker();
    await fireEvent.press(screen.getByText("Pickthall"));
    expect(props.onSelect).toHaveBeenCalledWith("en-pickthall");
    expect(props.onClose).toHaveBeenCalled();
  });

  it("opens a language from the list", async () => {
    await renderPicker({ selectedId: "" });
    await fireEvent.press(screen.getByText("ZZ"));
    expect(screen.getByText("Choose translator — ZZ")).toBeTruthy();
    expect(screen.getByText("Zed One")).toBeTruthy();
  });

  it("clears the search from the clear button", async () => {
    await renderPicker();
    await fireEvent.changeText(screen.getByPlaceholderText("Search translators…"), "sahih");
    await fireEvent.press(screen.getByLabelText("Clear search"));
    expect(screen.getByText("Pickthall")).toBeTruthy();
  });

  it("resets to the language list after closing and reopening", async () => {
    const { props, rerender } = await renderPicker({ selectedId: "" });
    await fireEvent.press(screen.getByText("English"));
    await rerender(<TranslationPickerSheet {...props} visible={false} />);
    await rerender(<TranslationPickerSheet {...props} visible />);
    expect(screen.getByText("Translation")).toBeTruthy();
  });

  it("marks the language holding the selection after going back", async () => {
    await renderPicker({ selectedId: "ur-jalandhry" });
    await openLanguageList();
    expect(screen.getByRole("button", { name: /اردو/, selected: true })).toBeTruthy();
  });
});
