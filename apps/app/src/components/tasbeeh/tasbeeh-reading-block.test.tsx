import { screen } from "@testing-library/react-native";
import { Text } from "react-native";

import { TasbeehReadingBlock } from "@/components/tasbeeh/tasbeeh-reading-block";
import { renderWithTheme } from "@/test-support/render";

const mockVisibility = { showTransliteration: true, showTranslation: true };

// Imported transitively (reading typography → audio provider); never played here.
jest.mock("@/components/reading-typography-context", () => ({ ReadingTypographyBar: () => null }));
jest.mock("@/lib/settings/reading-display", () => ({
  useReadingDisplay: () => mockVisibility,
}));
jest.mock("@/hooks/use-scripture-translation", () => ({
  useScriptureTranslation: (item: { translation: string }) => item.translation,
}));

// The first render warms the theme + i18n graph, which is slow on a busy machine.

type Item = Parameters<typeof TasbeehReadingBlock>[0]["item"];

function buildItem(overrides: Partial<Item> = {}): Item {
  return {
    arabic: "سُبْحَانَ اللَّهِ",
    transliteration: "  SubhanAllah  ",
    translation: " Glory be to Allah ",
    reference: "Sahih Muslim 2694",
    ...overrides,
  };
}

async function renderBlock(item: Partial<Item> = {}, footer?: React.ReactNode) {
  return await renderWithTheme(<TasbeehReadingBlock item={buildItem(item)} footer={footer} />);
}

describe("TasbeehReadingBlock", () => {
  afterEach(() => {
    mockVisibility.showTransliteration = true;
    mockVisibility.showTranslation = true;
  });

  it("shows the Arabic with trimmed transliteration and translation", async () => {
    await renderBlock();
    expect(screen.getByText("سُبْحَانَ اللَّهِ")).toBeTruthy();
    expect(screen.getByText("SubhanAllah")).toBeTruthy();
    expect(screen.getByText("Glory be to Allah")).toBeTruthy();
  });

  it("shows the reference and footer", async () => {
    await renderBlock({}, <Text>Footer slot</Text>);
    expect(screen.getByText(/Sahih Muslim 2694/)).toBeTruthy();
    expect(screen.getByText("Footer slot")).toBeTruthy();
  });

  it.each([
    { hidden: "transliteration", flag: "showTransliteration", text: "SubhanAllah" },
    { hidden: "translation", flag: "showTranslation", text: "Glory be to Allah" },
  ] as const)("hides the $hidden when turned off", async ({ flag, text }) => {
    mockVisibility[flag] = false;
    await renderBlock();
    expect(screen.queryByText(text)).toBeNull();
  });

  it("skips blank transliteration, translation and a missing reference", async () => {
    await renderBlock({ transliteration: undefined, translation: "   ", reference: undefined });
    expect(screen.getByText("سُبْحَانَ اللَّهِ")).toBeTruthy();
    expect(screen.queryByText(/Sahih/)).toBeNull();
    expect(screen.queryByText("SubhanAllah")).toBeNull();
  });
});
