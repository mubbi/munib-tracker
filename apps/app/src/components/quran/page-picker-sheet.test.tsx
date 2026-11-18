import { fireEvent, screen } from "@testing-library/react-native";

import { PagePickerSheet } from "@/components/quran/page-picker-sheet";
import type { PageListEntry } from "@/lib/quran";
import { usePlatform } from "@/test-support/platform";
import { renderWithTheme } from "@/test-support/render";

jest.mock("@/components/ui/sheet", () => require("@/test-support/mocks/sheet").sheetMock);

// `PAGE_LIST` is read at import time, so the fixture rows live inside the factory.
jest.mock("@/lib/quran", () => {
  const fatihah = {
    surah: 1,
    surahNameEnglish: "The Opening",
    surahNameArabic: "الفاتحة",
    surahNameTransliteration: "Al-Fatihah",
  };
  const baqarah = {
    surah: 2,
    surahNameEnglish: "The Cow",
    surahNameArabic: "البقرة",
    surahNameTransliteration: "Al-Baqarah",
  };
  const pages: PageListEntry[] = [
    { page: 1, ayah: 1, juz: 1, ...fatihah },
    { page: 2, ayah: 1, juz: 1, ...baqarah },
    { page: 12, ayah: 77, juz: 1, ...baqarah },
  ];
  return { getPageList: () => pages };
});

type Props = Parameters<typeof PagePickerSheet>[0];

async function renderSheet(overrides: Partial<Props> = {}) {
  const props: Props = {
    visible: true,
    selectedPage: 2,
    onSelect: jest.fn(),
    onClose: jest.fn(),
    ...overrides,
  };
  await renderWithTheme(<PagePickerSheet {...props} />);
  return props;
}

async function search(query: string) {
  await fireEvent.changeText(screen.getByPlaceholderText("Search page or surah…"), query);
}

describe("PagePickerSheet", () => {
  it("lists every page with its surah, ayah and juz", async () => {
    await renderSheet();
    expect(screen.getByText("Jump to page")).toBeTruthy();
    expect(screen.getByText("Page 12")).toBeTruthy();
    expect(screen.getByText("Al-Baqarah · 2:77 · Juz 1")).toBeTruthy();
  });

  it("marks the current page as selected", async () => {
    await renderSheet({ selectedPage: 12 });
    expect(screen.getByRole("button", { name: /Page 12/, selected: true })).toBeTruthy();
    expect(screen.getByRole("button", { name: /Page 2 /, selected: false })).toBeTruthy();
  });

  it.each([
    ["12", ["Page 12"], ["Page 2"]],
    ["cow", ["Page 2", "Page 12"], ["Page 1"]],
    ["fatihah", ["Page 1"], ["Page 12"]],
    ["   ", ["Page 1", "Page 2", "Page 12"], []],
  ])("filters by %p", async (query, shown, hidden) => {
    await renderSheet();
    await search(query);
    for (const label of shown) expect(screen.getByText(label)).toBeTruthy();
    for (const label of hidden) expect(screen.queryByText(label)).toBeNull();
  });

  it("selects a page and closes", async () => {
    const props = await renderSheet();
    await fireEvent.press(screen.getByText("Page 12"));
    expect(props.onSelect).toHaveBeenCalledWith(12);
    expect(props.onClose).toHaveBeenCalled();
  });

  describe("on TV", () => {
    usePlatform({ isTV: true });

    it("gives the current page preferred focus", async () => {
      await renderSheet({ selectedPage: 2 });
      const current = screen.getByRole("button", { name: /Page 2 /, selected: true });
      expect(current.props.hasTVPreferredFocus).toBe(true);
    });
  });
});
