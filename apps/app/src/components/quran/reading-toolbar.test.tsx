import { fireEvent, screen } from "@testing-library/react-native";

import { QuranReadingToolbar } from "@/components/quran/reading-toolbar";
import { setMockLiquidGlass } from "@/test-support/mocks/glass-surface";
import { usePlatform } from "@/test-support/platform";
import { renderWithTheme } from "@/test-support/render";

let mockDark = false;
const mockFullscreen = { supported: false, active: false, toggle: jest.fn(async () => undefined) };

jest.mock("@/hooks/use-reading-fullscreen", () => ({
  useReadingFullscreen: () => mockFullscreen,
}));

jest.mock("@/components/reading-font-controls", () => {
  const { createElement } = require("react");
  const { View } = require("react-native");
  return { ReadingFontControls: () => createElement(View, { testID: "font-controls" }) };
});

// Shared glass mock (switchable `hasLiquidGlass`) plus the GlassSurface component this file renders.
jest.mock("@/components/ui/glass-surface", () =>
  Object.defineProperties(
    { GlassSurface: () => null },
    Object.getOwnPropertyDescriptors(
      require("@/test-support/mocks/glass-surface").glassSurfaceMock,
    ),
  ),
);

jest.mock("@/hooks/use-theme-tokens", () => {
  const actual = jest.requireActual("@/hooks/use-theme-tokens");
  return {
    ...actual,
    useThemeTokens: () => {
      const value = actual.useThemeTokens();
      return { ...value, tokens: { ...value.tokens, isDark: mockDark } };
    },
  };
});

type Props = Parameters<typeof QuranReadingToolbar>[0];

async function renderToolbar(overrides: Partial<Props> = {}) {
  const props: Props = {
    visible: true,
    progress: { value: 0.4 } as Props["progress"],
    reciterName: "Alafasy",
    translationName: "Pickthall",
    secondTranslationName: "None",
    showTransliteration: true,
    showTranslation: false,
    onOpenReciter: jest.fn(),
    onOpenTranslation: jest.fn(),
    onOpenSecondary: jest.fn(),
    onToggleTransliteration: jest.fn(),
    onToggleTranslation: jest.fn(),
    ...overrides,
  };
  const utils = await renderWithTheme(<QuranReadingToolbar {...props} />);
  return { ...utils, props };
}

