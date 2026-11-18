import type { QuranTafsirEditionDef } from "@munib-tracker/shared/i18n";
import { fireEvent, screen } from "@testing-library/react-native";

import { TafsirPickerSheet } from "@/components/quran/tafsir-picker-sheet";
import type { TafsirLanguageGroup } from "@/lib/quran-tafsir-options";
import { renderWithTheme } from "@/test-support/render";

jest.mock("@/components/ui/sheet", () => require("@/test-support/mocks/sheet").sheetMock);

jest.mock("@/components/locale-flag", () => {
  const { createElement } = require("react");
  const { View } = require("react-native");
  return {
    LocaleFlag: ({ locale }: { locale: string }) =>
      createElement(View, { testID: `flag-${locale}` }),
  };
});

jest.mock("@/lib/quran-tafsir-options", () => ({
  getAllTafsirEditions: () => [],
  groupTafsirsByLanguage: () => mockGroups,
  languageForTafsirId: (id: string) =>
    mockGroups.flatMap((group) => group.editions).find((edition) => edition.id === id)?.language,
}));

function edition(overrides: Partial<QuranTafsirEditionDef>): QuranTafsirEditionDef {
  return {
    id: "en-ibn-kathir",
    provider: "spa5k",
    slug: "ibn-kathir",
    name: "Ibn Kathir (abridged)",
    author: "Hafiz Ibn Kathir",
    language: "en",
    direction: "ltr",
    ...overrides,
  };
}

const mockGroups: TafsirLanguageGroup[] = [
  {
    language: "en",
    locale: "en",
    name: "English",
    english: "English",
    editions: [
      edition({}),
      edition({ id: "en-maarif", name: "Maarif al-Quran", author: "Mufti Shafi" }),
    ],
  },
  {
    language: "ur",
    locale: "ur",
    name: "اردو",
    english: "Urdu",
    editions: [
      edition({ id: "ur-bayan", name: "Bayan ul Quran", author: "Dr Israr", language: "ur" }),
    ],
  },
  {
    language: "zz",
    locale: null,
    name: "ZZ",
    english: "Zedish",
    editions: [edition({ id: "zz-tafsir", name: "Zed Commentary", author: "Zed", language: "zz" })],
  },
];

type Props = Parameters<typeof TafsirPickerSheet>[0];

async function renderPicker(overrides: Partial<Props> = {}) {
  const props: Props = {
    visible: true,
    title: "Tafsir",
    selectedId: "",
    onSelect: jest.fn(),
    onClose: jest.fn(),
    ...overrides,
  };
  const utils = await renderWithTheme(<TafsirPickerSheet {...props} />);
  return { ...utils, props };
}

