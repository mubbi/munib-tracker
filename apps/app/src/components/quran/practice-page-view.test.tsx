import { fireEvent, screen } from "@testing-library/react-native";

import { PracticePageView } from "@/components/quran/practice-page-view";
import { getAyahsOnPage, getPageLayout, getSurahByNumber } from "@/lib/quran";
import { type MushafToken, mapMushafTokens } from "@/lib/quran-companion/mushaf-tokens";
import type { WordState } from "@/lib/quran-companion/types";
import { iosInlineAyahMarker } from "@/lib/reading-typography";
import { buildAyah, buildMushafPageLayout } from "@/test-support/fixtures/quran";
import { renderWithTheme } from "@/test-support/render";
import { flattenStyle } from "@/test-support/style";

jest.mock("@/lib/quran", () => ({
  ...jest.requireActual("@/lib/quran"),
  getAyahsOnPage: jest.fn(),
  getPageLayout: jest.fn(),
}));

jest.mock("@/lib/quran-companion/mushaf-tokens", () => ({ mapMushafTokens: jest.fn() }));

// The glyph renderer has its own tests; here it just draws each line through the callback.
jest.mock("@/components/quran/mushaf-line-renderer", () => {
  const { View } = require("react-native");
  return {
    MushafLineRenderer: ({
      layout,
      renderLineGlyphs,
    }: {
      layout: { lines: unknown[] };
      renderLineGlyphs: (lineIndex: number, glyphs: string) => unknown;
    }) => <View>{layout.lines.map((_line, i) => renderLineGlyphs(i, ""))}</View>,
  };
});

const WORDS: Record<number, string[]> = { 6: ["ٱهْدِنَا", "ٱلصِّرَٰطَ", "ٱلْمُسْتَقِيمَ"] };

const PAGE_AYAHS = [
  buildAyah({ ayah: 6, arabic: "fatihah-6" }),
  buildAyah({ ayah: 7, arabic: "fatihah-7" }),
  buildAyah({ surah: 2, ayah: 1, arabic: "baqarah-1" }),
];

type ViewProps = Parameters<typeof PracticePageView>[0];

type ViewOptions = Partial<ViewProps> & {
  states?: WordState[];
  hidden?: number[];
};

async function renderPage({ states = [], hidden = [], ...props }: ViewOptions = {}) {
  const onAyahPress = jest.fn();
  await renderWithTheme(
    <PracticePageView
      view="page"
      page={1}
      surah={1}
      passageAyahs={[6, 7]}
      currentAyah={6}
      wordsOf={(ayah) => WORDS[ayah] ?? null}
      statesOf={() => states}
      hiddenOf={(ayah) => new Set(ayah === 6 ? hidden : [])}
      activeWord={null}
      surahWordCounts={null}
      arabicSize={28}
      onAyahPress={onAyahPress}
      {...props}
    />,
  );
  return { onAyahPress };
}

const styleOf = (text: string) => flattenStyle(screen.getByText(text).props.style);

beforeEach(() => {
  jest.mocked(getAyahsOnPage).mockReturnValue(PAGE_AYAHS);
  jest.mocked(getPageLayout).mockReturnValue(buildMushafPageLayout());
});

describe("PracticePageView — page view", () => {
  it("shows the passage's study words and other ayahs as plain text", async () => {
    await renderPage();
    for (const word of WORDS[6]) expect(screen.getByText(word)).toBeTruthy();
    expect(screen.getByText("fatihah-7")).toBeTruthy();
    expect(screen.getByText("baqarah-1")).toBeTruthy();
  });

  it("opens a surah banner only where a surah starts on the page", async () => {
    await renderPage();
    const banner = (surah: number) => getSurahByNumber(surah)?.nameArabic ?? "";
    expect(screen.getByText(banner(2))).toBeTruthy();
    expect(screen.queryByText(banner(1))).toBeNull();
  });

  it("jumps to a passage ayah on tap", async () => {
    const { onAyahPress } = await renderPage();
    await fireEvent.press(screen.getByLabelText("1:7"));
    expect(onAyahPress).toHaveBeenCalledWith(7);
  });

  it("does not jump to an ayah outside the passage", async () => {
    const { onAyahPress } = await renderPage();
    await fireEvent.press(screen.getByLabelText("2:1"));
    expect(onAyahPress).not.toHaveBeenCalled();
  });

  it("keeps the ayah markers visible", async () => {
    await renderPage();
    expect(screen.getByText(iosInlineAyahMarker(6))).toBeTruthy();
    expect(screen.getByText(iosInlineAyahMarker(1))).toBeTruthy();
  });

  it("dims ayahs outside the passage", async () => {
    await renderPage();
    expect(styleOf("baqarah-1").color).not.toEqual(styleOf("fatihah-7").color);
  });

  it("blanks hidden words but keeps their width", async () => {
    await renderPage({ hidden: [1] });
    expect(styleOf(WORDS[6][1])).toMatchObject({ color: "transparent" });
    expect(styleOf(WORDS[6][0]).color).not.toBe("transparent");
  });

  it("accents the word the reciter is on", async () => {
    await renderPage({ activeWord: 2 });
    expect(styleOf(WORDS[6][2]).color).toEqual(expect.any(String));
    expect(styleOf(WORDS[6][2]).backgroundColor).not.toEqual(styleOf(WORDS[6][0]).backgroundColor);
  });

  it("colours words by their practice state", async () => {
    await renderPage({ states: ["upcoming", "uncertain", "confirmedMismatch"] });
    const colors = WORDS[6].map((word) => styleOf(word).color);
    expect(new Set(colors).size).toBe(3);
  });

  it("tints matched words of the current ayah only", async () => {
    await renderPage({ currentAyah: 7, states: ["matched"] });
    expect(styleOf(WORDS[6][0])).toEqual({});
  });

  it("uses the chosen Arabic font family", async () => {
    await renderPage({ arabicFontFamily: "Amiri" });
    let node = screen.getByText("baqarah-1").parent;
    while (node && !flattenStyle(node.props.style).fontFamily) node = node.parent;
    expect(flattenStyle(node?.props.style).fontFamily).toBe("Amiri");
  });
});

