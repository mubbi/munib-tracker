import { fireEvent, screen } from "@testing-library/react-native";

import { TajweedLegend, TajweedStickyLegendBar } from "@/components/quran/tajweed-legend";
import { TAJWEED_RULES } from "@/constants/tajweed";
import { mockRouter, resetExpoRouterMock } from "@/test-support/mocks/expo-router";
import { setMockLiquidGlass } from "@/test-support/mocks/glass-surface";
import { renderWithTheme } from "@/test-support/render";
import { flattenStyle } from "@/test-support/style";

let mockDark = false;

jest.mock("expo-router", () => require("@/test-support/mocks/expo-router").expoRouterMock);

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

const [GHUNNAH, IKHFA] = TAJWEED_RULES;

function treeJson() {
  return JSON.stringify(screen.toJSON());
}

beforeEach(() => {
  resetExpoRouterMock();
  mockDark = false;
  setMockLiquidGlass(false);
});

describe("TajweedLegend", () => {
  async function renderLegend() {
    await renderWithTheme(<TajweedLegend />);
  }

  it("starts expanded with a link per rule", async () => {
    await renderLegend();
    expect(screen.getByRole("button", { name: "Tajweed legend", expanded: true })).toBeTruthy();
    expect(screen.getAllByRole("link")).toHaveLength(TAJWEED_RULES.length);
  });

  it("opens the rule's Learn lesson", async () => {
    await renderLegend();
    await fireEvent.press(screen.getByRole("link", { name: "Ghunnah" }));
    expect(mockRouter.push).toHaveBeenCalledWith({
      pathname: "/learn-quran/tajweed/[id]",
      params: { id: GHUNNAH?.lessonId },
    });
  });

  it("collapses the rule list", async () => {
    await renderLegend();
    await fireEvent.press(screen.getByRole("button", { name: "Tajweed legend" }));
    expect(screen.getByRole("button", { name: "Tajweed legend", expanded: false })).toBeTruthy();
    expect(screen.queryAllByRole("link")).toHaveLength(0);
  });

  it.each([
    [false, GHUNNAH?.colorLight, GHUNNAH?.colorDark],
    [true, GHUNNAH?.colorDark, GHUNNAH?.colorLight],
  ])("uses the matching swatches when dark=%p", async (dark, shown, hidden) => {
    mockDark = dark;
    await renderLegend();
    expect(treeJson()).toContain(shown);
    expect(treeJson()).not.toContain(hidden);
  });
});

describe("TajweedStickyLegendBar", () => {
  async function renderBar(visible = true) {
    await renderWithTheme(<TajweedStickyLegendBar visible={visible} />);
  }

  it("opens the rule's Learn lesson", async () => {
    await renderBar();
    await fireEvent.press(screen.getByRole("link", { name: "Ikhfa" }));
    expect(mockRouter.push).toHaveBeenCalledWith({
      pathname: "/learn-quran/tajweed/[id]",
      params: { id: IKHFA?.lessonId },
    });
  });

  it.each([
    [true, "auto"],
    [false, "none"],
  ])("sets pointer events when visible=%p", async (visible, pointerEvents) => {
    await renderBar(visible);
    expect(flattenStyle(screen.getByLabelText("Tajweed legend").props.style).pointerEvents).toBe(
      pointerEvents,
    );
  });

  it.each([
    [false, false],
    [false, true],
    [true, false],
    [true, true],
  ])("renders every swatch with dark=%p glass=%p", async (dark, glass) => {
    mockDark = dark;
    setMockLiquidGlass(glass);
    await renderBar();
    expect(screen.getAllByRole("link")).toHaveLength(TAJWEED_RULES.length);
    expect(treeJson()).toContain(dark ? GHUNNAH?.colorDark : GHUNNAH?.colorLight);
  });
});