describe("QuranReadingToolbar", () => {
  beforeEach(() => {
    mockDark = false;
    setMockLiquidGlass(false);
    mockFullscreen.supported = false;
    mockFullscreen.active = false;
    mockFullscreen.toggle.mockClear();
  });

  it("embeds the reading font controls", async () => {
    await renderToolbar();
    expect(screen.getByTestId("font-controls")).toBeTruthy();
  });

  it.each([
    ["Reciter: Alafasy", "onOpenReciter"],
    ["Translation: Pickthall", "onOpenTranslation"],
    ["Second translation: None", "onOpenSecondary"],
  ] as const)("%p fires %s", async (label, handler) => {
    const { props } = await renderToolbar();
    await fireEvent.press(screen.getByLabelText(label));
    expect(props[handler]).toHaveBeenCalled();
  });

  it.each([
    ["Show transliteration", true, "onToggleTransliteration"],
    ["Show translation", false, "onToggleTranslation"],
  ] as const)("%p switch reflects checked=%p and toggles", async (name, checked, handler) => {
    const { props } = await renderToolbar();
    const toggle = screen.getByRole("switch", { name });
    expect(toggle.props.accessibilityState.checked).toBe(checked);
    await fireEvent.press(toggle);
    expect(props[handler]).toHaveBeenCalled();
  });

  it("omits optional chips without handlers", async () => {
    await renderToolbar();
    for (const label of [
      "Back to top",
      /Jump to page/,
      /Reader layout/,
      /^Tafsir/,
      "Word by word",
      "Tajweed colors",
      /Playback settings/,
      "Enter fullscreen",
    ]) {
      expect(screen.queryByLabelText(label)).toBeNull();
    }
  });

  it.each<[string, Partial<Props>, keyof Props]>([
    ["Back to top", { onBackToTop: jest.fn() }, "onBackToTop"],
    ["Jump to page: Page 12", { pageLabel: "Page 12", onOpenPage: jest.fn() }, "onOpenPage"],
    ["Reader layout: Mushaf", { layoutLabel: "Mushaf", onOpenLayout: jest.fn() }, "onOpenLayout"],
    ["Tafsir: Ibn Kathir", { tafsirName: "Ibn Kathir", onOpenTafsir: jest.fn() }, "onOpenTafsir"],
    ["Tafsir: Select tafsir", { onOpenTafsir: jest.fn() }, "onOpenTafsir"],
    ["Word by word", { onToggleWordByWord: jest.fn() }, "onToggleWordByWord"],
    ["Tajweed colors", { onToggleTajweed: jest.fn() }, "onToggleTajweed"],
    ["Playback settings: Playback", { onOpenPlayback: jest.fn() }, "onOpenPlayback"],
  ])("shows %p when its handler is given", async (label, overrides, handler) => {
    const { props } = await renderToolbar(overrides);
    await fireEvent.press(screen.getByLabelText(label));
    expect(props[handler]).toHaveBeenCalled();
  });

  it.each([
    ["Word by word", { showWordByWord: true, onToggleWordByWord: jest.fn() }],
    ["Tajweed colors", { showTajweed: true, onToggleTajweed: jest.fn() }],
  ])("checks the %p switch when enabled", async (name, overrides) => {
    await renderToolbar(overrides);
    expect(screen.getByRole("switch", { name, checked: true })).toBeTruthy();
  });

  it.each([
    [true, "Range 1–2", true],
    [false, undefined, false],
  ])("highlights an active playback chip (%p)", async (playbackActive, playbackLabel, selected) => {
    await renderToolbar({ onOpenPlayback: jest.fn(), playbackActive, playbackLabel });
    expect(screen.getByRole("button", { name: /Playback settings/, selected })).toBeTruthy();
  });

  it("hides back-to-top when showBackToTop is false", async () => {
    await renderToolbar({ showBackToTop: false, onBackToTop: jest.fn() });
    expect(screen.queryByLabelText("Back to top")).toBeNull();
  });

  it("hides translation controls when asked", async () => {
    await renderToolbar({ showTranslationControls: false, onOpenTafsir: jest.fn() });
    expect(screen.queryByLabelText("Translation: Pickthall")).toBeNull();
    expect(screen.queryByRole("switch")).toBeNull();
    expect(screen.getByLabelText("Reciter: Alafasy")).toBeTruthy();
  });

  it.each([
    [false, false],
    [false, true],
    [true, false],
    [true, true],
  ])("renders the frosted wash with dark=%p glass=%p", async (dark, glass) => {
    mockDark = dark;
    setMockLiquidGlass(glass);
    await renderToolbar();
    expect(screen.getByLabelText("Reciter: Alafasy")).toBeTruthy();
  });

  it.each([
    [false, "Enter fullscreen"],
    [true, "Exit fullscreen"],
  ])("toggles fullscreen when active=%p", async (active, name) => {
    mockFullscreen.supported = true;
    mockFullscreen.active = active;
    await renderToolbar();
    await fireEvent.press(screen.getByRole("button", { name, selected: active }));
    expect(mockFullscreen.toggle).toHaveBeenCalled();
  });

  it("stays tappable while hidden if fullscreen is active", async () => {
    mockFullscreen.supported = true;
    mockFullscreen.active = true;
    await renderToolbar({ visible: false });
    await fireEvent.press(screen.getByLabelText("Exit fullscreen"));
    expect(mockFullscreen.toggle).toHaveBeenCalled();
  });

  it("ignores taps while hidden", async () => {
    const { props } = await renderToolbar({ visible: false });
    await fireEvent.press(screen.getByLabelText("Reciter: Alafasy"));
    expect(props.onOpenReciter).not.toHaveBeenCalled();
  });

  describe("on TV", () => {
    usePlatform({ isTV: true });

    it("drops back-to-top", async () => {
      await renderToolbar({ onBackToTop: jest.fn() });
      expect(screen.queryByLabelText("Back to top")).toBeNull();
    });

    it("keeps active chips selectable", async () => {
      await renderToolbar({ onOpenPlayback: jest.fn(), playbackActive: true });
      expect(
        screen.getByRole("button", { name: /Playback settings/, selected: true }),
      ).toBeTruthy();
    });

    it("keeps toggle chips", async () => {
      await renderToolbar();
      expect(
        screen.getByRole("switch", { name: "Show transliteration", checked: true }),
      ).toBeTruthy();
    });
  });
});