describe("PracticePageView — mushaf view", () => {
  const token = (overrides: Partial<MushafToken>): MushafToken => ({
    text: "x",
    ayah: 6,
    word: 0,
    end: false,
    ...overrides,
  });

  function mapTokens(tokens: MushafToken[], mapped = true) {
    jest.mocked(mapMushafTokens).mockReturnValue({ lines: { 2: tokens }, mapped });
  }

  it("draws each mapped glyph token", async () => {
    mapTokens([token({ text: "w0" }), token({ text: "w1", word: 1 })]);
    await renderPage({ view: "mushaf" });
    expect(screen.getByText("w0")).toBeTruthy();
    expect(screen.getByText(/w1/)).toBeTruthy();
  });

  it("jumps to a passage ayah from its token", async () => {
    mapTokens([token({ text: "w0", ayah: 7 })]);
    const { onAyahPress } = await renderPage({ view: "mushaf" });
    await fireEvent.press(screen.getByText("w0"));
    expect(onAyahPress).toHaveBeenCalledWith(7);
  });

  it("ignores taps on tokens outside the passage", async () => {
    mapTokens([token({ text: "other", ayah: null, word: null })]);
    const { onAyahPress } = await renderPage({ view: "mushaf" });
    await fireEvent.press(screen.getByText("other"));
    expect(onAyahPress).not.toHaveBeenCalled();
  });

  it("accents the current ayah's end marker only", async () => {
    mapTokens([
      token({ text: "m6", word: null, end: true }),
      token({ text: "m7", ayah: 7, word: null, end: true }),
    ]);
    await renderPage({ view: "mushaf" });
    expect(styleOf("m6").color).toEqual(expect.any(String));
    expect(styleOf(" m7")).toEqual({});
  });

  it("blanks an unplaced token once every word of its ayah is hidden", async () => {
    mapTokens([token({ text: "whole", word: null })]);
    await renderPage({ view: "mushaf", hidden: [0, 1, 2] });
    expect(styleOf("whole")).toMatchObject({ color: "transparent" });
  });

  it("keeps an unplaced token visible while its words are still loading", async () => {
    mapTokens([token({ text: "loading", ayah: 7, word: null })]);
    await renderPage({ view: "mushaf", hiddenOf: () => new Set([0]) });
    expect(styleOf("loading").color).not.toBe("transparent");
  });

  it("explains coarse marks when the word list is missing", async () => {
    mapTokens([token({})], false);
    await renderPage({ view: "mushaf" });
    expect(screen.getByText(/Word marks in the mushaf need the word list/)).toBeTruthy();
  });

  it("skips text lines with no tokens", async () => {
    jest.mocked(mapMushafTokens).mockReturnValue({ lines: {}, mapped: true });
    await renderPage({ view: "mushaf" });
    expect(screen.queryByText("x")).toBeNull();
  });

  it.each([
    [1, [null, expect.anything()]],
    [604, [expect.anything(), null]],
  ])("maps page %s with its neighbouring pages", async (page, [prev, next]) => {
    mapTokens([token({})]);
    await renderPage({ view: "mushaf", page });
    expect(mapMushafTokens).toHaveBeenLastCalledWith(expect.anything(), 1, null, prev, next);
  });
});