describe("TafsirPickerSheet", () => {
  it("renders nothing while hidden", async () => {
    await renderPicker({ visible: false });
    expect(screen.queryByTestId("sheet")).toBeNull();
  });

  it("lists each language with its native name, secondary label and edition count", async () => {
    await renderPicker();
    expect(screen.getByText("Tafsir")).toBeTruthy();
    expect(screen.getByText("Urdu")).toBeTruthy();
    expect(screen.getByText("2 tafsirs")).toBeTruthy();
    expect(screen.getAllByText("1 tafsir")).toHaveLength(2);
  });

  it("shows a flag only for languages with an app locale", async () => {
    await renderPicker();
    expect(screen.getByTestId("flag-en")).toBeTruthy();
    expect(screen.getByText("Zedish")).toBeTruthy();
    expect(screen.queryByTestId("flag-zz")).toBeNull();
  });

  it("selects None from the header row", async () => {
    const { props } = await renderPicker();
    await fireEvent.press(screen.getByRole("button", { name: "Select tafsir", selected: true }));
    expect(props.onSelect).toHaveBeenCalledWith("");
    expect(props.onClose).toHaveBeenCalled();
  });

  it("hides the None row when allowNone is false", async () => {
    await renderPicker({ allowNone: false, preferredLanguages: ["ur"] });
    expect(screen.queryByText("Select tafsir")).toBeNull();
  });

  it.each([
    ["urdu", "Urdu", "English"],
    ["zed", "Zedish", "Urdu"],
  ])("filters languages by %p", async (query, kept, dropped) => {
    await renderPicker();
    await fireEvent.changeText(screen.getByPlaceholderText("Search languages…"), query);
    expect(screen.getByText(kept)).toBeTruthy();
    expect(screen.queryByText(dropped)).toBeNull();
  });

  it("shows the empty state when no language matches", async () => {
    await renderPicker();
    await fireEvent.changeText(screen.getByPlaceholderText("Search languages…"), "nothing");
    expect(screen.getByText("No languages match your search.")).toBeTruthy();
  });

  it("clears the search from the clear button", async () => {
    await renderPicker();
    await fireEvent.changeText(screen.getByPlaceholderText("Search languages…"), "urdu");
    await fireEvent.press(screen.getByLabelText("Clear search"));
    expect(screen.getByText("English")).toBeTruthy();
    expect(screen.queryByLabelText("Clear search")).toBeNull();
  });

  it("drills into a language to list its editions by author", async () => {
    await renderPicker();
    await fireEvent.press(screen.getByText("English"));
    expect(screen.getByText("Choose tafsir — English")).toBeTruthy();
    expect(screen.getByText("Mufti Shafi")).toBeTruthy();
  });

  it.each([
    ["shafi", "Maarif al-Quran", "Ibn Kathir (abridged)"],
    ["ibn", "Ibn Kathir (abridged)", "Maarif al-Quran"],
  ])("filters editions by name or author %p", async (query, kept, dropped) => {
    await renderPicker();
    await fireEvent.press(screen.getByText("English"));
    await fireEvent.changeText(screen.getByPlaceholderText("Search authors…"), query);
    expect(screen.getByText(kept)).toBeTruthy();
    expect(screen.queryByText(dropped)).toBeNull();
  });

  it("shows the empty state when no edition matches", async () => {
    await renderPicker();
    await fireEvent.press(screen.getByText("English"));
    await fireEvent.changeText(screen.getByPlaceholderText("Search authors…"), "qqq");
    expect(screen.getByText("No languages match your search.")).toBeTruthy();
  });

  it("selects an edition and closes", async () => {
    const { props } = await renderPicker();
    await fireEvent.press(screen.getByText("English"));
    await fireEvent.press(screen.getByText("Maarif al-Quran"));
    expect(props.onSelect).toHaveBeenCalledWith("en-maarif");
    expect(props.onClose).toHaveBeenCalled();
  });

  it("opens on the selected edition's language", async () => {
    await renderPicker({ selectedId: "ur-bayan" });
    expect(screen.getByText("Choose tafsir — اردو")).toBeTruthy();
    expect(screen.getByRole("button", { name: /Bayan ul Quran/, selected: true })).toBeTruthy();
  });

  it("stays on the language list for an unknown selection", async () => {
    await renderPicker({ selectedId: "missing-id" });
    expect(screen.getByText("Tafsir")).toBeTruthy();
    expect(screen.getByRole("button", { name: "Select tafsir", selected: false })).toBeTruthy();
  });

  it("goes back to languages and marks the one holding the selection", async () => {
    await renderPicker({ selectedId: "ur-bayan" });
    await fireEvent.press(screen.getByLabelText("All languages"));
    expect(screen.getByRole("button", { name: /اردو/, selected: true })).toBeTruthy();
  });

  it("resets to the language list after closing and reopening", async () => {
    const { props, rerender } = await renderPicker();
    await fireEvent.press(screen.getByText("English"));
    await rerender(<TafsirPickerSheet {...props} visible={false} />);
    await rerender(<TafsirPickerSheet {...props} visible />);
    expect(screen.getByText("Tafsir")).toBeTruthy();
  });
});
