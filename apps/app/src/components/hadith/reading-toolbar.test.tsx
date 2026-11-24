import { fireEvent, screen } from "@testing-library/react-native";

import { HadithReadingToolbar } from "@/components/hadith/reading-toolbar";
import { setMockLiquidGlass } from "@/test-support/mocks/glass-surface";
import { usePlatform } from "@/test-support/platform";
import { renderWithTheme } from "@/test-support/render";

const mockFullscreen = { supported: false, active: false, toggle: jest.fn(async () => undefined) };

jest.mock("@/hooks/use-reading-fullscreen", () => ({
  useReadingFullscreen: () => mockFullscreen,
}));
jest.mock("@/components/reading-font-controls", () => ({ ReadingFontControls: () => null }));
jest.mock("@/components/ui/glass-surface", () =>
  require("@/test-support/mocks/glass-surface").glassSurfaceWithComponentMock(),
);

type Props = Parameters<typeof HadithReadingToolbar>[0];

async function renderToolbar(overrides: Partial<Props> = {}) {
  const props: Props = {
    visible: true,
    progress: { value: 0.2 } as Props["progress"],
    showArabic: true,
    showTranslation: false,
    showNarrator: true,
    showGrade: false,
    showIsnad: true,
    showSharh: false,
    onBackToTop: jest.fn(),
    onToggleArabic: jest.fn(),
    onToggleTranslation: jest.fn(),
    onToggleNarrator: jest.fn(),
    onToggleGrade: jest.fn(),
    onToggleIsnad: jest.fn(),
    onToggleSharh: jest.fn(),
    ...overrides,
  };
  await renderWithTheme(<HadithReadingToolbar {...props} />);
  return props;
}

describe("HadithReadingToolbar", () => {
  beforeEach(() => {
    Object.assign(mockFullscreen, { supported: false, active: false });
    mockFullscreen.toggle.mockClear();
  });
  afterEach(() => setMockLiquidGlass(false));

  it.each([
    ["Show Arabic", "onToggleArabic", true],
    ["Show translation", "onToggleTranslation", false],
    ["Show narrator", "onToggleNarrator", true],
    ["Show grade", "onToggleGrade", false],
    ["Show isnad", "onToggleIsnad", true],
    ["Show explanation", "onToggleSharh", false],
  ] as const)("toggles %s", async (label, handler, checked) => {
    const props = await renderToolbar();
    const chip = screen.getByLabelText(label);
    expect(chip.props.accessibilityState).toMatchObject({ checked });
    await fireEvent.press(chip);
    expect(props[handler]).toHaveBeenCalled();
  });

  it("scrolls back to top", async () => {
    const props = await renderToolbar();
    await fireEvent.press(screen.getByLabelText("Back to top"));
    expect(props.onBackToTop).toHaveBeenCalled();
  });

  it("hides chips the collection does not provide", async () => {
    setMockLiquidGlass(true);
    await renderToolbar({
      hasNarrator: false,
      hasGrade: false,
      hasIsnad: false,
      hasSharh: false,
      showBackToTop: false,
    });
    expect(screen.queryByLabelText("Show narrator")).toBeNull();
    expect(screen.queryByLabelText("Show explanation")).toBeNull();
    expect(screen.queryByLabelText("Back to top")).toBeNull();
  });

  it.each([
    [false, "Enter fullscreen"],
    [true, "Exit fullscreen"],
  ])("toggles fullscreen (active=%s)", async (active, label) => {
    Object.assign(mockFullscreen, { supported: true, active });
    await renderToolbar();
    await fireEvent.press(screen.getByLabelText(label));
    expect(mockFullscreen.toggle).toHaveBeenCalled();
  });

  describe("on TV", () => {
    usePlatform({ isTV: true });

    it("drops back-to-top but keeps the chips", async () => {
      const props = await renderToolbar();
      expect(screen.queryByLabelText("Back to top")).toBeNull();
      await fireEvent.press(screen.getByLabelText("Show Arabic"));
      expect(props.onToggleArabic).toHaveBeenCalled();
    });
  });
});
