import { fireEvent, screen } from "@testing-library/react-native";

import en from "@/i18n/en.json";
import { usePlatform } from "@/test-support/platform";
import { renderWithTheme } from "@/test-support/render";

import { AccentEditor, isAccentAdjusted } from "./accent-editor";

jest.mock("@/components/ui/sheet", () => require("@/test-support/mocks/sheet").sheetMock);

const mockSetAccentColor = jest.fn();
const mockSetCustomAccent = jest.fn();
const mockTheme: { customAccent: string | null } = { customAccent: null };
jest.mock("@/hooks/use-theme-tokens", () => ({
  useThemeTokens: () => {
    const { resolveTheme } = require("@munib-tracker/theme/resolve");
    const { resolveCustomAccentTheme } = require("@/lib/boot/resolved-accent");
    const { computeThemeTokens } = require("@/lib/theme-tokens");
    const base = resolveTheme("dark", "dark", "forest");
    const custom = mockTheme.customAccent;
    const colors = custom ? resolveCustomAccentTheme(base, "dark", custom) : base;
    return {
      colors,
      tokens: computeThemeTokens(colors, "dark"),
      scheme: "dark",
      accentColorId: "forest",
      customAccent: custom,
      colorMode: "dark",
      isReady: true,
      setColorMode: jest.fn(),
      setAccentColor: mockSetAccentColor,
      setCustomAccent: mockSetCustomAccent,
    };
  },
}));

beforeEach(() => {
  mockTheme.customAccent = null;
  jest.clearAllMocks();
});

describe("isAccentAdjusted", () => {
  it("is true only when the shown accent differs from the stored custom hex", () => {
    expect(isAccentAdjusted(null, "#123456")).toBe(false);
    expect(isAccentAdjusted("#3B82F6", "#3b82f6")).toBe(false);
    expect(isAccentAdjusted("#0C390F", "#2fa838")).toBe(true);
  });
});

describe("AccentEditor", () => {
  it("shows the 12 presets in one row plus a More swatch, no inline palette", async () => {
    await renderWithTheme(<AccentEditor />);

    expect(screen.getAllByTestId(/^accent-preset-/)).toHaveLength(12);
    expect(screen.getByLabelText(en.appearance.moreColors)).toBeTruthy();
    // The 36-colour palette and custom picker live in the sheet.
    expect(screen.queryByText(en.appearance.accentAllColors)).toBeNull();
  });

  it("selects a preset", async () => {
    await renderWithTheme(<AccentEditor />);

    await fireEvent.press(screen.getByTestId("accent-preset-rose"));

    expect(mockSetAccentColor).toHaveBeenCalledWith("rose");
  });

  it("opens the named More sheet with the palette and a hex field", async () => {
    await renderWithTheme(<AccentEditor />);

    await fireEvent.press(screen.getByLabelText(en.appearance.moreColors));

    expect(screen.getByText(en.appearance.accentAllColors)).toBeTruthy();
    await fireEvent.press(screen.getByLabelText("#FF6B6B"));
    expect(mockSetCustomAccent).toHaveBeenLastCalledWith("#FF6B6B");
    const hex = screen.getByLabelText(en.appearance.hexLabel);
    await fireEvent.changeText(hex, "1e6b4f");
    await fireEvent(hex, "submitEditing");
    expect(mockSetCustomAccent).toHaveBeenLastCalledWith("#1e6b4f");
  });

  it("flags a too-dark custom accent as adjusted for readability (stored hex unchanged)", async () => {
    mockTheme.customAccent = "#0C390F";
    await renderWithTheme(<AccentEditor />);

    expect(screen.getByTestId("accent-adjusted-note")).toBeTruthy();
    expect(screen.getByText("#0C390F")).toBeTruthy();
    expect(mockSetCustomAccent).not.toHaveBeenCalled();
  });

  it("shows no note for a readable custom accent", async () => {
    mockTheme.customAccent = "#3B82F6";
    await renderWithTheme(<AccentEditor />);

    expect(screen.queryByTestId("accent-adjusted-note")).toBeNull();
  });

  describe("on TV", () => {
    usePlatform({ isTV: true });

    it("keeps one preset row and no custom picker", async () => {
      await renderWithTheme(<AccentEditor />);

      expect(screen.getAllByTestId(/^accent-preset-/)).toHaveLength(12);
      expect(screen.queryByLabelText(en.appearance.moreColors)).toBeNull();
    });
  });
});
